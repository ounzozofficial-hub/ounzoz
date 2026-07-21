import {
  BMR_INPUT_BOUNDS,
  BMR_VALIDATION_MESSAGES,
  calculateBMR,
  validateAgeInput,
  validateHeightInput,
  validateSexInput,
  validateWeightInput,
} from './bmr';
import type { BiologicalSex } from '@/types/shared';
import type {
  ActivityLevel,
  TDEEResult,
  TDEEValidationError,
} from '@/types/tdee';

// Activity multiplier table — the standard scale commonly paired with
// the Harris-Benedict and Mifflin-St Jeor BMR equations to estimate
// Total Daily Energy Expenditure. Widely cited source: Harris JA, and
// Benedict FG (1919) established the original BMR-to-TDEE activity
// scaling approach; these specific multiplier values are the version
// most commonly published alongside Mifflin-St Jeor today (e.g. as used
// by the NIH Body Weight Planner and most clinical nutrition
// references).
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary — little or no exercise',
  light: 'Lightly active — light exercise 1–3 days/week',
  moderate: 'Moderately active — moderate exercise 3–5 days/week',
  active: 'Very active — hard exercise 6–7 days/week',
  very_active: 'Extra active — very hard exercise or a physical job',
};

/**
 * Calculates Total Daily Energy Expenditure — the calories/day a person
 * burns including activity, on top of resting metabolism.
 *
 * Formula: TDEE = BMR × activity multiplier
 *
 * BMR is computed via the same Mifflin-St Jeor equation used by BMR
 * Calculator (lib/calculators/bmr.ts) — TDEE Calculator builds directly
 * on that function rather than duplicating it, since lib/calculators/ is
 * exactly the shared location CLAUDE.md Section 5 designates for logic
 * genuinely reused across tools.
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
// Weight/height/age/sex validation is identical to BMR Calculator's, so
// it's reused directly from lib/calculators/bmr.ts rather than
// duplicated (CLAUDE.md Section 5). Only activity level is new here.

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

/** User-facing copy for each validation error — reuses BMR's messages and adds the one TDEE-specific field. */
export const TDEE_VALIDATION_MESSAGES: Record<TDEEValidationError, string> = {
  ...BMR_VALIDATION_MESSAGES,
  ACTIVITY_LEVEL_REQUIRED: 'Select your activity level to calculate TDEE.',
};
