import { describe, expect, it } from 'vitest';
import { calculateBMR } from './bmr';
import {
  ACTIVITY_MULTIPLIERS,
  calculateTDEE,
  getTDEEResult,
  TDEE_INPUT_BOUNDS,
  validateActivityLevelInput,
  validateTDEEInputs,
} from './tdee';

describe('calculateTDEE', () => {
  // --- Normal / expected cases: one per activity level ---
  it('calculates TDEE for sedentary activity', () => {
    const bmr = calculateBMR(70, 175, 30, 'male'); // 1649
    expect(calculateTDEE(70, 175, 30, 'male', 'sedentary')).toBe(
      Math.round(bmr * 1.2),
    );
  });

  it('calculates TDEE for lightly active', () => {
    const bmr = calculateBMR(70, 175, 30, 'male');
    expect(calculateTDEE(70, 175, 30, 'male', 'light')).toBe(
      Math.round(bmr * 1.375),
    );
  });

  it('calculates TDEE for moderately active', () => {
    const bmr = calculateBMR(60, 165, 30, 'female');
    expect(calculateTDEE(60, 165, 30, 'female', 'moderate')).toBe(
      Math.round(bmr * 1.55),
    );
  });

  it('calculates TDEE for very active', () => {
    const bmr = calculateBMR(70, 175, 30, 'male');
    expect(calculateTDEE(70, 175, 30, 'male', 'active')).toBe(
      Math.round(bmr * 1.725),
    );
  });

  it('calculates TDEE for extra active', () => {
    const bmr = calculateBMR(70, 175, 30, 'male');
    expect(calculateTDEE(70, 175, 30, 'male', 'very_active')).toBe(
      Math.round(bmr * 1.9),
    );
  });

  it('produces a higher TDEE for a more active level with identical body stats', () => {
    const sedentary = calculateTDEE(70, 175, 30, 'male', 'sedentary');
    const veryActive = calculateTDEE(70, 175, 30, 'male', 'very_active');
    expect(veryActive).toBeGreaterThan(sedentary);
  });

  it('matches BMR × multiplier exactly for every activity level', () => {
    const bmr = calculateBMR(70, 175, 30, 'male');
    for (const level of Object.keys(ACTIVITY_MULTIPLIERS) as Array<
      keyof typeof ACTIVITY_MULTIPLIERS
    >) {
      expect(calculateTDEE(70, 175, 30, 'male', level)).toBe(
        Math.round(bmr * ACTIVITY_MULTIPLIERS[level]),
      );
    }
  });

  // --- Edge cases: very low/high but valid values ---
  it('handles the minimum allowed weight/height/age bounds', () => {
    expect(() =>
      calculateTDEE(
        TDEE_INPUT_BOUNDS.MIN_WEIGHT_KG,
        TDEE_INPUT_BOUNDS.MIN_HEIGHT_CM,
        TDEE_INPUT_BOUNDS.MIN_AGE_YEARS,
        'male',
        'sedentary',
      ),
    ).not.toThrow();
  });

  it('handles the maximum allowed weight/height/age bounds', () => {
    expect(() =>
      calculateTDEE(
        TDEE_INPUT_BOUNDS.MAX_WEIGHT_KG,
        TDEE_INPUT_BOUNDS.MAX_HEIGHT_CM,
        TDEE_INPUT_BOUNDS.MAX_AGE_YEARS,
        'female',
        'very_active',
      ),
    ).not.toThrow();
  });

  // --- Invalid inputs ---
  it('throws for zero weight (delegated to calculateBMR)', () => {
    expect(() => calculateTDEE(0, 175, 30, 'male', 'sedentary')).toThrow(
      RangeError,
    );
  });

  it('throws for negative height (delegated to calculateBMR)', () => {
    expect(() => calculateTDEE(70, -175, 30, 'male', 'sedentary')).toThrow(
      RangeError,
    );
  });

  it('throws for non-numeric age (delegated to calculateBMR)', () => {
    expect(() => calculateTDEE(70, 175, NaN, 'male', 'sedentary')).toThrow(
      RangeError,
    );
  });

  it('throws for an unrecognized activity level', () => {
    expect(() =>
      calculateTDEE(
        70,
        175,
        30,
        'male',
        'not_a_real_level' as unknown as 'sedentary',
      ),
    ).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculateTDEE(70, 175, 30, 'male', 'moderate');
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('getTDEEResult', () => {
  it('returns both tdee and the underlying bmr', () => {
    const result = getTDEEResult(70, 175, 30, 'male', 'sedentary');
    const expectedBmr = calculateBMR(70, 175, 30, 'male');
    expect(result.bmr).toBe(expectedBmr);
    expect(result.tdee).toBe(Math.round(expectedBmr * 1.2));
  });

  it('propagates validation errors from the underlying BMR calculation', () => {
    expect(() => getTDEEResult(0, 175, 30, 'male', 'sedentary')).toThrow(
      RangeError,
    );
  });

  it('throws for an unrecognized activity level', () => {
    expect(() =>
      getTDEEResult(70, 175, 30, 'male', 'invalid' as unknown as 'sedentary'),
    ).toThrow(RangeError);
  });
});

describe('validateActivityLevelInput', () => {
  it('returns null for each valid activity level', () => {
    for (const level of Object.keys(ACTIVITY_MULTIPLIERS) as Array<
      keyof typeof ACTIVITY_MULTIPLIERS
    >) {
      expect(validateActivityLevelInput(level)).toBeNull();
    }
  });

  it('flags when nothing is selected', () => {
    expect(validateActivityLevelInput(null)).toBe('ACTIVITY_LEVEL_REQUIRED');
  });
});

describe('validateTDEEInputs', () => {
  it('returns null for all fields when input is fully valid', () => {
    expect(
      validateTDEEInputs('70', '175', '30', 'male', 'moderate'),
    ).toEqual({
      weightError: null,
      heightError: null,
      ageError: null,
      sexError: null,
      activityError: null,
    });
  });

  it('reports weight, height, age, sex, and activity errors independently', () => {
    expect(validateTDEEInputs('', 'abc', '-5', null, null)).toEqual({
      weightError: 'WEIGHT_REQUIRED',
      heightError: 'HEIGHT_NOT_A_NUMBER',
      ageError: 'AGE_NOT_POSITIVE',
      sexError: 'SEX_REQUIRED',
      activityError: 'ACTIVITY_LEVEL_REQUIRED',
    });
  });

  it('flags only the invalid field, leaving the valid ones null', () => {
    expect(
      validateTDEEInputs('70', '175', '30', 'male', null),
    ).toEqual({
      weightError: null,
      heightError: null,
      ageError: null,
      sexError: null,
      activityError: 'ACTIVITY_LEVEL_REQUIRED',
    });
  });
});
