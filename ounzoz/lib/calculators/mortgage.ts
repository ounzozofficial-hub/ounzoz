import type { MortgageResult, MortgageValidationError } from '@/types/mortgage';

// Sanity bounds — not underwriting limits, just wide enough to cover
// realistic residential mortgages while catching fat-fingered input
// before it reaches the calculation (CLAUDE.md Section 8). Deliberately
// separate from LOAN_INPUT_BOUNDS in lib/calculators/loan.ts (CLAUDE.md
// Section 5, Tool Independence) — mortgage-scale home prices need a
// wider range than Loan Calculator's personal/auto-loan bounds.
const MIN_HOME_PRICE = 10_000;
const MAX_HOME_PRICE = 20_000_000;
const MIN_INTEREST_RATE = 0;
const MAX_INTEREST_RATE = 40;
const MIN_TERM_YEARS = 1;
const MAX_TERM_YEARS = 40;
const MAX_ANNUAL_PROPERTY_TAX = 1_000_000;
const MAX_ANNUAL_HOME_INSURANCE = 1_000_000;
const MAX_MONTHLY_HOA = 20_000;

/**
 * Calculates the fixed monthly principal & interest payment for a
 * fully-amortizing mortgage.
 *
 * Formula: the same standard loan amortization formula used across
 * mainstream mortgage calculators —
 *
 *   M = P × [r(1+r)^n] / [(1+r)^n − 1]
 *
 * where P = principal (home price − down payment), r = monthly interest
 * rate (annual rate ÷ 12), n = number of monthly payments (years × 12).
 * When the annual rate is 0%, the payment is simply P / n.
 *
 * Deliberately not imported from lib/calculators/loan.ts even though the
 * formula is identical — CLAUDE.md Section 5 (Tool Independence): no
 * cross-tool imports, deleting one tool's folder must never affect
 * another's. A small amount of duplication is the expected, preferred
 * tradeoff.
 *
 * Pure function (CLAUDE.md Section 6). Assumes inputs already passed
 * validation; still range-checks defensively and throws RangeError
 * rather than ever producing NaN/Infinity (CLAUDE.md Section 8).
 *
 * @param principal - loan principal (home price minus down payment)
 * @param annualRatePercent - annual interest rate as a percentage (e.g. 6 for 6%)
 * @param termYears - loan term in whole years
 * @returns monthly principal & interest payment, rounded to the nearest cent
 */
export function calculateMonthlyPrincipalAndInterest(
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
 * Runs the full calculation: principal & interest, the escrow portion
 * (property tax + home insurance, prorated monthly, plus HOA dues — all
 * user-supplied, never estimated by this tool; see MortgageResult.ts /
 * FAQ for why PMI is deliberately not modeled), the combined total
 * monthly payment, and the total interest/paid over the loan term.
 * Escrow is excluded from totalInterest/totalPaid since it isn't
 * interest on the loan.
 */
export function getMortgageResult(
  homePrice: number,
  downPayment: number,
  annualRatePercent: number,
  termYears: number,
  annualPropertyTax = 0,
  annualHomeInsurance = 0,
  monthlyHOA = 0,
): MortgageResult {
  if (!Number.isFinite(homePrice) || homePrice <= 0) {
    throw new RangeError('homePrice must be a positive finite number');
  }
  if (!Number.isFinite(downPayment) || downPayment < 0) {
    throw new RangeError('downPayment must be a non-negative finite number');
  }
  if (downPayment >= homePrice) {
    throw new RangeError('downPayment must be less than homePrice');
  }
  for (const [name, value] of Object.entries({
    annualPropertyTax,
    annualHomeInsurance,
    monthlyHOA,
  })) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(`${name} must be a non-negative finite number`);
    }
  }

  const principal = homePrice - downPayment;
  const monthlyPrincipalAndInterest = calculateMonthlyPrincipalAndInterest(
    principal,
    annualRatePercent,
    termYears,
  );

  const monthlyEscrow =
    Math.round(
      ((annualPropertyTax + annualHomeInsurance) / 12 + monthlyHOA) * 100,
    ) / 100;

  const totalMonthlyPayment =
    Math.round((monthlyPrincipalAndInterest + monthlyEscrow) * 100) / 100;

  const numberOfPayments = termYears * 12;
  const totalPaid =
    Math.round(monthlyPrincipalAndInterest * numberOfPayments * 100) / 100;
  const totalInterest = Math.round((totalPaid - principal) * 100) / 100;

  return {
    monthlyPrincipalAndInterest,
    monthlyEscrow,
    totalMonthlyPayment,
    totalPaid,
    totalInterest,
  };
}

