import type { SavingsResult, SavingsValidationError } from '@/types/savings';

// Sanity bounds — not a promise about what any real bank offers, just
// wide enough to cover realistic savings scenarios while catching
// fat-fingered input (CLAUDE.md Section 8). The interest-rate ceiling
// (20%) is deliberately narrower than Compound Interest Calculator's
// general-purpose 0–50% range: this tool models a savings-account-style
// APY specifically, not an arbitrary hypothetical rate, so the bound
// itself is part of the tool's framing, not a copy-paste leftover.
const MIN_INITIAL_DEPOSIT = 0;
const MAX_INITIAL_DEPOSIT = 10_000_000;
const MIN_MONTHLY_CONTRIBUTION = 0;
const MAX_MONTHLY_CONTRIBUTION = 50_000;
const MIN_INTEREST_RATE = 0;
const MAX_INTEREST_RATE = 20;
const MIN_YEARS = 1;
const MAX_YEARS = 50;

/**
 * Calculates the future value of an initial deposit plus a fixed monthly
 * contribution, growing at a given annual rate compounded monthly.
 *
 * Formula: the standard future-value-of-an-ordinary-annuity-plus-lump-sum
 * formula —
 *
 *   FV = P × (1+i)^n + PMT × [((1+i)^n − 1) / i]
 *
 * where P = initial deposit, PMT = monthly contribution (credited at the
 * end of each month — an "ordinary annuity"), i = monthly rate (annual
 * rate ÷ 12), n = number of months (years × 12). Compounding is fixed at
 * monthly rather than selectable (unlike Compound Interest Calculator) —
 * pairing a selectable compounding frequency with a fixed monthly
 * contribution would create a genuine period-mismatch ambiguity (e.g.
 * what does a $100 "monthly" contribution mean under quarterly
 * compounding?), so monthly-compounding is fixed specifically to keep
 * the math and UX unambiguous. Deliberately not imported from any other
 * calculator — CLAUDE.md Section 5 (Tool Independence).
 *
 * Special case i = 0: FV = P + PMT × n (avoids division by zero in the
 * annuity term, and is the correct limit of the formula as i → 0).
 *
 * Pure function (CLAUDE.md Section 6). Assumes inputs already passed
 * validation; still range-checks defensively and throws RangeError
 * rather than ever producing NaN/Infinity (CLAUDE.md Section 8).
 *
 * @param initialDeposit - starting lump-sum deposit (0 or more)
 * @param monthlyContribution - fixed amount added at the end of each month (0 or more)
 * @param annualRatePercent - annual interest rate as a percentage (e.g. 5 for 5%)
 * @param years - number of years to grow, whole years
 * @returns final balance, rounded to the nearest cent
 */
export function calculateFinalBalance(
  initialDeposit: number,
  monthlyContribution: number,
  annualRatePercent: number,
  years: number,
): number {
  if (!Number.isFinite(initialDeposit) || initialDeposit < 0) {
    throw new RangeError('initialDeposit must be a non-negative finite number');
  }
  if (!Number.isFinite(monthlyContribution) || monthlyContribution < 0) {
    throw new RangeError('monthlyContribution must be a non-negative finite number');
  }
  if (initialDeposit === 0 && monthlyContribution === 0) {
    throw new RangeError('initialDeposit and monthlyContribution cannot both be zero');
  }
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) {
    throw new RangeError('annualRatePercent must be a non-negative finite number');
  }
  if (!Number.isFinite(years) || years <= 0) {
    throw new RangeError('years must be a positive finite number');
  }

  const monthlyRate = annualRatePercent / 100 / 12;
  const numberOfMonths = years * 12;
  const growth = Math.pow(1 + monthlyRate, numberOfMonths);

  const finalBalance =
    monthlyRate === 0
      ? initialDeposit + monthlyContribution * numberOfMonths
      : initialDeposit * growth + monthlyContribution * ((growth - 1) / monthlyRate);

  return Math.round(finalBalance * 100) / 100;
}

/**
 * Runs the full calculation and returns the final balance alongside the
 * contributions/interest breakdown, so the result panel can show how the
 * number was built (same "show the components" pattern as Loan Calculator
 * showing total interest/total paid).
 */
export function getSavingsResult(
  initialDeposit: number,
  monthlyContribution: number,
  annualRatePercent: number,
  years: number,
): SavingsResult {
  const finalBalance = calculateFinalBalance(
    initialDeposit,
    monthlyContribution,
    annualRatePercent,
    years,
  );
  const totalContributions =
    Math.round((initialDeposit + monthlyContribution * years * 12) * 100) / 100;
  const interestEarned = Math.round((finalBalance - totalContributions) * 100) / 100;

  return { finalBalance, totalContributions, interestEarned };
}

// --- Validation ---

/** Shared shape for the two optional, empty-ok fields (initial deposit, monthly contribution) — same convention as Mortgage's optional escrow inputs. */
function validateOptionalNonNegativeInput(
  raw: string,
  max: number,
  errors: {
    notANumber: SavingsValidationError;
    negative: SavingsValidationError;
    outOfRange: SavingsValidationError;
  },
): SavingsValidationError | null {
  const trimmed = raw.trim();
  if (trimmed === '') return null;

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return errors.notANumber;
  if (value < 0) return errors.negative;
  if (value > max) return errors.outOfRange;
  return null;
}

