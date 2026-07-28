import { describe, expect, it } from 'vitest';
import {
  MORTGAGE_INPUT_BOUNDS,
  calculateMonthlyPrincipalAndInterest,
  getMortgageResult,
  validateDownPaymentInput,
  validateHOAInput,
  validateHomeInsuranceInput,
  validateHomePriceInput,
  validateInterestRateInput,
  validateLoanTermInput,
  validateMortgageInputs,
  validatePropertyTaxInput,
} from './mortgage';

describe('calculateMonthlyPrincipalAndInterest', () => {
  // --- Normal / expected cases ---
  // Reference values computed independently from the standard amortization
  // formula M = P × [r(1+r)^n] / [(1+r)^n − 1] via a standalone script
  // (not this implementation) before writing this file — same
  // hand-verification approach used for calculateMonthlyPayment (loan.ts).
  it('calculates P&I for a $240,000 principal at 6% over 30 years', () => {
    // r = 0.005, n = 360 -> M = 1438.921260... -> rounds to 1438.92
    expect(calculateMonthlyPrincipalAndInterest(240000, 6, 30)).toBe(1438.92);
  });

  it('calculates P&I for a $160,000 principal at 0% over 10 years', () => {
    // 0% -> M = P / n = 160000 / 120
    expect(calculateMonthlyPrincipalAndInterest(160000, 0, 10)).toBe(1333.33);
  });

  it('produces a higher P&I for a higher interest rate, all else equal', () => {
    const lowerRate = calculateMonthlyPrincipalAndInterest(240000, 4, 30);
    const higherRate = calculateMonthlyPrincipalAndInterest(240000, 8, 30);
    expect(higherRate).toBeGreaterThan(lowerRate);
  });

  it('produces a lower P&I for a longer term, all else equal', () => {
    const shorterTerm = calculateMonthlyPrincipalAndInterest(240000, 6, 15);
    const longerTerm = calculateMonthlyPrincipalAndInterest(240000, 6, 30);
    expect(longerTerm).toBeLessThan(shorterTerm);
  });

  // --- Edge cases: bounds ---
  it('handles the minimum home price bound as principal (0 down)', () => {
    // 10,000, 5%, 1yr -> M = 856.074818... -> rounds to 856.07
    expect(
      calculateMonthlyPrincipalAndInterest(
        MORTGAGE_INPUT_BOUNDS.MIN_HOME_PRICE,
        5,
        1,
      ),
    ).toBe(856.07);
  });

  it('handles the maximum home price bound at the maximum rate over the minimum term', () => {
    // 20,000,000, 40%, 1yr -> M = 2049429.657234... -> rounds to 2049429.66
    expect(
      calculateMonthlyPrincipalAndInterest(
        MORTGAGE_INPUT_BOUNDS.MAX_HOME_PRICE,
        MORTGAGE_INPUT_BOUNDS.MAX_INTEREST_RATE,
        1,
      ),
    ).toBe(2049429.66);
  });

  // --- Invalid inputs ---
  it('throws for zero principal', () => {
    expect(() => calculateMonthlyPrincipalAndInterest(0, 5, 30)).toThrow(
      RangeError,
    );
  });

  it('throws for negative principal', () => {
    expect(() => calculateMonthlyPrincipalAndInterest(-1000, 5, 30)).toThrow(
      RangeError,
    );
  });

  it('throws for negative interest rate', () => {
    expect(() => calculateMonthlyPrincipalAndInterest(240000, -1, 30)).toThrow(
      RangeError,
    );
  });

  it('throws for zero term', () => {
    expect(() => calculateMonthlyPrincipalAndInterest(240000, 6, 0)).toThrow(
      RangeError,
    );
  });

  it('throws for non-numeric principal (NaN)', () => {
    expect(() => calculateMonthlyPrincipalAndInterest(NaN, 6, 30)).toThrow(
      RangeError,
    );
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculateMonthlyPrincipalAndInterest(240000, 6, 30);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('getMortgageResult', () => {
  it('computes P&I, escrow, and total monthly payment for a $300,000 home with tax/insurance/HOA', () => {
    // home 300000, down 60000 -> principal 240000, 6%, 30yr
    // escrow = (3600 + 1200)/12 + 50 = 450
    const result = getMortgageResult(
      300000,
      60000,
      6,
      30,
      3600,
      1200,
      50,
    );
    expect(result.monthlyPrincipalAndInterest).toBe(1438.92);
    expect(result.monthlyEscrow).toBe(450);
    expect(result.totalMonthlyPayment).toBe(1888.92);
  });

  it('computes totals matching total P&I paid minus principal (escrow excluded)', () => {
    const result = getMortgageResult(300000, 60000, 6, 30, 3600, 1200, 50);
    expect(result.totalPaid).toBe(518011.2);
    expect(result.totalInterest).toBe(278011.2);
  });

  it('defaults escrow fields to 0 when omitted, so total payment equals P&I only', () => {
    const result = getMortgageResult(200000, 40000, 0, 10);
    expect(result.monthlyEscrow).toBe(0);
    expect(result.totalMonthlyPayment).toBe(result.monthlyPrincipalAndInterest);
    expect(result.monthlyPrincipalAndInterest).toBe(1333.33);
  });

  it('includes property tax and insurance without HOA correctly', () => {
    // principal 160000, 0%, 10yr -> P&I 1333.33; escrow = (2400+1200)/12 = 300
    const result = getMortgageResult(200000, 40000, 0, 10, 2400, 1200, 0);
    expect(result.monthlyEscrow).toBe(300);
    expect(result.totalMonthlyPayment).toBe(1633.33);
  });

  it('throws when down payment equals home price (zero principal)', () => {
    expect(() => getMortgageResult(200000, 200000, 5, 30)).toThrow(
      RangeError,
    );
  });

  it('throws when down payment exceeds home price', () => {
    expect(() => getMortgageResult(200000, 250000, 5, 30)).toThrow(
      RangeError,
    );
  });

  it('throws for a negative down payment', () => {
    expect(() => getMortgageResult(200000, -1000, 5, 30)).toThrow(
      RangeError,
    );
  });

  it('throws for a negative escrow field', () => {
    expect(() => getMortgageResult(200000, 40000, 5, 30, -100)).toThrow(
      RangeError,
    );
  });

  it('produces a higher total monthly payment for a larger down payment reduction in principal (lower principal -> lower P&I)', () => {
    const smallerDown = getMortgageResult(300000, 20000, 6, 30);
    const largerDown = getMortgageResult(300000, 100000, 6, 30);
    expect(largerDown.monthlyPrincipalAndInterest).toBeLessThan(
      smallerDown.monthlyPrincipalAndInterest,
    );
  });
});

describe('validateHomePriceInput', () => {
  it('returns null for a valid home price', () => {
    expect(validateHomePriceInput('300000')).toBeNull();
  });

  it('flags an empty home price field', () => {
    expect(validateHomePriceInput('')).toBe('HOME_PRICE_REQUIRED');
  });

  it('flags non-numeric home price', () => {
    expect(validateHomePriceInput('abc')).toBe('HOME_PRICE_NOT_A_NUMBER');
  });

  it('flags zero home price', () => {
    expect(validateHomePriceInput('0')).toBe('HOME_PRICE_NOT_POSITIVE');
  });

  it('accepts the exact minimum and maximum home price bounds', () => {
    expect(
      validateHomePriceInput(String(MORTGAGE_INPUT_BOUNDS.MIN_HOME_PRICE)),
    ).toBeNull();
    expect(
      validateHomePriceInput(String(MORTGAGE_INPUT_BOUNDS.MAX_HOME_PRICE)),
    ).toBeNull();
  });

  it('flags a home price just below the minimum bound', () => {
    expect(validateHomePriceInput('9999')).toBe('HOME_PRICE_OUT_OF_RANGE');
  });
});

describe('validateDownPaymentInput', () => {
  it('returns null for a valid down payment less than the home price', () => {
    expect(validateDownPaymentInput('60000', '300000')).toBeNull();
  });

  it('accepts a zero down payment', () => {
    expect(validateDownPaymentInput('0', '300000')).toBeNull();
  });

  it('flags an empty down payment field', () => {
    expect(validateDownPaymentInput('', '300000')).toBe(
      'DOWN_PAYMENT_REQUIRED',
    );
  });

  it('flags a negative down payment', () => {
    expect(validateDownPaymentInput('-1000', '300000')).toBe(
      'DOWN_PAYMENT_NEGATIVE',
    );
  });

  it('flags a down payment equal to the home price', () => {
    expect(validateDownPaymentInput('300000', '300000')).toBe(
      'DOWN_PAYMENT_NOT_LESS_THAN_HOME_PRICE',
    );
  });

  it('flags a down payment greater than the home price', () => {
    expect(validateDownPaymentInput('350000', '300000')).toBe(
      'DOWN_PAYMENT_NOT_LESS_THAN_HOME_PRICE',
    );
  });

  it('skips the cross-field check when home price is itself invalid, leaving down payment valid', () => {
    expect(validateDownPaymentInput('60000', '')).toBeNull();
    expect(validateDownPaymentInput('60000', 'abc')).toBeNull();
  });
});

describe('validateInterestRateInput', () => {
  it('returns null for a valid rate', () => {
    expect(validateInterestRateInput('6')).toBeNull();
  });

  it('accepts a 0% rate as valid', () => {
    expect(validateInterestRateInput('0')).toBeNull();
  });

  it('flags a rate above the maximum bound', () => {
    expect(validateInterestRateInput('41')).toBe(
      'INTEREST_RATE_OUT_OF_RANGE',
    );
  });
});

describe('validateLoanTermInput', () => {
  it('returns null for a valid term', () => {
    expect(validateLoanTermInput('30')).toBeNull();
  });

  it('flags a fractional term', () => {
    expect(validateLoanTermInput('30.5')).toBe('LOAN_TERM_NOT_WHOLE_NUMBER');
  });

  it('flags a term above the maximum bound', () => {
    expect(validateLoanTermInput('41')).toBe('LOAN_TERM_OUT_OF_RANGE');
  });
});

describe('optional escrow field validators', () => {
  it('treats an empty property tax field as valid (defaults to 0)', () => {
    expect(validatePropertyTaxInput('')).toBeNull();
  });

  it('flags a negative property tax', () => {
    expect(validatePropertyTaxInput('-100')).toBe('PROPERTY_TAX_NEGATIVE');
  });

  it('flags a property tax above the sanity bound', () => {
    expect(validatePropertyTaxInput('2000000')).toBe(
      'PROPERTY_TAX_OUT_OF_RANGE',
    );
  });

  it('treats an empty home insurance field as valid (defaults to 0)', () => {
    expect(validateHomeInsuranceInput('')).toBeNull();
  });

  it('flags non-numeric home insurance', () => {
    expect(validateHomeInsuranceInput('abc')).toBe(
      'HOME_INSURANCE_NOT_A_NUMBER',
    );
  });

  it('treats an empty HOA field as valid (defaults to 0)', () => {
    expect(validateHOAInput('')).toBeNull();
  });

  it('flags a negative HOA', () => {
    expect(validateHOAInput('-50')).toBe('HOA_NEGATIVE');
  });

  it('flags HOA above the sanity bound', () => {
    expect(validateHOAInput('25000')).toBe('HOA_OUT_OF_RANGE');
  });
});

describe('validateMortgageInputs', () => {
  it('returns null for every field when input is fully valid, including empty optional fields', () => {
    expect(
      validateMortgageInputs('300000', '60000', '6', '30', '', '', ''),
    ).toEqual({
      homePriceError: null,
      downPaymentError: null,
      rateError: null,
      termError: null,
      propertyTaxError: null,
      homeInsuranceError: null,
      hoaError: null,
    });
  });

  it('reports required-field errors independently', () => {
    expect(validateMortgageInputs('', '', '', '', '', '', '')).toEqual({
      homePriceError: 'HOME_PRICE_REQUIRED',
      downPaymentError: 'DOWN_PAYMENT_REQUIRED',
      rateError: 'INTEREST_RATE_REQUIRED',
      termError: 'LOAN_TERM_REQUIRED',
      propertyTaxError: null,
      homeInsuranceError: null,
      hoaError: null,
    });
  });
});
