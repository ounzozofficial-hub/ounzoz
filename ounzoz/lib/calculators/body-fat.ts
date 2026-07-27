import { BMR_INPUT_BOUNDS } from '@/lib/formulas/bmr-formula';
import type { BiologicalSex } from '@/types/shared';
import type {
  BodyFatCategory,
  BodyFatCategoryInfo,
  BodyFatResult,
  BodyFatValidationError,
} from '@/types/body-fat';

// Height reuses the exact same "what's a realistic human height" bounds
// every other tool already uses (lib/formulas/bmr-formula.ts) — this tool
// doesn't need weight or age, so only the height bounds are pulled in.
const { MIN_HEIGHT_CM, MAX_HEIGHT_CM } = BMR_INPUT_BOUNDS;

// Sanity bounds for the measurement inputs this tool introduces — not
// clinical limits, just wide enough to cover every realistic adult while
// catching fat-fingered input before it reaches the calculation
// (CLAUDE.md Section 8). No other tool needs these, so they stay local
// per CLAUDE.md Section 5's "genuinely shared by 2+ tools" threshold.
const MIN_NECK_CM = 15;
const MAX_NECK_CM = 60;
const MIN_WAIST_CM = 40;
const MAX_WAIST_CM = 200;
const MIN_HIP_CM = 40;
const MAX_HIP_CM = 200;

/**
 * Estimates body fat percentage using the US Navy circumference method.
 *
 * Formula source: Hodgdon, J.A., & Beckett, M.B. (1984). Technical
 * Reports No. 84-11 and 84-29, Naval Health Research Center — the
 * standard the US Navy uses for body composition assessment, and the
 * most widely used at-home body-fat estimation method that doesn't
 * require calipers or a DEXA scan.
 *
 *   Men:   %BF = 495 / (1.0324   − 0.19077×log10(waist−neck)      + 0.15456×log10(height)) − 450
 *   Women: %BF = 495 / (1.29579 − 0.35004×log10(waist+hip−neck)  + 0.22100×log10(height)) − 450
 *
 * All measurements in centimeters, matching this platform's metric-first
 * convention (the formula as commonly published uses inches; this is the
 * equivalent metric form used by the same calculators).
 *
 * Pure function (CLAUDE.md Section 6): deterministic, no I/O, no DOM/React
 * state. Assumes inputs already passed validation; still range-checks
 * defensively — including the case where waist/neck/hip don't form a
 * valid measurement (log10 of a non-positive number) — and throws
 * RangeError rather than ever producing NaN/Infinity (CLAUDE.md
 * Section 8).
 *
 * @param heightCm - height in centimeters
 * @param neckCm - neck circumference in centimeters
 * @param waistCm - waist circumference in centimeters
 * @param sex - biological sex, per the formula's two variants
 * @param hipCm - hip circumference in centimeters, required for the
 *   female formula only
 * @returns body fat percentage, rounded to 1 decimal place
 */
export function calculateBodyFatPercentage(
  heightCm: number,
  neckCm: number,
  waistCm: number,
  sex: BiologicalSex,
  hipCm?: number,
): number {
  if (!Number.isFinite(heightCm) || heightCm <= 0) {
    throw new RangeError('heightCm must be a positive finite number');
  }
  if (!Number.isFinite(neckCm) || neckCm <= 0) {
    throw new RangeError('neckCm must be a positive finite number');
  }
  if (!Number.isFinite(waistCm) || waistCm <= 0) {
    throw new RangeError('waistCm must be a positive finite number');
  }

  if (sex === 'male') {
    const diff = waistCm - neckCm;
    if (diff <= 0) {
      throw new RangeError(
        'waistCm must be greater than neckCm for the male formula',
      );
    }
    const bodyFat =
      495 /
        (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(heightCm)) -
      450;
    return Math.round(bodyFat * 10) / 10;
  }

  if (!Number.isFinite(hipCm) || (hipCm as number) <= 0) {
    throw new RangeError(
      'hipCm must be a positive finite number for the female formula',
    );
  }
  const diff = waistCm + (hipCm as number) - neckCm;
  if (diff <= 0) {
    throw new RangeError(
      'waistCm + hipCm must be greater than neckCm for the female formula',
    );
  }
  const bodyFat =
    495 /
      (1.29579 - 0.35004 * Math.log10(diff) + 0.221 * Math.log10(heightCm)) -
    450;
  return Math.round(bodyFat * 10) / 10;
}

const CATEGORY_LABELS: Record<BodyFatCategory, string> = {
  'essential-fat': 'Essential fat',
  athletes: 'Athletic',
  fitness: 'Fitness',
  average: 'Average',
  obese: 'Obese',
};

