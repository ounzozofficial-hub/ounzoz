import {
  BMR_INPUT_BOUNDS,
  validateAgeInput,
  validateHeightInput,
  validateSexInput,
  validateWeightInput,
} from '@/lib/formulas/bmr-formula';
import {
  calculateTDEE,
  getTDEEResult,
  validateActivityLevelInput,
} from '@/lib/calculators/tdee';
import type { ActivityLevel, BiologicalSex } from '@/types/shared';
import type {
  CalorieGoal,
  CalorieResult,
  CalorieValidationError,
} from '@/types/calorie';

// Re-exported so a consumer only needs to import from this one file for
// everything Calorie Calculator needs, same convention as bmr.ts/tdee.ts.
export { validateActivityLevelInput };

// Goal-related constants live here, not in lib/formulas/ — Calorie
// Calculator is currently the only tool with a goal concept, so this
// stays local per CLAUDE.md Section 5's explicit "genuinely shared by 2+
// tools" threshold, not extracted preemptively.
export const CALORIE_ADJUSTMENTS: Record<CalorieGoal, number> = {
  lose: -500,
  maintain: 0,
  gain: 500,
};

export const CALORIE_GOAL_LABELS: Record<CalorieGoal, string> = {
  lose: 'Lose weight',
  maintain: 'Maintain weight',
  gain: 'Gain weight',
};

// Standard safe-minimum floors (kcal/day), the widely cited convention
// below which a calorie target is commonly flagged for medical guidance
// (e.g. NHS/Mayo Clinic consumer guidance). Checked by getCalorieResult
// below; never used to clamp or alter the calculated target — flag only
// (DESIGN.md Section 11.1).
export const MIN_SAFE_CALORIES: Record<BiologicalSex, number> = {
  female: 1200,
  male: 1500,
};

/**
 * Calculates a daily calorie target for a weight goal.
 *
 * Formula: target = TDEE ± a flat adjustment for the goal.
 *   Lose weight: TDEE − 500 kcal/day
 *   Maintain:    TDEE
 *   Gain weight: TDEE + 500 kcal/day
 *
 * The ±500 kcal/day adjustment is the standard "3,500 kcal ≈ 1 lb of body
 * fat" energy-balance rule of thumb: 500 kcal/day × 7 days = 3,500
 * kcal/week ≈ 1 lb/week of weight change. It's an approximation (real
 * weight change is nonlinear and adaptive), but it's the convention nearly
 * every mainstream calorie calculator uses, so it's what this tool uses
 * too (CLAUDE.md Section 11).
 *
 * Pure function (CLAUDE.md Section 6). Builds on calculateTDEE from
 * lib/calculators/tdee.ts — Calorie Calculator sits one tier above TDEE,
 * the same relationship TDEE has with BMR. Throws RangeError for invalid
 * inputs rather than ever producing NaN/Infinity (CLAUDE.md Section 8).
 */
export function calculateCalorieTarget(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: BiologicalSex,
  activityLevel: ActivityLevel,
  goal: CalorieGoal,
): number {
  const tdee = calculateTDEE(weightKg, heightCm, age, sex, activityLevel);
  const adjustment = CALORIE_ADJUSTMENTS[goal];

  if (!Number.isFinite(adjustment)) {
    throw new RangeError('goal must be a recognized CalorieGoal');
  }

  return tdee + adjustment;
}

/**
 * Runs the full BMR → TDEE → Calorie chain, computing BMR/TDEE only once,
 * and flags whether the resulting target falls below the standard
 * safe-minimum floor for the person's sex (MIN_SAFE_CALORIES). The flag
 * never changes `calories` itself — the UI surfaces it via ResultCard's
 * advisory slot (DESIGN.md Section 11.1), same pattern as TDEE showing
 * BMR alongside its own result for context.
 */
