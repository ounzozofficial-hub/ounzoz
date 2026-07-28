import type {
  GestationalAge,
  PregnancyDueDateResult,
  PregnancyDueDateValidationError,
} from '@/types/pregnancy-due-date';

// Naegele's Rule adds a fixed 280 days (40 weeks) to the first day of
// the last menstrual period (LMP) — the standard estimation method
// cited by ACOG (American College of Obstetricians and Gynecologists)
// and the NHS. It assumes a "textbook" 28-day cycle with ovulation on
// day 14; real due dates vary by individual, which is why every result
// this tool shows is framed as an estimate, never a diagnosis (this
// tool is YMYL-adjacent health content — PROJECT.md Section 5, CLAUDE.md
// Section 10).
const DAYS_ADDED_BY_NAEGELES_RULE = 280;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Sanity bound — not a clinical limit, just wide enough to catch an
// obviously fat-fingered date (e.g. the wrong year) while still covering
// every realistic use case, including a full-term pregnancy that has
// gone past its estimated due date (full term extends to 42 weeks/294
// days). CLAUDE.md Section 8.
const MAX_DAYS_SINCE_LMP = 300;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Whole-day difference between two calendar dates, ignoring time-of-day,
// so a same-day comparison never reads as ±1 day from a few hours' drift.
function daysBetween(from: Date, to: Date): number {
  return Math.round(
    (startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY,
  );
}

/**
 * Calculates the estimated due date from the first day of the last
 * menstrual period (LMP), per Naegele's Rule.
 *
 * Formula source: Naegele's Rule — EDD = LMP + 280 days (40 weeks).
 * https://www.acog.org/womens-health/faqs/how-your-fetus-grows-during-pregnancy
 *
 * Pure function (CLAUDE.md Section 6). Assumes lmpDate has already
 * passed validation; still guards against an invalid Date to avoid ever
 * producing an "Invalid Date" downstream (CLAUDE.md Section 8).
 */
export function calculateDueDate(lmpDate: Date): Date {
  if (Number.isNaN(lmpDate.getTime())) {
    throw new RangeError('lmpDate must be a valid Date');
  }

  const dueDate = startOfDay(lmpDate);
  dueDate.setDate(dueDate.getDate() + DAYS_ADDED_BY_NAEGELES_RULE);
  return dueDate;
}

/**
 * Calculates current gestational age (completed weeks + remaining days)
 * relative to a reference date — normally "today", passed in explicitly
 * by the caller rather than read internally (e.g. via `new Date()`) so
 * this stays a pure, independently testable function (CLAUDE.md
 * Section 6).
 */
export function getGestationalAge(
  lmpDate: Date,
  referenceDate: Date,
): GestationalAge {
  const totalDays = daysBetween(lmpDate, referenceDate);
  if (totalDays < 0) {
    throw new RangeError('lmpDate must not be after referenceDate');
  }

  return {
    weeks: Math.floor(totalDays / 7),
    days: totalDays % 7,
  };
}

/**
 * Maps completed gestational weeks to a trimester.
 *
 * Formula source: ACOG's standard trimester boundaries — 1st trimester
 * weeks 0–13, 2nd trimester weeks 14–27, 3rd trimester week 28 onward.
 * https://www.acog.org/womens-health/faqs/how-your-fetus-grows-during-pregnancy
 */
export function getTrimester(gestationalWeeks: number): 1 | 2 | 3 {
  if (gestationalWeeks < 14) return 1;
  if (gestationalWeeks < 28) return 2;
  return 3;
}

/**
 * Runs the full LMP → due date / gestational age / trimester chain, all
 * relative to the same reference date (same "compute shared state once"
 * pattern as getCalorieResult computing BMR/TDEE once).
 */
export function getPregnancyDueDateResult(
  lmpDate: Date,
  referenceDate: Date,
): PregnancyDueDateResult {
  const dueDate = calculateDueDate(lmpDate);
  const gestationalAge = getGestationalAge(lmpDate, referenceDate);
  const trimester = getTrimester(gestationalAge.weeks);
  const daysRemaining = daysBetween(referenceDate, dueDate);

  return { dueDate, gestationalAge, trimester, daysRemaining };
}

// --- Validation ---

/**
 * Validates the raw "YYYY-MM-DD" string from a native `<input
 * type="date">` before any calculation runs. referenceDate is passed in
 * explicitly (usually "today") so this stays pure and testable, same as
 * every calculation function above (CLAUDE.md Section 6).
 */
export function validateLMPDateInput(
  lmpDateRaw: string,
  referenceDate: Date,
): PregnancyDueDateValidationError | null {
  const trimmed = lmpDateRaw.trim();
  if (trimmed === '') return 'LMP_DATE_REQUIRED';

  // Parse via explicit numeric components rather than `new Date(trimmed)`
  // — the latter parses "YYYY-MM-DD" as UTC midnight, which can shift a
  // day off in local timezones. CLAUDE.md Section 8: never trust raw
  // input without controlled parsing.
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) return 'LMP_DATE_INVALID';

  const [, yearStr, monthStr, dayStr] = match;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  const lmpDate = new Date(year, month - 1, day);

  // Reject dates like Feb 30 that `Date` would otherwise silently roll
  // over into the following month rather than reporting as invalid.
  if (
    lmpDate.getFullYear() !== year ||
    lmpDate.getMonth() !== month - 1 ||
    lmpDate.getDate() !== day
  ) {
    return 'LMP_DATE_INVALID';
  }

  const daysSinceLMP = daysBetween(lmpDate, referenceDate);
  if (daysSinceLMP < 0) return 'LMP_DATE_IN_FUTURE';
  if (daysSinceLMP > MAX_DAYS_SINCE_LMP) return 'LMP_DATE_TOO_FAR_IN_PAST';

  return null;
}

/**
 * Parses a "YYYY-MM-DD" string into a Date. Only call this after
 * validateLMPDateInput has returned null for the same string.
 */
export function parseLMPDate(lmpDateRaw: string): Date {
  const [year, month, day] = lmpDateRaw.trim().split('-').map(Number);
  return new Date(year, month - 1, day);
}

export const PREGNANCY_DUE_DATE_INPUT_BOUNDS = {
  MAX_DAYS_SINCE_LMP,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const PREGNANCY_DUE_DATE_VALIDATION_MESSAGES: Record<
  PregnancyDueDateValidationError,
  string
> = {
  LMP_DATE_REQUIRED:
    'Enter the first day of your last menstrual period to estimate your due date.',
  LMP_DATE_INVALID: 'Enter a valid date.',
  LMP_DATE_IN_FUTURE: "This date can't be in the future.",
  LMP_DATE_TOO_FAR_IN_PAST: `Enter a date within the last ${MAX_DAYS_SINCE_LMP} days — beyond a full-term pregnancy, this estimate is no longer meaningful.`,
};
