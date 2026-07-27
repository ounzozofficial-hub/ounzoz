import { describe, expect, it } from 'vitest';
import {
  WATER_INTAKE_ACTIVITY_BONUS_ML,
  WATER_INTAKE_INPUT_BOUNDS,
  WATER_INTAKE_ML_PER_KG,
  calculateWaterIntakeMl,
  getWaterIntakeResult,
  validateWaterIntakeInputs,
  validateWeightInput,
} from './water-intake';

describe('calculateWaterIntakeMl', () => {
  // --- Normal / expected cases ---
  // Reference values hand-computed as (weight × 35, rounded to the
  // nearest 10) + the activity bonus, same verification approach used
  // for calculateBMR and the Navy body-fat formula.
  it('calculates water intake for a sedentary 70kg adult (no activity bonus)', () => {
    // 70 × 35 = 2450, sedentary bonus = 0
    expect(calculateWaterIntakeMl(70, 'sedentary')).toBe(2450);
  });

  it('calculates water intake for a moderately active 70kg adult', () => {
    // 70 × 35 = 2450, moderate bonus = 500
    expect(calculateWaterIntakeMl(70, 'moderate')).toBe(2950);
  });

  it('calculates water intake for a lightly active 60kg adult', () => {
    // 60 × 35 = 2100, light bonus = 250
    expect(calculateWaterIntakeMl(60, 'light')).toBe(2350);
  });

  it('calculates water intake for a very active 90kg adult', () => {
    // 90 × 35 = 3150, active bonus = 750
    expect(calculateWaterIntakeMl(90, 'active')).toBe(3900);
  });

  it('calculates water intake for an extra active 55kg adult', () => {
    // 55 × 35 = 1925 -> rounds to 1930, very_active bonus = 1000
    expect(calculateWaterIntakeMl(55, 'very_active')).toBe(2930);
  });

  it('matches weight × 35 (rounded) + the bonus exactly for every activity level', () => {
    for (const level of Object.keys(WATER_INTAKE_ACTIVITY_BONUS_ML) as Array<
      keyof typeof WATER_INTAKE_ACTIVITY_BONUS_ML
    >) {
      const expected =
        Math.round((70 * WATER_INTAKE_ML_PER_KG) / 10) * 10 +
        WATER_INTAKE_ACTIVITY_BONUS_ML[level];
      expect(calculateWaterIntakeMl(70, level)).toBe(expected);
    }
  });

  it('produces a higher total for a more active level with identical weight', () => {
    const sedentary = calculateWaterIntakeMl(70, 'sedentary');
    const veryActive = calculateWaterIntakeMl(70, 'very_active');
    expect(veryActive).toBeGreaterThan(sedentary);
  });

  it('produces a higher total for a heavier person at the same activity level', () => {
    const lighter = calculateWaterIntakeMl(55, 'moderate');
    const heavier = calculateWaterIntakeMl(95, 'moderate');
    expect(heavier).toBeGreaterThan(lighter);
  });

  it('rounds to the nearest 10 ml', () => {
    const result = calculateWaterIntakeMl(71, 'sedentary');
    expect(result % 10).toBe(0);
  });

  // --- Edge cases: bounds of the input range ---
  it('handles the minimum allowed weight bound', () => {
    // 1 × 35 = 35 -> rounds to 40
    expect(
      calculateWaterIntakeMl(
        WATER_INTAKE_INPUT_BOUNDS.MIN_WEIGHT_KG,
        'sedentary',
      ),
    ).toBe(40);
  });

  it('handles the maximum allowed weight bound', () => {
    // 500 × 35 = 17500, very_active bonus = 1000
    expect(
      calculateWaterIntakeMl(
        WATER_INTAKE_INPUT_BOUNDS.MAX_WEIGHT_KG,
        'very_active',
      ),
    ).toBe(18500);
  });

  // --- Invalid inputs ---
  it('throws for zero weight', () => {
    expect(() => calculateWaterIntakeMl(0, 'sedentary')).toThrow(RangeError);
  });

  it('throws for negative weight', () => {
    expect(() => calculateWaterIntakeMl(-70, 'sedentary')).toThrow(
      RangeError,
    );
  });

  it('throws for non-numeric weight (NaN)', () => {
    expect(() => calculateWaterIntakeMl(NaN, 'sedentary')).toThrow(
      RangeError,
    );
  });

  it('throws for Infinity weight', () => {
    expect(() => calculateWaterIntakeMl(Infinity, 'sedentary')).toThrow(
      RangeError,
    );
  });

  it('throws for an unrecognized activity level', () => {
    expect(() =>
      calculateWaterIntakeMl(70, 'not_a_real_level' as unknown as 'sedentary'),
    ).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculateWaterIntakeMl(70, 'moderate');
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('getWaterIntakeResult', () => {
  it('returns totalMl as baselineMl + activityBonusMl exactly', () => {
    const result = getWaterIntakeResult(70, 'moderate');
    expect(result.baselineMl).toBe(2450);
    expect(result.activityBonusMl).toBe(500);
    expect(result.totalMl).toBe(result.baselineMl + result.activityBonusMl);
  });

  it('matches calculateWaterIntakeMl exactly for the same inputs', () => {
    const result = getWaterIntakeResult(82, 'active');
    expect(result.totalMl).toBe(calculateWaterIntakeMl(82, 'active'));
  });

  it('reports a zero activity bonus for sedentary', () => {
    const result = getWaterIntakeResult(70, 'sedentary');
    expect(result.activityBonusMl).toBe(0);
    expect(result.totalMl).toBe(result.baselineMl);
  });

  it('propagates validation errors from an invalid weight', () => {
    expect(() => getWaterIntakeResult(0, 'sedentary')).toThrow(RangeError);
  });

  it('throws for an unrecognized activity level', () => {
    expect(() =>
      getWaterIntakeResult(70, 'invalid' as unknown as 'sedentary'),
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
      validateWeightInput(String(WATER_INTAKE_INPUT_BOUNDS.MIN_WEIGHT_KG)),
    ).toBeNull();
    expect(
      validateWeightInput(String(WATER_INTAKE_INPUT_BOUNDS.MAX_WEIGHT_KG)),
    ).toBeNull();
  });

  it('flags weight just above the maximum bound', () => {
    expect(validateWeightInput('500.1')).toBe('WEIGHT_OUT_OF_RANGE');
  });
});

describe('validateWaterIntakeInputs', () => {
  it('returns null for both fields when input is fully valid', () => {
    expect(validateWaterIntakeInputs('70', 'moderate')).toEqual({
      weightError: null,
      activityError: null,
    });
  });

  it('reports weight and activity-level errors independently', () => {
    expect(validateWaterIntakeInputs('', null)).toEqual({
      weightError: 'WEIGHT_REQUIRED',
      activityError: 'ACTIVITY_LEVEL_REQUIRED',
    });
  });

  it('flags only the invalid field, leaving the valid one null', () => {
    expect(validateWaterIntakeInputs('70', null)).toEqual({
      weightError: null,
      activityError: 'ACTIVITY_LEVEL_REQUIRED',
    });
  });
});
