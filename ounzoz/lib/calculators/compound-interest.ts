import type {
  CompoundInterestResult,
  CompoundInterestValidationError,
  CompoundingFrequency,
} from '@/types/compound-interest';

// Sanity bounds — wide enough to cover any realistic compound-interest
// scenario while catching fat-fingered input before it reaches the
// calculation (CLAUDE.md Section 8). Same $1–$10,000,000 principal
// ceiling convention as Loan Calculator's amount bounds.
const MIN_PRINCIPAL = 1;
const MAX_PRINCIPAL = 10_000_000;
const MIN_INTEREST_RATE = 0;
const MAX_INTEREST_RATE = 50;
const MIN_YEARS = 1;
const MAX_YEARS = 50;

// Compounding periods per year for each selectable frequency — this is
// the tool's one distinguishing, educational feature (PROJECT.md Section
// 7 differentiates Compound Interest from Savings/Investment on exactly
// this: a pure lump-sum formula with frequency as the variable being
// demonstrated).
const COMPOUNDING_PERIODS_PER_YEAR: Record<CompoundingFrequency, number> = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

export const COMPOUNDING_FREQUENCY_LABELS: Record<CompoundingFrequency, string> = {
  annually: 'Annually',
  semiannually: 'Semi-annually',
  quarterly: 'Quarterly',
  monthly: 'Monthly',
  daily: 'Daily',
};

/**
 * Calculates the final balance of a lump-sum principal under compound
 * interest.
 *
 * Formula: the standard compound interest formula —
 *
 *   A = P × (1 + r/n)^(n×t)
 *
 * where P = principal, r = annual interest rate (as a decimal), n =
 * compounding periods per year, t = years. Unlike Loan/Mortgage's
 * amortization formula, there's no divide-by-zero case to special-case
 * at 0% — the formula already resolves correctly to A = P when r = 0.
 *
 * Pure function (CLAUDE.md Section 6): deterministic, no I/O, no
 * DOM/React state. Assumes inputs already passed validation; still
 * range-checks defensively and throws RangeError rather than ever
 * producing NaN/Infinity (CLAUDE.md Section 8).
 *
 * @param principal - starting lump-sum amount
 * @param annualRatePercent - annual interest rate as a percentage (e.g. 5 for 5%)
 * @param frequency - how often interest compounds per year
 * @param years - number of years to grow, whole years
 * @returns final balance, rounded to the nearest cent
 */
export function calculateFinalBalance(
  principal: number,
  annualRatePercent: number,
  frequency: CompoundingFrequency,
  years: number,
): number {
  if (!Number.isFinite(principal) || principal <= 0) {
    throw new RangeError('principal must be a positive finite number');
  }
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) {
    throw new RangeError('annualRatePercent must be a non-negative finite number');
  }
  if (!Number.isFinite(years) || years <= 0) {
    throw new RangeError('years must be a positive finite number');
  }
  const periodsPerYear = COMPOUNDING_PERIODS_PER_YEAR[frequency];
  if (!Number.isFinite(periodsPerYear)) {
    throw new RangeError('frequency must be a recognized CompoundingFrequency');
  }

  const rate = annualRatePercent / 100;
  const finalBalance =
    principal * Math.pow(1 + rate / periodsPerYear, periodsPerYear * years);

  return Math.round(finalBalance * 100) / 100;
}

/**
 * Runs the full calculation and returns the final balance alongside the
 * interest-earned breakdown, so the result panel can show how the number
 * was built (same "show the components" pattern as Loan Calculator
 * showing total interest/total paid).
 */
export function getCompoundInterestResult(
  principal: number,
  annualRatePercent: number,
  frequency: CompoundingFrequency,
  years: number,
): CompoundInterestResult {
  const finalBalance = calculateFinalBalance(
    principal,
    annualRatePercent,
    frequency,
    years,
  );
  const interestEarned = Math.round((finalBalance - principal) * 100) / 100;

  return { finalBalance, interestEarned };
}

// --- Validation ---

