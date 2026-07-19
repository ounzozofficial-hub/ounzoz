import { describe, expect, it } from 'vitest';
import {
  BMI_INPUT_BOUNDS,
  calculateBMI,
  getBMICategory,
  getBMIResult,
  validateBMIInputs,
  validateHeightInput,
  validateWeightInput,
} from './bmi';

describe('calculateBMI', () => {
  // --- Normal / expected cases ---
  it('calculates BMI for a typical adult (70kg, 175cm)', () => {
    // 70 / 1.75^2 = 22.857... -> 22.9
    expect(calculateBMI(70, 175)).toBe(22.9);
  });

  it('calculates BMI for another typical case (60kg, 160cm)', () => {
    // 60 / 1.60^2 = 23.4375 -> 23.4
    expect(calculateBMI(60, 160)).toBe(23.4);
  });

  it('rounds to exactly 1 decimal place', () => {
    // 80 / 1.80^2 = 24.691358... -> 24.7
    expect(calculateBMI(80, 180)).toBe(24.7);
  });

  // --- Edge cases: very low/high but valid values ---
  it('handles a very low but valid weight/height (2kg, 40cm — small infant)', () => {
    // 2 / 0.40^2 = 12.5
    expect(calculateBMI(2, 40)).toBe(12.5);
  });

  it('handles a very high but valid weight (300kg, 200cm)', () => {
    // 300 / 2.00^2 = 75
    expect(calculateBMI(300, 200)).toBe(75);
  });

  it('handles the minimum allowed weight and height bounds', () => {
    expect(() =>
      calculateBMI(BMI_INPUT_BOUNDS.MIN_WEIGHT_KG, BMI_INPUT_BOUNDS.MIN_HEIGHT_CM),
    ).not.toThrow();
  });

  it('handles the maximum allowed weight and height bounds', () => {
    expect(() =>
      calculateBMI(BMI_INPUT_BOUNDS.MAX_WEIGHT_KG, BMI_INPUT_BOUNDS.MAX_HEIGHT_CM),
    ).not.toThrow();
  });

  // --- Invalid inputs ---
  it('throws for zero weight (division producing a meaningless result)', () => {
    expect(() => calculateBMI(0, 175)).toThrow(RangeError);
  });

  it('throws for zero height (would divide by zero -> Infinity)', () => {
    expect(() => calculateBMI(70, 0)).toThrow(RangeError);
  });

  it('throws for negative weight', () => {
    expect(() => calculateBMI(-70, 175)).toThrow(RangeError);
  });

  it('throws for negative height', () => {
    expect(() => calculateBMI(70, -175)).toThrow(RangeError);
  });

  it('throws for non-numeric weight (NaN)', () => {
    expect(() => calculateBMI(NaN, 175)).toThrow(RangeError);
  });

  it('throws for non-numeric height (NaN)', () => {
    expect(() => calculateBMI(70, NaN)).toThrow(RangeError);
  });

  it('throws for Infinity weight', () => {
    expect(() => calculateBMI(Infinity, 175)).toThrow(RangeError);
  });

  it('throws for Infinity height', () => {
    expect(() => calculateBMI(70, Infinity)).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculateBMI(70, 175);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('getBMICategory', () => {
  // --- Boundary values: exact category thresholds ---
  it('classifies exactly 18.5 as normal (lower bound is inclusive)', () => {
    expect(getBMICategory(18.5).category).toBe('normal');
  });

  it('classifies just under 18.5 as underweight', () => {
    expect(getBMICategory(18.4).category).toBe('underweight');
  });

  it('classifies exactly 25 as overweight (lower bound is inclusive)', () => {
    expect(getBMICategory(25).category).toBe('overweight');
  });

  it('classifies just under 25 as normal', () => {
    expect(getBMICategory(24.9).category).toBe('normal');
  });

  it('classifies exactly 30 as obese (lower bound is inclusive)', () => {
    expect(getBMICategory(30).category).toBe('obese');
  });

  it('classifies just under 30 as overweight', () => {
    expect(getBMICategory(29.9).category).toBe('overweight');
  });

  // --- Normal cases across each band ---
  it('classifies a low underweight value correctly', () => {
    expect(getBMICategory(15).category).toBe('underweight');
  });

  it('classifies a mid-normal value correctly', () => {
    expect(getBMICategory(22).category).toBe('normal');
  });

  it('classifies a high obese value correctly', () => {
    expect(getBMICategory(45).category).toBe('obese');
  });

  it('returns a human-readable label alongside the category', () => {
    expect(getBMICategory(22).label).toBe('Normal weight');
  });

  // --- Invalid inputs ---
  it('throws for zero BMI', () => {
    expect(() => getBMICategory(0)).toThrow(RangeError);
  });

  it('throws for negative BMI', () => {
    expect(() => getBMICategory(-5)).toThrow(RangeError);
  });

  it('throws for NaN BMI', () => {
    expect(() => getBMICategory(NaN)).toThrow(RangeError);
  });
});

describe('getBMIResult', () => {
  it('combines calculateBMI and getBMICategory into one result', () => {
    const result = getBMIResult(70, 175);
    expect(result.bmi).toBe(22.9);
    expect(result.category.category).toBe('normal');
    expect(result.category.label).toBe('Normal weight');
  });

  it('propagates validation errors from calculateBMI for invalid input', () => {
    expect(() => getBMIResult(0, 175)).toThrow(RangeError);
  });
});

describe('validateWeightInput', () => {
  it('returns null for a valid weight', () => {
    expect(validateWeightInput('70')).toBeNull();
  });

  it('returns null for a valid decimal weight', () => {
    expect(validateWeightInput('70.5')).toBeNull();
  });

  it('trims surrounding whitespace before validating', () => {
    expect(validateWeightInput('  70  ')).toBeNull();
  });

  it('flags an empty weight field', () => {
    expect(validateWeightInput('')).toBe('WEIGHT_REQUIRED');
  });

  it('flags a whitespace-only weight field as required', () => {
    expect(validateWeightInput('   ')).toBe('WEIGHT_REQUIRED');
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
    expect(validateWeightInput(String(BMI_INPUT_BOUNDS.MIN_WEIGHT_KG))).toBeNull();
  });

  it('accepts the exact maximum weight bound', () => {
    expect(validateWeightInput(String(BMI_INPUT_BOUNDS.MAX_WEIGHT_KG))).toBeNull();
  });

  it('flags weight just below the minimum bound', () => {
    expect(validateWeightInput('0.5')).toBe('WEIGHT_OUT_OF_RANGE');
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

  it('flags negative height', () => {
    expect(validateHeightInput('-175')).toBe('HEIGHT_NOT_POSITIVE');
  });

  it('accepts the exact minimum height bound', () => {
    expect(validateHeightInput(String(BMI_INPUT_BOUNDS.MIN_HEIGHT_CM))).toBeNull();
  });

  it('accepts the exact maximum height bound', () => {
    expect(validateHeightInput(String(BMI_INPUT_BOUNDS.MAX_HEIGHT_CM))).toBeNull();
  });

  it('flags height just below the minimum bound', () => {
    expect(validateHeightInput('29.9')).toBe('HEIGHT_OUT_OF_RANGE');
  });

  it('flags height just above the maximum bound', () => {
    expect(validateHeightInput('300.1')).toBe('HEIGHT_OUT_OF_RANGE');
  });
});

describe('validateBMIInputs', () => {
  it('returns null for both fields when weight and height are valid', () => {
    expect(validateBMIInputs('70', '175')).toEqual({
      weightError: null,
      heightError: null,
    });
  });

  it('reports weight and height errors independently', () => {
    expect(validateBMIInputs('', 'abc')).toEqual({
      weightError: 'WEIGHT_REQUIRED',
      heightError: 'HEIGHT_NOT_A_NUMBER',
    });
  });

  it('flags only the invalid field, leaving the valid one null', () => {
    expect(validateBMIInputs('-70', '175')).toEqual({
      weightError: 'WEIGHT_NOT_POSITIVE',
      heightError: null,
    });
  });
});
