import { describe, expect, it } from 'vitest';
import {
  BMR_INPUT_BOUNDS,
  calculateBMR,
  getBMRResult,
  validateAgeInput,
  validateBMRInputs,
  validateHeightInput,
  validateSexInput,
  validateWeightInput,
} from './bmr';

describe('calculateBMR', () => {
  // --- Normal / expected cases ---
  it('calculates BMR for a typical adult male (70kg, 175cm, 30y)', () => {
    // 10*70 + 6.25*175 - 5*30 + 5 = 700 + 1093.75 - 150 + 5 = 1648.75 -> 1649
    expect(calculateBMR(70, 175, 30, 'male')).toBe(1649);
  });

  it('calculates BMR for a typical adult female (60kg, 165cm, 30y)', () => {
    // 10*60 + 6.25*165 - 5*30 - 161 = 600 + 1031.25 - 150 - 161 = 1320.25 -> 1320
    expect(calculateBMR(60, 165, 30, 'female')).toBe(1320);
  });

  it('produces a different result for male vs female with identical body stats', () => {
    const male = calculateBMR(70, 175, 30, 'male');
    const female = calculateBMR(70, 175, 30, 'female');
    // The equations differ by a constant +5 (male) vs -161 (female): 166 apart.
    expect(male - female).toBe(166);
  });

  it('rounds to the nearest whole number', () => {
    // 10*82 + 6.25*178 - 5*45 + 5 = 820 + 1112.5 - 225 + 5 = 1712.5 -> 1713 (round half up)
    expect(calculateBMR(82, 178, 45, 'male')).toBe(1713);
  });

  // --- Edge cases: very low/high but valid values ---
  it('handles a very low but valid age (1 year old)', () => {
    expect(() => calculateBMR(10, 75, 1, 'male')).not.toThrow();
  });

  it('handles the maximum realistic age (120 years)', () => {
    expect(() => calculateBMR(70, 170, 120, 'female')).not.toThrow();
  });

  it('handles the minimum allowed weight and height bounds', () => {
    expect(() =>
      calculateBMR(
        BMR_INPUT_BOUNDS.MIN_WEIGHT_KG,
        BMR_INPUT_BOUNDS.MIN_HEIGHT_CM,
        30,
        'male',
      ),
    ).not.toThrow();
  });

  it('handles the maximum allowed weight and height bounds', () => {
    expect(() =>
      calculateBMR(
        BMR_INPUT_BOUNDS.MAX_WEIGHT_KG,
        BMR_INPUT_BOUNDS.MAX_HEIGHT_CM,
        30,
        'male',
      ),
    ).not.toThrow();
  });

  // --- Invalid inputs ---
  it('throws for zero weight', () => {
    expect(() => calculateBMR(0, 175, 30, 'male')).toThrow(RangeError);
  });

  it('throws for zero height', () => {
    expect(() => calculateBMR(70, 0, 30, 'male')).toThrow(RangeError);
  });

  it('throws for zero age', () => {
    expect(() => calculateBMR(70, 175, 0, 'male')).toThrow(RangeError);
  });

  it('throws for negative weight', () => {
    expect(() => calculateBMR(-70, 175, 30, 'male')).toThrow(RangeError);
  });

  it('throws for negative height', () => {
    expect(() => calculateBMR(70, -175, 30, 'male')).toThrow(RangeError);
  });

  it('throws for negative age', () => {
    expect(() => calculateBMR(70, 175, -30, 'male')).toThrow(RangeError);
  });

  it('throws for non-numeric weight (NaN)', () => {
    expect(() => calculateBMR(NaN, 175, 30, 'male')).toThrow(RangeError);
  });

  it('throws for non-numeric height (NaN)', () => {
    expect(() => calculateBMR(70, NaN, 30, 'male')).toThrow(RangeError);
  });

  it('throws for non-numeric age (NaN)', () => {
    expect(() => calculateBMR(70, 175, NaN, 'male')).toThrow(RangeError);
  });

  it('throws for Infinity weight', () => {
    expect(() => calculateBMR(Infinity, 175, 30, 'male')).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculateBMR(70, 175, 30, 'male');
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('getBMRResult', () => {
  it('wraps calculateBMR in a BMRResult object', () => {
    const result = getBMRResult(70, 175, 30, 'male');
    expect(result.bmr).toBe(1649);
  });

  it('propagates validation errors from calculateBMR for invalid input', () => {
    expect(() => getBMRResult(0, 175, 30, 'male')).toThrow(RangeError);
  });
});

describe('validateWeightInput', () => {
  it('returns null for a valid weight', () => {
    expect(validateWeightInput('70')).toBeNull();
  });

  it('flags an empty weight field', () => {
    expect(validateWeightInput('')).toBe('WEIGHT_REQUIRED');
  });

  it('flags non-numeric weight', () => {
    expect(validateWeightInput('abc')).toBe('WEIGHT_NOT_A_NUMBER');
  });

  it('flags zero weight', () => {
    expect(validateWeightInput('0')).toBe('WEIGHT_NOT_POSITIVE');
  });

  it('flags negative weight', () => {
    expect(validateWeightInput('-70')).toBe('WEIGHT_NOT_POSITIVE');
  });

  it('accepts the exact minimum weight bound', () => {
    expect(
      validateWeightInput(String(BMR_INPUT_BOUNDS.MIN_WEIGHT_KG)),
    ).toBeNull();
  });

  it('accepts the exact maximum weight bound', () => {
    expect(
      validateWeightInput(String(BMR_INPUT_BOUNDS.MAX_WEIGHT_KG)),
    ).toBeNull();
  });

  it('flags weight just above the maximum bound', () => {
    expect(validateWeightInput('500.1')).toBe('WEIGHT_OUT_OF_RANGE');
  });
});

describe('validateHeightInput', () => {
  it('returns null for a valid height', () => {
    expect(validateHeightInput('175')).toBeNull();
  });

  it('flags an empty height field', () => {
    expect(validateHeightInput('')).toBe('HEIGHT_REQUIRED');
  });

  it('flags non-numeric height', () => {
    expect(validateHeightInput('abc')).toBe('HEIGHT_NOT_A_NUMBER');
  });

  it('flags zero height', () => {
    expect(validateHeightInput('0')).toBe('HEIGHT_NOT_POSITIVE');
  });

  it('accepts the exact minimum height bound', () => {
    expect(
      validateHeightInput(String(BMR_INPUT_BOUNDS.MIN_HEIGHT_CM)),
    ).toBeNull();
  });

  it('accepts the exact maximum height bound', () => {
    expect(
      validateHeightInput(String(BMR_INPUT_BOUNDS.MAX_HEIGHT_CM)),
    ).toBeNull();
  });

  it('flags height just above the maximum bound', () => {
    expect(validateHeightInput('300.1')).toBe('HEIGHT_OUT_OF_RANGE');
  });
});

describe('validateAgeInput', () => {
  // --- Normal cases ---
  it('returns null for a valid age', () => {
    expect(validateAgeInput('30')).toBeNull();
  });

  // --- Required ---
  it('flags an empty age field', () => {
    expect(validateAgeInput('')).toBe('AGE_REQUIRED');
  });

  it('flags a whitespace-only age field as required', () => {
    expect(validateAgeInput('   ')).toBe('AGE_REQUIRED');
  });

  // --- Non-numeric ---
  it('flags non-numeric age', () => {
    expect(validateAgeInput('abc')).toBe('AGE_NOT_A_NUMBER');
  });

  // --- Zero / negative ---
  it('flags zero age', () => {
    expect(validateAgeInput('0')).toBe('AGE_NOT_POSITIVE');
  });

  it('flags negative age', () => {
    expect(validateAgeInput('-5')).toBe('AGE_NOT_POSITIVE');
  });

  // --- Non-whole numbers ---
  it('flags a fractional age', () => {
    expect(validateAgeInput('30.5')).toBe('AGE_NOT_WHOLE_NUMBER');
  });

  // --- Boundary values: exact bounds ---
  it('accepts the exact minimum age bound (1 year)', () => {
    expect(validateAgeInput(String(BMR_INPUT_BOUNDS.MIN_AGE_YEARS))).toBeNull();
  });

  it('accepts the exact maximum age bound (120 years)', () => {
    expect(validateAgeInput(String(BMR_INPUT_BOUNDS.MAX_AGE_YEARS))).toBeNull();
  });

  it('flags age just above the maximum bound (121 years)', () => {
    expect(validateAgeInput('121')).toBe('AGE_OUT_OF_RANGE');
  });

  it('flags age of zero as not-positive before range (0 is below range but caught by positivity check first)', () => {
    expect(validateAgeInput('0')).toBe('AGE_NOT_POSITIVE');
  });
});

describe('validateSexInput', () => {
  it('returns null when male is selected', () => {
    expect(validateSexInput('male')).toBeNull();
  });

  it('returns null when female is selected', () => {
    expect(validateSexInput('female')).toBeNull();
  });

  it('flags when nothing is selected', () => {
    expect(validateSexInput(null)).toBe('SEX_REQUIRED');
  });
});

describe('validateBMRInputs', () => {
  it('returns null for all fields when input is fully valid', () => {
    expect(validateBMRInputs('70', '175', '30', 'male')).toEqual({
      weightError: null,
      heightError: null,
      ageError: null,
      sexError: null,
    });
  });

  it('reports weight, height, age, and sex errors independently', () => {
    expect(validateBMRInputs('', 'abc', '-5', null)).toEqual({
      weightError: 'WEIGHT_REQUIRED',
      heightError: 'HEIGHT_NOT_A_NUMBER',
      ageError: 'AGE_NOT_POSITIVE',
      sexError: 'SEX_REQUIRED',
    });
  });

  it('flags only the invalid field, leaving the valid ones null', () => {
    expect(validateBMRInputs('70', '175', '200', 'female')).toEqual({
      weightError: null,
      heightError: null,
      ageError: 'AGE_OUT_OF_RANGE',
      sexError: null,
    });
  });
});
