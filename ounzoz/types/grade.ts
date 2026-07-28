export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface GradeResult {
  /** Weighted-average overall grade as a percentage, rounded to 2 decimals */
  overallPercent: number;
  /** Letter grade mapped from overallPercent on the standard US scale */
  letterGrade: LetterGrade;
  /** Sum of every category's weight, rounded to 2 decimals — shown so
   * the user can sanity-check whether they've entered their full course */
  totalWeight: number;
  /** Number of categories included in the calculation */
  categoryCount: number;
}

// Grade Calculator is a dynamic-row-list tool (same shape as GPA
// Calculator's course rows), so validation is per-row: each row needs a
// valid weight and a valid score independently (CLAUDE.md Section 8 —
// every input is validated, no partial rows silently ignored).
export type GradeRowValidationError =
  | 'WEIGHT_REQUIRED'
  | 'WEIGHT_NOT_A_NUMBER'
  | 'WEIGHT_OUT_OF_RANGE'
  | 'SCORE_REQUIRED'
  | 'SCORE_NOT_A_NUMBER'
  | 'SCORE_OUT_OF_RANGE';