export function validatePrincipalInput(
  principalRaw: string,
): CompoundInterestValidationError | null {
  const trimmed = principalRaw.trim();
  if (trimmed === '') return 'PRINCIPAL_REQUIRED';

  const principal = Number(trimmed);
  if (!Number.isFinite(principal)) return 'PRINCIPAL_NOT_A_NUMBER';
  if (principal <= 0) return 'PRINCIPAL_NOT_POSITIVE';
  if (principal < MIN_PRINCIPAL || principal > MAX_PRINCIPAL) {
    return 'PRINCIPAL_OUT_OF_RANGE';
  }
  return null;
}

export function validateInterestRateInput(
  rateRaw: string,
): CompoundInterestValidationError | null {
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

export function validateFrequencyInput(
  frequency: CompoundingFrequency | null,
): CompoundInterestValidationError | null {
  if (!frequency) return 'FREQUENCY_REQUIRED';
  return null;
}

export function validateYearsInput(
  yearsRaw: string,
): CompoundInterestValidationError | null {
  const trimmed = yearsRaw.trim();
  if (trimmed === '') return 'YEARS_REQUIRED';

  const years = Number(trimmed);
  if (!Number.isFinite(years)) return 'YEARS_NOT_A_NUMBER';
  if (years <= 0) return 'YEARS_NOT_POSITIVE';
  if (!Number.isInteger(years)) return 'YEARS_NOT_WHOLE_NUMBER';
  if (years < MIN_YEARS || years > MAX_YEARS) return 'YEARS_OUT_OF_RANGE';
  return null;
}

export function validateCompoundInterestInputs(
  principalRaw: string,
  rateRaw: string,
  frequency: CompoundingFrequency | null,
  yearsRaw: string,
): {
  principalError: CompoundInterestValidationError | null;
  rateError: CompoundInterestValidationError | null;
  frequencyError: CompoundInterestValidationError | null;
  yearsError: CompoundInterestValidationError | null;
} {
  return {
    principalError: validatePrincipalInput(principalRaw),
    rateError: validateInterestRateInput(rateRaw),
    frequencyError: validateFrequencyInput(frequency),
    yearsError: validateYearsInput(yearsRaw),
  };
}

export const COMPOUND_INTEREST_INPUT_BOUNDS = {
  MIN_PRINCIPAL,
  MAX_PRINCIPAL,
  MIN_INTEREST_RATE,
  MAX_INTEREST_RATE,
  MIN_YEARS,
  MAX_YEARS,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const COMPOUND_INTEREST_VALIDATION_MESSAGES: Record<
  CompoundInterestValidationError,
  string
> = {
  PRINCIPAL_REQUIRED: 'Enter your starting amount to see how it grows.',
  PRINCIPAL_NOT_A_NUMBER: 'Starting amount must be a number.',
  PRINCIPAL_NOT_POSITIVE: 'Starting amount must be greater than zero.',
  PRINCIPAL_OUT_OF_RANGE: `Enter a starting amount between ${MIN_PRINCIPAL.toLocaleString('en-US')} and ${MAX_PRINCIPAL.toLocaleString('en-US')}.`,
  INTEREST_RATE_REQUIRED: 'Enter the annual interest rate to see how it grows.',
  INTEREST_RATE_NOT_A_NUMBER: 'Interest rate must be a number.',
  INTEREST_RATE_NEGATIVE: 'Interest rate cannot be negative.',
  INTEREST_RATE_OUT_OF_RANGE: `Enter an interest rate between ${MIN_INTEREST_RATE}% and ${MAX_INTEREST_RATE}%.`,
  FREQUENCY_REQUIRED: 'Select how often interest compounds.',
  YEARS_REQUIRED: 'Enter the number of years to see how it grows.',
  YEARS_NOT_A_NUMBER: 'Years must be a number.',
  YEARS_NOT_POSITIVE: 'Years must be greater than zero.',
  YEARS_NOT_WHOLE_NUMBER: 'Years must be a whole number.',
  YEARS_OUT_OF_RANGE: `Enter a number of years between ${MIN_YEARS} and ${MAX_YEARS}.`,
};
