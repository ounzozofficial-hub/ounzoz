import type { BMRValidationError } from './bmr';

export type { CalorieGoal } from './shared';

export interface CalorieResult {
  /** Daily calorie target in calories/day, rounded to the nearest whole number */
  calories: number;
  /** The TDEE this target is adjusted from, shown alongside the result for context */
  tdee: number;
  /** The BMR underlying that TDEE, shown alongside the result for context */
  bmr: number;
  /** True when `calories` falls below the standard safe-minimum floor for
   * the person's sex. Flag only — never changes `calories` itself
   * (DESIGN.md Section 11.1). */
  belowSafeMinimum: boolean;
}

// Calorie Calculator builds directly on BMR's validation error set (same
// weight/height/age/sex fields, identical rules) plus its own
// activity-level and goal fields — built on BMRValidationError specifically,
// not TDEEValidationError. Calorie and TDEE are peers that each build
// independently on BMR (CLAUDE.md Section 5: Tool Independence), so Calorie
// doesn't take on a type dependency on TDEE's validation error set just
// because it happens to reuse the same activity-level field.
export type CalorieValidationError =
  | BMRValidationError
  | 'ACTIVITY_LEVEL_REQUIRED'
  | 'GOAL_REQUIRED';
