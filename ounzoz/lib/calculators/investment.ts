import type { InvestmentResult, InvestmentValidationError } from '@/types/investment';

// Sanity bounds — not a promise about what any real brokerage/fund
// offers, just wide enough to cover realistic investing scenarios while
// catching fat-fingered input (CLAUDE.md Section 8). The expected-return
// ceiling (30%) is deliberately wider than Savings Calculator's 0–20%
// APY bound: equity-market return assumptions realistically span a much
// wider range than a bank savings APY, so the bound itself is part of
// this tool's framing, not a copy-paste leftover.
const MIN_INITIAL_INVESTMENT = 0;
const MAX_INITIAL_INVESTMENT = 10_000_000;
const MIN_MONTHLY_CONTRIBUTION = 0;
const MAX_MONTHLY_CONTRIBUTION = 100_000;
const MIN_RETURN_RATE = 0;
const MAX_RETURN_RATE = 30;
const MIN_YEARS = 1;
const MAX_YEARS = 50;

/**
 * Calculates the projected future value of an initial investment plus a
 * fixed monthly contribution, growing at a given expected annual return
 * compounded monthly.
 *
 * Formula: the standard future-value-of-an-ordinary-annuity-plus-lump-sum
 * formula —
 *
 *   FV = P × (1+i)^n + PMT × [((1+i)^n − 1) / i]
 *
 * where P = initial investment, PMT = monthly contribution (credited at
 * the end of each month — an "ordinary annuity"), i = monthly rate
 * (annual expected return ÷ 12), n = number of months (years × 12). Same
 * formula shape as Savings Calculator, implemented independently here
 * (CLAUDE.md Section 5 — Tool Independence: no cross-tool imports) since
 * this models expected investment returns rather than a savings-account
 * APY. Compounding is fixed at monthly (not selectable) for the same
 * reason Savings Calculator fixes it — pairing a selectable compounding
 * frequency with a fixed monthly contribution creates a genuine
 * period-mismatch ambiguity.
 *
 * Special case i = 0: FV = P + PMT × n (avoids division by zero in the
 * annuity term, and is the correct limit of the formula as i → 0).
 *
 * This function does not assume or embed any particular "expected"
 * market return — the rate is entirely user-supplied. See faq-content.ts
 * for why no historical benchmark figure is suggested anywhere on this
 * tool's page (SEO.md Section 5 / CLAUDE.md's rule against unverifiable
 * or fabricated claims, and this being YMYL content per PROJECT.md
 * Section 5).
 *
 * Pure function (CLAUDE.md Section 6). Assumes inputs already passed
 * validation; still range-checks defensively and throws RangeError
 * rather than ever producing NaN/Infinity (CLAUDE.md Section 8).
 *
 * @param initialInvestment - starting lump-sum investment (0 or more)
 * @param monthlyContribution - fixed amount added at the end of each month (0 or more)
 * @param annualReturnPercent - expected annual return as a percentage (e.g. 7 for 7%)
 * @param years - number of years to project, whole years
 * @returns final projected balance, rounded to the nearest cent
 */
export function calculateProjectedBalance(
  initialInvestment: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  years: number,
): number {
  if (!Number.isFinite(initialInvestment) || initialInvestment < 0) {
    throw new RangeError('initialInvestment must be a non-negative finite number');
  }
  if (!Number.isFinite(monthlyContribution) || monthlyContribution < 0) {
    throw new RangeError('monthlyContribution must be a non-negative finite number');
  }
  if (initialInvestment === 0 && monthlyContribution === 0) {
    throw new RangeError('initialInvestment and monthlyContribution cannot both be zero');
  }
  if (!Number.isFinite(annualReturnPercent) || annualReturnPercent < 0) {
    throw new RangeError('annualReturnPercent must be a non-negative finite number');
  }
  if (!Number.isFinite(years) || years <= 0) {
    throw new RangeError('years must be a positive finite number');
  }

  const monthlyRate = annualReturnPercent / 100 / 12;
  const numberOfMonths = years * 12;
  const growth = Math.pow(1 + monthlyRate, numberOfMonths);

  const finalBalance =
    monthlyRate === 0
      ? initialInvestment + monthlyContribution * numberOfMonths
      : initialInvestment * growth +
        monthlyContribution * ((growth - 1) / monthlyRate);

  return Math.round(finalBalance * 100) / 100;
}

/**
 * Runs the full calculation and returns the final balance alongside the
 * contributions/growth breakdown, so the result panel can show how the
 * number was built (same "show the components" pattern as Savings
 * Calculator showing total contributions/interest earned).
 */
export function getInvestmentResult(
  initialInvestment: number,
  monthlyContribution: number,
  annualReturnPercent: number,
  years: number,
): InvestmentResult {
  const finalBalance = calculateProjectedBalance(
    initialInvestment,
    monthlyContribution,
    annualReturnPercent,
    years,
  );
  const totalContributions =
    Math.round((initialInvestment + monthlyContribution * years * 12) * 100) / 100;
  const estimatedGrowth = Math.round((finalBalance - totalContributions) * 100) / 100;

  return { finalBalance, totalContributions, estimatedGrowth };
}

// --- Validation ---

/** Shared shape for the two optional, empty-ok fields (initial investment, monthly contribution) — same convention as Savings Calculator's optional deposit/contribution inputs. */
function validateOptionalNonNegativeInput(
  raw: string,
  max: number,
  errors: {
    notANumber: InvestmentValidationError;
    negative: InvestmentValidationError;
    outOfRange: InvestmentValidationError;
  },
): InvestmentValidationError | null {
  const trimmed = raw.trim();
  if (trimmed === '') return null;

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return errors.notANumber;
  if (value < 0) return errors.negative;
  if (value > max) return errors.outOfRange;
  return null;
}

