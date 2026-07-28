export interface CompoundInterestResult {
  /** Final balance after compounding, rounded to the nearest cent */
  finalBalance: number;
  /** Total interest earned (finalBalance − principal), rounded to the nearest cent */
  interestEarned: number;
}

// Compound Interest Calculator's one distinguishing input vs. Loan/
// Mortgage: a selectable compounding frequency. Kept local to this tool
// (not types/shared.ts) since no other tool needs it yet — CLAUDE.md
// Section 4/5's "only extract when genuinely shared by 2+" rule.
export type CompoundingFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'daily';

// Compound Interest Calculator only needs principal/rate/frequency/years —
// a different field set from every other Finance tool so far, so this is
// its own small, self-contained validation error type (CLAUDE.md Section 5).
export type CompoundInterestValidationError =
  | 'PRINCIPAL_REQUIRED'
  | 'PRINCIPAL_NOT_A_NUMBER'
  | 'PRINCIPAL_NOT_POSITIVE'
  | 'PRINCIPAL_OUT_OF_RANGE'
  | 'INTEREST_RATE_REQUIRED'
  | 'INTEREST_RATE_NOT_A_NUMBER'
  | 'INTEREST_RATE_NEGATIVE'
  | 'INTEREST_RATE_OUT_OF_RANGE'
  | 'FREQUENCY_REQUIRED'
  | 'YEARS_REQUIRED'
  | 'YEARS_NOT_A_NUMBER'
  | 'YEARS_NOT_POSITIVE'
  | 'YEARS_NOT_WHOLE_NUMBER'
  | 'YEARS_OUT_OF_RANGE';
