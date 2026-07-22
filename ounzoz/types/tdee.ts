import type { BMRValidationError } from './bmr';

export type { ActivityLevel } from './shared';

export interface TDEEResult {
  /** Total Daily Energy Expenditure in calories/day, rounded to the nearest whole number */
  tdee: number;
  /** The BMR TDEE was derived from, shown alongside the result for context */
  bmr: number;
}

// Reuses BMR's validation error set (same weight/height/age/sex fields,
// identical rules) and adds one TDEE-specific field.
export type TDEEValidationError = BMRValidationError | 'ACTIVITY_LEVEL_REQUIRED';
