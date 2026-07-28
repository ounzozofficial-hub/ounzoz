import { describe, expect, it } from 'vitest';
import {
  LOAN_INPUT_BOUNDS,
  calculateMonthlyPayment,
  getLoanResult,
  validateInterestRateInput,
  validateLoanAmountInput,
  validateLoanInputs,
  validateLoanTermInput,
} from './loan';

describe('calculateMonthlyPayment', () => {
  // --- Normal / expected cases ---
  // Reference values computed independently from the standard amortization
  // formula M = P × [r(1+r)^n] / [(1+r)^n − 1] via a standalone script
  // (not this implementation) before writing this file — same
  // hand-verification approach used for calculateBMR / calculateBodyFatPercentage.
  it('calculates the monthly payment for a $200,000 loan at 6% over 30 years', () => {
    // r = 0.005, n = 360 -> M = 1199.101050... -> rounds to 1199.10
    expect(calculateMonthlyPayment(200000, 6, 30)).toBe(1199.1);
  });

  it('calculates the monthly payment for a $10,000 loan at 5% over 5 years', () => {
    // r = 0.05/12, n = 60 -> M = 188.712336... -> rounds to 188.71
    expect(calculateMonthlyPayment(10000, 5, 5)).toBe(188.71);
  });

  it('calculates the monthly payment for a $25,000 loan at 7.5% over 5 years', () => {
    // r = 0.075/12, n = 60 -> M = 500.948715... -> rounds to 500.95
    expect(calculateMonthlyPayment(25000, 7.5, 5)).toBe(500.95);
  });

  it('calculates the monthly payment for a $1,000 loan at 10% over 3 years', () => {
    // r = 0.10/12, n = 36 -> M = 32.267187... -> rounds to 32.27
    expect(calculateMonthlyPayment(1000, 10, 3)).toBe(32.27);
  });

  it('handles a 0% interest loan as principal divided evenly across payments', () => {
    // 0% means the standard formula's denominator would be 0; M = P / n instead
    expect(calculateMonthlyPayment(12000, 0, 1)).toBe(1000);
  });

  it('produces a higher monthly payment for a higher interest rate, all else equal', () => {
    const lowerRate = calculateMonthlyPayment(10000, 3, 5);
    const higherRate = calculateMonthlyPayment(10000, 9, 5);
    expect(higherRate).toBeGreaterThan(lowerRate);
  });

  it('produces a lower monthly payment for a longer term, all else equal', () => {
    const shorterTerm = calculateMonthlyPayment(10000, 5, 3);
    const longerTerm = calculateMonthlyPayment(10000, 5, 10);
    expect(longerTerm).toBeLessThan(shorterTerm);
  });

  it('produces a higher monthly payment for a larger principal, all else equal', () => {
    const smaller = calculateMonthlyPayment(5000, 5, 5);
    const larger = calculateMonthlyPayment(50000, 5, 5);
    expect(larger).toBeGreaterThan(smaller);
  });

  it('rounds to the nearest cent', () => {
    const result = calculateMonthlyPayment(7777, 4.25, 6);
    expect(result).toBe(Math.round(result * 100) / 100);
  });

  // --- Edge cases: bounds of the input ranges ---
  it('handles the minimum allowed loan amount', () => {
    // 500, 5%, 1 year -> M = 42.803741... -> rounds to 42.80
    expect(
      calculateMonthlyPayment(LOAN_INPUT_BOUNDS.MIN_LOAN_AMOUNT, 5, 1),
    ).toBe(42.8);
  });

  it('handles the maximum allowed loan amount at the maximum rate over the minimum term', () => {
    // 10,000,000, 40%, 1 year -> M = 1024714.828617... -> rounds to 1024714.83
    expect(
      calculateMonthlyPayment(
        LOAN_INPUT_BOUNDS.MAX_LOAN_AMOUNT,
        LOAN_INPUT_BOUNDS.MAX_INTEREST_RATE,
        1,
      ),
    ).toBe(1024714.83);
  });

  it('handles the maximum allowed term at 0% interest', () => {
    // 12000, 0%, 40 years -> n = 480 -> M = 25 exactly
    expect(
      calculateMonthlyPayment(12000, 0, LOAN_INPUT_BOUNDS.MAX_TERM_YEARS),
    ).toBe(25);
  });

  it('handles the minimum loan amount over the maximum term', () => {
    // 500, 5%, 40 years -> M = 2.410983... -> rounds to 2.41
    expect(
      calculateMonthlyPayment(
        LOAN_INPUT_BOUNDS.MIN_LOAN_AMOUNT,
        5,
        LOAN_INPUT_BOUNDS.MAX_TERM_YEARS,
      ),
    ).toBe(2.41);
  });

  // --- Invalid inputs ---
  it('throws for zero principal', () => {
    expect(() => calculateMonthlyPayment(0, 5, 5)).toThrow(RangeError);
  });

  it('throws for negative principal', () => {
    expect(() => calculateMonthlyPayment(-1000, 5, 5)).toThrow(RangeError);
  });

  it('throws for negative interest rate', () => {
    expect(() => calculateMonthlyPayment(1000, -1, 5)).toThrow(RangeError);
  });

  it('throws for zero term', () => {
    expect(() => calculateMonthlyPayment(1000, 5, 0)).toThrow(RangeError);
  });

  it('throws for negative term', () => {
    expect(() => calculateMonthlyPayment(1000, 5, -5)).toThrow(RangeError);
  });

  it('throws for non-numeric principal (NaN)', () => {
    expect(() => calculateMonthlyPayment(NaN, 5, 5)).toThrow(RangeError);
  });

  it('throws for Infinity principal', () => {
    expect(() => calculateMonthlyPayment(Infinity, 5, 5)).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculateMonthlyPayment(10000, 5, 5);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('getLoanResult', () => {
  it('returns totalInterest as totalPaid minus principal exactly', () => {
    const result = getLoanResult(10000, 5, 5);
    expect(result.totalPaid).toBe(11322.6);
    expect(result.totalInterest).toBe(1322.6);
    expect(Math.round((result.totalPaid - 10000) * 100) / 100).toBe(
      result.totalInterest,
    );
  });

  it('reports zero total interest for a 0% loan', () => {
    const result = getLoanResult(12000, 0, 1);
    expect(result.totalInterest).toBe(0);
    expect(result.totalPaid).toBe(12000);
  });

  it('matches calculateMonthlyPayment exactly for the same inputs', () => {
    const result = getLoanResult(200000, 6, 30);
    expect(result.monthlyPayment).toBe(calculateMonthlyPayment(200000, 6, 30));
  });

  it('propagates validation errors from an invalid principal', () => {
    expect(() => getLoanResult(0, 5, 5)).toThrow(RangeError);
  });
});

describe('validateLoanAmountInput', () => {
  it('returns null for a valid amount', () => {
    expect(validateLoanAmountInput('10000')).toBeNull();
  });

  it('flags an empty amount field', () => {
    expect(validateLoanAmountInput('')).toBe('LOAN_AMOUNT_REQUIRED');
  });

  it('flags non-numeric amount', () => {
    expect(validateLoanAmountInput('abc')).toBe('LOAN_AMOUNT_NOT_A_NUMBER');
  });

  it('flags zero amount', () => {
    expect(validateLoanAmountInput('0')).toBe('LOAN_AMOUNT_NOT_POSITIVE');
  });

  it('flags negative amount', () => {
    expect(validateLoanAmountInput('-500')).toBe('LOAN_AMOUNT_NOT_POSITIVE');
  });

  it('accepts the exact minimum and maximum amount bounds', () => {
    expect(
      validateLoanAmountInput(String(LOAN_INPUT_BOUNDS.MIN_LOAN_AMOUNT)),
    ).toBeNull();
    expect(
      validateLoanAmountInput(String(LOAN_INPUT_BOUNDS.MAX_LOAN_AMOUNT)),
    ).toBeNull();
  });

  it('flags an amount just below the minimum bound', () => {
    expect(validateLoanAmountInput('499')).toBe('LOAN_AMOUNT_OUT_OF_RANGE');
  });

  it('flags an amount just above the maximum bound', () => {
    expect(validateLoanAmountInput('10000001')).toBe(
      'LOAN_AMOUNT_OUT_OF_RANGE',
    );
  });
});

describe('validateInterestRateInput', () => {
  it('returns null for a valid rate', () => {
    expect(validateInterestRateInput('6')).toBeNull();
  });

  it('accepts a 0% rate as valid', () => {
    expect(validateInterestRateInput('0')).toBeNull();
  });

  it('flags an empty rate field', () => {
    expect(validateInterestRateInput('')).toBe('INTEREST_RATE_REQUIRED');
  });

  it('flags non-numeric rate', () => {
    expect(validateInterestRateInput('abc')).toBe(
      'INTEREST_RATE_NOT_A_NUMBER',
    );
  });

  it('flags negative rate', () => {
    expect(validateInterestRateInput('-1')).toBe('INTEREST_RATE_NEGATIVE');
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

  it('flags an empty term field', () => {
    expect(validateLoanTermInput('')).toBe('LOAN_TERM_REQUIRED');
  });

  it('flags non-numeric term', () => {
    expect(validateLoanTermInput('abc')).toBe('LOAN_TERM_NOT_A_NUMBER');
  });

  it('flags zero term', () => {
    expect(validateLoanTermInput('0')).toBe('LOAN_TERM_NOT_POSITIVE');
  });

  it('flags a fractional term', () => {
    expect(validateLoanTermInput('5.5')).toBe('LOAN_TERM_NOT_WHOLE_NUMBER');
  });

  it('flags a term above the maximum bound', () => {
    expect(validateLoanTermInput('41')).toBe('LOAN_TERM_OUT_OF_RANGE');
  });
});

describe('validateLoanInputs', () => {
  it('returns null for all fields when input is fully valid', () => {
    expect(validateLoanInputs('10000', '5', '5')).toEqual({
      amountError: null,
      rateError: null,
      termError: null,
    });
  });

  it('reports errors independently per field', () => {
    expect(validateLoanInputs('', '', '')).toEqual({
      amountError: 'LOAN_AMOUNT_REQUIRED',
      rateError: 'INTEREST_RATE_REQUIRED',
      termError: 'LOAN_TERM_REQUIRED',
    });
  });

  it('flags only the invalid field, leaving valid ones null', () => {
    expect(validateLoanInputs('10000', '5', '')).toEqual({
      amountError: null,
      rateError: null,
      termError: 'LOAN_TERM_REQUIRED',
    });
  });
});
