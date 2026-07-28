import { describe, expect, it } from 'vitest';
import {
  GRADE_INPUT_BOUNDS,
  calculateOverallGrade,
  getGradeResult,
  getLetterGrade,
  validateCategoryRow,
  validateScoreInput,
  validateWeightInput,
} from './grade';
import type { CategoryInput } from './grade';

describe('calculateOverallGrade', () => {
  // --- Normal / expected cases ---
  // Reference values hand-computed as Σ(score × weight) / Σ(weight), same
  // verification approach used across every prior tool's tests.
  it('calculates the overall grade for a single fully-weighted category', () => {
    // 85 × 100 / 100 = 85
    expect(
      calculateOverallGrade([{ weight: 100, score: 85 }]),
    ).toBe(85);
  });

  it('calculates the overall grade for two categories summing to 100% weight', () => {
    // (90×40 + 70×60) / 100 = (3600 + 4200) / 100 = 78
    expect(
      calculateOverallGrade([
        { weight: 40, score: 90 },
        { weight: 60, score: 70 },
      ]),
    ).toBe(78);
  });

  it('normalizes correctly when weights do not sum to 100', () => {
    // (100×30 + 50×20) / 50 = (3000 + 1000) / 50 = 80
    expect(
      calculateOverallGrade([
        { weight: 30, score: 100 },
        { weight: 20, score: 50 },
      ]),
    ).toBe(80);
  });

  it('rounds to 2 decimal places', () => {
    // (100×1 + 0×2) / 3 = 100 / 3 = 33.3333... -> 33.33
    expect(
      calculateOverallGrade([
        { weight: 1, score: 100 },
        { weight: 2, score: 0 },
      ]),
    ).toBe(33.33);
  });

  // --- Boundary values ---
  it('returns exactly 100 for an all-100 course', () => {
    expect(
      calculateOverallGrade([
        { weight: 50, score: 100 },
        { weight: 50, score: 100 },
      ]),
    ).toBe(100);
  });

  it('returns exactly 0 for an all-0 course', () => {
    expect(
      calculateOverallGrade([
        { weight: 50, score: 0 },
        { weight: 50, score: 0 },
      ]),
    ).toBe(0);
  });

  it('handles the minimum score bound', () => {
    expect(
      calculateOverallGrade([{ weight: 100, score: GRADE_INPUT_BOUNDS.MIN_PERCENT }]),
    ).toBe(0);
  });

  it('handles the maximum score bound', () => {
    expect(
      calculateOverallGrade([{ weight: 100, score: GRADE_INPUT_BOUNDS.MAX_PERCENT }]),
    ).toBe(100);
  });

  it('handles the maximum weight bound on a single category', () => {
    expect(
      calculateOverallGrade([{ weight: GRADE_INPUT_BOUNDS.MAX_PERCENT, score: 75 }]),
    ).toBe(75);
  });

  // --- Invalid inputs ---
  it('throws for an empty category list', () => {
    expect(() => calculateOverallGrade([])).toThrow(RangeError);
  });

  it('throws when every category has zero weight', () => {
    expect(() =>
      calculateOverallGrade([{ weight: 0, score: 100 }]),
    ).toThrow(RangeError);
  });

  it('throws for a negative weight', () => {
    expect(() =>
      calculateOverallGrade([{ weight: -10, score: 50 }]),
    ).toThrow(RangeError);
  });

  it('throws for a weight above 100', () => {
    expect(() =>
      calculateOverallGrade([{ weight: 110, score: 50 }]),
    ).toThrow(RangeError);
  });

  it('throws for a negative score', () => {
    expect(() =>
      calculateOverallGrade([{ weight: 50, score: -1 }]),
    ).toThrow(RangeError);
  });

  it('throws for a score above 100', () => {
    expect(() =>
      calculateOverallGrade([{ weight: 50, score: 101 }]),
    ).toThrow(RangeError);
  });

  it('throws for non-finite weight or score', () => {
    expect(() =>
      calculateOverallGrade([{ weight: NaN, score: 50 }]),
    ).toThrow(RangeError);
    expect(() =>
      calculateOverallGrade([{ weight: 50, score: Infinity }]),
    ).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculateOverallGrade([{ weight: 50, score: 72 }]);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('getLetterGrade', () => {
  it('maps exactly 90 and above to A', () => {
    expect(getLetterGrade(90)).toBe('A');
    expect(getLetterGrade(100)).toBe('A');
  });

  it('maps just below 90 to B', () => {
    expect(getLetterGrade(89.99)).toBe('B');
  });

  it('maps exactly 80 to B', () => {
    expect(getLetterGrade(80)).toBe('B');
  });

  it('maps just below 80 to C', () => {
    expect(getLetterGrade(79.99)).toBe('C');
  });

  it('maps exactly 70 to C', () => {
    expect(getLetterGrade(70)).toBe('C');
  });

  it('maps just below 70 to D', () => {
    expect(getLetterGrade(69.99)).toBe('D');
  });

  it('maps exactly 60 to D', () => {
    expect(getLetterGrade(60)).toBe('D');
  });

  it('maps just below 60 to F', () => {
    expect(getLetterGrade(59.99)).toBe('F');
  });

  it('maps exactly 0 to F', () => {
    expect(getLetterGrade(0)).toBe('F');
  });

  it('throws for a negative percent', () => {
    expect(() => getLetterGrade(-1)).toThrow(RangeError);
  });

  it('throws for a non-finite percent', () => {
    expect(() => getLetterGrade(NaN)).toThrow(RangeError);
    expect(() => getLetterGrade(Infinity)).toThrow(RangeError);
  });
});

describe('getGradeResult', () => {
  it('returns overallPercent, letterGrade, totalWeight, and categoryCount together', () => {
    const result = getGradeResult([
      { weight: 40, score: 90 },
      { weight: 60, score: 70 },
    ]);
    expect(result.overallPercent).toBe(78);
    expect(result.letterGrade).toBe('C');
    expect(result.totalWeight).toBe(100);
    expect(result.categoryCount).toBe(2);
  });

  it('matches calculateOverallGrade exactly for the same inputs', () => {
    const categories: CategoryInput[] = [
      { weight: 30, score: 100 },
      { weight: 20, score: 50 },
    ];
    expect(getGradeResult(categories).overallPercent).toBe(
      calculateOverallGrade(categories),
    );
  });

  it('reports the correct totalWeight when weights do not sum to 100', () => {
    const result = getGradeResult([
      { weight: 25, score: 80 },
      { weight: 15, score: 60 },
    ]);
    expect(result.totalWeight).toBe(40);
  });

  it('propagates validation errors from an invalid category list', () => {
    expect(() => getGradeResult([])).toThrow(RangeError);
  });
});

describe('validateWeightInput', () => {
  it('returns null for a valid weight', () => {
    expect(validateWeightInput('40')).toBeNull();
  });

  it('flags an empty field', () => {
    expect(validateWeightInput('')).toBe('WEIGHT_REQUIRED');
  });

  it('flags non-numeric input', () => {
    expect(validateWeightInput('abc')).toBe('WEIGHT_NOT_A_NUMBER');
  });

  it('flags a negative weight', () => {
    expect(validateWeightInput('-5')).toBe('WEIGHT_OUT_OF_RANGE');
  });

  it('flags a weight above 100', () => {
    expect(validateWeightInput('101')).toBe('WEIGHT_OUT_OF_RANGE');
  });

  it('accepts the exact minimum and maximum bounds', () => {
    expect(validateWeightInput(String(GRADE_INPUT_BOUNDS.MIN_PERCENT))).toBeNull();
    expect(validateWeightInput(String(GRADE_INPUT_BOUNDS.MAX_PERCENT))).toBeNull();
  });
});

describe('validateScoreInput', () => {
  it('returns null for a valid score', () => {
    expect(validateScoreInput('85')).toBeNull();
  });

  it('flags an empty field', () => {
    expect(validateScoreInput('')).toBe('SCORE_REQUIRED');
  });

  it('flags non-numeric input', () => {
    expect(validateScoreInput('abc')).toBe('SCORE_NOT_A_NUMBER');
  });

  it('flags a negative score', () => {
    expect(validateScoreInput('-1')).toBe('SCORE_OUT_OF_RANGE');
  });

  it('flags a score above 100', () => {
    expect(validateScoreInput('100.1')).toBe('SCORE_OUT_OF_RANGE');
  });

  it('accepts the exact minimum and maximum bounds', () => {
    expect(validateScoreInput(String(GRADE_INPUT_BOUNDS.MIN_PERCENT))).toBeNull();
    expect(validateScoreInput(String(GRADE_INPUT_BOUNDS.MAX_PERCENT))).toBeNull();
  });
});

describe('validateCategoryRow', () => {
  it('returns null for both fields when input is fully valid', () => {
    expect(validateCategoryRow('40', '85')).toEqual({
      weightError: null,
      scoreError: null,
    });
  });

  it('reports weight and score errors independently', () => {
    expect(validateCategoryRow('', '')).toEqual({
      weightError: 'WEIGHT_REQUIRED',
      scoreError: 'SCORE_REQUIRED',
    });
  });

  it('flags only the invalid field, leaving the valid one null', () => {
    expect(validateCategoryRow('40', '')).toEqual({
      weightError: null,
      scoreError: 'SCORE_REQUIRED',
    });
  });
});
