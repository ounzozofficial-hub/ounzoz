export interface MortgageResult {
  /** Monthly principal & interest payment, rounded to the nearest cent */
  monthlyPrincipalAndInterest: number;
  /** Monthly escrow (property tax + home insurance, prorated) + HOA, rounded to the nearest cent */
  monthlyEscrow: number;
  /** Total estimated monthly payment: principal & interest + escrow, rounded to the nearest cent */
  totalMonthlyPayment: number;
  /** Total principal & interest paid over the loan term (does not include escrow, which isn't interest) */
  totalPaid: number;
  /** Total interest paid over the loan term */
  totalInterest: number;
}

// Mortgage Calculator's own field set (home price, down payment, rate,
// term, plus optional tax/insurance/HOA) is deliberately not shared with
// LoanValidationError — CLAUDE.md Section 5 (Tool Independence): no
// cross-tool imports, a small amount of duplication between independent
// tools is expected and preferred over coupling.
export type MortgageValidationError =
  | 'HOME_PRICE_REQUIRED'
  | 'HOME_PRICE_NOT_A_NUMBER'
  | 'HOME_PRICE_NOT_POSITIVE'
  | 'HOME_PRICE_OUT_OF_RANGE'
  | 'DOWN_PAYMENT_REQUIRED'
  | 'DOWN_PAYMENT_NOT_A_NUMBER'
  | 'DOWN_PAYMENT_NEGATIVE'
  | 'DOWN_PAYMENT_NOT_LESS_THAN_HOME_PRICE'
  | 'INTEREST_RATE_REQUIRED'
  | 'INTEREST_RATE_NOT_A_NUMBER'
  | 'INTEREST_RATE_NEGATIVE'
  | 'INTEREST_RATE_OUT_OF_RANGE'
  | 'LOAN_TERM_REQUIRED'
  | 'LOAN_TERM_NOT_A_NUMBER'
  | 'LOAN_TERM_NOT_POSITIVE'
  | 'LOAN_TERM_NOT_WHOLE_NUMBER'
  | 'LOAN_TERM_OUT_OF_RANGE'
  | 'PROPERTY_TAX_NOT_A_NUMBER'
  | 'PROPERTY_TAX_NEGATIVE'
  | 'PROPERTY_TAX_OUT_OF_RANGE'
  | 'HOME_INSURANCE_NOT_A_NUMBER'
  | 'HOME_INSURANCE_NEGATIVE'
  | 'HOME_INSURANCE_OUT_OF_RANGE'
  | 'HOA_NOT_A_NUMBER'
  | 'HOA_NEGATIVE'
  | 'HOA_OUT_OF_RANGE';