// Upper bound (inclusive) of each category band, per sex.
const CATEGORY_MAX_BY_SEX: Record<
  BiologicalSex,
  { max: number; category: BodyFatCategory }[]
> = {
  male: [
    { max: 5, category: 'essential-fat' },
    { max: 13, category: 'athletes' },
    { max: 17, category: 'fitness' },
    { max: 24, category: 'average' },
    { max: Infinity, category: 'obese' },
  ],
  female: [
    { max: 13, category: 'essential-fat' },
    { max: 20, category: 'athletes' },
    { max: 24, category: 'fitness' },
    { max: 31, category: 'average' },
    { max: Infinity, category: 'obese' },
  ],
};

/**
 * Maps a body fat percentage to its ACE (American Council on Exercise)
 * body composition category.
 *
 * Formula source: American Council on Exercise, Body Fat Percentage
 * Categories — the widely cited sex-specific classification table
 * (Essential Fat / Athletes / Fitness / Average / Obese).
 *
 * Boundary values are inclusive on the upper bound of each band (e.g.
 * exactly 5% for men is Essential Fat, not Athletic; exactly 24% for men
 * is Average, not Obese).
 */
export function getBodyFatCategory(
  bodyFatPercentage: number,
  sex: BiologicalSex,
): BodyFatCategoryInfo {
  if (!Number.isFinite(bodyFatPercentage)) {
    throw new RangeError('bodyFatPercentage must be a finite number');
  }

  const bands = CATEGORY_MAX_BY_SEX[sex];
  const match = bands.find((band) => bodyFatPercentage <= band.max);
  const category = (match ?? bands[bands.length - 1]).category;

  return { category, label: CATEGORY_LABELS[category] };
}

/**
 * Runs calculateBodyFatPercentage + getBodyFatCategory together — the
 * single entry point the tool page calls once inputs are already
 * validated.
 */
export function getBodyFatResult(
  heightCm: number,
  neckCm: number,
  waistCm: number,
  sex: BiologicalSex,
  hipCm?: number,
): BodyFatResult {
  const bodyFatPercentage = calculateBodyFatPercentage(
    heightCm,
    neckCm,
    waistCm,
    sex,
    hipCm,
  );
  return {
    bodyFatPercentage,
    category: getBodyFatCategory(bodyFatPercentage, sex),
  };
}

// --- Validation ---
// Height and sex validation follow the same rules as every other tool,
// but are re-implemented locally (rather than imported) because this
// tool's error type doesn't include the WEIGHT_*/AGE_* members that
// BMRValidationError carries — only the numeric bounds are shared
// (CLAUDE.md Section 5).

export function validateHeightInput(
  heightCmRaw: string,
): BodyFatValidationError | null {
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
): BodyFatValidationError | null {
  return sex === null ? 'SEX_REQUIRED' : null;
}

export function validateNeckInput(
  neckCmRaw: string,
): BodyFatValidationError | null {
  const trimmed = neckCmRaw.trim();
  if (trimmed === '') return 'NECK_REQUIRED';

  const neckCm = Number(trimmed);
  if (!Number.isFinite(neckCm)) return 'NECK_NOT_A_NUMBER';
  if (neckCm <= 0) return 'NECK_NOT_POSITIVE';
  if (neckCm < MIN_NECK_CM || neckCm > MAX_NECK_CM) return 'NECK_OUT_OF_RANGE';
  return null;
}

export function validateWaistInput(
  waistCmRaw: string,
): BodyFatValidationError | null {
  const trimmed = waistCmRaw.trim();
  if (trimmed === '') return 'WAIST_REQUIRED';

  const waistCm = Number(trimmed);
  if (!Number.isFinite(waistCm)) return 'WAIST_NOT_A_NUMBER';
  if (waistCm <= 0) return 'WAIST_NOT_POSITIVE';
  if (waistCm < MIN_WAIST_CM || waistCm > MAX_WAIST_CM) {
    return 'WAIST_OUT_OF_RANGE';
  }
  return null;
}

/**
 * Hip is only part of the female formula — the male formula never reads
 * it, so it's only required/validated when sex is 'female'.
 */
export function validateHipInput(
  hipCmRaw: string,
  sex: BiologicalSex | null,
): BodyFatValidationError | null {
  if (sex !== 'female') return null;

  const trimmed = hipCmRaw.trim();
  if (trimmed === '') return 'HIP_REQUIRED';

  const hipCm = Number(trimmed);
  if (!Number.isFinite(hipCm)) return 'HIP_NOT_A_NUMBER';
  if (hipCm <= 0) return 'HIP_NOT_POSITIVE';
  if (hipCm < MIN_HIP_CM || hipCm > MAX_HIP_CM) return 'HIP_OUT_OF_RANGE';
  return null;
}

