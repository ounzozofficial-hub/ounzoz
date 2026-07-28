export interface LoanResult {
  /** Monthly payment in currency units, rounded to the nearest cent */
  monthlyPayment: number;
  /** Total amount paid over the life of the loan (monthlyPayment × number of payments) */
  totalPaid: number;
  /** Total interest paid over the life of the loan (totalPaid − principal) */
  totalInterest: number;
}

// Loan Calculator only needs amount/rate/term — a different field set from
// every Health tool, so this is its own small, self-contained validation
// error type rather than reusing any existing union (CLAUDE.md Section 5).
export type LoanValidationError =
  | 'LOAN_AMOUNT_REQUIRED'
  | 'LOAN_AMOUNT_NOT_A_NUMBER'
  | 'LOAN_AMOUNT_NOT_POSITIVE'
  | 'LOAN_AMOUNT_OUT_OF_RANGE'
  | 'INTEREST_RATE_REQUIRED'
  | 'INTEREST_RATE_NOT_A_NUMBER'
  | 'INTEREST_RATE_NEGATIVE'
  | 'INTEREST_RATE_OUT_OF_RANGE'
  | 'LOAN_TERM_REQUIRED'
  | 'LOAN_TERM_NOT_A_NUMBER'
  | 'LOAN_TERM_NOT_POSITIVE'
  | 'LOAN_TERM_NOT_WHOLE_NUMBER'
  | 'LOAN_TERM_OUT_OF_RANGE';
