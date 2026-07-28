import { describe, expect, it } from 'vitest';
import {
  GPA_INPUT_BOUNDS,
  GRADE_POINTS,
  calculateGPA,
  getGPAResult,
  validateCourseRow,
  validateCreditHoursInput,
  validateGradeInput,
} from './gpa';
import type { CourseInput } from './gpa';

describe('calculateGPA', () => {
  // --- Normal / expected cases ---
  // Reference values hand-computed as Σ(points × hours) / Σ(hours), same
  // verification approach used across every prior tool's tests.
  it('calculates GPA for a single A course', () => {
    // 4.0 × 3 / 3 = 4.0
    expect(calculateGPA([{ grade: 'A', creditHours: 3 }])).toBe(4);
  });

  it('calculates GPA for two evenly-weighted courses', () => {
    // (4.0×3 + 3.0×3) / 6 = 21 / 6 = 3.5
    expect(
      calculateGPA([
        { grade: 'A', creditHours: 3 },
        { grade: 'B', creditHours: 3 },
      ]),
    ).toBe(3.5);
  });

  it('calculates GPA weighted by differing credit hours', () => {
    // (3.7×4 + 2.0×1) / 5 = (14.8 + 2) / 5 = 16.8 / 5 = 3.36
    expect(
      calculateGPA([
        { grade: 'A-', creditHours: 4 },
        { grade: 'C', creditHours: 1 },
      ]),
    ).toBe(3.36);
  });

  it('calculates GPA across three courses with +/- grades', () => {
    // (4.0×3 + 3.3×4 + 2.0×3) / 10 = (12 + 13.2 + 6) / 10 = 31.2 / 10 = 3.12
    expect(
      calculateGPA([
        { grade: 'A', creditHours: 3 },
        { grade: 'B+', creditHours: 4 },
        { grade: 'C', creditHours: 3 },
      ]),
    ).toBe(3.12);
  });

  it('rounds to 2 decimal places', () => {
    // (3.7×0.5 + 1.0×10) / 10.5 = (1.85 + 10) / 10.5 = 11.85 / 10.5 = 1.128571... -> 1.13
    expect(
      calculateGPA([
        { grade: 'A-', creditHours: 0.5 },
        { grade: 'D', creditHours: 10 },
      ]),
    ).toBe(1.13);
  });

  // --- Boundary values ---
  it('returns exactly 4.0 for an all-A course load', () => {
    expect(
      calculateGPA([
        { grade: 'A', creditHours: 3 },
        { grade: 'A', creditHours: 4 },
      ]),
    ).toBe(4);
  });

  it('returns exactly 0.0 for an all-F course load', () => {
    expect(
      calculateGPA([
        { grade: 'F', creditHours: 3 },
        { grade: 'F', creditHours: 4 },
      ]),
    ).toBe(0);
  });

  it('handles the minimum credit-hour bound', () => {
    expect(
      calculateGPA([
        { grade: 'B', creditHours: GPA_INPUT_BOUNDS.MIN_CREDIT_HOURS },
      ]),
    ).toBe(3.0);
  });

  it('handles the maximum credit-hour bound', () => {
    expect(
      calculateGPA([
        { grade: 'B', creditHours: GPA_INPUT_BOUNDS.MAX_CREDIT_HOURS },
      ]),
    ).toBe(3.0);
  });

  it('matches every GRADE_POINTS entry for a single-course calculation', () => {
    for (const [grade, points] of Object.entries(GRADE_POINTS) as [
      keyof typeof GRADE_POINTS,
      number,
    ][]) {
      expect(calculateGPA([{ grade, creditHours: 3 }])).toBe(points);
    }
  });

  // --- Invalid inputs ---
  it('throws for an empty course list', () => {
    expect(() => calculateGPA([])).toThrow(RangeError);
  });

  it('throws for zero credit hours', () => {
    expect(() =>
      calculateGPA([{ grade: 'A', creditHours: 0 }]),
    ).toThrow(RangeError);
  });

  it('throws for negative credit hours', () => {
    expect(() =>
      calculateGPA([{ grade: 'A', creditHours: -3 }]),
    ).toThrow(RangeError);
  });

  it('throws for non-finite credit hours', () => {
    expect(() =>
      calculateGPA([{ grade: 'A', creditHours: NaN }]),
    ).toThrow(RangeError);
    expect(() =>
      calculateGPA([{ grade: 'A', creditHours: Infinity }]),
    ).toThrow(RangeError);
  });

  it('throws for an unrecognized grade', () => {
    expect(() =>
      calculateGPA([
        { grade: 'Z' as unknown as CourseInput['grade'], creditHours: 3 },
      ]),
    ).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculateGPA([{ grade: 'B+', creditHours: 3 }]);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('getGPAResult', () => {
  it('returns gpa, totalCreditHours, and courseCount together', () => {
    const result = getGPAResult([
      { grade: 'A', creditHours: 3 },
      { grade: 'B', creditHours: 3 },
    ]);
    expect(result.gpa).toBe(3.5);
    expect(result.totalCreditHours).toBe(6);
    expect(result.courseCount).toBe(2);
  });

  it('matches calculateGPA exactly for the same inputs', () => {
    const courses: CourseInput[] = [
      { grade: 'A-', creditHours: 4 },
      { grade: 'C', creditHours: 1 },
    ];
    expect(getGPAResult(courses).gpa).toBe(calculateGPA(courses));
  });

  it('propagates validation errors from an invalid course list', () => {
    expect(() => getGPAResult([])).toThrow(RangeError);
  });
});

describe('validateGradeInput', () => {
  it('returns null for a selected grade', () => {
    expect(validateGradeInput('A')).toBeNull();
  });

  it('flags a missing grade', () => {
    expect(validateGradeInput(null)).toBe('GRADE_REQUIRED');
  });
});

describe('validateCreditHoursInput', () => {
  it('returns null for a valid credit-hours value', () => {
    expect(validateCreditHoursInput('3')).toBeNull();
  });

  it('flags an empty field', () => {
    expect(validateCreditHoursInput('')).toBe('CREDIT_HOURS_REQUIRED');
  });

  it('flags non-numeric input', () => {
    expect(validateCreditHoursInput('abc')).toBe('CREDIT_HOURS_NOT_A_NUMBER');
  });

  it('flags zero credit hours', () => {
    expect(validateCreditHoursInput('0')).toBe('CREDIT_HOURS_NOT_POSITIVE');
  });

  it('flags negative credit hours', () => {
    expect(validateCreditHoursInput('-3')).toBe('CREDIT_HOURS_NOT_POSITIVE');
  });

  it('accepts the exact minimum and maximum bounds', () => {
    expect(
      validateCreditHoursInput(String(GPA_INPUT_BOUNDS.MIN_CREDIT_HOURS)),
    ).toBeNull();
    expect(
      validateCreditHoursInput(String(GPA_INPUT_BOUNDS.MAX_CREDIT_HOURS)),
    ).toBeNull();
  });

  it('flags a value just below the minimum bound', () => {
    expect(validateCreditHoursInput('0.3')).toBe('CREDIT_HOURS_OUT_OF_RANGE');
  });

  it('flags a value just above the maximum bound', () => {
    expect(validateCreditHoursInput('10.5')).toBe('CREDIT_HOURS_OUT_OF_RANGE');
  });
});

describe('validateCourseRow', () => {
  it('returns null for both fields when input is fully valid', () => {
    expect(validateCourseRow('A', '3')).toEqual({
      gradeError: null,
      creditHoursError: null,
    });
  });

  it('reports grade and credit-hours errors independently', () => {
    expect(validateCourseRow(null, '')).toEqual({
      gradeError: 'GRADE_REQUIRED',
      creditHoursError: 'CREDIT_HOURS_REQUIRED',
    });
  });

  it('flags only the invalid field, leaving the valid one null', () => {
    expect(validateCourseRow('B', '')).toEqual({
      gradeError: null,
      creditHoursError: 'CREDIT_HOURS_REQUIRED',
    });
  });
});
