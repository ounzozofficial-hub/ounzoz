export interface ProteinIntakeResult {
  /** Total daily protein target in grams, rounded to the nearest whole gram */
  totalGrams: number;
  /** The grams-per-kg multiplier used for the selected activity level */
  gramsPerKg: number;
}

// Protein Intake Calculator only needs weight and activity level — same
// field set as Water Intake Calculator, but kept as its own independent
// type rather than shared, since the two tools aren't otherwise related
// (CLAUDE.md Section 5: Tool Independence — a matching shape between two
// unrelated tools' local types is fine; it isn't a reason to couple them).
export type ProteinIntakeValidationError =
  | 'WEIGHT_REQUIRED'
  | 'WEIGHT_NOT_A_NUMBER'
  | 'WEIGHT_NOT_POSITIVE'
  | 'WEIGHT_OUT_OF_RANGE'
  | 'ACTIVITY_LEVEL_REQUIRED';