// --- Validation ---

export function validateHomePriceInput(
  homePriceRaw: string,
): MortgageValidationError | null {
  const trimmed = homePriceRaw.trim();
  if (trimmed === '') return 'HOME_PRICE_REQUIRED';

  const homePrice = Number(trimmed);
  if (!Number.isFinite(homePrice)) return 'HOME_PRICE_NOT_A_NUMBER';
  if (homePrice <= 0) return 'HOME_PRICE_NOT_POSITIVE';
  if (homePrice < MIN_HOME_PRICE || homePrice > MAX_HOME_PRICE) {
    return 'HOME_PRICE_OUT_OF_RANGE';
  }
  return null;
}

export function validateDownPaymentInput(
  downPaymentRaw: string,
  homePriceRaw: string,
): MortgageValidationError | null {
  const trimmed = downPaymentRaw.trim();
  if (trimmed === '') return 'DOWN_PAYMENT_REQUIRED';

  const downPayment = Number(trimmed);
  if (!Number.isFinite(downPayment)) return 'DOWN_PAYMENT_NOT_A_NUMBER';
  if (downPayment < 0) return 'DOWN_PAYMENT_NEGATIVE';

  // Cross-field check only runs once home price is itself a valid number —
  // otherwise the home price field already carries its own error.
  const homePrice = Number(homePriceRaw.trim());
  if (Number.isFinite(homePrice) && homePrice > 0 && downPayment >= homePrice) {
    return 'DOWN_PAYMENT_NOT_LESS_THAN_HOME_PRICE';
  }
  return null;
}

