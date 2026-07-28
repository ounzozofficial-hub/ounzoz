import type { LoanResult, LoanValidationError } from '@/types/loan';

// Sanity bounds — not a lender's actual underwriting limits, just wide
// enough to cover every realistic personal/auto/personal-finance loan
// while catching fat-fingered input before it reaches the calculation
// (CLAUDE.md Section 8). Mortgage-scale amounts get their own, wider
// bounds on the Mortgage Calculator rather than stretching this tool's
// range to cover both use cases.
const MIN_LOAN_AMOUNT = 500;
const MAX_LOAN_AMOUNT = 10_000_000;
const MIN_INTEREST_RATE = 0;
const MAX_INTEREST_RATE = 40;
const MIN_TERM_YEARS = 1;
const MAX_TERM_YEARS = 40;

/**
 * Calculates the fixed monthly payment for a fully-amortizing loan.
 *
 * Formula: the standard loan amortization formula used across mainstream
 * lending/finance calculators —
 *
 *   M = P × [r(1+r)^n] / [(1+r)^n − 1]
 *
 * where P = principal, r = monthly interest rate (annual rate ÷ 12),
 * n = number of monthly payments (years × 12). When the annual rate is
 * 0%, the formula's denominator would be 0, so the payment is simply
 * P / n (a 0% promotional loan is a real, valid case — not an error).
 *
 * Pure function (CLAUDE.md Section 6): deterministic, no I/O, no
 * DOM/React state. Assumes inputs already passed validation; still
 * range-checks defensively and throws RangeError rather than ever
 * producing NaN/Infinity (CLAUDE.md Section 8).
 *
 * @param principal - loan amount
 * @param annualRatePercent - annual interest rate as a percentage (e.g. 6 for 6%)
 * @param termYears - loan term in whole years
 * @returns monthly payment, rounded to the nearest cent
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  termYears: number,
): number {
  if (!Number.isFinite(principal) || principal <= 0) {
    throw new RangeError('principal must be a positive finite number');
  }
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) {
    throw new RangeError('annualRatePercent must be a non-negative finite number');
  }
  if (!Number.isFinite(termYears) || termYears <= 0) {
    throw new RangeError('termYears must be a positive finite number');
  }

  const monthlyRate = annualRatePercent / 100 / 12;
  const numberOfPayments = termYears * 12;

  const monthlyPayment =
    monthlyRate === 0
      ? principal / numberOfPayments
      : (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return Math.round(monthlyPayment * 100) / 100;
}

/**
 * Runs the full calculation and returns the monthly payment alongside the
 * total-paid/total-interest breakdown, so the result panel can show how
 * the number was built (same "show the components" pattern as Water
 * Intake showing baseline + activity bonus).
 */
export function getLoanResult(
  principal: number,
  annualRatePercent: number,
  termYears: number,
): LoanResult {
  const monthlyPayment = calculateMonthlyPayment(
    principal,
    annualRatePercent,
    termYears,
  );
  const numberOfPayments = termYears * 12;
  const totalPaid = Math.round(monthlyPayment * numberOfPayments * 100) / 100;
  const totalInterest = Math.round((totalPaid - principal) * 100) / 100;

  return { monthlyPayment, totalPaid, totalInterest };
}

// --- Validation ---

export function validateLoanAmountInput(
  amountRaw: string,
): LoanValidationError | null {
  const trimmed = amountRaw.trim();
  if (trimmed === '') return 'LOAN_AMOUNT_REQUIRED';

  const amount = Number(trimmed);
  if (!Number.isFinite(amount)) return 'LOAN_AMOUNT_NOT_A_NUMBER';
  if (amount <= 0) return 'LOAN_AMOUNT_NOT_POSITIVE';
  if (amount < MIN_LOAN_AMOUNT || amount > MAX_LOAN_AMOUNT) {
    return 'LOAN_AMOUNT_OUT_OF_RANGE';
  }
  return null;
}

export function validateInterestRateInput(
  rateRaw: string,
): LoanValidationError | null {
  const trimmed = rateRaw.trim();
  if (trimmed === '') return 'INTEREST_RATE_REQUIRED';

  const rate = Number(trimmed);
  if (!Number.isFinite(rate)) return 'INTEREST_RATE_NOT_A_NUMBER';
  if (rate < 0) return 'INTEREST_RATE_NEGATIVE';
  if (rate < MIN_INTEREST_RATE || rate > MAX_INTEREST_RATE) {
    return 'INTEREST_RATE_OUT_OF_RANGE';
  }
  return null;
}

export function validateLoanTermInput(
  termRaw: string,
): LoanValidationError | null {
  const trimmed = termRaw.trim();
  if (trimmed === '') return 'LOAN_TERM_REQUIRED';

  const term = Number(trimmed);
  if (!Number.isFinite(term)) return 'LOAN_TERM_NOT_A_NUMBER';
  if (term <= 0) return 'LOAN_TERM_NOT_POSITIVE';
  if (!Number.isInteger(term)) return 'LOAN_TERM_NOT_WHOLE_NUMBER';
  if (term < MIN_TERM_YEARS || term > MAX_TERM_YEARS) {
    return 'LOAN_TERM_OUT_OF_RANGE';
  }
  return null;
}

export function validateLoanInputs(
  amountRaw: string,
  rateRaw: string,
  termRaw: string,
): {
  amountError: LoanValidationError | null;
  rateError: LoanValidationError | null;
  termError: LoanValidationError | null;
} {
  return {
    amountError: validateLoanAmountInput(amountRaw),
    rateError: validateInterestRateInput(rateRaw),
    termError: validateLoanTermInput(termRaw),
  };
}

export const LOAN_INPUT_BOUNDS = {
  MIN_LOAN_AMOUNT,
  MAX_LOAN_AMOUNT,
  MIN_INTEREST_RATE,
  MAX_INTEREST_RATE,
  MIN_TERM_YEARS,
  MAX_TERM_YEARS,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const LOAN_VALIDATION_MESSAGES: Record<LoanValidationError, string> = {
  LOAN_AMOUNT_REQUIRED: 'Enter the loan amount to calculate your payment.',
  LOAN_AMOUNT_NOT_A_NUMBER: 'Loan amount must be a number.',
  LOAN_AMOUNT_NOT_POSITIVE: 'Loan amount must be greater than zero.',
  LOAN_AMOUNT_OUT_OF_RANGE: `Enter a loan amount between ${MIN_LOAN_AMOUNT.toLocaleString('en-US')} and ${MAX_LOAN_AMOUNT.toLocaleString('en-US')}.`,
  INTEREST_RATE_REQUIRED: 'Enter the annual interest rate to calculate your payment.',
  INTEREST_RATE_NOT_A_NUMBER: 'Interest rate must be a number.',
  INTEREST_RATE_NEGATIVE: 'Interest rate cannot be negative.',
  INTEREST_RATE_OUT_OF_RANGE: `Enter an interest rate between ${MIN_INTEREST_RATE}% and ${MAX_INTEREST_RATE}%.`,
  LOAN_TERM_REQUIRED: 'Enter the loan term to calculate your payment.',
  LOAN_TERM_NOT_A_NUMBER: 'Loan term must be a number.',
  LOAN_TERM_NOT_POSITIVE: 'Loan term must be greater than zero.',
  LOAN_TERM_NOT_WHOLE_NUMBER: 'Loan term must be a whole number of years.',
  LOAN_TERM_OUT_OF_RANGE: `Enter a loan term between ${MIN_TERM_YEARS} and ${MAX_TERM_YEARS} years.`,
};