/**
 * Cross-field check: the Navy formula takes log10 of (waist − neck) for
 * men, or (waist + hip − neck) for women — both must be positive
 * (CLAUDE.md Section 8: never let invalid math reach the UI). Only
 * evaluated once every contributing field is individually a valid
 * number — otherwise a required/range error on one field would be
 * masked by a confusing consistency error.
 */
export function validateMeasurementConsistency(
  neckCmRaw: string,
  waistCmRaw: string,
  hipCmRaw: string,
  sex: BiologicalSex | null,
): BodyFatValidationError | null {
  if (sex === null) return null;

  const neckCm = Number(neckCmRaw.trim());
  const waistCm = Number(waistCmRaw.trim());
  if (!Number.isFinite(neckCm) || !Number.isFinite(waistCm)) return null;

  if (sex === 'male') {
    return waistCm - neckCm > 0 ? null : 'WAIST_NECK_DIFFERENCE_INVALID';
  }

  const hipCm = Number(hipCmRaw.trim());
  if (!Number.isFinite(hipCm)) return null;
  return waistCm + hipCm - neckCm > 0
    ? null
    : 'WAIST_HIP_NECK_DIFFERENCE_INVALID';
}

export function validateBodyFatInputs(
  heightCmRaw: string,
  neckCmRaw: string,
  waistCmRaw: string,
  hipCmRaw: string,
  sex: BiologicalSex | null,
): {
  heightError: BodyFatValidationError | null;
  neckError: BodyFatValidationError | null;
  waistError: BodyFatValidationError | null;
  hipError: BodyFatValidationError | null;
  sexError: BodyFatValidationError | null;
} {
  const heightError = validateHeightInput(heightCmRaw);
  const neckError = validateNeckInput(neckCmRaw);
  const hipError = validateHipInput(hipCmRaw, sex);
  const sexError = validateSexInput(sex);
  let waistError = validateWaistInput(waistCmRaw);

  if (!neckError && !waistError && !hipError && !sexError) {
    const consistencyError = validateMeasurementConsistency(
      neckCmRaw,
      waistCmRaw,
      hipCmRaw,
      sex,
    );
    if (consistencyError) waistError = consistencyError;
  }

  return { heightError, neckError, waistError, hipError, sexError };
}

export const BODY_FAT_INPUT_BOUNDS = {
  MIN_HEIGHT_CM,
  MAX_HEIGHT_CM,
  MIN_NECK_CM,
  MAX_NECK_CM,
  MIN_WAIST_CM,
  MAX_WAIST_CM,
  MIN_HIP_CM,
  MAX_HIP_CM,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const BODY_FAT_VALIDATION_MESSAGES: Record<
  BodyFatValidationError,
  string
> = {
  HEIGHT_REQUIRED: 'Enter your height to estimate body fat.',
  HEIGHT_NOT_A_NUMBER: 'Height must be a number.',
  HEIGHT_NOT_POSITIVE: 'Height must be greater than zero.',
  HEIGHT_OUT_OF_RANGE: `Enter a height between ${MIN_HEIGHT_CM} and ${MAX_HEIGHT_CM} cm.`,
  SEX_REQUIRED: 'Select your sex to estimate body fat.',
  NECK_REQUIRED: 'Enter your neck circumference to estimate body fat.',
  NECK_NOT_A_NUMBER: 'Neck circumference must be a number.',
  NECK_NOT_POSITIVE: 'Neck circumference must be greater than zero.',
  NECK_OUT_OF_RANGE: `Enter a neck circumference between ${MIN_NECK_CM} and ${MAX_NECK_CM} cm.`,
  WAIST_REQUIRED: 'Enter your waist circumference to estimate body fat.',
  WAIST_NOT_A_NUMBER: 'Waist circumference must be a number.',
  WAIST_NOT_POSITIVE: 'Waist circumference must be greater than zero.',
  WAIST_OUT_OF_RANGE: `Enter a waist circumference between ${MIN_WAIST_CM} and ${MAX_WAIST_CM} cm.`,
  HIP_REQUIRED: 'Enter your hip circumference to estimate body fat.',
  HIP_NOT_A_NUMBER: 'Hip circumference must be a number.',
  HIP_NOT_POSITIVE: 'Hip circumference must be greater than zero.',
  HIP_OUT_OF_RANGE: `Enter a hip circumference between ${MIN_HIP_CM} and ${MAX_HIP_CM} cm.`,
  WAIST_NECK_DIFFERENCE_INVALID:
    'Waist circumference must be greater than neck circumference.',
  WAIST_HIP_NECK_DIFFERENCE_INVALID:
    'Waist plus hip circumference must be greater than neck circumference.',
};