export function validateInterestRateInput(
  rateRaw: string,
): MortgageValidationError | null {
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
): MortgageValidationError | null {
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

/** Shared shape for the three optional escrow fields — each is empty-ok (defaults to 0), non-negative, and sanity-bounded. */
function validateOptionalNonNegativeInput(
  raw: string,
  max: number,
  errors: {
    notANumber: MortgageValidationError;
    negative: MortgageValidationError;
    outOfRange: MortgageValidationError;
  },
): MortgageValidationError | null {
  const trimmed = raw.trim();
  if (trimmed === '') return null;

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return errors.notANumber;
  if (value < 0) return errors.negative;
  if (value > max) return errors.outOfRange;
  return null;
}

export function validatePropertyTaxInput(
  propertyTaxRaw: string,
): MortgageValidationError | null {
  return validateOptionalNonNegativeInput(
    propertyTaxRaw,
    MAX_ANNUAL_PROPERTY_TAX,
    {
      notANumber: 'PROPERTY_TAX_NOT_A_NUMBER',
      negative: 'PROPERTY_TAX_NEGATIVE',
      outOfRange: 'PROPERTY_TAX_OUT_OF_RANGE',
    },
  );
}

export function validateHomeInsuranceInput(
  homeInsuranceRaw: string,
): MortgageValidationError | null {
  return validateOptionalNonNegativeInput(
    homeInsuranceRaw,
    MAX_ANNUAL_HOME_INSURANCE,
    {
      notANumber: 'HOME_INSURANCE_NOT_A_NUMBER',
      negative: 'HOME_INSURANCE_NEGATIVE',
      outOfRange: 'HOME_INSURANCE_OUT_OF_RANGE',
    },
  );
}

export function validateHOAInput(
  hoaRaw: string,
): MortgageValidationError | null {
  return validateOptionalNonNegativeInput(hoaRaw, MAX_MONTHLY_HOA, {
    notANumber: 'HOA_NOT_A_NUMBER',
    negative: 'HOA_NEGATIVE',
    outOfRange: 'HOA_OUT_OF_RANGE',
  });
}

export function validateMortgageInputs(
  homePriceRaw: string,
  downPaymentRaw: string,
  rateRaw: string,
  termRaw: string,
  propertyTaxRaw: string,
  homeInsuranceRaw: string,
  hoaRaw: string,
): {
  homePriceError: MortgageValidationError | null;
  downPaymentError: MortgageValidationError | null;
  rateError: MortgageValidationError | null;
  termError: MortgageValidationError | null;
  propertyTaxError: MortgageValidationError | null;
  homeInsuranceError: MortgageValidationError | null;
  hoaError: MortgageValidationError | null;
} {
  return {
    homePriceError: validateHomePriceInput(homePriceRaw),
    downPaymentError: validateDownPaymentInput(downPaymentRaw, homePriceRaw),
    rateError: validateInterestRateInput(rateRaw),
    termError: validateLoanTermInput(termRaw),
    propertyTaxError: validatePropertyTaxInput(propertyTaxRaw),
    homeInsuranceError: validateHomeInsuranceInput(homeInsuranceRaw),
    hoaError: validateHOAInput(hoaRaw),
  };
}

export const MORTGAGE_INPUT_BOUNDS = {
  MIN_HOME_PRICE,
  MAX_HOME_PRICE,
  MIN_INTEREST_RATE,
  MAX_INTEREST_RATE,
  MIN_TERM_YEARS,
  MAX_TERM_YEARS,
  MAX_ANNUAL_PROPERTY_TAX,
  MAX_ANNUAL_HOME_INSURANCE,
  MAX_MONTHLY_HOA,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const MORTGAGE_VALIDATION_MESSAGES: Record<
  MortgageValidationError,
  string
> = {
  HOME_PRICE_REQUIRED: 'Enter the home price to calculate your payment.',
  HOME_PRICE_NOT_A_NUMBER: 'Home price must be a number.',
  HOME_PRICE_NOT_POSITIVE: 'Home price must be greater than zero.',
  HOME_PRICE_OUT_OF_RANGE: `Enter a home price between ${MIN_HOME_PRICE.toLocaleString('en-US')} and ${MAX_HOME_PRICE.toLocaleString('en-US')}.`,
  DOWN_PAYMENT_REQUIRED: 'Enter your down payment (0 if none).',
  DOWN_PAYMENT_NOT_A_NUMBER: 'Down payment must be a number.',
  DOWN_PAYMENT_NEGATIVE: 'Down payment cannot be negative.',
  DOWN_PAYMENT_NOT_LESS_THAN_HOME_PRICE:
    'Down payment must be less than the home price.',
  INTEREST_RATE_REQUIRED: 'Enter the annual interest rate to calculate your payment.',
  INTEREST_RATE_NOT_A_NUMBER: 'Interest rate must be a number.',
  INTEREST_RATE_NEGATIVE: 'Interest rate cannot be negative.',
  INTEREST_RATE_OUT_OF_RANGE: `Enter an interest rate between ${MIN_INTEREST_RATE}% and ${MAX_INTEREST_RATE}%.`,
  LOAN_TERM_REQUIRED: 'Enter the loan term to calculate your payment.',
  LOAN_TERM_NOT_A_NUMBER: 'Loan term must be a number.',
  LOAN_TERM_NOT_POSITIVE: 'Loan term must be greater than zero.',
  LOAN_TERM_NOT_WHOLE_NUMBER: 'Loan term must be a whole number of years.',
  LOAN_TERM_OUT_OF_RANGE: `Enter a loan term between ${MIN_TERM_YEARS} and ${MAX_TERM_YEARS} years.`,
  PROPERTY_TAX_NOT_A_NUMBER: 'Annual property tax must be a number.',
  PROPERTY_TAX_NEGATIVE: 'Annual property tax cannot be negative.',
  PROPERTY_TAX_OUT_OF_RANGE: `Enter an annual property tax up to ${MAX_ANNUAL_PROPERTY_TAX.toLocaleString('en-US')}.`,
  HOME_INSURANCE_NOT_A_NUMBER: 'Annual home insurance must be a number.',
  HOME_INSURANCE_NEGATIVE: 'Annual home insurance cannot be negative.',
  HOME_INSURANCE_OUT_OF_RANGE: `Enter an annual home insurance up to ${MAX_ANNUAL_HOME_INSURANCE.toLocaleString('en-US')}.`,
  HOA_NOT_A_NUMBER: 'Monthly HOA dues must be a number.',
  HOA_NEGATIVE: 'Monthly HOA dues cannot be negative.',
  HOA_OUT_OF_RANGE: `Enter monthly HOA dues up to ${MAX_MONTHLY_HOA.toLocaleString('en-US')}.`,
};
