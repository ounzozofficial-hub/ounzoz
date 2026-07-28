import { describe, expect, it } from 'vitest';
import {
  INVESTMENT_INPUT_BOUNDS,
  calculateProjectedBalance,
  getInvestmentResult,
  validateInitialInvestmentInput,
  validateInvestmentInputs,
  validateMonthlyContributionInput,
  validateReturnRateInput,
  validateYearsInput,
} from './investment';

describe('calculateProjectedBalance', () => {
  // --- Normal / expected cases ---
  // Reference values computed independently from the standard
  // future-value-of-annuity-plus-lump-sum formula
  // FV = P(1+i)^n + PMT[((1+i)^n - 1)/i] via a standalone script (not this
  // implementation) before writing this file — same hand-verification
  // approach as calculateFinalBalance (savings) / calculateMonthlyPayment (loan).
  it('calculates a $2,000 investment + $150/mo at 7% over 20 years', () => {
    // i=0.07/12, n=240 -> FV = 86216.48...
    expect(calculateProjectedBalance(2000, 150, 7, 20)).toBe(86216.48);
  });

  it('calculates a lump-sum-only investment (no monthly contribution)', () => {
    // P=10000, PMT=0, 8%, 10y -> FV = 22196.40...
    expect(calculateProjectedBalance(10000, 0, 8, 10)).toBe(22196.4);
  });

  it('calculates a contribution-only balance (no initial investment)', () => {
    // P=0, PMT=300, 7%, 25y -> FV = 243021.51...
    expect(calculateProjectedBalance(0, 300, 7, 25)).toBe(243021.51);
  });

  it('calculates over the maximum term at a realistic return', () => {
    // P=1000, PMT=100, 7%, 50y -> FV = 577587.51...
    expect(calculateProjectedBalance(1000, 100, 7, 50)).toBe(577587.51);
  });

  it('produces a higher balance for a higher expected return, all else equal', () => {
    const lowerReturn = calculateProjectedBalance(5000, 200, 4, 20);
    const higherReturn = calculateProjectedBalance(5000, 200, 10, 20);
    expect(higherReturn).toBeGreaterThan(lowerReturn);
  });

  it('produces a higher balance for more years, all else equal', () => {
    const fewerYears = calculateProjectedBalance(5000, 200, 7, 5);
    const moreYears = calculateProjectedBalance(5000, 200, 7, 30);
    expect(moreYears).toBeGreaterThan(fewerYears);
  });

  it('produces a higher balance for a larger monthly contribution, all else equal', () => {
    const smaller = calculateProjectedBalance(5000, 100, 7, 20);
    const larger = calculateProjectedBalance(5000, 400, 7, 20);
    expect(larger).toBeGreaterThan(smaller);
  });

  it('handles a 0% return as straight-line accumulation (no growth)', () => {
    // P=1000, PMT=50, 0%, 3y -> 1000 + 50*36 = 2800
    expect(calculateProjectedBalance(1000, 50, 0, 3)).toBe(2800);
  });

  it('rounds to the nearest cent', () => {
    const result = calculateProjectedBalance(5000, 200, 9, 30);
    expect(result).toBe(Math.round(result * 100) / 100);
    expect(result).toBe(439801.58);
  });

  // --- Edge cases: bounds of the input ranges ---
  it('handles the maximum initial investment alone at 0% over the minimum term', () => {
    expect(
      calculateProjectedBalance(
        INVESTMENT_INPUT_BOUNDS.MAX_INITIAL_INVESTMENT,
        0,
        0,
        1,
      ),
    ).toBe(10000000);
  });

  it('handles the maximum monthly contribution alone at 0% over the minimum term', () => {
    expect(
      calculateProjectedBalance(
        0,
        INVESTMENT_INPUT_BOUNDS.MAX_MONTHLY_CONTRIBUTION,
        0,
        1,
      ),
    ).toBe(1200000);
  });

  it('handles the maximum expected return', () => {
    // P=1000, PMT=0, 30%, 1y -> FV = 1344.89...
    expect(
      calculateProjectedBalance(
        1000,
        0,
        INVESTMENT_INPUT_BOUNDS.MAX_RETURN_RATE,
        1,
      ),
    ).toBe(1344.89);
  });

  it('handles a tiny contribution-only case at a near-zero return', () => {
    // P=0, PMT=1, 0.1%, 1y -> FV = 12.006... -> rounds to 12.01
    expect(calculateProjectedBalance(0, 1, 0.1, 1)).toBe(12.01);
  });

  // --- Invalid inputs ---
  it('throws when both initial investment and contribution are zero', () => {
    expect(() => calculateProjectedBalance(0, 0, 7, 10)).toThrow(RangeError);
  });

  it('throws for negative initial investment', () => {
    expect(() => calculateProjectedBalance(-5000, 200, 7, 10)).toThrow(
      RangeError,
    );
  });

  it('throws for negative monthly contribution', () => {
    expect(() => calculateProjectedBalance(5000, -200, 7, 10)).toThrow(
      RangeError,
    );
  });

  it('throws for negative expected return', () => {
    expect(() => calculateProjectedBalance(5000, 200, -1, 10)).toThrow(
      RangeError,
    );
  });

  it('throws for zero years', () => {
    expect(() => calculateProjectedBalance(5000, 200, 7, 0)).toThrow(
      RangeError,
    );
  });

  it('throws for negative years', () => {
    expect(() => calculateProjectedBalance(5000, 200, 7, -5)).toThrow(
      RangeError,
    );
  });

  it('throws for non-numeric initial investment (NaN)', () => {
    expect(() => calculateProjectedBalance(NaN, 200, 7, 10)).toThrow(
      RangeError,
    );
  });

  it('throws for Infinity monthly contribution', () => {
    expect(() => calculateProjectedBalance(5000, Infinity, 7, 10)).toThrow(
      RangeError,
    );
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculateProjectedBalance(5000, 200, 7, 10);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('getInvestmentResult', () => {
  it('returns totalContributions and estimatedGrowth that sum to finalBalance', () => {
    const result = getInvestmentResult(2000, 150, 7, 20);
    expect(result.finalBalance).toBe(86216.48);
    expect(result.totalContributions).toBe(38000);
    expect(result.estimatedGrowth).toBe(48216.48);
    expect(
      Math.round((result.totalContributions + result.estimatedGrowth) * 100) /
        100,
    ).toBe(result.finalBalance);
  });

  it('reports zero estimated growth for a 0% return', () => {
    const result = getInvestmentResult(1000, 50, 0, 3);
    expect(result.estimatedGrowth).toBe(0);
    expect(result.finalBalance).toBe(result.totalContributions);
  });

  it('matches calculateProjectedBalance exactly for the same inputs', () => {
    const result = getInvestmentResult(10000, 0, 8, 10);
    expect(result.finalBalance).toBe(calculateProjectedBalance(10000, 0, 8, 10));
  });

  it('propagates validation errors when both fields are zero', () => {
    expect(() => getInvestmentResult(0, 0, 7, 10)).toThrow(RangeError);
  });
});

describe('validateInitialInvestmentInput', () => {
  it('returns null for a valid investment', () => {
    expect(validateInitialInvestmentInput('5000')).toBeNull();
  });

  it('returns null for an empty field (optional, defaults to 0)', () => {
    expect(validateInitialInvestmentInput('')).toBeNull();
  });

  it('returns null for an explicit 0', () => {
    expect(validateInitialInvestmentInput('0')).toBeNull();
  });

  it('flags non-numeric input', () => {
    expect(validateInitialInvestmentInput('abc')).toBe(
      'INITIAL_INVESTMENT_NOT_A_NUMBER',
    );
  });

  it('flags a negative investment', () => {
    expect(validateInitialInvestmentInput('-500')).toBe(
      'INITIAL_INVESTMENT_NEGATIVE',
    );
  });

  it('accepts the exact maximum bound', () => {
    expect(
      validateInitialInvestmentInput(
        String(INVESTMENT_INPUT_BOUNDS.MAX_INITIAL_INVESTMENT),
      ),
    ).toBeNull();
  });

  it('flags an investment above the maximum bound', () => {
    expect(validateInitialInvestmentInput('10000001')).toBe(
      'INITIAL_INVESTMENT_OUT_OF_RANGE',
    );
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
    expect(validateMonthlyContributionInput('100001')).toBe(
      'MONTHLY_CONTRIBUTION_OUT_OF_RANGE',
    );
  });
});

describe('validateReturnRateInput', () => {
  it('returns null for a valid rate', () => {
    expect(validateReturnRateInput('7')).toBeNull();
  });

  it('accepts a 0% rate as valid', () => {
    expect(validateReturnRateInput('0')).toBeNull();
  });

  it('flags an empty rate field (required, unlike investment/contribution)', () => {
    expect(validateReturnRateInput('')).toBe('RETURN_RATE_REQUIRED');
  });

  it('flags a rate above the 30% maximum bound', () => {
    expect(validateReturnRateInput('31')).toBe('RETURN_RATE_OUT_OF_RANGE');
  });
});

describe('validateYearsInput', () => {
  it('returns null for a valid year count', () => {
    expect(validateYearsInput('20')).toBeNull();
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

describe('validateInvestmentInputs', () => {
  it('returns null for all fields when input is fully valid', () => {
    expect(validateInvestmentInputs('5000', '200', '7', '20')).toEqual({
      initialInvestmentError: null,
      monthlyContributionError: null,
      rateError: null,
      yearsError: null,
    });
  });

  it('flags NOTHING_TO_CALCULATE when both investment and contribution are empty', () => {
    expect(validateInvestmentInputs('', '', '7', '20')).toEqual({
      initialInvestmentError: null,
      monthlyContributionError: 'NOTHING_TO_CALCULATE',
      rateError: null,
      yearsError: null,
    });
  });

  it('flags NOTHING_TO_CALCULATE when both investment and contribution are explicit zeros', () => {
    expect(validateInvestmentInputs('0', '0', '7', '20')).toEqual({
      initialInvestmentError: null,
      monthlyContributionError: 'NOTHING_TO_CALCULATE',
      rateError: null,
      yearsError: null,
    });
  });

  it('accepts an investment-only input as valid (no NOTHING_TO_CALCULATE)', () => {
    expect(validateInvestmentInputs('5000', '', '7', '20')).toEqual({
      initialInvestmentError: null,
      monthlyContributionError: null,
      rateError: null,
      yearsError: null,
    });
  });

  it('accepts a contribution-only input as valid (no NOTHING_TO_CALCULATE)', () => {
    expect(validateInvestmentInputs('', '200', '7', '20')).toEqual({
      initialInvestmentError: null,
      monthlyContributionError: null,
      rateError: null,
      yearsError: null,
    });
  });

  it('reports each field error independently, leaving valid ones null', () => {
    expect(validateInvestmentInputs('5000', '200', '', '')).toEqual({
      initialInvestmentError: null,
      monthlyContributionError: null,
      rateError: 'RETURN_RATE_REQUIRED',
      yearsError: 'YEARS_REQUIRED',
    });
  });
});
