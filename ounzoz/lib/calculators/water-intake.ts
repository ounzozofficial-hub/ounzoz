import { BMR_INPUT_BOUNDS } from '@/lib/formulas/bmr-formula';
import {
  ACTIVITY_LEVEL_LABELS,
  validateActivityLevelInput,
} from '@/lib/formulas/activity-multiplier';
import type { ActivityLevel } from '@/types/shared';
import type {
  WaterIntakeResult,
  WaterIntakeValidationError,
} from '@/types/water-intake';

// Re-exported so a consumer only needs to import from this one file for
// everything Water Intake Calculator needs, same convention as
// bmr.ts/tdee.ts/calorie.ts.
export { ACTIVITY_LEVEL_LABELS, validateActivityLevelInput };

// Weight bounds are the same "realistic human weight" sanity range every
// other tool already uses (lib/formulas/bmr-formula.ts) — no reason for
// this tool's weight validity to differ from BMI/BMR's.
const { MIN_WEIGHT_KG, MAX_WEIGHT_KG } = BMR_INPUT_BOUNDS;

// Baseline fluid need per kg of body weight per day. This is a widely
// used practical guideline for estimating daily fluid intake in healthy
// adults — commonly cited in clinical nutrition and fluid-management
// references as an adult maintenance estimate in the ~30–35 mL/kg/day
// range — rather than a single precise peer-reviewed formula the way
// Devine (1974) or Mifflin-St Jeor (1990) are. Applied to typical adult
// body weights (roughly 60–90 kg), it lands in the same range as the
// authoritative reference this estimate is cross-checked against: the
// U.S. National Academies of Medicine's 2004 Dietary Reference Intakes
// for total water (~3.7 L/day for men, ~2.7 L/day for women, including
// water from food) — this tool's number is beverage/fluid intake only,
// which is consistently a somewhat smaller figure than "total water."
export const WATER_INTAKE_ML_PER_KG = 35;

// Activity-level adjustment — flat additions reflecting the general,
// widely recommended principle (e.g. American College of Sports Medicine
// guidance on fluid replacement during exercise) that higher activity
// requires more fluid to offset sweat loss. Unlike ACTIVITY_MULTIPLIERS
// (a specific, widely published table), there is no single standardized
// ml-per-activity-tier figure — these are practical increments, not a
// cited formula. Individual sweat rate varies significantly by person,
// climate, and exertion, which the FAQ content calls out directly.
export const WATER_INTAKE_ACTIVITY_BONUS_ML: Record<ActivityLevel, number> = {
  sedentary: 0,
  light: 250,
  moderate: 500,
  active: 750,
  very_active: 1000,
};

/**
 * Estimates daily water (fluid) intake from body weight and activity
 * level.
 *
 * Formula: total ml/day = (weight in kg × 35 ml) + activity-level bonus.
 * See WATER_INTAKE_ML_PER_KG and WATER_INTAKE_ACTIVITY_BONUS_ML above for
 * the sourcing notes behind each component.
 *
 * Pure function (CLAUDE.md Section 6): deterministic, no I/O, no
 * DOM/React state. Assumes inputs already passed validation; still
 * range-checks defensively and throws RangeError rather than ever
 * producing NaN/Infinity (CLAUDE.md Section 8).
 *
 * @param weightKg - body weight in kilograms
 * @param activityLevel - activity level, per the bonus table above
 * @returns total daily water intake in milliliters, rounded to the
 *   nearest 10 ml
 */
export function calculateWaterIntakeMl(
  weightKg: number,
  activityLevel: ActivityLevel,
): number {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new RangeError('weightKg must be a positive finite number');
  }

  const bonusMl = WATER_INTAKE_ACTIVITY_BONUS_ML[activityLevel];
  if (!Number.isFinite(bonusMl)) {
    throw new RangeError('activityLevel must be a recognized ActivityLevel');
  }

  const baselineMl = Math.round((weightKg * WATER_INTAKE_ML_PER_KG) / 10) * 10;
  return baselineMl + bonusMl;
}

/**
 * Runs the full calculation and returns the baseline/bonus breakdown
 * alongside the total, so the result panel can show how the number was
 * built (same "show the components" pattern as TDEE showing BMR, or
 * Calorie showing TDEE).
 */
export function getWaterIntakeResult(
  weightKg: number,
  activityLevel: ActivityLevel,
): WaterIntakeResult {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new RangeError('weightKg must be a positive finite number');
  }

  const bonusMl = WATER_INTAKE_ACTIVITY_BONUS_ML[activityLevel];
  if (!Number.isFinite(bonusMl)) {
    throw new RangeError('activityLevel must be a recognized ActivityLevel');
  }

  const baselineMl = Math.round((weightKg * WATER_INTAKE_ML_PER_KG) / 10) * 10;

  return {
    totalMl: baselineMl + bonusMl,
    baselineMl,
    activityBonusMl: bonusMl,
  };
}

// --- Validation ---

export function validateWeightInput(
  weightKgRaw: string,
): WaterIntakeValidationError | null {
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

export function validateWaterIntakeInputs(
  weightKgRaw: string,
  activityLevel: ActivityLevel | null,
): {
  weightError: WaterIntakeValidationError | null;
  activityError: WaterIntakeValidationError | null;
} {
  return {
    weightError: validateWeightInput(weightKgRaw),
    activityError: validateActivityLevelInput(activityLevel),
  };
}

export const WATER_INTAKE_INPUT_BOUNDS = {
  MIN_WEIGHT_KG,
  MAX_WEIGHT_KG,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const WATER_INTAKE_VALIDATION_MESSAGES: Record<
  WaterIntakeValidationError,
  string
> = {
  WEIGHT_REQUIRED: 'Enter your weight to estimate your water intake.',
  WEIGHT_NOT_A_NUMBER: 'Weight must be a number.',
  WEIGHT_NOT_POSITIVE: 'Weight must be greater than zero.',
  WEIGHT_OUT_OF_RANGE: `Enter a weight between ${MIN_WEIGHT_KG} and ${MAX_WEIGHT_KG} kg.`,
  ACTIVITY_LEVEL_REQUIRED: 'Select your activity level to estimate your water intake.',
};
