import { describe, expect, it } from 'vitest';
import {
  PREGNANCY_DUE_DATE_INPUT_BOUNDS,
  calculateDueDate,
  getGestationalAge,
  getPregnancyDueDateResult,
  getTrimester,
  parseLMPDate,
  validateLMPDateInput,
} from './pregnancy-due-date';

// Formats a Date as "YYYY-MM-DD", matching the <input type="date"> raw
// value shape validateLMPDateInput/parseLMPDate expect.
function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

describe('calculateDueDate', () => {
  // Reference values hand-computed via day-of-year arithmetic: Jan 1,
  // 2026 is day 1 of a non-leap year, so day 1 + 280 days lands on day
  // 281. Cumulative days through September (non-leap) = 273, so day 281
  // is the (281 − 273) = 8th day of October → Oct 8, 2026.
  it('adds 280 days for a non-leap-year LMP', () => {
    const dueDate = calculateDueDate(new Date(2026, 0, 1));
    expect(dueDate).toEqual(new Date(2026, 9, 8));
  });

  // Same day-of-year arithmetic, but 2024 is a leap year (Feb = 29 days),
  // so cumulative days through September = 274, and day 281 is the
  // (281 − 274) = 7th day of October → Oct 7, 2024 — one day earlier
  // than the non-leap case above, confirming the leap day is accounted
  // for automatically by Date's own rollover (not by any special-cased
  // logic in this function).
  it('adds 280 days across a leap-year February', () => {
    const dueDate = calculateDueDate(new Date(2024, 0, 1));
    expect(dueDate).toEqual(new Date(2024, 9, 7));
  });

  it('ignores time-of-day on the input date', () => {
    const dueDate = calculateDueDate(new Date(2026, 0, 1, 23, 59));
    expect(dueDate).toEqual(new Date(2026, 9, 8));
  });

  it('throws for an invalid Date', () => {
    expect(() => calculateDueDate(new Date('not-a-date'))).toThrow(
      RangeError,
    );
  });
});

describe('getGestationalAge', () => {
  // 59 days between Jan 1 and Mar 1, 2026 (Jan=31 + Feb=28 = 59):
  // 59 = 8×7 + 3, so 8 completed weeks and 3 remaining days.
  it('computes completed weeks and remaining days', () => {
    const age = getGestationalAge(new Date(2026, 0, 1), new Date(2026, 2, 1));
    expect(age).toEqual({ weeks: 8, days: 3 });
  });

  it('returns zero weeks/days when the reference date is the LMP itself', () => {
    const lmp = new Date(2026, 0, 1);
    expect(getGestationalAge(lmp, lmp)).toEqual({ weeks: 0, days: 0 });
  });

  it('throws if the reference date is before the LMP date', () => {
    expect(() =>
      getGestationalAge(new Date(2026, 2, 1), new Date(2026, 0, 1)),
    ).toThrow(RangeError);
  });
});

describe('getTrimester', () => {
  // ACOG boundaries: 1st = weeks 0–13, 2nd = weeks 14–27, 3rd = week 28+.
  it('classifies week 0 as trimester 1', () => {
    expect(getTrimester(0)).toBe(1);
  });

  it('classifies the trimester-1/2 boundary correctly', () => {
    expect(getTrimester(13)).toBe(1);
    expect(getTrimester(14)).toBe(2);
  });

  it('classifies the trimester-2/3 boundary correctly', () => {
    expect(getTrimester(27)).toBe(2);
    expect(getTrimester(28)).toBe(3);
  });

  it('classifies a well-past-term week as trimester 3', () => {
    expect(getTrimester(42)).toBe(3);
  });
});

