import { describe, expect, it } from 'vitest';
import { getCalorieResult } from './calorie';
import {
  FAT_PERCENTAGE_OF_CALORIES,
  MACRO_INPUT_BOUNDS,
  getMacroResult,
  validateMacroInputs,
} from './macro';

describe('getMacroResult', () => {
  // --- Normal / expected cases ---
  // Reference values hand-computed as: calories from getCalorieResult;
  // proteinGrams = round(weight × g/kg); fatGrams = round(calories × 0.3
  // / 9); carbGrams = round((calories − proteinCal − fatCal) / 4). Same
  // verification approach used for calculateBMR and the Navy body-fat
  // formula.
  it('splits macros for a typical adult male maintaining weight', () => {
    const result = getMacroResult(70, 175, 30, 'male', 'moderate', 'maintain');
    expect(result.calories).toBe(2556);
    expect(result.proteinGrams).toBe(98);
    expect(result.fatGrams).toBe(85);
    expect(result.carbGrams).toBe(350);
  });

  it('splits macros for the same adult male losing weight', () => {
    const result = getMacroResult(70, 175, 30, 'male', 'moderate', 'lose');
    expect(result.calories).toBe(2056);
    expect(result.proteinGrams).toBe(98);
    expect(result.fatGrams).toBe(69);
    expect(result.carbGrams).toBe(261);
  });

  it('splits macros for a lightly active adult female gaining weight', () => {
    const result = getMacroResult(60, 165, 28, 'female', 'light', 'gain');
    expect(result.calories).toBe(2329);
    expect(result.proteinGrams).toBe(72);
    expect(result.fatGrams).toBe(78);
    expect(result.carbGrams).toBe(335);
  });

  it('splits macros for a very active adult male maintaining weight', () => {
    const result = getMacroResult(90, 180, 25, 'male', 'active', 'maintain');
    expect(result.calories).toBe(3286);
    expect(result.proteinGrams).toBe(144);
    expect(result.fatGrams).toBe(110);
    expect(result.carbGrams).toBe(430);
  });

  it('matches getCalorieResult exactly for the total calories', () => {
    const macro = getMacroResult(70, 175, 30, 'male', 'moderate', 'maintain');
    const calorie = getCalorieResult(70, 175, 30, 'male', 'moderate', 'maintain');
    expect(macro.calories).toBe(calorie.calories);
  });

  it('accounts for (almost) all calories across the three macros', () => {
    // Rounding each macro independently means the sum can be off by a
    // gram or two from the exact total — never by more than a few
    // calories' worth.
    const result = getMacroResult(70, 175, 30, 'male', 'moderate', 'maintain');
    const reconstitutedCalories =
      result.proteinGrams * 4 + result.fatGrams * 9 + result.carbGrams * 4;
    expect(Math.abs(reconstitutedCalories - result.calories)).toBeLessThanOrEqual(4);
  });

  it('produces a higher protein target for a more active level with identical weight/goal', () => {
    const sedentary = getMacroResult(70, 175, 30, 'male', 'sedentary', 'maintain');
    const veryActive = getMacroResult(70, 175, 30, 'male', 'very_active', 'maintain');
    expect(veryActive.proteinGrams).toBeGreaterThan(sedentary.proteinGrams);
  });

  it('produces a lower calorie target (and generally lower carbs) for "lose" than "maintain"', () => {
    const maintain = getMacroResult(70, 175, 30, 'male', 'moderate', 'maintain');
    const lose = getMacroResult(70, 175, 30, 'male', 'moderate', 'lose');
    expect(lose.calories).toBeLessThan(maintain.calories);
    expect(lose.carbGrams).toBeLessThan(maintain.carbGrams);
  });

  // --- Edge cases: bounds of the input range ---
  it('handles the minimum allowed weight/height/age bounds', () => {
    expect(() =>
      getMacroResult(
        MACRO_INPUT_BOUNDS.MIN_WEIGHT_KG,
        MACRO_INPUT_BOUNDS.MIN_HEIGHT_CM,
        MACRO_INPUT_BOUNDS.MIN_AGE_YEARS,
        'male',
        'sedentary',
        'maintain',
      ),
    ).not.toThrow();
  });

  it('handles the maximum allowed weight/height/age bounds', () => {
    expect(() =>
      getMacroResult(
        MACRO_INPUT_BOUNDS.MAX_WEIGHT_KG,
        MACRO_INPUT_BOUNDS.MAX_HEIGHT_CM,
        MACRO_INPUT_BOUNDS.MAX_AGE_YEARS,
        'female',
        'very_active',
        'gain',
      ),
    ).not.toThrow();
  });

  // --- Invalid inputs ---
  it('throws for zero weight (delegated to getCalorieResult)', () => {
    expect(() =>
      getMacroResult(0, 175, 30, 'male', 'moderate', 'maintain'),
    ).toThrow(RangeError);
  });

  it('throws for negative height (delegated to getCalorieResult)', () => {
    expect(() =>
      getMacroResult(70, -175, 30, 'male', 'moderate', 'maintain'),
    ).toThrow(RangeError);
  });

  it('throws for non-numeric age (delegated to getCalorieResult)', () => {
    expect(() =>
      getMacroResult(70, 175, NaN, 'male', 'moderate', 'maintain'),
    ).toThrow(RangeError);
  });

  it('throws for an unrecognized activity level', () => {
    expect(() =>
      getMacroResult(
        70,
        175,
        30,
        'male',
        'not_a_real_level' as unknown as 'sedentary',
        'maintain',
      ),
    ).toThrow(RangeError);
  });

  it('throws for an unrecognized goal (delegated to getCalorieResult)', () => {
    expect(() =>
      getMacroResult(
        70,
        175,
        30,
        'male',
        'moderate',
        'not_a_real_goal' as unknown as 'maintain',
      ),
    ).toThrow(RangeError);
  });

  it('propagates the non-positive calorie target guard from getCalorieResult', () => {
    expect(() =>
      getMacroResult(
        MACRO_INPUT_BOUNDS.MIN_WEIGHT_KG,
        MACRO_INPUT_BOUNDS.MIN_HEIGHT_CM,
        MACRO_INPUT_BOUNDS.MIN_AGE_YEARS,
        'male',
        'very_active',
        'lose',
      ),
    ).toThrow(RangeError);
  });

  it('throws rather than returning a negative carbohydrate target when protein and fat exceed total calories', () => {
    // A small, older, very active woman on a "lose" goal: total calories
    // squeaks just above zero (passes getCalorieResult's own guard), but
    // the protein target alone (weight × 2.0 g/kg for very_active) far
    // exceeds that tiny calorie total — this must never surface as a
    // negative carb target (CLAUDE.md Section 8).
    expect(() =>
      getMacroResult(30, 100, 100, 'female', 'very_active', 'lose'),
    ).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = getMacroResult(70, 175, 30, 'male', 'moderate', 'maintain');
    expect(Number.isFinite(result.calories)).toBe(true);
    expect(Number.isFinite(result.proteinGrams)).toBe(true);
    expect(Number.isFinite(result.fatGrams)).toBe(true);
    expect(Number.isFinite(result.carbGrams)).toBe(true);
  });
});