export function getCalorieResult(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: BiologicalSex,
  activityLevel: ActivityLevel,
  goal: CalorieGoal,
): CalorieResult {
  const { tdee, bmr } = getTDEEResult(
    weightKg,
    heightCm,
    age,
    sex,
    activityLevel,
  );
  const adjustment = CALORIE_ADJUSTMENTS[goal];

  if (!Number.isFinite(adjustment)) {
    throw new RangeError('goal must be a recognized CalorieGoal');
  }

  const calories = tdee + adjustment;

  return {
    calories,
    tdee,
    bmr,
    belowSafeMinimum: calories < MIN_SAFE_CALORIES[sex],
  };
}

// --- Validation ---
// Weight/height/age/sex validation is identical to what BMR Calculator
// uses, so it's reused directly from the shared formula module (same
// approach as TDEE). Activity-level validation is reused from TDEE
// Calculator's file since Calorie builds on TDEE's result (same tier
// relationship as TDEE building on BMR). Only goal validation is new here.

export function validateGoalInput(
  goal: CalorieGoal | null,
): CalorieValidationError | null {
  return goal === null ? 'GOAL_REQUIRED' : null;
}

export function validateCalorieInputs(
  weightKgRaw: string,
  heightCmRaw: string,
  ageRaw: string,
  sex: BiologicalSex | null,
  activityLevel: ActivityLevel | null,
  goal: CalorieGoal | null,
): {
  weightError: CalorieValidationError | null;
  heightError: CalorieValidationError | null;
  ageError: CalorieValidationError | null;
  sexError: CalorieValidationError | null;
  activityError: CalorieValidationError | null;
  goalError: CalorieValidationError | null;
} {
  return {
    weightError: validateWeightInput(weightKgRaw),
    heightError: validateHeightInput(heightCmRaw),
    ageError: validateAgeInput(ageRaw),
    sexError: validateSexInput(sex),
    activityError: validateActivityLevelInput(activityLevel),
    goalError: validateGoalInput(goal),
  };
}

export const CALORIE_INPUT_BOUNDS = BMR_INPUT_BOUNDS;

// Calorie-specific copy for every field — not a spread of BMR's or TDEE's
// messages, same lesson applied on TDEE Calculator (CLAUDE.md Section 8 /
// DESIGN.md Section 19: error copy must be specific and correct for the
// tool the person is actually using).
export const CALORIE_VALIDATION_MESSAGES: Record<CalorieValidationError, string> = {
  WEIGHT_REQUIRED: 'Enter your weight to calculate your calorie target.',
  HEIGHT_REQUIRED: 'Enter your height to calculate your calorie target.',
  AGE_REQUIRED: 'Enter your age to calculate your calorie target.',
  SEX_REQUIRED: 'Select your sex to calculate your calorie target.',
  WEIGHT_NOT_A_NUMBER: 'Weight must be a number.',
  HEIGHT_NOT_A_NUMBER: 'Height must be a number.',
  AGE_NOT_A_NUMBER: 'Age must be a number.',
  WEIGHT_NOT_POSITIVE: 'Weight must be greater than zero.',
  HEIGHT_NOT_POSITIVE: 'Height must be greater than zero.',
  AGE_NOT_POSITIVE: 'Age must be greater than zero.',
  WEIGHT_OUT_OF_RANGE: `Enter a weight between ${BMR_INPUT_BOUNDS.MIN_WEIGHT_KG} and ${BMR_INPUT_BOUNDS.MAX_WEIGHT_KG} kg.`,
  HEIGHT_OUT_OF_RANGE: `Enter a height between ${BMR_INPUT_BOUNDS.MIN_HEIGHT_CM} and ${BMR_INPUT_BOUNDS.MAX_HEIGHT_CM} cm.`,
  AGE_OUT_OF_RANGE: `Enter a number between ${BMR_INPUT_BOUNDS.MIN_AGE_YEARS} and ${BMR_INPUT_BOUNDS.MAX_AGE_YEARS} for age.`,
  AGE_NOT_WHOLE_NUMBER: 'Age must be a whole number of years.',
  ACTIVITY_LEVEL_REQUIRED: 'Select your activity level to calculate your calorie target.',
  GOAL_REQUIRED: 'Select your goal to calculate your calorie target.',
};
