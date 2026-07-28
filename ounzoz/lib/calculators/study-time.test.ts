import { describe, expect, it } from 'vitest';
import {
  STUDY_TIME_INPUT_BOUNDS,
  calculateHoursPerTopic,
  getStudyTimeResult,
  validateDaysInput,
  validateHoursPerDayInput,
  validateStudyTimeInputs,
  validateTopicsInput,
} from './study-time';

describe('calculateHoursPerTopic', () => {
  // --- Normal / expected cases ---
  // Reference values hand-computed as (days × hoursPerDay) / topics,
  // rounded to 1 decimal, same verification approach used across every
  // prior tool's tests.
  it('calculates hours per topic for a typical exam-prep scenario', () => {
    // 10 × 2 = 20 total hours / 5 topics = 4.0
    expect(calculateHoursPerTopic(10, 2, 5)).toBe(4.0);
  });

  it('calculates hours per topic for a single-day cram session', () => {
    // 1 × 8 = 8 total hours / 4 topics = 2.0
    expect(calculateHoursPerTopic(1, 8, 4)).toBe(2.0);
  });

  it('rounds a non-exact result to 1 decimal place', () => {
    // 3 × 2 = 6 total hours / 7 topics = 0.857142... -> 0.9
    expect(calculateHoursPerTopic(3, 2, 7)).toBe(0.9);
  });

  it('produces more hours per topic with more available days at the same rate', () => {
    const fewer = calculateHoursPerTopic(5, 2, 5);
    const more = calculateHoursPerTopic(20, 2, 5);
    expect(more).toBeGreaterThan(fewer);
  });

  it('produces fewer hours per topic as topic count increases', () => {
    const fewerTopics = calculateHoursPerTopic(10, 3, 3);
    const moreTopics = calculateHoursPerTopic(10, 3, 10);
    expect(moreTopics).toBeLessThan(fewerTopics);
  });

  // --- Advisory-threshold boundary (1 hour/topic) ---
  it('returns exactly 1.0 when total hours divide evenly to the threshold', () => {
    // 10 × 1 = 10 total hours / 10 topics = 1.0
    expect(calculateHoursPerTopic(10, 1, 10)).toBe(1.0);
  });

  it('returns just above the threshold', () => {
    // 10 × 1.1 = 11 total hours / 10 topics = 1.1
    expect(calculateHoursPerTopic(10, 1.1, 10)).toBe(1.1);
  });

  it('returns just below the threshold', () => {
    // 10 × 0.99 = 9.9 total hours / 10 topics = 0.99 -> rounds to 1.0
    // (use a case that rounds cleanly below instead)
    // 10 × 0.9 = 9 total hours / 10 topics = 0.9
    expect(calculateHoursPerTopic(10, 0.9, 10)).toBe(0.9);
  });

  // --- Boundary values: bounds of the input range ---
  it('handles the maximum bounds (max days, max hours/day, min topics)', () => {
    // 180 × 16 = 2880 total hours / 1 topic = 2880.0
    expect(
      calculateHoursPerTopic(
        STUDY_TIME_INPUT_BOUNDS.MAX_DAYS,
        STUDY_TIME_INPUT_BOUNDS.MAX_HOURS_PER_DAY,
        STUDY_TIME_INPUT_BOUNDS.MIN_TOPICS,
      ),
    ).toBe(2880.0);
  });

  it('handles the minimum bounds (min days, min hours/day, max topics) and rounds a tiny result to 0', () => {
    // 1 × 0.5 = 0.5 total hours / 50 topics = 0.01 -> rounds to 0.0
    expect(
      calculateHoursPerTopic(
        STUDY_TIME_INPUT_BOUNDS.MIN_DAYS,
        STUDY_TIME_INPUT_BOUNDS.MIN_HOURS_PER_DAY,
        STUDY_TIME_INPUT_BOUNDS.MAX_TOPICS,
      ),
    ).toBe(0.0);
  });

  // --- Invalid inputs ---
  it('throws for zero days', () => {
    expect(() => calculateHoursPerTopic(0, 2, 5)).toThrow(RangeError);
  });

  it('throws for negative days', () => {
    expect(() => calculateHoursPerTopic(-5, 2, 5)).toThrow(RangeError);
  });

  it('throws for zero hours per day', () => {
    expect(() => calculateHoursPerTopic(10, 0, 5)).toThrow(RangeError);
  });

  it('throws for negative hours per day', () => {
    expect(() => calculateHoursPerTopic(10, -2, 5)).toThrow(RangeError);
  });

  it('throws for zero topics', () => {
    expect(() => calculateHoursPerTopic(10, 2, 0)).toThrow(RangeError);
  });

  it('throws for negative topics', () => {
    expect(() => calculateHoursPerTopic(10, 2, -3)).toThrow(RangeError);
  });

  it('throws for non-numeric (NaN) inputs', () => {
    expect(() => calculateHoursPerTopic(NaN, 2, 5)).toThrow(RangeError);
    expect(() => calculateHoursPerTopic(10, NaN, 5)).toThrow(RangeError);
    expect(() => calculateHoursPerTopic(10, 2, NaN)).toThrow(RangeError);
  });

  it('throws for Infinity inputs', () => {
    expect(() => calculateHoursPerTopic(Infinity, 2, 5)).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculateHoursPerTopic(14, 3, 6);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('getStudyTimeResult', () => {
  it('returns hoursPerTopic, totalAvailableHours, and belowAdvisoryThreshold together', () => {
    const result = getStudyTimeResult(10, 2, 5);
    expect(result.totalAvailableHours).toBe(20);
    expect(result.hoursPerTopic).toBe(4.0);
    expect(result.belowAdvisoryThreshold).toBe(false);
  });

  it('matches calculateHoursPerTopic exactly for the same inputs', () => {
    const result = getStudyTimeResult(14, 3, 6);
    expect(result.hoursPerTopic).toBe(calculateHoursPerTopic(14, 3, 6));
  });

  it('flags belowAdvisoryThreshold when hours per topic is under 1', () => {
    const result = getStudyTimeResult(10, 0.9, 10);
    expect(result.hoursPerTopic).toBe(0.9);
    expect(result.belowAdvisoryThreshold).toBe(true);
  });

  it('does not flag belowAdvisoryThreshold at exactly 1 hour per topic', () => {
    const result = getStudyTimeResult(10, 1, 10);
    expect(result.hoursPerTopic).toBe(1.0);
    expect(result.belowAdvisoryThreshold).toBe(false);
  });

  it('does not flag belowAdvisoryThreshold comfortably above the threshold', () => {
    const result = getStudyTimeResult(20, 4, 5);
    expect(result.belowAdvisoryThreshold).toBe(false);
  });

  it('propagates validation errors from invalid inputs', () => {
    expect(() => getStudyTimeResult(0, 2, 5)).toThrow(RangeError);
  });
});

describe('validateDaysInput', () => {
  it('returns null for a valid whole number of days', () => {
    expect(validateDaysInput('14')).toBeNull();
  });

  it('flags an empty field', () => {
    expect(validateDaysInput('')).toBe('DAYS_REQUIRED');
  });

  it('flags non-numeric input', () => {
    expect(validateDaysInput('abc')).toBe('DAYS_NOT_A_NUMBER');
  });

  it('flags zero days', () => {
    expect(validateDaysInput('0')).toBe('DAYS_NOT_POSITIVE');
  });

  it('flags negative days', () => {
    expect(validateDaysInput('-5')).toBe('DAYS_NOT_POSITIVE');
  });

  it('flags a non-whole number of days', () => {
    expect(validateDaysInput('3.5')).toBe('DAYS_NOT_WHOLE_NUMBER');
  });

  it('accepts the exact minimum and maximum bounds', () => {
    expect(
      validateDaysInput(String(STUDY_TIME_INPUT_BOUNDS.MIN_DAYS)),
    ).toBeNull();
    expect(
      validateDaysInput(String(STUDY_TIME_INPUT_BOUNDS.MAX_DAYS)),
    ).toBeNull();
  });

  it('flags days just above the maximum bound', () => {
    expect(validateDaysInput('181')).toBe('DAYS_OUT_OF_RANGE');
  });
});

describe('validateHoursPerDayInput', () => {
  it('returns null for a valid value', () => {
    expect(validateHoursPerDayInput('3')).toBeNull();
  });

  it('accepts a decimal value', () => {
    expect(validateHoursPerDayInput('2.5')).toBeNull();
  });

  it('flags an empty field', () => {
    expect(validateHoursPerDayInput('')).toBe('HOURS_PER_DAY_REQUIRED');
  });

  it('flags non-numeric input', () => {
    expect(validateHoursPerDayInput('abc')).toBe(
      'HOURS_PER_DAY_NOT_A_NUMBER',
    );
  });

  it('flags zero hours per day', () => {
    expect(validateHoursPerDayInput('0')).toBe('HOURS_PER_DAY_NOT_POSITIVE');
  });

  it('flags negative hours per day', () => {
    expect(validateHoursPerDayInput('-1')).toBe(
      'HOURS_PER_DAY_NOT_POSITIVE',
    );
  });

  it('accepts the exact minimum and maximum bounds', () => {
    expect(
      validateHoursPerDayInput(
        String(STUDY_TIME_INPUT_BOUNDS.MIN_HOURS_PER_DAY),
      ),
    ).toBeNull();
    expect(
      validateHoursPerDayInput(
        String(STUDY_TIME_INPUT_BOUNDS.MAX_HOURS_PER_DAY),
      ),
    ).toBeNull();
  });

  it('flags hours per day just above the maximum bound', () => {
    expect(validateHoursPerDayInput('16.1')).toBe(
      'HOURS_PER_DAY_OUT_OF_RANGE',
    );
  });

  it('flags hours per day just below the minimum bound', () => {
    expect(validateHoursPerDayInput('0.4')).toBe(
      'HOURS_PER_DAY_OUT_OF_RANGE',
    );
  });
});

describe('validateTopicsInput', () => {
  it('returns null for a valid whole number of topics', () => {
    expect(validateTopicsInput('6')).toBeNull();
  });

  it('flags an empty field', () => {
    expect(validateTopicsInput('')).toBe('TOPICS_REQUIRED');
  });

  it('flags non-numeric input', () => {
    expect(validateTopicsInput('abc')).toBe('TOPICS_NOT_A_NUMBER');
  });

  it('flags zero topics', () => {
    expect(validateTopicsInput('0')).toBe('TOPICS_NOT_POSITIVE');
  });

  it('flags negative topics', () => {
    expect(validateTopicsInput('-2')).toBe('TOPICS_NOT_POSITIVE');
  });

  it('flags a non-whole number of topics', () => {
    expect(validateTopicsInput('4.5')).toBe('TOPICS_NOT_WHOLE_NUMBER');
  });

  it('accepts the exact minimum and maximum bounds', () => {
    expect(
      validateTopicsInput(String(STUDY_TIME_INPUT_BOUNDS.MIN_TOPICS)),
    ).toBeNull();
    expect(
      validateTopicsInput(String(STUDY_TIME_INPUT_BOUNDS.MAX_TOPICS)),
    ).toBeNull();
  });

  it('flags topics just above the maximum bound', () => {
    expect(validateTopicsInput('51')).toBe('TOPICS_OUT_OF_RANGE');
  });
});

describe('validateStudyTimeInputs', () => {
  it('returns null for all fields when input is fully valid', () => {
    expect(validateStudyTimeInputs('14', '3', '6')).toEqual({
      daysError: null,
      hoursPerDayError: null,
      topicsError: null,
    });
  });

  it('reports errors for each field independently', () => {
    expect(validateStudyTimeInputs('', '', '')).toEqual({
      daysError: 'DAYS_REQUIRED',
      hoursPerDayError: 'HOURS_PER_DAY_REQUIRED',
      topicsError: 'TOPICS_REQUIRED',
    });
  });

  it('flags only the invalid field, leaving the valid ones null', () => {
    expect(validateStudyTimeInputs('14', '3', '')).toEqual({
      daysError: null,
      hoursPerDayError: null,
      topicsError: 'TOPICS_REQUIRED',
    });
  });
});
