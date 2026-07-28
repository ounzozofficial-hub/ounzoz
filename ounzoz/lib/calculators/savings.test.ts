import { describe, expect, it } from 'vitest';
import {
  SAVINGS_INPUT_BOUNDS,
  calculateFinalBalance,
  getSavingsResult,
  validateInitialDepositInput,
  validateInterestRateInput,
  validateMonthlyContributionInput,
  validateSavingsInputs,
  validateYearsInput,
} from './savings';

describe('calculateFinalBalance', () => {
  // --- Normal / expected cases ---
  // Reference values computed independently from the standard
  // future-value-of-annuity-plus-lump-sum formula
  // FV = P(1+i)^n + PMT[((1+i)^n - 1)/i] via a standalone script (not this
  // implementation) before writing this file — same hand-verification
  // approach as calculateFinalBalance (compound interest) / calculateMonthlyPayment (loan).
  it('calculates a $1,000 deposit + $100/mo at 6% over 10 years', () => {
    // i=0.005, n=120 -> FV = 18207.329... -> rounds to 18207.33
    expect(calculateFinalBalance(1000, 100, 6, 10)).toBe(18207.33);
  });

  it('calculates a lump-sum-only deposit (no monthly contribution)', () => {
    // P=5000, PMT=0, 4%, 5y -> FV = 6104.979... -> rounds to 6104.98
    expect(calculateFinalBalance(5000, 0, 4, 5)).toBe(6104.98);
  });

  it('calculates a contribution-only balance (no initial deposit)', () => {
    // P=0, PMT=200, 5%, 20y -> FV = 82206.734... -> rounds to 82206.73
    expect(calculateFinalBalance(0, 200, 5, 20)).toBe(82206.73);
  });

  it('calculates over the maximum term at a realistic rate', () => {
    // P=1000, PMT=100, 7%, 50y -> FV = 577587.514... -> rounds to 577587.51
    expect(calculateFinalBalance(1000, 100, 7, 50)).toBe(577587.51);
  });

  it('produces a higher balance for a higher interest rate, all else equal', () => {
    const lowerRate = calculateFinalBalance(1000, 100, 2, 10);
    const higherRate = calculateFinalBalance(1000, 100, 10, 10);
    expect(higherRate).toBeGreaterThan(lowerRate);
  });

  it('produces a higher balance for more years, all else equal', () => {
    const fewerYears = calculateFinalBalance(1000, 100, 5, 5);
    const moreYears = calculateFinalBalance(1000, 100, 5, 20);
    expect(moreYears).toBeGreaterThan(fewerYears);
  });

  it('produces a higher balance for a larger monthly contribution, all else equal', () => {
    const smaller = calculateFinalBalance(1000, 50, 5, 10);
    const larger = calculateFinalBalance(1000, 200, 5, 10);
    expect(larger).toBeGreaterThan(smaller);
  });

  it('handles a 0% interest rate as straight-line accumulation (no growth)', () => {
    // P=1000, PMT=50, 0%, 3y -> 1000 + 50*36 = 2800
    expect(calculateFinalBalance(1000, 50, 0, 3)).toBe(2800);
  });

  it('rounds to the nearest cent', () => {
    const result = calculateFinalBalance(1234, 56, 4.5, 7);
    expect(result).toBe(Math.round(result * 100) / 100);
  });

  // --- Edge cases: bounds of the input ranges ---
  it('handles the maximum initial deposit alone at 0% over the minimum term', () => {
    expect(
      calculateFinalBalance(SAVINGS_INPUT_BOUNDS.MAX_INITIAL_DEPOSIT, 0, 0, 1),
    ).toBe(10000000);
  });

  it('handles the maximum monthly contribution alone at 0% over the minimum term', () => {
    expect(
      calculateFinalBalance(0, SAVINGS_INPUT_BOUNDS.MAX_MONTHLY_CONTRIBUTION, 0, 1),
    ).toBe(600000);
  });

  it('handles the maximum interest rate', () => {
    // P=1000, PMT=0, 20%, 1y -> FV = 1219.39... -> rounds to 1219.39
    expect(
      calculateFinalBalance(1000, 0, SAVINGS_INPUT_BOUNDS.MAX_INTEREST_RATE, 1),
    ).toBe(1219.39);
  });

  it('handles a tiny deposit-free, contribution-only case at a near-zero rate', () => {
    // P=0, PMT=1, 0.1%, 1y -> FV = 12.006... -> rounds to 12.01
    expect(calculateFinalBalance(0, 1, 0.1, 1)).toBe(12.01);
  });

  // --- Invalid inputs ---
  it('throws when both deposit and contribution are zero', () => {
    expect(() => calculateFinalBalance(0, 0, 5, 10)).toThrow(RangeError);
  });

  it('throws for negative initial deposit', () => {
    expect(() => calculateFinalBalance(-1000, 100, 5, 10)).toThrow(RangeError);
  });

  it('throws for negative monthly contribution', () => {
    expect(() => calculateFinalBalance(1000, -100, 5, 10)).toThrow(RangeError);
  });

  it('throws for negative interest rate', () => {
    expect(() => calculateFinalBalance(1000, 100, -1, 10)).toThrow(RangeError);
  });

  it('throws for zero years', () => {
    expect(() => calculateFinalBalance(1000, 100, 5, 0)).toThrow(RangeError);
  });

  it('throws for negative years', () => {
    expect(() => calculateFinalBalance(1000, 100, 5, -5)).toThrow(RangeError);
  });

  it('throws for non-numeric initial deposit (NaN)', () => {
    expect(() => calculateFinalBalance(NaN, 100, 5, 10)).toThrow(RangeError);
  });

  it('throws for Infinity monthly contribution', () => {
    expect(() => calculateFinalBalance(1000, Infinity, 5, 10)).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculateFinalBalance(1000, 100, 5, 10);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('getSavingsResult', () => {
  it('returns totalContributions and interestEarned that sum to finalBalance', () => {
    const result = getSavingsResult(1000, 100, 6, 10);
    expect(result.finalBalance).toBe(18207.33);
    expect(result.totalContributions).toBe(13000);
    expect(result.interestEarned).toBe(5207.33);
    expect(
      Math.round((result.totalContributions + result.interestEarned) * 100) / 100,
    ).toBe(result.finalBalance);
  });

  it('reports zero interest earned for a 0% rate', () => {
    const result = getSavingsResult(1000, 50, 0, 3);
    expect(result.interestEarned).toBe(0);
    expect(result.finalBalance).toBe(result.totalContributions);
  });

  it('matches calculateFinalBalance exactly for the same inputs', () => {
    const result = getSavingsResult(5000, 0, 4, 5);
    expect(result.finalBalance).toBe(calculateFinalBalance(5000, 0, 4, 5));
  });

  it('propagates validation errors when both deposit and contribution are zero', () => {
    expect(() => getSavingsResult(0, 0, 5, 10)).toThrow(RangeError);
  });
});

describe('validateInitialDepositInput', () => {
  it('returns null for a valid deposit', () => {
    expect(validateInitialDepositInput('1000')).toBeNull();
  });

  it('returns null for an empty field (optional, defaults to 0)', () => {
    expect(validateInitialDepositInput('')).toBeNull();
  });

  it('returns null for an explicit 0', () => {
    expect(validateInitialDepositInput('0')).toBeNull();
  });

  it('flags non-numeric input', () => {
    expect(validateInitialDepositInput('abc')).toBe('INITIAL_DEPOSIT_NOT_A_NUMBER');
  });

  it('flags a negative deposit', () => {
    expect(validateInitialDepositInput('-500')).toBe('INITIAL_DEPOSIT_NEGATIVE');
  });

  it('accepts the exact maximum bound', () => {
    expect(
      validateInitialDepositInput(String(SAVINGS_INPUT_BOUNDS.MAX_INITIAL_DEPOSIT)),
    ).toBeNull();
  });

  it('flags a deposit above the maximum bound', () => {
    expect(validateInitialDepositInput('10000001')).toBe('INITIAL_DEPOSIT_OUT_OF_RANGE');
  });
});

describe('validateMonthlyContributionInput', () => {
  it('returns null for a valid contribution', () => {
    expect(validateMonthlyContributionInput('200')).toBeNull();
  });

  it('returns null for an empty field (optional, defaults to 0)', () => {
    expect(validateMonthlyContributionInput('')).toBeNull();
  });

  it('flags non-numeric input', () => {
    expect(validateMonthlyContributionInput('abc')).toBe(
      'MONTHLY_CONTRIBUTION_NOT_A_NUMBER',
    );
  });

  it('flags a negative contribution', () => {
    expect(validateMonthlyContributionInput('-50')).toBe(
      'MONTHLY_CONTRIBUTION_NEGATIVE',
    );
  });

  it('flags a contribution above the maximum bound', () => {
    expect(validateMonthlyContributionInput('50001')).toBe(
      'MONTHLY_CONTRIBUTION_OUT_OF_RANGE',
    );
  });
});

describe('validateInterestRateInput', () => {
  it('returns null for a valid rate', () => {
    expect(validateInterestRateInput('5')).toBeNull();
  });

  it('accepts a 0% rate as valid', () => {
    expect(validateInterestRateInput('0')).toBeNull();
  });

  it('flags an empty rate field (required, unlike deposit/contribution)', () => {
    expect(validateInterestRateInput('')).toBe('INTEREST_RATE_REQUIRED');
  });

  it('flags a rate above the 20% maximum bound', () => {
    expect(validateInterestRateInput('21')).toBe('INTEREST_RATE_OUT_OF_RANGE');
  });
});

describe('validateYearsInput', () => {
  it('returns null for a valid year count', () => {
    expect(validateYearsInput('10')).toBeNull();
  });

  it('flags an empty years field', () => {
    expect(validateYearsInput('')).toBe('YEARS_REQUIRED');
  });

  it('flags a fractional year count', () => {
    expect(validateYearsInput('5.5')).toBe('YEARS_NOT_WHOLE_NUMBER');
  });

  it('flags a year count above the maximum bound', () => {
    expect(validateYearsInput('51')).toBe('YEARS_OUT_OF_RANGE');
  });
});

describe('validateSavingsInputs', () => {
  it('returns null for all fields when input is fully valid', () => {
    expect(validateSavingsInputs('1000', '100', '5', '10')).toEqual({
      initialDepositError: null,
      monthlyContributionError: null,
      rateError: null,
      yearsError: null,
    });
  });

  it('flags NOTHING_TO_CALCULATE when both deposit and contribution are empty', () => {
    expect(validateSavingsInputs('', '', '5', '10')).toEqual({
      initialDepositError: null,
      monthlyContributionError: 'NOTHING_TO_CALCULATE',
      rateError: null,
      yearsError: null,
    });
  });

  it('flags NOTHING_TO_CALCULATE when both deposit and contribution are explicit zeros', () => {
    expect(validateSavingsInputs('0', '0', '5', '10')).toEqual({
      initialDepositError: null,
      monthlyContributionError: 'NOTHING_TO_CALCULATE',
      rateError: null,
      yearsError: null,
    });
  });

  it('accepts a deposit-only input as valid (no NOTHING_TO_CALCULATE)', () => {
    expect(validateSavingsInputs('1000', '', '5', '10')).toEqual({
      initialDepositError: null,
      monthlyContributionError: null,
      rateError: null,
      yearsError: null,
    });
  });

  it('accepts a contribution-only input as valid (no NOTHING_TO_CALCULATE)', () => {
    expect(validateSavingsInputs('', '100', '5', '10')).toEqual({
      initialDepositError: null,
      monthlyContributionError: null,
      rateError: null,
      yearsError: null,
    });
  });

  it('reports each field error independently, leaving valid ones null', () => {
    expect(validateSavingsInputs('1000', '100', '', '')).toEqual({
      initialDepositError: null,
      monthlyContributionError: null,
      rateError: 'INTEREST_RATE_REQUIRED',
      yearsError: 'YEARS_REQUIRED',
    });
  });
});
