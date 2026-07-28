import type { CalorieValidationError } from './calorie';

export interface MacroResult {
  /** Total daily calorie target this split is based on (Calorie Calculator's own result) */
  calories: number;
  /** Protein target in grams/day */
  proteinGrams: number;
  /** Fat target in grams/day */
  fatGrams: number;
  /** Carbohydrate target in grams/day, whatever calories remain after protein and fat */
  carbGrams: number;
}

// Macro Calculator genuinely builds on Calorie Calculator's result — same
// weight/height/age/sex/activityLevel/goal fields, no new ones — a tiered
// dependency, not a peer relationship (CLAUDE.md Section 5). This mirrors
// TDEEValidationError building on BMRValidationError since TDEE genuinely
// builds on BMR; Calorie's own type instead builds on BMRValidationError
// directly since Calorie and TDEE are peers that each build independently
// on BMR. Macro has no such peer relationship with Calorie — it directly
// depends on Calorie's result — so its validation type is Calorie's,
// unmodified.
export type MacroValidationError = CalorieValidationError;
