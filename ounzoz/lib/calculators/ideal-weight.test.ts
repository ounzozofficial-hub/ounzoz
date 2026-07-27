import { describe, expect, it } from 'vitest';
import {
  IDEAL_WEIGHT_INPUT_BOUNDS,
  calculateIdealWeight,
  getIdealWeightResult,
  validateHeightInput,
  validateIdealWeightInputs,
  validateSexInput,
} from './ideal-weight';

describe('calculateIdealWeight', () => {
  // --- Normal / expected cases ---
  // Reference values computed directly from the published Devine formula
  // (50 + 2.3×(inches−60) for men, 45.5 + 2.3×(inches−60) for women),
  // same hand-verification approach used for calculateBMR and the Navy
  // body-fat formula.
  it('calculates ideal weight for a typical adult male (175cm)', () => {
    expect(calculateIdealWeight(175, 'male')).toBe(70.5);
  });

  it('calculates ideal weight for a second typical adult male (180cm)', () => {
    expect(calculateIdealWeight(180, 'male')).toBe(75);
  });

  it('calculates ideal weight for a typical adult female (165cm)', () => {
    expect(calculateIdealWeight(165, 'female')).toBe(56.9);
  });

  it('calculates ideal weight for a second typical adult female (160cm)', () => {
    expect(calculateIdealWeight(160, 'female')).toBe(52.4);
  });

  it('returns exactly the base constant at 5 feet (152.4cm) for each sex', () => {
    // At height = 60 inches exactly, (inches − 60) = 0, so the result is
    // just the formula's base constant — the clearest possible check that
    // the constants and unit conversion are wired correctly.
    expect(calculateIdealWeight(152.4, 'male')).toBe(50);
    expect(calculateIdealWeight(152.4, 'female')).toBe(45.5);
  });

  it('produces a different result for male vs female at the same height', () => {
    const male = calculateIdealWeight(175, 'male');
    const female = calculateIdealWeight(175, 'female');
    // The formulas differ by a constant 4.5kg base (50 vs 45.5).
    expect(male - female).toBeCloseTo(4.5, 5);
  });

  it('produces a higher ideal weight for a taller person of the same sex', () => {
    const shorter = calculateIdealWeight(160, 'male');
    const taller = calculateIdealWeight(190, 'male');
    expect(taller).toBeGreaterThan(shorter);
  });

  it('rounds to 1 decimal place', () => {
    const result = calculateIdealWeight(171, 'male');
    expect(result).toBe(Math.round(result * 10) / 10);
  });

  // --- Edge cases: bounds of the input range ---
  it('handles the minimum allowed height bound (male)', () => {
    expect(
      calculateIdealWeight(IDEAL_WEIGHT_INPUT_BOUNDS.MIN_HEIGHT_CM, 'male'),
    ).toBe(38.8);
  });

  it('handles the minimum allowed height bound (female)', () => {
    expect(
      calculateIdealWeight(IDEAL_WEIGHT_INPUT_BOUNDS.MIN_HEIGHT_CM, 'female'),
    ).toBe(34.3);
  });

  it('handles the maximum allowed height bound (male)', () => {
    expect(
      calculateIdealWeight(IDEAL_WEIGHT_INPUT_BOUNDS.MAX_HEIGHT_CM, 'male'),
    ).toBe(120.3);
  });

  it('handles the maximum allowed height bound (female)', () => {
    expect(
      calculateIdealWeight(IDEAL_WEIGHT_INPUT_BOUNDS.MAX_HEIGHT_CM, 'female'),
    ).toBe(115.8);
  });

  // --- Invalid inputs ---
  it('throws for zero height', () => {
    expect(() => calculateIdealWeight(0, 'male')).toThrow(RangeError);
  });

  it('throws for negative height', () => {
    expect(() => calculateIdealWeight(-175, 'male')).toThrow(RangeError);
  });

  it('throws for non-numeric height (NaN)', () => {
    expect(() => calculateIdealWeight(NaN, 'male')).toThrow(RangeError);
  });

  it('throws for Infinity height', () => {
    expect(() => calculateIdealWeight(Infinity, 'male')).toThrow(RangeError);
  });

  it('throws rather than returning a non-positive ideal weight for an unrealistically short height', () => {
    // Well below the formula's valid domain — the linear extension below
    // 5ft eventually crosses zero. Guarded explicitly so a caller that
    // bypasses front-end validation never sees a negative "ideal weight"
    // (CLAUDE.md Section 8).
    expect(() => calculateIdealWeight(80, 'female')).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    expect(Number.isFinite(calculateIdealWeight(175, 'male'))).toBe(true);
    expect(Number.isFinite(calculateIdealWeight(165, 'female'))).toBe(true);
  });
});

describe('getIdealWeightResult', () => {
  it('wraps calculateIdealWeight in an IdealWeightResult object', () => {
    const result = getIdealWeightResult(175, 'male');
    expect(result.idealWeightKg).toBe(70.5);
  });

  it('propagates validation errors from calculateIdealWeight for invalid input', () => {
    expect(() => getIdealWeightResult(0, 'male')).toThrow(RangeError);
  });
});

describe('validateHeightInput', () => {
  it('returns null for a valid height', () => {
    expect(validateHeightInput('175')).toBeNull();
  });

  it('flags an empty height field', () => {
    expect(validateHeightInput('')).toBe('HEIGHT_REQUIRED');
  });

  it('flags a whitespace-only height field as required', () => {
    expect(validateHeightInput('   ')).toBe('HEIGHT_REQUIRED');
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
    expect(
      validateHeightInput(String(IDEAL_WEIGHT_INPUT_BOUNDS.MIN_HEIGHT_CM)),
    ).toBeNull();
  });

  it('accepts the exact maximum height bound', () => {
    expect(
      validateHeightInput(String(IDEAL_WEIGHT_INPUT_BOUNDS.MAX_HEIGHT_CM)),
    ).toBeNull();
  });

  it('flags height just below the minimum bound', () => {
    expect(validateHeightInput('139.9')).toBe('HEIGHT_OUT_OF_RANGE');
  });

  it('flags height just above the maximum bound', () => {
    expect(validateHeightInput('230.1')).toBe('HEIGHT_OUT_OF_RANGE');
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

describe('validateIdealWeightInputs', () => {
  it('returns null for both fields when input is fully valid', () => {
    expect(validateIdealWeightInputs('175', 'male')).toEqual({
      heightError: null,
      sexError: null,
    });
  });

  it('reports height and sex errors independently', () => {
    expect(validateIdealWeightInputs('', null)).toEqual({
      heightError: 'HEIGHT_REQUIRED',
      sexError: 'SEX_REQUIRED',
    });
  });

  it('flags only the invalid field, leaving the valid one null', () => {
    expect(validateIdealWeightInputs('175', null)).toEqual({
      heightError: null,
      sexError: 'SEX_REQUIRED',
    });
  });
});
