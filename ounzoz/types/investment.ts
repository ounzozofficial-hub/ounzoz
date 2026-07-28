export interface InvestmentResult {
  /** Final projected balance after growth, rounded to the nearest cent */
  finalBalance: number;
  /** Initial investment + all monthly contributions, with no growth applied, rounded to the nearest cent */
  totalContributions: number;
  /** Total estimated growth (finalBalance − totalContributions), rounded to the nearest cent */
  estimatedGrowth: number;
}

// Investment Calculator's field set (initial investment + monthly
// contribution + expected annual return + years) mirrors Savings
// Calculator's shape but is its own type — CLAUDE.md Section 5 (Tool
// Independence): no cross-tool imports, even where two tools share a
// structurally similar field set. Both INITIAL_INVESTMENT and
// MONTHLY_CONTRIBUTION are optional (empty = 0) — NOTHING_TO_CALCULATE
// covers the one cross-field case where both are zero.
export type InvestmentValidationError =
  | 'INITIAL_INVESTMENT_NOT_A_NUMBER'
  | 'INITIAL_INVESTMENT_NEGATIVE'
  | 'INITIAL_INVESTMENT_OUT_OF_RANGE'
  | 'MONTHLY_CONTRIBUTION_NOT_A_NUMBER'
  | 'MONTHLY_CONTRIBUTION_NEGATIVE'
  | 'MONTHLY_CONTRIBUTION_OUT_OF_RANGE'
  | 'NOTHING_TO_CALCULATE'
  | 'RETURN_RATE_REQUIRED'
  | 'RETURN_RATE_NOT_A_NUMBER'
  | 'RETURN_RATE_NEGATIVE'
  | 'RETURN_RATE_OUT_OF_RANGE'
  | 'YEARS_REQUIRED'
  | 'YEARS_NOT_A_NUMBER'
  | 'YEARS_NOT_POSITIVE'
  | 'YEARS_NOT_WHOLE_NUMBER'
  | 'YEARS_OUT_OF_RANGE';
