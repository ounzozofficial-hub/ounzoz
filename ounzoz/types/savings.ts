export interface SavingsResult {
  /** Final balance after growth, rounded to the nearest cent */
  finalBalance: number;
  /** Initial deposit + all monthly contributions, with no interest applied, rounded to the nearest cent */
  totalContributions: number;
  /** Total interest earned (finalBalance − totalContributions), rounded to the nearest cent */
  interestEarned: number;
}

// Savings Calculator's field set (initial deposit + monthly contribution +
// APY + years) differs from every other Finance tool so far, so this is
// its own small, self-contained validation error type (CLAUDE.md Section 5).
// Both INITIAL_DEPOSIT and MONTHLY_CONTRIBUTION are optional (empty = 0,
// same convention as Mortgage's escrow fields) — NOTHING_TO_CALCULATE
// covers the one cross-field case where both are zero.
export type SavingsValidationError =
  | 'INITIAL_DEPOSIT_NOT_A_NUMBER'
  | 'INITIAL_DEPOSIT_NEGATIVE'
  | 'INITIAL_DEPOSIT_OUT_OF_RANGE'
  | 'MONTHLY_CONTRIBUTION_NOT_A_NUMBER'
  | 'MONTHLY_CONTRIBUTION_NEGATIVE'
  | 'MONTHLY_CONTRIBUTION_OUT_OF_RANGE'
  | 'NOTHING_TO_CALCULATE'
  | 'INTEREST_RATE_REQUIRED'
  | 'INTEREST_RATE_NOT_A_NUMBER'
  | 'INTEREST_RATE_NEGATIVE'
  | 'INTEREST_RATE_OUT_OF_RANGE'
  | 'YEARS_REQUIRED'
  | 'YEARS_NOT_A_NUMBER'
  | 'YEARS_NOT_POSITIVE'
  | 'YEARS_NOT_WHOLE_NUMBER'
  | 'YEARS_OUT_OF_RANGE';
