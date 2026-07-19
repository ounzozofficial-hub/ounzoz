import type {
  BMICategory,
  BMICategoryInfo,
  BMIResult,
  BMIValidationError,
} from '@/types/bmi';

// Sanity bounds for inputs — not clinical limits, just wide enough to
// cover every realistic human while catching obviously fat-fingered
// input (e.g. a height typed in meters instead of centimeters) before it
// reaches the calculation. CLAUDE.md Section 8: never trust raw input.
const MIN_WEIGHT_KG = 1;
const MAX_WEIGHT_KG = 500;
const MIN_HEIGHT_CM = 30;
const MAX_HEIGHT_CM = 300;

/**
 * Calculates Body Mass Index.
 *
 * Formula source: World Health Organization BMI standard —
 * BMI = weight(kg) / height(m)²
 * https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index
 *
 * This is a pure function: given the same inputs it always returns the
 * same output, does no I/O, and touches no DOM/React state (CLAUDE.md
 * Section 6). It assumes inputs have already passed validateBMIInputs —
 * it still guards against div-by-zero/negative height to avoid ever
 * producing NaN or Infinity (CLAUDE.md Section 8), throwing a RangeError
 * instead so a caller that skips validation fails loudly rather than
 * silently rendering a broken number.
 *
 * @param weightKg - body weight in kilograms
 * @param heightCm - height in centimeters
 * @returns BMI rounded to 1 decimal place
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new RangeError('weightKg must be a positive finite number');
  }
  if (!Number.isFinite(heightCm) || heightCm <= 0) {
    throw new RangeError('heightCm must be a positive finite number');
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  // Round to 1 decimal place without floating-point drift artifacts
  // (e.g. avoid 22.400000000000002).
  return Math.round(bmi * 10) / 10;
}

const CATEGORY_LABELS: Record<BMICategory, string> = {
  underweight: 'Underweight',
  normal: 'Normal weight',
  overweight: 'Overweight',
  obese: 'Obese',
};

/**
 * Maps a BMI value to its WHO weight-status category.
 *
 * Formula source: World Health Organization BMI classification —
 * <18.5 Underweight · 18.5–24.9 Normal · 25–29.9 Overweight · ≥30 Obese
 * https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index
 *
 * Boundary values are inclusive on the lower bound of each band (e.g.
 * exactly 18.5 is Normal, not Underweight; exactly 25 is Overweight, not
 * Normal) — this matches the WHO reference table exactly.
 */
export function getBMICategory(bmi: number): BMICategoryInfo {
  if (!Number.isFinite(bmi) || bmi <= 0) {
    throw new RangeError('bmi must be a positive finite number');
  }

  let category: BMICategory;
  if (bmi < 18.5) {
    category = 'underweight';
  } else if (bmi < 25) {
    category = 'normal';
  } else if (bmi < 30) {
    category = 'overweight';
  } else {
    category = 'obese';
  }

  return { category, label: CATEGORY_LABELS[category] };
}

/**
 * Runs calculateBMI + getBMICategory together — the single entry point
 * the tool page calls once inputs are already validated.
 */
export function getBMIResult(weightKg: number, heightCm: number): BMIResult {
  const bmi = calculateBMI(weightKg, heightCm);
  return { bmi, category: getBMICategory(bmi) };
}

/**
 * Validates the raw weight field before any calculation runs.
 * Returns the applicable error, or null if the value is valid.
 */
export function validateWeightInput(
  weightKgRaw: string,
): BMIValidationError | null {
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

/**
 * Validates the raw height field before any calculation runs.
 * Returns the applicable error, or null if the value is valid.
 */
export function validateHeightInput(
  heightCmRaw: string,
): BMIValidationError | null {
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

/**
 * Validates raw BMI form input before any calculation runs.
 *
 * Returns a per-field error (or null) for weight and height
 * independently, so the UI can show each error on its own Input rather
 * than blocking on a single combined message.
 *
 * CLAUDE.md Section 8: never trust raw browser input — always parse,
 * type-check, and range-check before it reaches a calculation.
 */
export function validateBMIInputs(
  weightKgRaw: string,
  heightCmRaw: string,
): {
  weightError: BMIValidationError | null;
  heightError: BMIValidationError | null;
} {
  return {
    weightError: validateWeightInput(weightKgRaw),
    heightError: validateHeightInput(heightCmRaw),
  };
}

export const BMI_INPUT_BOUNDS = {
  MIN_WEIGHT_KG,
  MAX_WEIGHT_KG,
  MIN_HEIGHT_CM,
  MAX_HEIGHT_CM,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8. */
export const BMI_VALIDATION_MESSAGES: Record<BMIValidationError, string> = {
  WEIGHT_REQUIRED: 'Enter your weight to calculate BMI.',
  HEIGHT_REQUIRED: 'Enter your height to calculate BMI.',
  WEIGHT_NOT_A_NUMBER: 'Weight must be a number.',
  HEIGHT_NOT_A_NUMBER: 'Height must be a number.',
  WEIGHT_NOT_POSITIVE: 'Weight must be greater than zero.',
  HEIGHT_NOT_POSITIVE: 'Height must be greater than zero.',
  WEIGHT_OUT_OF_RANGE: `Enter a weight between ${MIN_WEIGHT_KG} and ${MAX_WEIGHT_KG} kg.`,
  HEIGHT_OUT_OF_RANGE: `Enter a height between ${MIN_HEIGHT_CM} and ${MAX_HEIGHT_CM} cm.`,
};
