import {
  BMR_INPUT_BOUNDS,
  calculateBMR,
  validateAgeInput,
  validateHeightInput,
  validateSexInput,
  validateWeightInput,
} from '@/lib/formulas/bmr-formula';
import {
  ACTIVITY_MULTIPLIERS,
  ACTIVITY_LEVEL_LABELS,
} from '@/lib/formulas/activity-multiplier';
import type { BiologicalSex } from '@/types/shared';
import type {
  ActivityLevel,
  TDEEResult,
  TDEEValidationError,
} from '@/types/tdee';

// Re-exported for existing consumers importing from this tool file
// (TDEEForm.tsx used to; ActivityLevelSelector now imports directly from
// the neutral module instead, per the same Tool Independence fix applied
// to BMR_VALIDATION_MESSAGES/calculateBMR above).
export { ACTIVITY_MULTIPLIERS, ACTIVITY_LEVEL_LABELS };

/**
 * Calculates Total Daily Energy Expenditure — the calories/day a person
 * burns including activity, on top of resting metabolism.
 *
 * Formula: TDEE = BMR × activity multiplier
 *
 * BMR is computed via lib/formulas/bmr-formula.ts — the same neutral
 * Mifflin-St Jeor formula module BMR Calculator itself builds on
 * (CLAUDE.md Section 5: Tool Independence — TDEE imports the shared
 * formula, not BMR Calculator's tool file, so deleting bmr-calculator's
 * app folder can never break this tool).
 *
 * Pure function (CLAUDE.md Section 6). Throws RangeError for invalid
 * inputs rather than ever producing NaN/Infinity (CLAUDE.md Section 8) —
 * calculateBMR already guards weight/height/age; this additionally
 * guards activityLevel.
 */
export function calculateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: BiologicalSex,
  activityLevel: ActivityLevel,
): number {
  const bmr = calculateBMR(weightKg, heightCm, age, sex);
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];

  if (!Number.isFinite(multiplier)) {
    throw new RangeError('activityLevel must be a recognized ActivityLevel');
  }

  return Math.round(bmr * multiplier);
}

/**
 * Runs the BMR + TDEE calculation together, computing BMR only once and
 * returning both — TDEE Calculator's result panel shows BMR alongside
 * TDEE for context (SEO.md Section 4: explain how to interpret the
 * result, not just show a bare number).
 */
export function getTDEEResult(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: BiologicalSex,
  activityLevel: ActivityLevel,
): TDEEResult {
  const bmr = calculateBMR(weightKg, heightCm, age, sex);
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];

  if (!Number.isFinite(multiplier)) {
    throw new RangeError('activityLevel must be a recognized ActivityLevel');
  }

  return { tdee: Math.round(bmr * multiplier), bmr };
}

// --- Validation ---
// Weight/height/age/sex validation is identical to what BMR Calculator
// uses, so it's reused directly from the shared formula module rather
// than duplicated (CLAUDE.md Section 5). Only activity level is new
// here.

export function validateActivityLevelInput(
  activityLevel: ActivityLevel | null,
): TDEEValidationError | null {
  return activityLevel === null ? 'ACTIVITY_LEVEL_REQUIRED' : null;
}

export function validateTDEEInputs(
  weightKgRaw: string,
  heightCmRaw: string,
  ageRaw: string,
  sex: BiologicalSex | null,
  activityLevel: ActivityLevel | null,
): {
  weightError: TDEEValidationError | null;
  heightError: TDEEValidationError | null;
  ageError: TDEEValidationError | null;
  sexError: TDEEValidationError | null;
  activityError: TDEEValidationError | null;
} {
  return {
    weightError: validateWeightInput(weightKgRaw),
    heightError: validateHeightInput(heightCmRaw),
    ageError: validateAgeInput(ageRaw),
    sexError: validateSexInput(sex),
    activityError: validateActivityLevelInput(activityLevel),
  };
}

export const TDEE_INPUT_BOUNDS = BMR_INPUT_BOUNDS;

// TDEE-specific copy for every field — NOT a spread of BMR's messages.
// Reusing BMR_VALIDATION_MESSAGES directly would have shown "Enter your
// weight to calculate BMR." on the TDEE page, which is wrong for the
// tool the person is actually using. Caught and fixed during this
// refactor (CLAUDE.md Section 8 / DESIGN.md Section 19: error copy must
// be specific and correct, not just present).
export const TDEE_VALIDATION_MESSAGES: Record<TDEEValidationError, string> = {
  WEIGHT_REQUIRED: 'Enter your weight to calculate TDEE.',
  HEIGHT_REQUIRED: 'Enter your height to calculate TDEE.',
  AGE_REQUIRED: 'Enter your age to calculate TDEE.',
  SEX_REQUIRED: 'Select your sex to calculate TDEE.',
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
  ACTIVITY_LEVEL_REQUIRED: 'Select your activity level to calculate TDEE.',
};