describe('FAT_PERCENTAGE_OF_CALORIES', () => {
  it('falls within the 20-35% AMDR for fat', () => {
    expect(FAT_PERCENTAGE_OF_CALORIES).toBeGreaterThanOrEqual(0.2);
    expect(FAT_PERCENTAGE_OF_CALORIES).toBeLessThanOrEqual(0.35);
  });
});

describe('validateMacroInputs', () => {
  it('returns null for all fields when input is fully valid', () => {
    expect(
      validateMacroInputs('70', '175', '30', 'male', 'moderate', 'maintain'),
    ).toEqual({
      weightError: null,
      heightError: null,
      ageError: null,
      sexError: null,
      activityError: null,
      goalError: null,
    });
  });

  it('reports weight, height, age, sex, activity, and goal errors independently', () => {
    expect(validateMacroInputs('', 'abc', '-5', null, null, null)).toEqual({
      weightError: 'WEIGHT_REQUIRED',
      heightError: 'HEIGHT_NOT_A_NUMBER',
      ageError: 'AGE_NOT_POSITIVE',
      sexError: 'SEX_REQUIRED',
      activityError: 'ACTIVITY_LEVEL_REQUIRED',
      goalError: 'GOAL_REQUIRED',
    });
  });

  it('flags only the invalid field, leaving the valid ones null', () => {
    expect(
      validateMacroInputs('70', '175', '30', 'male', 'moderate', null),
    ).toEqual({
      weightError: null,
      heightError: null,
      ageError: null,
      sexError: null,
      activityError: null,
      goalError: 'GOAL_REQUIRED',
    });
  });
});
