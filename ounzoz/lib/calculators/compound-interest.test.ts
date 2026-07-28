import { describe, expect, it } from 'vitest';
import {
  COMPOUND_INTEREST_INPUT_BOUNDS,
  calculateFinalBalance,
  getCompoundInterestResult,
  validateCompoundInterestInputs,
  validateFrequencyInput,
  validateInterestRateInput,
  validatePrincipalInput,
  validateYearsInput,
} from './compound-interest';

describe('calculateFinalBalance', () => {
  // --- Normal / expected cases ---
  // Reference values computed independently from the standard compound
  // interest formula A = P × (1 + r/n)^(n×t) via a standalone script (not
  // this implementation) before writing this file — same
  // hand-verification approach as calculateMonthlyPayment/calculateBMR.
  it('calculates a $10,000 principal at 5% compounded monthly over 10 years', () => {
    // r=0.05, n=12, t=10 -> A = 16470.094... -> rounds to 16470.09
    expect(calculateFinalBalance(10000, 5, 'monthly', 10)).toBe(16470.09);
  });

  it('calculates a $1,000 principal at 6% compounded annually over 5 years', () => {
    // r=0.06, n=1, t=5 -> A = 1338.225... -> rounds to 1338.23
    expect(calculateFinalBalance(1000, 6, 'annually', 5)).toBe(1338.23);
  });

  it('calculates a $5,000 principal at 8% compounded quarterly over 3 years', () => {
    // r=0.08, n=4, t=3 -> A = 6341.209... -> rounds to 6341.21
    expect(calculateFinalBalance(5000, 8, 'quarterly', 3)).toBe(6341.21);
  });

  it('calculates a $2,000 principal at 4% compounded semi-annually over 2 years', () => {
    // r=0.04, n=2, t=2 -> A = 2164.859... -> rounds to 2164.86
    expect(calculateFinalBalance(2000, 4, 'semiannually', 2)).toBe(2164.86);
  });

  it('calculates a $1,000 principal at 3% compounded daily over 1 year', () => {
    // r=0.03, n=365, t=1 -> A = 1030.454... -> rounds to 1030.45
    expect(calculateFinalBalance(1000, 3, 'daily', 1)).toBe(1030.45);
  });

  it('produces a higher balance for more frequent compounding, all else equal', () => {
    const annually = calculateFinalBalance(10000, 6, 'annually', 10);
    const monthly = calculateFinalBalance(10000, 6, 'monthly', 10);
    const daily = calculateFinalBalance(10000, 6, 'daily', 10);
    expect(monthly).toBeGreaterThan(annually);
    expect(daily).toBeGreaterThan(monthly);
  });

  it('produces a higher balance for a higher interest rate, all else equal', () => {
    const lowerRate = calculateFinalBalance(10000, 3, 'monthly', 10);
    const higherRate = calculateFinalBalance(10000, 9, 'monthly', 10);
    expect(higherRate).toBeGreaterThan(lowerRate);
  });

  it('produces a higher balance for more years, all else equal', () => {
    const fewerYears = calculateFinalBalance(10000, 5, 'monthly', 5);
    const moreYears = calculateFinalBalance(10000, 5, 'monthly', 20);
    expect(moreYears).toBeGreaterThan(fewerYears);
  });

  it('handles a 0% interest rate as no growth at all, regardless of frequency', () => {
    expect(calculateFinalBalance(5000, 0, 'monthly', 10)).toBe(5000);
    expect(calculateFinalBalance(5000, 0, 'daily', 10)).toBe(5000);
  });

  it('rounds to the nearest cent', () => {
    const result = calculateFinalBalance(7777, 4.25, 'quarterly', 6);
    expect(result).toBe(Math.round(result * 100) / 100);
  });

  // --- Edge cases: bounds of the input ranges ---
  // Deliberately not combining all three bounds (max principal + max rate
  // + max years) at once — like Loan Calculator's own boundary tests, that
  // combination produces a balance large enough that cent-rounding
  // (value × 100) would exceed Number.MAX_SAFE_INTEGER and lose precision.
  // Each bound is exercised in isolation or paired with a moderate value
  // for the others instead.
  it('handles the minimum allowed principal', () => {
    // 1, 0.5%, monthly, 1y -> A = 1.005... -> rounds to 1.01 (see below)
    expect(
      calculateFinalBalance(COMPOUND_INTEREST_INPUT_BOUNDS.MIN_PRINCIPAL, 0.5, 'monthly', 1),
    ).toBe(1.01);
  });

  it('handles the maximum allowed principal at the maximum rate over the minimum term', () => {
    // 10,000,000, 50%, annually, 1y -> A = 15,000,000 exactly
    expect(
      calculateFinalBalance(
        COMPOUND_INTEREST_INPUT_BOUNDS.MAX_PRINCIPAL,
        COMPOUND_INTEREST_INPUT_BOUNDS.MAX_INTEREST_RATE,
        'annually',
        1,
      ),
    ).toBe(15000000);
  });

  it('handles the maximum allowed years at a moderate rate and principal', () => {
    // 10,000, 5%, annually, 50y -> A = 114,674.00 (verified independently)
    expect(
      calculateFinalBalance(10000, 5, 'annually', COMPOUND_INTEREST_INPUT_BOUNDS.MAX_YEARS),
    ).toBe(114674);
  });

  it('handles the minimum allowed rate (0%) at the minimum term', () => {
    expect(
      calculateFinalBalance(1, COMPOUND_INTEREST_INPUT_BOUNDS.MIN_INTEREST_RATE, 'annually', COMPOUND_INTEREST_INPUT_BOUNDS.MIN_YEARS),
    ).toBe(1);
  });

  // --- Invalid inputs ---
  it('throws for zero principal', () => {
    expect(() => calculateFinalBalance(0, 5, 'monthly', 10)).toThrow(RangeError);
  });

  it('throws for negative principal', () => {
    expect(() => calculateFinalBalance(-1000, 5, 'monthly', 10)).toThrow(RangeError);
  });

  it('throws for negative interest rate', () => {
    expect(() => calculateFinalBalance(1000, -1, 'monthly', 10)).toThrow(RangeError);
  });

  it('throws for zero years', () => {
    expect(() => calculateFinalBalance(1000, 5, 'monthly', 0)).toThrow(RangeError);
  });

  it('throws for negative years', () => {
    expect(() => calculateFinalBalance(1000, 5, 'monthly', -5)).toThrow(RangeError);
  });

  it('throws for non-numeric principal (NaN)', () => {
    expect(() => calculateFinalBalance(NaN, 5, 'monthly', 10)).toThrow(RangeError);
  });

  it('throws for Infinity principal', () => {
    expect(() => calculateFinalBalance(Infinity, 5, 'monthly', 10)).toThrow(RangeError);
  });

  it('throws for an unrecognized compounding frequency', () => {
    expect(() =>
      calculateFinalBalance(1000, 5, 'weekly' as unknown as 'monthly', 10),
    ).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculateFinalBalance(10000, 5, 'monthly', 10);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('getCompoundInterestResult', () => {
  it('returns interestEarned as finalBalance minus principal exactly', () => {
    const result = getCompoundInterestResult(1000, 6, 'annually', 5);
    expect(result.finalBalance).toBe(1338.23);
    expect(result.interestEarned).toBe(338.23);
    expect(Math.round((result.finalBalance - 1000) * 100) / 100).toBe(
      result.interestEarned,
    );
  });

  it('reports zero interest earned for a 0% rate', () => {
    const result = getCompoundInterestResult(5000, 0, 'monthly', 10);
    expect(result.interestEarned).toBe(0);
    expect(result.finalBalance).toBe(5000);
  });

  it('matches calculateFinalBalance exactly for the same inputs', () => {
    const result = getCompoundInterestResult(10000, 5, 'monthly', 10);
    expect(result.finalBalance).toBe(calculateFinalBalance(10000, 5, 'monthly', 10));
  });

  it('propagates validation errors from an invalid principal', () => {
    expect(() => getCompoundInterestResult(0, 5, 'monthly', 10)).toThrow(RangeError);
  });
});

describe('validatePrincipalInput', () => {
  it('returns null for a valid principal', () => {
    expect(validatePrincipalInput('10000')).toBeNull();
  });

  it('flags an empty principal field', () => {
    expect(validatePrincipalInput('')).toBe('PRINCIPAL_REQUIRED');
  });

  it('flags non-numeric principal', () => {
    expect(validatePrincipalInput('abc')).toBe('PRINCIPAL_NOT_A_NUMBER');
  });

  it('flags zero principal', () => {
    expect(validatePrincipalInput('0')).toBe('PRINCIPAL_NOT_POSITIVE');
  });

  it('flags negative principal', () => {
    expect(validatePrincipalInput('-500')).toBe('PRINCIPAL_NOT_POSITIVE');
  });

  it('accepts the exact minimum and maximum principal bounds', () => {
    expect(
      validatePrincipalInput(String(COMPOUND_INTEREST_INPUT_BOUNDS.MIN_PRINCIPAL)),
    ).toBeNull();
    expect(
      validatePrincipalInput(String(COMPOUND_INTEREST_INPUT_BOUNDS.MAX_PRINCIPAL)),
    ).toBeNull();
  });

  it('flags a principal just above the maximum bound', () => {
    expect(validatePrincipalInput('10000001')).toBe('PRINCIPAL_OUT_OF_RANGE');
  });
});

describe('validateInterestRateInput', () => {
  it('returns null for a valid rate', () => {
    expect(validateInterestRateInput('5')).toBeNull();
  });

  it('accepts a 0% rate as valid', () => {
    expect(validateInterestRateInput('0')).toBeNull();
  });

  it('flags an empty rate field', () => {
    expect(validateInterestRateInput('')).toBe('INTEREST_RATE_REQUIRED');
  });

  it('flags non-numeric rate', () => {
    expect(validateInterestRateInput('abc')).toBe('INTEREST_RATE_NOT_A_NUMBER');
  });

  it('flags negative rate', () => {
    expect(validateInterestRateInput('-1')).toBe('INTEREST_RATE_NEGATIVE');
  });

  it('flags a rate above the maximum bound', () => {
    expect(validateInterestRateInput('51')).toBe('INTEREST_RATE_OUT_OF_RANGE');
  });
});

describe('validateFrequencyInput', () => {
  it('returns null for a selected frequency', () => {
    expect(validateFrequencyInput('monthly')).toBeNull();
  });

  it('flags a null (unselected) frequency', () => {
    expect(validateFrequencyInput(null)).toBe('FREQUENCY_REQUIRED');
  });
});

describe('validateYearsInput', () => {
  it('returns null for a valid year count', () => {
    expect(validateYearsInput('10')).toBeNull();
  });

  it('flags an empty years field', () => {
    expect(validateYearsInput('')).toBe('YEARS_REQUIRED');
  });

  it('flags non-numeric years', () => {
    expect(validateYearsInput('abc')).toBe('YEARS_NOT_A_NUMBER');
  });

  it('flags zero years', () => {
    expect(validateYearsInput('0')).toBe('YEARS_NOT_POSITIVE');
  });

  it('flags a fractional year count', () => {
    expect(validateYearsInput('5.5')).toBe('YEARS_NOT_WHOLE_NUMBER');
  });

  it('flags a year count above the maximum bound', () => {
    expect(validateYearsInput('51')).toBe('YEARS_OUT_OF_RANGE');
  });
});

describe('validateCompoundInterestInputs', () => {
  it('returns null for all fields when input is fully valid', () => {
    expect(validateCompoundInterestInputs('10000', '5', 'monthly', '10')).toEqual({
      principalError: null,
      rateError: null,
      frequencyError: null,
      yearsError: null,
    });
  });

  it('reports errors independently per field', () => {
    expect(validateCompoundInterestInputs('', '', null, '')).toEqual({
      principalError: 'PRINCIPAL_REQUIRED',
      rateError: 'INTEREST_RATE_REQUIRED',
      frequencyError: 'FREQUENCY_REQUIRED',
      yearsError: 'YEARS_REQUIRED',
    });
  });

  it('flags only the invalid field, leaving valid ones null', () => {
    expect(validateCompoundInterestInputs('10000', '5', 'monthly', '')).toEqual({
      principalError: null,
      rateError: null,
      frequencyError: null,
      yearsError: 'YEARS_REQUIRED',
    });
  });
});
