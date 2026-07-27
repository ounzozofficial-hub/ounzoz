export type BodyFatCategory =
  | 'essential-fat'
  | 'athletes'
  | 'fitness'
  | 'average'
  | 'obese';

export interface BodyFatCategoryInfo {
  category: BodyFatCategory;
  /** Human-readable label, e.g. "Athletic" */
  label: string;
}

export interface BodyFatResult {
  /** Body fat percentage, rounded to 1 decimal place, e.g. 16.1 */
  bodyFatPercentage: number;
  category: BodyFatCategoryInfo;
}

// Body Fat Calculator's own field set (sex, height, neck, waist, and hip
// for the female formula) doesn't match BMR/TDEE/Calorie's weight+height+
// age+sex tier, so this is a fully independent validation error type
// rather than built on BMRValidationError (CLAUDE.md Section 5: a small
// amount of duplication between independent tools is acceptable and
// preferred over forcing a shared type where the field sets genuinely
// diverge).
export type BodyFatValidationError =
  | 'HEIGHT_REQUIRED'
  | 'HEIGHT_NOT_A_NUMBER'
  | 'HEIGHT_NOT_POSITIVE'
  | 'HEIGHT_OUT_OF_RANGE'
  | 'SEX_REQUIRED'
  | 'NECK_REQUIRED'
  | 'NECK_NOT_A_NUMBER'
  | 'NECK_NOT_POSITIVE'
  | 'NECK_OUT_OF_RANGE'
  | 'WAIST_REQUIRED'
  | 'WAIST_NOT_A_NUMBER'
  | 'WAIST_NOT_POSITIVE'
  | 'WAIST_OUT_OF_RANGE'
  | 'HIP_REQUIRED'
  | 'HIP_NOT_A_NUMBER'
  | 'HIP_NOT_POSITIVE'
  | 'HIP_OUT_OF_RANGE'
  // Cross-field checks: the Navy formula takes log10 of (waist − neck) for
  // men, or (waist + hip − neck) for women — both must be positive or the
  // formula produces NaN/Infinity (CLAUDE.md Section 8). Surfaced under
  // the waist field since it's common to both formulas.
  | 'WAIST_NECK_DIFFERENCE_INVALID'
  | 'WAIST_HIP_NECK_DIFFERENCE_INVALID';