export function validateInitialInvestmentInput(
  initialInvestmentRaw: string,
): InvestmentValidationError | null {
  return validateOptionalNonNegativeInput(
    initialInvestmentRaw,
    MAX_INITIAL_INVESTMENT,
    {
      notANumber: 'INITIAL_INVESTMENT_NOT_A_NUMBER',
      negative: 'INITIAL_INVESTMENT_NEGATIVE',
      outOfRange: 'INITIAL_INVESTMENT_OUT_OF_RANGE',
    },
  );
}

export function validateMonthlyContributionInput(
  monthlyContributionRaw: string,
): InvestmentValidationError | null {
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

export function validateReturnRateInput(
  rateRaw: string,
): InvestmentValidationError | null {
  const trimmed = rateRaw.trim();
  if (trimmed === '') return 'RETURN_RATE_REQUIRED';

  const rate = Number(trimmed);
  if (!Number.isFinite(rate)) return 'RETURN_RATE_NOT_A_NUMBER';
  if (rate < 0) return 'RETURN_RATE_NEGATIVE';
  if (rate < MIN_RETURN_RATE || rate > MAX_RETURN_RATE) {
    return 'RETURN_RATE_OUT_OF_RANGE';
  }
  return null;
}

export function validateYearsInput(
  yearsRaw: string,
): InvestmentValidationError | null {
  const trimmed = yearsRaw.trim();
  if (trimmed === '') return 'YEARS_REQUIRED';

  const years = Number(trimmed);
  if (!Number.isFinite(years)) return 'YEARS_NOT_A_NUMBER';
  if (years <= 0) return 'YEARS_NOT_POSITIVE';
  if (!Number.isInteger(years)) return 'YEARS_NOT_WHOLE_NUMBER';
  if (years < MIN_YEARS || years > MAX_YEARS) return 'YEARS_OUT_OF_RANGE';
  return null;
}

export function validateInvestmentInputs(
  initialInvestmentRaw: string,
  monthlyContributionRaw: string,
  rateRaw: string,
  yearsRaw: string,
): {
  initialInvestmentError: InvestmentValidationError | null;
  monthlyContributionError: InvestmentValidationError | null;
  rateError: InvestmentValidationError | null;
  yearsError: InvestmentValidationError | null;
} {
  const initialInvestmentError = validateInitialInvestmentInput(
    initialInvestmentRaw,
  );
  const monthlyContributionError = validateMonthlyContributionInput(
    monthlyContributionRaw,
  );

  // Cross-field check: only meaningful once both fields are individually
  // valid — otherwise each field already carries its own specific error.
  if (!initialInvestmentError && !monthlyContributionError) {
    const investment = Number(initialInvestmentRaw.trim() || '0');
    const contribution = Number(monthlyContributionRaw.trim() || '0');
    if (investment === 0 && contribution === 0) {
      return {
        initialInvestmentError: null,
        monthlyContributionError: 'NOTHING_TO_CALCULATE',
        rateError: validateReturnRateInput(rateRaw),
        yearsError: validateYearsInput(yearsRaw),
      };
    }
  }

  return {
    initialInvestmentError,
    monthlyContributionError,
    rateError: validateReturnRateInput(rateRaw),
    yearsError: validateYearsInput(yearsRaw),
  };
}

export const INVESTMENT_INPUT_BOUNDS = {
  MIN_INITIAL_INVESTMENT,
  MAX_INITIAL_INVESTMENT,
  MIN_MONTHLY_CONTRIBUTION,
  MAX_MONTHLY_CONTRIBUTION,
  MIN_RETURN_RATE,
  MAX_RETURN_RATE,
  MIN_YEARS,
  MAX_YEARS,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const INVESTMENT_VALIDATION_MESSAGES: Record<
  InvestmentValidationError,
  string
> = {
  INITIAL_INVESTMENT_NOT_A_NUMBER: 'Initial investment must be a number.',
  INITIAL_INVESTMENT_NEGATIVE: 'Initial investment cannot be negative.',
  INITIAL_INVESTMENT_OUT_OF_RANGE: `Enter an initial investment up to ${MAX_INITIAL_INVESTMENT.toLocaleString('en-US')}.`,
  MONTHLY_CONTRIBUTION_NOT_A_NUMBER: 'Monthly contribution must be a number.',
  MONTHLY_CONTRIBUTION_NEGATIVE: 'Monthly contribution cannot be negative.',
  MONTHLY_CONTRIBUTION_OUT_OF_RANGE: `Enter a monthly contribution up to ${MAX_MONTHLY_CONTRIBUTION.toLocaleString('en-US')}.`,
  NOTHING_TO_CALCULATE:
    'Enter an initial investment or a monthly contribution (or both) to project your investment growth.',
  RETURN_RATE_REQUIRED:
    'Enter your expected annual return to project your investment growth.',
  RETURN_RATE_NOT_A_NUMBER: 'Expected annual return must be a number.',
  RETURN_RATE_NEGATIVE: 'Expected annual return cannot be negative.',
  RETURN_RATE_OUT_OF_RANGE: `Enter an expected annual return between ${MIN_RETURN_RATE}% and ${MAX_RETURN_RATE}%.`,
  YEARS_REQUIRED: 'Enter the number of years to project your investment growth.',
  YEARS_NOT_A_NUMBER: 'Years must be a number.',
  YEARS_NOT_POSITIVE: 'Years must be greater than zero.',
  YEARS_NOT_WHOLE_NUMBER: 'Years must be a whole number.',
  YEARS_OUT_OF_RANGE: `Enter a number of years between ${MIN_YEARS} and ${MAX_YEARS}.`,
};