describe('getPregnancyDueDateResult', () => {
  it('assembles due date, gestational age, trimester, and days remaining consistently', () => {
    const lmp = new Date(2026, 0, 1);
    const today = new Date(2026, 2, 1); // Mar 1, 2026 — 59 days after LMP
    const result = getPregnancyDueDateResult(lmp, today);

    expect(result.dueDate).toEqual(new Date(2026, 9, 8));
    expect(result.gestationalAge).toEqual({ weeks: 8, days: 3 });
    expect(result.trimester).toBe(1);
    // 59 days elapsed + 221 days remaining = 280 total, confirming the
    // due date, "today", and gestational age all agree with each other.
    expect(result.daysRemaining).toBe(221);
  });

  it('reports a negative daysRemaining once the due date has passed', () => {
    const lmp = new Date(2026, 0, 1);
    const wellPastDue = new Date(2026, 9, 20); // 12 days after the Oct 8 due date
    const result = getPregnancyDueDateResult(lmp, wellPastDue);
    expect(result.daysRemaining).toBe(-12);
    expect(result.trimester).toBe(3);
  });

  it('never returns NaN for any successful call', () => {
    const result = getPregnancyDueDateResult(
      new Date(2026, 0, 1),
      new Date(2026, 2, 1),
    );
    expect(Number.isFinite(result.gestationalAge.weeks)).toBe(true);
    expect(Number.isFinite(result.gestationalAge.days)).toBe(true);
    expect(Number.isFinite(result.daysRemaining)).toBe(true);
    expect(Number.isNaN(result.dueDate.getTime())).toBe(false);
  });
});

describe('validateLMPDateInput', () => {
  const referenceDate = new Date(2026, 5, 1); // Jun 1, 2026

  it('returns null for a valid recent date', () => {
    expect(validateLMPDateInput('2026-05-01', referenceDate)).toBeNull();
  });

  it('returns LMP_DATE_REQUIRED for an empty string', () => {
    expect(validateLMPDateInput('', referenceDate)).toBe('LMP_DATE_REQUIRED');
  });

  it('returns LMP_DATE_REQUIRED for whitespace only', () => {
    expect(validateLMPDateInput('   ', referenceDate)).toBe(
      'LMP_DATE_REQUIRED',
    );
  });

  it('returns LMP_DATE_INVALID for a non-date string', () => {
    expect(validateLMPDateInput('not-a-date', referenceDate)).toBe(
      'LMP_DATE_INVALID',
    );
  });

  it('returns LMP_DATE_INVALID for a calendar date that does not exist (Feb 30)', () => {
    expect(validateLMPDateInput('2026-02-30', referenceDate)).toBe(
      'LMP_DATE_INVALID',
    );
  });

  it('returns LMP_DATE_INVALID for an out-of-range month', () => {
    expect(validateLMPDateInput('2026-13-01', referenceDate)).toBe(
      'LMP_DATE_INVALID',
    );
  });

  it('returns LMP_DATE_IN_FUTURE for a date one day after the reference date', () => {
    expect(validateLMPDateInput('2026-06-02', referenceDate)).toBe(
      'LMP_DATE_IN_FUTURE',
    );
  });

  it('accepts the reference date itself (LMP = today)', () => {
    expect(validateLMPDateInput('2026-06-01', referenceDate)).toBeNull();
  });

  // Boundary values at the MAX_DAYS_SINCE_LMP threshold (CLAUDE.md
  // Section 7): exactly at the bound is valid, one day beyond is not.
  it('accepts a date exactly MAX_DAYS_SINCE_LMP days in the past', () => {
    const atBound = new Date(referenceDate);
    atBound.setDate(
      atBound.getDate() - PREGNANCY_DUE_DATE_INPUT_BOUNDS.MAX_DAYS_SINCE_LMP,
    );
    expect(
      validateLMPDateInput(toISODateString(atBound), referenceDate),
    ).toBeNull();
  });

  it('rejects a date one day beyond MAX_DAYS_SINCE_LMP as too far in the past', () => {
    const beyondBound = new Date(referenceDate);
    beyondBound.setDate(
      beyondBound.getDate() -
        (PREGNANCY_DUE_DATE_INPUT_BOUNDS.MAX_DAYS_SINCE_LMP + 1),
    );
    expect(
      validateLMPDateInput(toISODateString(beyondBound), referenceDate),
    ).toBe('LMP_DATE_TOO_FAR_IN_PAST');
  });
});

describe('parseLMPDate', () => {
  it('parses a valid "YYYY-MM-DD" string into the corresponding local Date', () => {
    expect(parseLMPDate('2026-01-01')).toEqual(new Date(2026, 0, 1));
  });
});
