import type { BiologicalSex } from '@/types/shared';
import type { BMRValidationError } from '@/types/bmr';

// This module holds the Mifflin-St Jeor BMR formula and its input
// validation as a neutral, tool-agnostic unit — analogous to
// components/shared/SexSelector.tsx. It originally lived inside
// lib/calculators/bmr.ts, but once TDEE Calculator needed the same
// formula (TDEE = BMR × activity multiplier), importing from another
// tool's calculator file would have violated CLAUDE.md Section 5 (Tool
// Independence): deleting bmr-calculator's folder should never risk
// breaking tdee-calculator. Moving the formula itself to lib/formulas/
// resolves that — both lib/calculators/bmr.ts and lib/calculators/tdee.ts
// import from here, and neither imports from the other.

// Sanity bounds — not clinical limits, just wide enough to cover every
// realistic human while catching fat-fingered input before it reaches
// the calculation (CLAUDE.md Section 8).
const MIN_WEIGHT_KG = 1;
const MAX_WEIGHT_KG = 500;
const MIN_HEIGHT_CM = 30;
const MAX_HEIGHT_CM = 300;
const MIN_AGE_YEARS = 1;
const MAX_AGE_YEARS = 120;

/**
 * Calculates Basal Metabolic Rate — the calories/day the body burns at
 * complete rest.
 *
 * Formula source: Mifflin-St Jeor Equation (Mifflin MD, St Jeor ST, et
 * al., 1990), the equation currently recommended by the Academy of
 * Nutrition and Dietetics as the most accurate predictive BMR equation
 * for most adults, superseding the older Harris-Benedict equation.
 *
 *   Men:   BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age(y) + 5
 *   Women: BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 × age(y) − 161
 *
 * Pure function (CLAUDE.md Section 6): deterministic, no I/O, no
 * DOM/React state. Assumes inputs already passed validation; it still
 * range-checks defensively and throws RangeError rather than ever
 * producing NaN/Infinity (CLAUDE.md Section 8).
 *
 * @param weightKg - body weight in kilograms
 * @param heightCm - height in centimeters
 * @param age - age in whole years
 * @param sex - biological sex, per the equation's two coefficient sets
 * @returns BMR in calories/day, rounded to the nearest whole number
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: BiologicalSex,
): number {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new RangeError('weightKg must be a positive finite number');
  }
  if (!Number.isFinite(heightCm) || heightCm <= 0) {
    throw new RangeError('heightCm must be a positive finite number');
  }
  if (!Number.isFinite(age) || age <= 0) {
    throw new RangeError('age must be a positive finite number');
  }

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = sex === 'male' ? base + 5 : base - 161;

  return Math.round(bmr);
}

// --- Per-field validation (CLAUDE.md Section 8) ---
// Shared by any tool built on this formula (BMR Calculator, TDEE
// Calculator, and any future tool needing weight/height/age/sex — e.g.
// Calorie Calculator): each field validates independently so the UI can
// show errors next to the field that caused them, per DESIGN.md
// Section 19.

export function validateWeightInput(
  weightKgRaw: string,
): BMRValidationError | null {
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

export function validateHeightInput(
  heightCmRaw: string,
): BMRValidationError | null {
  const trimmed = heightCmRaw.trim();
  if (trimmed === '') return 'HEIGHT_REQUIRED';

  const heightCm = Number(trimmed);
  if (!Number.isFinite(heightCm)) return 'HEIGHT_NOT_A_NUMBER';
  if (heightCm <= 0) return 'HEIGHT_NOT_POSITIVE';
  if (heightCm < MIN_HEIGHT_CM || heightCm > MAX_HEIGHT_CM) {
    return 'HEIGHT_OUT_OF_RANGE';
  }
  return null;
}

export function validateAgeInput(ageRaw: string): BMRValidationError | null {
  const trimmed = ageRaw.trim();
  if (trimmed === '') return 'AGE_REQUIRED';

  const age = Number(trimmed);
  if (!Number.isFinite(age)) return 'AGE_NOT_A_NUMBER';
  if (age <= 0) return 'AGE_NOT_POSITIVE';
  if (!Number.isInteger(age)) return 'AGE_NOT_WHOLE_NUMBER';
  if (age < MIN_AGE_YEARS || age > MAX_AGE_YEARS) return 'AGE_OUT_OF_RANGE';
  return null;
}

export function validateSexInput(
  sex: BiologicalSex | null,
): BMRValidationError | null {
  return sex === null ? 'SEX_REQUIRED' : null;
}

export const BMR_INPUT_BOUNDS = {
  MIN_WEIGHT_KG,
  MAX_WEIGHT_KG,
  MIN_HEIGHT_CM,
  MAX_HEIGHT_CM,
  MIN_AGE_YEARS,
  MAX_AGE_YEARS,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const BMR_VALIDATION_MESSAGES: Record<BMRValidationError, string> = {
  WEIGHT_REQUIRED: 'Enter your weight to calculate BMR.',
  HEIGHT_REQUIRED: 'Enter your height to calculate BMR.',
  AGE_REQUIRED: 'Enter your age to calculate BMR.',
  SEX_REQUIRED: 'Select your sex to calculate BMR.',
  WEIGHT_NOT_A_NUMBER: 'Weight must be a number.',
  HEIGHT_NOT_A_NUMBER: 'Height must be a number.',
  AGE_NOT_A_NUMBER: 'Age must be a number.',
  WEIGHT_NOT_POSITIVE: 'Weight must be greater than zero.',
  HEIGHT_NOT_POSITIVE: 'Height must be greater than zero.',
  AGE_NOT_POSITIVE: 'Age must be greater than zero.',
  WEIGHT_OUT_OF_RANGE: `Enter a weight between ${MIN_WEIGHT_KG} and ${MAX_WEIGHT_KG} kg.`,
  HEIGHT_OUT_OF_RANGE: `Enter a height between ${MIN_HEIGHT_CM} and ${MAX_HEIGHT_CM} cm.`,
  AGE_OUT_OF_RANGE: `Enter a number between ${MIN_AGE_YEARS} and ${MAX_AGE_YEARS} for age.`,
  AGE_NOT_WHOLE_NUMBER: 'Age must be a whole number of years.',
};