export function validateInitialDepositInput(
  initialDepositRaw: string,
): SavingsValidationError | null {
  return validateOptionalNonNegativeInput(initialDepositRaw, MAX_INITIAL_DEPOSIT, {
    notANumber: 'INITIAL_DEPOSIT_NOT_A_NUMBER',
    negative: 'INITIAL_DEPOSIT_NEGATIVE',
    outOfRange: 'INITIAL_DEPOSIT_OUT_OF_RANGE',
  });
}

export function validateMonthlyContributionInput(
  monthlyContributionRaw: string,
): SavingsValidationError | null {
  return validateOptionalNonNegativeInput(
    monthlyContributionRaw,
    MAX_MONTHLY_CONTRIBUTION,
    {
      notANumber: 'MONTHLY_CONTRIBUTION_NOT_A_NUMBER',
      negative: 'MONTHLY_CONTRIBUTION_NEGATIVE',
      outOfRange: 'MONTHLY_CONTRIBUTION_OUT_OF_RANGE',
    },
  );
}

export function validateInterestRateInput(
  rateRaw: string,
): SavingsValidationError | null {
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

export function validateYearsInput(
  yearsRaw: string,
): SavingsValidationError | null {
  const trimmed = yearsRaw.trim();
  if (trimmed === '') return 'YEARS_REQUIRED';

  const years = Number(trimmed);
  if (!Number.isFinite(years)) return 'YEARS_NOT_A_NUMBER';
  if (years <= 0) return 'YEARS_NOT_POSITIVE';
  if (!Number.isInteger(years)) return 'YEARS_NOT_WHOLE_NUMBER';
  if (years < MIN_YEARS || years > MAX_YEARS) return 'YEARS_OUT_OF_RANGE';
  return null;
}

export function validateSavingsInputs(
  initialDepositRaw: string,
  monthlyContributionRaw: string,
  rateRaw: string,
  yearsRaw: string,
): {
  initialDepositError: SavingsValidationError | null;
  monthlyContributionError: SavingsValidationError | null;
  rateError: SavingsValidationError | null;
  yearsError: SavingsValidationError | null;
} {
  const initialDepositError = validateInitialDepositInput(initialDepositRaw);
  const monthlyContributionError = validateMonthlyContributionInput(
    monthlyContributionRaw,
  );

  // Cross-field check: only meaningful once both fields are individually
  // valid — otherwise each field already carries its own specific error.
  if (!initialDepositError && !monthlyContributionError) {
    const deposit = Number(initialDepositRaw.trim() || '0');
    const contribution = Number(monthlyContributionRaw.trim() || '0');
    if (deposit === 0 && contribution === 0) {
      return {
        initialDepositError: null,
        monthlyContributionError: 'NOTHING_TO_CALCULATE',
        rateError: validateInterestRateInput(rateRaw),
        yearsError: validateYearsInput(yearsRaw),
      };
    }
  }

  return {
    initialDepositError,
    monthlyContributionError,
    rateError: validateInterestRateInput(rateRaw),
    yearsError: validateYearsInput(yearsRaw),
  };
}

export const SAVINGS_INPUT_BOUNDS = {
  MIN_INITIAL_DEPOSIT,
  MAX_INITIAL_DEPOSIT,
  MIN_MONTHLY_CONTRIBUTION,
  MAX_MONTHLY_CONTRIBUTION,
  MIN_INTEREST_RATE,
  MAX_INTEREST_RATE,
  MIN_YEARS,
  MAX_YEARS,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const SAVINGS_VALIDATION_MESSAGES: Record<SavingsValidationError, string> = {
  INITIAL_DEPOSIT_NOT_A_NUMBER: 'Initial deposit must be a number.',
  INITIAL_DEPOSIT_NEGATIVE: 'Initial deposit cannot be negative.',
  INITIAL_DEPOSIT_OUT_OF_RANGE: `Enter an initial deposit up to ${MAX_INITIAL_DEPOSIT.toLocaleString('en-US')}.`,
  MONTHLY_CONTRIBUTION_NOT_A_NUMBER: 'Monthly contribution must be a number.',
  MONTHLY_CONTRIBUTION_NEGATIVE: 'Monthly contribution cannot be negative.',
  MONTHLY_CONTRIBUTION_OUT_OF_RANGE: `Enter a monthly contribution up to ${MAX_MONTHLY_CONTRIBUTION.toLocaleString('en-US')}.`,
  NOTHING_TO_CALCULATE:
    'Enter an initial deposit or a monthly contribution (or both) to calculate your savings growth.',
  INTEREST_RATE_REQUIRED: 'Enter the annual interest rate (APY) to calculate your savings growth.',
  INTEREST_RATE_NOT_A_NUMBER: 'Interest rate must be a number.',
  INTEREST_RATE_NEGATIVE: 'Interest rate cannot be negative.',
  INTEREST_RATE_OUT_OF_RANGE: `Enter an interest rate between ${MIN_INTEREST_RATE}% and ${MAX_INTEREST_RATE}%.`,
  YEARS_REQUIRED: 'Enter the number of years to calculate your savings growth.',
  YEARS_NOT_A_NUMBER: 'Years must be a number.',
  YEARS_NOT_POSITIVE: 'Years must be greater than zero.',
  YEARS_NOT_WHOLE_NUMBER: 'Years must be a whole number.',
  YEARS_OUT_OF_RANGE: `Enter a number of years between ${MIN_YEARS} and ${MAX_YEARS}.`,
};
