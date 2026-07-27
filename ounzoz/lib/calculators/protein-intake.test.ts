import { describe, expect, it } from 'vitest';
import {
  PROTEIN_G_PER_KG,
  PROTEIN_INTAKE_INPUT_BOUNDS,
  calculateProteinIntake,
  getProteinIntakeResult,
  validateProteinIntakeInputs,
  validateWeightInput,
} from './protein-intake';

describe('calculateProteinIntake', () => {
  // --- Normal / expected cases ---
  // Reference values hand-computed as weight × grams-per-kg, rounded to
  // the nearest whole gram, same verification approach used for
  // calculateBMR and the Navy body-fat formula.
  it('calculates protein intake for a sedentary 70kg adult (RDA baseline)', () => {
    // 70 × 0.8 = 56
    expect(calculateProteinIntake(70, 'sedentary')).toBe(56);
  });

  it('calculates protein intake for a lightly active 70kg adult', () => {
    // 70 × 1.2 = 84
    expect(calculateProteinIntake(70, 'light')).toBe(84);
  });

  it('calculates protein intake for a moderately active 70kg adult', () => {
    // 70 × 1.4 = 98
    expect(calculateProteinIntake(70, 'moderate')).toBe(98);
  });

  it('calculates protein intake for a very active 70kg adult', () => {
    // 70 × 1.6 = 112
    expect(calculateProteinIntake(70, 'active')).toBe(112);
  });

  it('calculates protein intake for an extra active 70kg adult', () => {
    // 70 × 2.0 = 140
    expect(calculateProteinIntake(70, 'very_active')).toBe(140);
  });

  it('calculates protein intake for a second body weight and activity level', () => {
    // 65 × 1.4 = 91
    expect(calculateProteinIntake(65, 'moderate')).toBe(91);
  });

  it('rounds to the nearest whole gram', () => {
    // 82 × 1.6 = 131.2 -> 131
    expect(calculateProteinIntake(82, 'active')).toBe(131);
  });

  it('matches weight × grams-per-kg exactly (rounded) for every activity level', () => {
    for (const level of Object.keys(PROTEIN_G_PER_KG) as Array<
      keyof typeof PROTEIN_G_PER_KG
    >) {
      expect(calculateProteinIntake(70, level)).toBe(
        Math.round(70 * PROTEIN_G_PER_KG[level]),
      );
    }
  });

  it('produces a higher target for a more active level with identical weight', () => {
    const sedentary = calculateProteinIntake(70, 'sedentary');
    const veryActive = calculateProteinIntake(70, 'very_active');
    expect(veryActive).toBeGreaterThan(sedentary);
  });

  it('produces a higher target for a heavier person at the same activity level', () => {
    const lighter = calculateProteinIntake(55, 'moderate');
    const heavier = calculateProteinIntake(95, 'moderate');
    expect(heavier).toBeGreaterThan(lighter);
  });

  // --- Edge cases: bounds of the input range ---
  it('handles the minimum allowed weight bound', () => {
    // 1 × 0.8 = 0.8 -> rounds to 1
    expect(
      calculateProteinIntake(
        PROTEIN_INTAKE_INPUT_BOUNDS.MIN_WEIGHT_KG,
        'sedentary',
      ),
    ).toBe(1);
  });

  it('handles the maximum allowed weight bound', () => {
    // 500 × 2.0 = 1000
    expect(
      calculateProteinIntake(
        PROTEIN_INTAKE_INPUT_BOUNDS.MAX_WEIGHT_KG,
        'very_active',
      ),
    ).toBe(1000);
  });

  // --- Invalid inputs ---
  it('throws for zero weight', () => {
    expect(() => calculateProteinIntake(0, 'sedentary')).toThrow(RangeError);
  });

  it('throws for negative weight', () => {
    expect(() => calculateProteinIntake(-70, 'sedentary')).toThrow(
      RangeError,
    );
  });

  it('throws for non-numeric weight (NaN)', () => {
    expect(() => calculateProteinIntake(NaN, 'sedentary')).toThrow(
      RangeError,
    );
  });

  it('throws for Infinity weight', () => {
    expect(() => calculateProteinIntake(Infinity, 'sedentary')).toThrow(
      RangeError,
    );
  });

  it('throws for an unrecognized activity level', () => {
    expect(() =>
      calculateProteinIntake(70, 'not_a_real_level' as unknown as 'sedentary'),
    ).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculateProteinIntake(70, 'moderate');
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('getProteinIntakeResult', () => {
  it('returns totalGrams matching calculateProteinIntake and the correct gramsPerKg', () => {
    const result = getProteinIntakeResult(70, 'moderate');
    expect(result.totalGrams).toBe(calculateProteinIntake(70, 'moderate'));
    expect(result.gramsPerKg).toBe(1.4);
  });

  it('reports the RDA multiplier for sedentary', () => {
    const result = getProteinIntakeResult(70, 'sedentary');
    expect(result.gramsPerKg).toBe(0.8);
  });

  it('propagates validation errors from an invalid weight', () => {
    expect(() => getProteinIntakeResult(0, 'sedentary')).toThrow(RangeError);
  });

  it('throws for an unrecognized activity level', () => {
    expect(() =>
      getProteinIntakeResult(70, 'invalid' as unknown as 'sedentary'),
    ).toThrow(RangeError);
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

  it('accepts the exact minimum and maximum weight bounds', () => {
    expect(
      validateWeightInput(String(PROTEIN_INTAKE_INPUT_BOUNDS.MIN_WEIGHT_KG)),
    ).toBeNull();
    expect(
      validateWeightInput(String(PROTEIN_INTAKE_INPUT_BOUNDS.MAX_WEIGHT_KG)),
    ).toBeNull();
  });

  it('flags weight just above the maximum bound', () => {
    expect(validateWeightInput('500.1')).toBe('WEIGHT_OUT_OF_RANGE');
  });
});

describe('validateProteinIntakeInputs', () => {
  it('returns null for both fields when input is fully valid', () => {
    expect(validateProteinIntakeInputs('70', 'moderate')).toEqual({
      weightError: null,
      activityError: null,
    });
  });

  it('reports weight and activity-level errors independently', () => {
    expect(validateProteinIntakeInputs('', null)).toEqual({
      weightError: 'WEIGHT_REQUIRED',
      activityError: 'ACTIVITY_LEVEL_REQUIRED',
    });
  });

  it('flags only the invalid field, leaving the valid one null', () => {
    expect(validateProteinIntakeInputs('70', null)).toEqual({
      weightError: null,
      activityError: 'ACTIVITY_LEVEL_REQUIRED',
    });
  });
});
