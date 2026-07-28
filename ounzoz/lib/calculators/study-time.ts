import type {
  StudyTimeResult,
  StudyTimeValidationError,
} from '@/types/study-time';

// Sanity bounds — not a study-habits guideline, just wide enough to cover
// realistic exam prep (a single day cram up to a full semester's runway,
// half an hour up to 16 hours of daily capacity, a single topic up to a
// full course's worth of chapters) while catching fat-fingered input
// before it reaches the calculation (CLAUDE.md Section 8).
const MIN_DAYS = 1;
const MAX_DAYS = 180;
const MIN_HOURS_PER_DAY = 0.5;
const MAX_HOURS_PER_DAY = 16;
const MIN_TOPICS = 1;
const MAX_TOPICS = 50;

// Below this many hours per topic, the result surfaces an advisory note
// (DESIGN.md Section 11.1) suggesting the student reconsider their plan —
// a practical heads-up, not a hard rule, and it never changes the number
// shown.
const ADVISORY_THRESHOLD_HOURS_PER_TOPIC = 1;

/**
 * Calculates how many study hours are available per topic given a
 * deadline, daily study capacity, and number of topics to cover.
 *
 * Formula: totalAvailableHours = days × hoursPerDay;
 *          hoursPerTopic = totalAvailableHours / topics.
 *
 * This is pure arithmetic allocation of time the student has already
 * decided to commit — it deliberately does not recommend how many total
 * hours someone "should" study, since that varies enormously by subject,
 * course, and student and can't be stated as a single verifiable rule
 * (CLAUDE.md's AI safety rules / SEO.md Section 5 — no fabricated
 * authority).
 *
 * Pure function (CLAUDE.md Section 6): deterministic, no I/O, no
 * DOM/React state. Assumes inputs already passed validation; still
 * range-checks defensively and throws RangeError rather than ever
 * producing NaN/Infinity (CLAUDE.md Section 8).
 *
 * @param days - whole days until the exam/deadline
 * @param hoursPerDay - hours available for studying each day
 * @param topics - number of topics/chapters/subjects to cover
 * @returns hours available per topic, rounded to 1 decimal place
 */
export function calculateHoursPerTopic(
  days: number,
  hoursPerDay: number,
  topics: number,
): number {
  if (!Number.isFinite(days) || days <= 0) {
    throw new RangeError('days must be a positive finite number');
  }
  if (!Number.isFinite(hoursPerDay) || hoursPerDay <= 0) {
    throw new RangeError('hoursPerDay must be a positive finite number');
  }
  if (!Number.isFinite(topics) || topics <= 0) {
    throw new RangeError('topics must be a positive finite number');
  }

  const totalAvailableHours = days * hoursPerDay;
  return Math.round((totalAvailableHours / topics) * 10) / 10;
}

/**
 * Runs the full calculation and returns hoursPerTopic alongside the
 * total-available-hours context and the advisory flag, so the result
 * panel can show how the number was built (same "show the components"
 * pattern used across the platform) and surface DESIGN.md Section 11.1's
 * advisory slot when appropriate.
 */
export function getStudyTimeResult(
  days: number,
  hoursPerDay: number,
  topics: number,
): StudyTimeResult {
  const hoursPerTopic = calculateHoursPerTopic(days, hoursPerDay, topics);
  const totalAvailableHours = Math.round(days * hoursPerDay * 10) / 10;

  return {
    hoursPerTopic,
    totalAvailableHours,
    belowAdvisoryThreshold: hoursPerTopic < ADVISORY_THRESHOLD_HOURS_PER_TOPIC,
  };
}

// --- Validation ---

export function validateDaysInput(
  daysRaw: string,
): StudyTimeValidationError | null {
  const trimmed = daysRaw.trim();
  if (trimmed === '') return 'DAYS_REQUIRED';

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return 'DAYS_NOT_A_NUMBER';
  if (value <= 0) return 'DAYS_NOT_POSITIVE';
  if (!Number.isInteger(value)) return 'DAYS_NOT_WHOLE_NUMBER';
  if (value < MIN_DAYS || value > MAX_DAYS) return 'DAYS_OUT_OF_RANGE';
  return null;
}

