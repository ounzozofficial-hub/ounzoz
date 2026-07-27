import type { BiologicalSex } from '@/types/shared';
import type {
  IdealWeightResult,
  IdealWeightValidationError,
} from '@/types/ideal-weight';

// Height bounds specific to this tool, not reused from BMI/BMR's generic
// 30–300cm sanity range. The Devine formula is an adult reference-weight
// formula (originally developed for adult drug-dosing calculations), and
// realistic adult height sits well inside 140–230cm — a range chosen to
// keep results comfortably positive across the whole domain (below
// ~100cm the formula's linear extension below 5ft turns negative, which
// is a meaningless "ideal weight").
const MIN_HEIGHT_CM = 140;
const MAX_HEIGHT_CM = 230;

/**
 * Calculates ideal body weight using the Devine formula.
 *
 * Formula source: Devine, B.J. (1974). "Gentamicin therapy." Drug
 * Intelligence & Clinical Pharmacy, 8, 650–655 — the most widely
 * referenced ideal-body-weight formula in clinical practice (originally
 * created for drug dosing, now the standard reference formula cited
 * ahead of alternatives like Robinson, Miller, or Hamwi).
 *
 *   Men:   IBW = 50 kg + 2.3 kg × (height in inches − 60)
 *   Women: IBW = 45.5 kg + 2.3 kg × (height in inches − 60)
 *
 * Height is collected in centimeters (this platform's metric-first
 * convention) and converted to inches internally, since the formula's
 * published constants are defined in imperial units.
 *
 * Pure function (CLAUDE.md Section 6): deterministic, no I/O, no
 * DOM/React state. Assumes inputs already passed validation; still
 * range-checks defensively and throws RangeError rather than ever
 * producing NaN/Infinity or a non-positive "weight" (CLAUDE.md
 * Section 8).
 *
 * @param heightCm - height in centimeters
 * @param sex - biological sex, per the formula's two constants
 * @returns ideal body weight in kilograms, rounded to 1 decimal place
 */
export function calculateIdealWeight(
  heightCm: number,
  sex: BiologicalSex,
): number {
  if (!Number.isFinite(heightCm) || heightCm <= 0) {
    throw new RangeError('heightCm must be a positive finite number');
  }

  const heightIn = heightCm / 2.54;
  const baseKg = sex === 'male' ? 50 : 45.5;
  const idealWeightKg = baseKg + 2.3 * (heightIn - 60);

  if (!Number.isFinite(idealWeightKg) || idealWeightKg <= 0) {
    throw new RangeError(
      'Resulting ideal weight is not a valid positive number for this height',
    );
  }

  return Math.round(idealWeightKg * 10) / 10;
}

/**
 * Runs calculateIdealWeight — the single entry point the tool page calls
 * once inputs are already validated.
 */
export function getIdealWeightResult(
  heightCm: number,
  sex: BiologicalSex,
): IdealWeightResult {
  return { idealWeightKg: calculateIdealWeight(heightCm, sex) };
}

// --- Validation ---
// Height and sex validation follow the same rules/shape as every other
// tool, but are re-implemented locally with this tool's own bounds
// (CLAUDE.md Section 5) — the height bounds specifically differ from
// BMI/BMR's (see MIN_HEIGHT_CM/MAX_HEIGHT_CM above).

export function validateHeightInput(
  heightCmRaw: string,
): IdealWeightValidationError | null {
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

export function validateSexInput(
  sex: BiologicalSex | null,
): IdealWeightValidationError | null {
  return sex === null ? 'SEX_REQUIRED' : null;
}

export function validateIdealWeightInputs(
  heightCmRaw: string,
  sex: BiologicalSex | null,
): {
  heightError: IdealWeightValidationError | null;
  sexError: IdealWeightValidationError | null;
} {
  return {
    heightError: validateHeightInput(heightCmRaw),
    sexError: validateSexInput(sex),
  };
}

export const IDEAL_WEIGHT_INPUT_BOUNDS = {
  MIN_HEIGHT_CM,
  MAX_HEIGHT_CM,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const IDEAL_WEIGHT_VALIDATION_MESSAGES: Record<
  IdealWeightValidationError,
  string
> = {
  HEIGHT_REQUIRED: 'Enter your height to estimate your ideal weight.',
  HEIGHT_NOT_A_NUMBER: 'Height must be a number.',
  HEIGHT_NOT_POSITIVE: 'Height must be greater than zero.',
  HEIGHT_OUT_OF_RANGE: `Enter a height between ${MIN_HEIGHT_CM} and ${MAX_HEIGHT_CM} cm.`,
  SEX_REQUIRED: 'Select your sex to estimate your ideal weight.',
};
