export type Grade =
  | 'A'
  | 'A-'
  | 'B+'
  | 'B'
  | 'B-'
  | 'C+'
  | 'C'
  | 'C-'
  | 'D+'
  | 'D'
  | 'D-'
  | 'F';

export interface GPAResult {
  /** Weighted-average GPA on the standard unweighted 4.0 scale, rounded to 2 decimals */
  gpa: number;
  /** Sum of credit hours across every course, rounded to 2 decimals */
  totalCreditHours: number;
  /** Number of courses included in the calculation */
  courseCount: number;
}

// GPA Calculator is a dynamic-row-list tool (no prior tool needed this),
// so validation is per-row: each row needs a selected Grade and a valid
// credit-hours value independently (CLAUDE.md Section 8 — every input is
// validated, no partial rows silently ignored).
export type GPARowValidationError =
  | 'GRADE_REQUIRED'
  | 'CREDIT_HOURS_REQUIRED'
  | 'CREDIT_HOURS_NOT_A_NUMBER'
  | 'CREDIT_HOURS_NOT_POSITIVE'
  | 'CREDIT_HOURS_OUT_OF_RANGE';
