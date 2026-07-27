export interface WaterIntakeResult {
  /** Total daily water intake in milliliters, rounded to the nearest 10 ml */
  totalMl: number;
  /** The weight-based baseline before the activity adjustment, in milliliters */
  baselineMl: number;
  /** The activity-level adjustment added on top of the baseline, in milliliters */
  activityBonusMl: number;
}

// Water Intake Calculator only needs weight and activity level — a
// different field set from BMR/TDEE/Calorie (no height/age/sex), so this
// is its own small, self-contained validation error type rather than
// reusing BMRValidationError or TDEEValidationError (CLAUDE.md Section 5).
export type WaterIntakeValidationError =
  | 'WEIGHT_REQUIRED'
  | 'WEIGHT_NOT_A_NUMBER'
  | 'WEIGHT_NOT_POSITIVE'
  | 'WEIGHT_OUT_OF_RANGE'
  | 'ACTIVITY_LEVEL_REQUIRED';
