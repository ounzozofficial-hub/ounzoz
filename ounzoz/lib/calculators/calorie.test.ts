import { describe, expect, it } from 'vitest';
import { calculateBMR } from './bmr';
import { calculateTDEE } from './tdee';
import {
  CALORIE_ADJUSTMENTS,
  CALORIE_INPUT_BOUNDS,
  MIN_SAFE_CALORIES,
  calculateCalorieTarget,
  getCalorieResult,
  validateCalorieInputs,
  validateGoalInput,
} from './calorie';

describe('calculateCalorieTarget', () => {
  // --- Normal / expected cases: one per goal ---
  it('subtracts 500 kcal/day for a "lose weight" goal', () => {
    const tdee = calculateTDEE(70, 175, 30, 'male', 'moderate');
    expect(calculateCalorieTarget(70, 175, 30, 'male', 'moderate', 'lose')).toBe(
      tdee - 500,
    );
  });

  it('matches TDEE exactly for a "maintain weight" goal', () => {
    const tdee = calculateTDEE(70, 175, 30, 'male', 'moderate');
    expect(
      calculateCalorieTarget(70, 175, 30, 'male', 'moderate', 'maintain'),
    ).toBe(tdee);
  });

  it('adds 500 kcal/day for a "gain weight" goal', () => {
    const tdee = calculateTDEE(70, 175, 30, 'male', 'moderate');
    expect(calculateCalorieTarget(70, 175, 30, 'male', 'moderate', 'gain')).toBe(
      tdee + 500,
    );
  });

  it('matches TDEE ± the adjustment exactly for every goal', () => {
    const tdee = calculateTDEE(60, 165, 30, 'female', 'light');
    for (const goal of Object.keys(CALORIE_ADJUSTMENTS) as Array<
      keyof typeof CALORIE_ADJUSTMENTS
    >) {
      expect(calculateCalorieTarget(60, 165, 30, 'female', 'light', goal)).toBe(
        tdee + CALORIE_ADJUSTMENTS[goal],
      );
    }
  });

  it('produces a lower target for "lose" than "maintain", and a higher one for "gain"', () => {
    const lose = calculateCalorieTarget(70, 175, 30, 'male', 'active', 'lose');
    const maintain = calculateCalorieTarget(
      70,
      175,
      30,
      'male',
      'active',
      'maintain',
    );
    const gain = calculateCalorieTarget(70, 175, 30, 'male', 'active', 'gain');
    expect(lose).toBeLessThan(maintain);
    expect(gain).toBeGreaterThan(maintain);
  });

  // --- Edge cases: very low/high but valid values ---
  it('handles the minimum allowed weight/height/age bounds', () => {
    // 'maintain' here, not 'lose': at these extreme sanity-bound inputs
    // TDEE itself is tiny, so a -500 kcal/day "lose" adjustment would
    // legitimately trip the non-positive-result guard tested separately
    // below — this test is only checking that the underlying BMR/TDEE
    // math handles the bounds without crashing.
    expect(() =>
      calculateCalorieTarget(
        CALORIE_INPUT_BOUNDS.MIN_WEIGHT_KG,
        CALORIE_INPUT_BOUNDS.MIN_HEIGHT_CM,
        CALORIE_INPUT_BOUNDS.MIN_AGE_YEARS,
        'male',
        'sedentary',
        'maintain',
      ),
    ).not.toThrow();
  });

  it('handles the maximum allowed weight/height/age bounds', () => {
    expect(() =>
      calculateCalorieTarget(
        CALORIE_INPUT_BOUNDS.MAX_WEIGHT_KG,
        CALORIE_INPUT_BOUNDS.MAX_HEIGHT_CM,
        CALORIE_INPUT_BOUNDS.MAX_AGE_YEARS,
        'female',
        'very_active',
        'gain',
      ),
    ).not.toThrow();
  });

  // --- Invalid inputs ---
  it('throws for zero weight (delegated to calculateBMR via calculateTDEE)', () => {
    expect(() =>
      calculateCalorieTarget(0, 175, 30, 'male', 'sedentary', 'maintain'),
    ).toThrow(RangeError);
  });

  it('throws for negative height (delegated to calculateBMR via calculateTDEE)', () => {
    expect(() =>
      calculateCalorieTarget(70, -175, 30, 'male', 'sedentary', 'maintain'),
    ).toThrow(RangeError);
  });

  it('throws for non-numeric age (delegated to calculateBMR via calculateTDEE)', () => {
    expect(() =>
      calculateCalorieTarget(70, 175, NaN, 'male', 'sedentary', 'maintain'),
    ).toThrow(RangeError);
  });

  it('throws for an unrecognized activity level (delegated to calculateTDEE)', () => {
    expect(() =>
      calculateCalorieTarget(
        70,
        175,
        30,
        'male',
        'not_a_real_level' as unknown as 'sedentary',
        'maintain',
      ),
    ).toThrow(RangeError);
  });

  it('throws for an unrecognized goal', () => {
    expect(() =>
      calculateCalorieTarget(
        70,
        175,
        30,
        'male',
        'sedentary',
        'not_a_real_goal' as unknown as 'maintain',
      ),
    ).toThrow(RangeError);
  });

  it('throws rather than returning a non-positive calorie target at extreme sanity-bound inputs', () => {
    // At the accepted MIN weight/height/age bounds, TDEE itself is small
    // enough that a -500 kcal/day "lose" adjustment drives the target to
    // zero or negative — guarded explicitly so a caller that bypasses
    // front-end validation never sees a broken "calorie target"
    // (CLAUDE.md Section 8).
    expect(() =>
      calculateCalorieTarget(
        CALORIE_INPUT_BOUNDS.MIN_WEIGHT_KG,
        CALORIE_INPUT_BOUNDS.MIN_HEIGHT_CM,
        CALORIE_INPUT_BOUNDS.MIN_AGE_YEARS,
        'male',
        'very_active',
        'lose',
      ),
    ).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculateCalorieTarget(70, 175, 30, 'male', 'moderate', 'lose');
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('getCalorieResult', () => {
  it('returns calories, tdee, and bmr consistently', () => {
    const result = getCalorieResult(70, 175, 30, 'male', 'moderate', 'maintain');
    const expectedBmr = calculateBMR(70, 175, 30, 'male');
    const expectedTdee = calculateTDEE(70, 175, 30, 'male', 'moderate');
    expect(result.bmr).toBe(expectedBmr);
    expect(result.tdee).toBe(expectedTdee);
    expect(result.calories).toBe(expectedTdee);
  });

  it('applies the goal adjustment on top of tdee', () => {
    const result = getCalorieResult(70, 175, 30, 'male', 'moderate', 'lose');
    expect(result.calories).toBe(result.tdee - 500);
  });

  // --- Safety flag: never alters `calories`, only flags it ---
  it('flags belowSafeMinimum when the target falls under the floor for the person\'s sex', () => {
    // Small, older, sedentary woman losing weight: comfortably produces a
    // target under the 1,200 kcal/day female floor.
    const result = getCalorieResult(45, 150, 70, 'female', 'sedentary', 'lose');
    expect(result.calories).toBeLessThan(MIN_SAFE_CALORIES.female);
    expect(result.belowSafeMinimum).toBe(true);
  });

  it('does not flag belowSafeMinimum for a typical maintenance target', () => {
    const result = getCalorieResult(90, 180, 25, 'male', 'active', 'maintain');
    expect(result.calories).toBeGreaterThanOrEqual(MIN_SAFE_CALORIES.male);
    expect(result.belowSafeMinimum).toBe(false);
  });

  it('never clamps or alters `calories` even when belowSafeMinimum is true', () => {
    const result = getCalorieResult(45, 150, 70, 'female', 'sedentary', 'lose');
    const expectedTdee = calculateTDEE(45, 150, 70, 'female', 'sedentary');
    // The flagged result is still the real, unmodified TDEE - 500 — never
    // clamped up to the safe minimum (DESIGN.md Section 11.1).
    expect(result.calories).toBe(expectedTdee - 500);
  });

  it('propagates validation errors from the underlying BMR calculation', () => {
    expect(() =>
      getCalorieResult(0, 175, 30, 'male', 'sedentary', 'maintain'),
    ).toThrow(RangeError);
  });

  it('throws rather than returning a non-positive calorie target at extreme sanity-bound inputs', () => {
    expect(() =>
      getCalorieResult(
        CALORIE_INPUT_BOUNDS.MIN_WEIGHT_KG,
        CALORIE_INPUT_BOUNDS.MIN_HEIGHT_CM,
        CALORIE_INPUT_BOUNDS.MIN_AGE_YEARS,
        'male',
        'very_active',
        'lose',
      ),
    ).toThrow(RangeError);
  });

  it('throws for an unrecognized activity level', () => {
    expect(() =>
      getCalorieResult(
        70,
        175,
        30,
        'male',
        'invalid' as unknown as 'sedentary',
        'maintain',
      ),
    ).toThrow(RangeError);
  });

  it('throws for an unrecognized goal', () => {
    expect(() =>
      getCalorieResult(
        70,
        175,
        30,
        'male',
        'sedentary',
        'invalid' as unknown as 'maintain',
      ),
    ).toThrow(RangeError);
  });
});

describe('validateGoalInput', () => {
  it('returns null for each valid goal', () => {
    for (const goal of Object.keys(CALORIE_ADJUSTMENTS) as Array<
      keyof typeof CALORIE_ADJUSTMENTS
    >) {
      expect(validateGoalInput(goal)).toBeNull();
    }
  });

  it('flags when nothing is selected', () => {
    expect(validateGoalInput(null)).toBe('GOAL_REQUIRED');
  });
});

describe('validateCalorieInputs', () => {
  it('returns null for all fields when input is fully valid', () => {
    expect(
      validateCalorieInputs('70', '175', '30', 'male', 'moderate', 'lose'),
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
    expect(
      validateCalorieInputs('', 'abc', '-5', null, null, null),
    ).toEqual({
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
      validateCalorieInputs('70', '175', '30', 'male', 'moderate', null),
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
