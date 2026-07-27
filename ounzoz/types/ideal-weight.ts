export interface IdealWeightResult {
  /** Ideal body weight in kilograms, rounded to 1 decimal place */
  idealWeightKg: number;
}

// Ideal Weight Calculator only needs height and sex — the same tier as
// BMI (independent, not built on any other tool's file) — so this is its
// own small, self-contained validation error type rather than reusing
// BMR's (which also carries WEIGHT_*/AGE_* members this tool has no use
// for).
export type IdealWeightValidationError =
  | 'HEIGHT_REQUIRED'
  | 'HEIGHT_NOT_A_NUMBER'
  | 'HEIGHT_NOT_POSITIVE'
  | 'HEIGHT_OUT_OF_RANGE'
  | 'SEX_REQUIRED';