export function validateHoursPerDayInput(
  hoursPerDayRaw: string,
): StudyTimeValidationError | null {
  const trimmed = hoursPerDayRaw.trim();
  if (trimmed === '') return 'HOURS_PER_DAY_REQUIRED';

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return 'HOURS_PER_DAY_NOT_A_NUMBER';
  if (value <= 0) return 'HOURS_PER_DAY_NOT_POSITIVE';
  if (value < MIN_HOURS_PER_DAY || value > MAX_HOURS_PER_DAY) {
    return 'HOURS_PER_DAY_OUT_OF_RANGE';
  }
  return null;
}

export function validateTopicsInput(
  topicsRaw: string,
): StudyTimeValidationError | null {
  const trimmed = topicsRaw.trim();
  if (trimmed === '') return 'TOPICS_REQUIRED';

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return 'TOPICS_NOT_A_NUMBER';
  if (value <= 0) return 'TOPICS_NOT_POSITIVE';
  if (!Number.isInteger(value)) return 'TOPICS_NOT_WHOLE_NUMBER';
  if (value < MIN_TOPICS || value > MAX_TOPICS) return 'TOPICS_OUT_OF_RANGE';
  return null;
}

export function validateStudyTimeInputs(
  daysRaw: string,
  hoursPerDayRaw: string,
  topicsRaw: string,
): {
  daysError: StudyTimeValidationError | null;
  hoursPerDayError: StudyTimeValidationError | null;
  topicsError: StudyTimeValidationError | null;
} {
  return {
    daysError: validateDaysInput(daysRaw),
    hoursPerDayError: validateHoursPerDayInput(hoursPerDayRaw),
    topicsError: validateTopicsInput(topicsRaw),
  };
}

export const STUDY_TIME_INPUT_BOUNDS = {
  MIN_DAYS,
  MAX_DAYS,
  MIN_HOURS_PER_DAY,
  MAX_HOURS_PER_DAY,
  MIN_TOPICS,
  MAX_TOPICS,
} as const;

export const STUDY_TIME_ADVISORY_THRESHOLD_HOURS_PER_TOPIC =
  ADVISORY_THRESHOLD_HOURS_PER_TOPIC;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const STUDY_TIME_VALIDATION_MESSAGES: Record<
  StudyTimeValidationError,
  string
> = {
  DAYS_REQUIRED: 'Enter how many days you have until your exam or deadline.',
  DAYS_NOT_A_NUMBER: 'Days must be a number.',
  DAYS_NOT_POSITIVE: 'Days must be greater than zero.',
  DAYS_NOT_WHOLE_NUMBER: 'Days must be a whole number.',
  DAYS_OUT_OF_RANGE: `Enter a number of days between ${MIN_DAYS} and ${MAX_DAYS}.`,
  HOURS_PER_DAY_REQUIRED: 'Enter how many hours you can study per day.',
  HOURS_PER_DAY_NOT_A_NUMBER: 'Hours per day must be a number.',
  HOURS_PER_DAY_NOT_POSITIVE: 'Hours per day must be greater than zero.',
  HOURS_PER_DAY_OUT_OF_RANGE: `Enter hours per day between ${MIN_HOURS_PER_DAY} and ${MAX_HOURS_PER_DAY}.`,
  TOPICS_REQUIRED: 'Enter how many topics you need to cover.',
  TOPICS_NOT_A_NUMBER: 'Topics must be a number.',
  TOPICS_NOT_POSITIVE: 'Topics must be greater than zero.',
  TOPICS_NOT_WHOLE_NUMBER: 'Topics must be a whole number.',
  TOPICS_OUT_OF_RANGE: `Enter a number of topics between ${MIN_TOPICS} and ${MAX_TOPICS}.`,
};
