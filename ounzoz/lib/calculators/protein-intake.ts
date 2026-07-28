import { BMR_INPUT_BOUNDS } from '@/lib/formulas/bmr-formula';
import {
  ACTIVITY_LEVEL_LABELS,
  validateActivityLevelInput,
} from '@/lib/formulas/activity-multiplier';
import { PROTEIN_G_PER_KG } from '@/lib/formulas/protein-formula';
import type { ActivityLevel } from '@/types/shared';
import type {
  ProteinIntakeResult,
  ProteinIntakeValidationError,
} from '@/types/protein-intake';

// Re-exported so a consumer only needs to import from this one file for
// everything Protein Intake Calculator needs, same convention as
// bmr.ts/tdee.ts/calorie.ts/water-intake.ts. PROTEIN_G_PER_KG itself now
// lives in the neutral lib/formulas/protein-formula.ts (see that file for
// the sourcing notes behind each activity tier) — moved there once Macro
// Calculator also needed the same table.
export { ACTIVITY_LEVEL_LABELS, validateActivityLevelInput, PROTEIN_G_PER_KG };

// Weight bounds are the same "realistic human weight" sanity range every
// other tool already uses (lib/formulas/bmr-formula.ts).
const { MIN_WEIGHT_KG, MAX_WEIGHT_KG } = BMR_INPUT_BOUNDS;

/**
 * Estimates daily protein target from body weight and activity level.
 *
 * Formula: total grams/day = weight in kg × grams-per-kg for the
 * selected activity level. See PROTEIN_G_PER_KG above for the sourcing
 * notes behind each tier.
 *
 * Pure function (CLAUDE.md Section 6): deterministic, no I/O, no
 * DOM/React state. Assumes inputs already passed validation; still
 * range-checks defensively and throws RangeError rather than ever
 * producing NaN/Infinity (CLAUDE.md Section 8).
 *
 * @param weightKg - body weight in kilograms
 * @param activityLevel - activity level, per the table above
 * @returns total daily protein target in grams, rounded to the nearest
 *   whole gram
 */
export function calculateProteinIntake(
  weightKg: number,
  activityLevel: ActivityLevel,
): number {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new RangeError('weightKg must be a positive finite number');
  }

  const gramsPerKg = PROTEIN_G_PER_KG[activityLevel];
  if (!Number.isFinite(gramsPerKg)) {
    throw new RangeError('activityLevel must be a recognized ActivityLevel');
  }

  return Math.round(weightKg * gramsPerKg);
}

/**
 * Runs calculateProteinIntake and returns the grams-per-kg multiplier
 * alongside the total, so the result panel can show how the number was
 * built (same "show the components" pattern as TDEE showing BMR, or
 * Water Intake showing its baseline/bonus breakdown).
 */
export function getProteinIntakeResult(
  weightKg: number,
  activityLevel: ActivityLevel,
): ProteinIntakeResult {
  const gramsPerKg = PROTEIN_G_PER_KG[activityLevel];
  return {
    totalGrams: calculateProteinIntake(weightKg, activityLevel),
    gramsPerKg,
  };
}

// --- Validation ---

export function validateWeightInput(
  weightKgRaw: string,
): ProteinIntakeValidationError | null {
  const trimmed = weightKgRaw.trim();
  if (trimmed === '') return 'WEIGHT_REQUIRED';

  const weightKg = Number(trimmed);
  if (!Number.isFinite(weightKg)) return 'WEIGHT_NOT_A_NUMBER';
  if (weightKg <= 0) return 'WEIGHT_NOT_POSITIVE';
  if (weightKg < MIN_WEIGHT_KG || weightKg > MAX_WEIGHT_KG) {
    return 'WEIGHT_OUT_OF_RANGE';
  }
  return null;
}

export function validateProteinIntakeInputs(
  weightKgRaw: string,
  activityLevel: ActivityLevel | null,
): {
  weightError: ProteinIntakeValidationError | null;
  activityError: ProteinIntakeValidationError | null;
} {
  return {
    weightError: validateWeightInput(weightKgRaw),
    activityError: validateActivityLevelInput(activityLevel),
  };
}

export const PROTEIN_INTAKE_INPUT_BOUNDS = {
  MIN_WEIGHT_KG,
  MAX_WEIGHT_KG,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const PROTEIN_INTAKE_VALIDATION_MESSAGES: Record<
  ProteinIntakeValidationError,
  string
> = {
  WEIGHT_REQUIRED: 'Enter your weight to estimate your protein target.',
  WEIGHT_NOT_A_NUMBER: 'Weight must be a number.',
  WEIGHT_NOT_POSITIVE: 'Weight must be greater than zero.',
  WEIGHT_OUT_OF_RANGE: `Enter a weight between ${MIN_WEIGHT_KG} and ${MAX_WEIGHT_KG} kg.`,
  ACTIVITY_LEVEL_REQUIRED:
    'Select your activity level to estimate your protein target.',
};
