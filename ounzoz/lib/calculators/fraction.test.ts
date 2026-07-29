import { describe, expect, it } from 'vitest';
import {
  FRACTION_INPUT_BOUNDS,
  calculateFractionResult,
  greatestCommonDivisor,
  roundFractionValue,
  simplifyFraction,
  validateDenominator1Input,
  validateDenominator2Input,
  validateFractionInputs,
  validateNumerator1Input,
  validateNumerator2Input,
} from './fraction';

describe('greatestCommonDivisor', () => {
  it('finds the GCD of two positive integers', () => {
    expect(greatestCommonDivisor(12, 8)).toBe(4);
  });

  it('is sign-independent', () => {
    expect(greatestCommonDivisor(-12, 8)).toBe(4);
    expect(greatestCommonDivisor(12, -8)).toBe(4);
  });

  it('returns the non-zero value when one input is zero', () => {
    expect(greatestCommonDivisor(0, 5)).toBe(5);
  });

  it('returns 1 for coprime numbers', () => {
    expect(greatestCommonDivisor(7, 11)).toBe(1);
  });
});

describe('simplifyFraction', () => {
  it('reduces a fraction to lowest terms', () => {
    expect(simplifyFraction(6, 12)).toEqual({ numerator: 1, denominator: 2 });
  });

  it('normalizes a negative denominator onto the numerator', () => {
    expect(simplifyFraction(2, -4)).toEqual({ numerator: -1, denominator: 2 });
  });

  it('leaves an already-simplified fraction unchanged', () => {
    expect(simplifyFraction(3, 7)).toEqual({ numerator: 3, denominator: 7 });
  });

  it('returns 0/1 for a zero numerator', () => {
    expect(simplifyFraction(0, 5)).toEqual({ numerator: 0, denominator: 1 });
  });

  it('throws for a zero denominator', () => {
    expect(() => simplifyFraction(1, 0)).toThrow(RangeError);
  });
});

describe('calculateFractionResult', () => {
  // --- Normal / expected cases (hand-verified) ---
  it('adds 1/2 + 1/3 -> 5/6', () => {
    // (1*3 + 1*2) / (2*3) = 5/6, already lowest terms
    const result = calculateFractionResult(1, 2, 1, 3, 'add');
    expect(result.numerator).toBe(5);
    expect(result.denominator).toBe(6);
    expect(result.decimal).toBeCloseTo(0.8333, 4);
    expect(result.isWholeNumber).toBe(false);
    expect(result.mixedNumber).toBeUndefined();
  });

  it('subtracts 1/2 - 3/4 -> -1/4', () => {
    // (1*4 - 3*2) / (2*4) = -2/8 -> -1/4
    const result = calculateFractionResult(1, 2, 3, 4, 'subtract');
    expect(result.numerator).toBe(-1);
    expect(result.denominator).toBe(4);
    expect(result.decimal).toBe(-0.25);
  });

  it('multiplies 3/4 * 2/3 -> 1/2', () => {
    // (3*2) / (4*3) = 6/12 -> 1/2
    const result = calculateFractionResult(3, 4, 2, 3, 'multiply');
    expect(result.numerator).toBe(1);
    expect(result.denominator).toBe(2);
    expect(result.decimal).toBe(0.5);
  });

  it('divides 2/3 ÷ 4/5 -> 5/6', () => {
    // (2*5) / (3*4) = 10/12 -> 5/6
    const result = calculateFractionResult(2, 3, 4, 5, 'divide');
    expect(result.numerator).toBe(5);
    expect(result.denominator).toBe(6);
  });

  // --- Whole-number result ---
  it('simplifies to a whole number when the result reduces to an integer', () => {
    // 2/3 * 3/2 = 6/6 -> 1/1
    const result = calculateFractionResult(2, 3, 3, 2, 'multiply');
    expect(result.numerator).toBe(1);
    expect(result.denominator).toBe(1);
    expect(result.isWholeNumber).toBe(true);
    expect(result.mixedNumber).toBeUndefined();
  });

  it('produces a negative whole number', () => {
    // -4/1 + 0/1 = -4/1
    const result = calculateFractionResult(-4, 1, 0, 1, 'add');
    expect(result.numerator).toBe(-4);
    expect(result.denominator).toBe(1);
    expect(result.isWholeNumber).toBe(true);
  });

  // --- Improper fraction -> mixed number ---
  it('produces a mixed-number breakdown for a positive improper result', () => {
    // 7/2 + 1/3 = (21+2)/6 = 23/6 -> 3 whole, 5/6 remainder
    const result = calculateFractionResult(7, 2, 1, 3, 'add');
    expect(result.numerator).toBe(23);
    expect(result.denominator).toBe(6);
    expect(result.isWholeNumber).toBe(false);
    expect(result.mixedNumber).toEqual({ whole: 3, numerator: 5, denominator: 6 });
  });

  it('produces a mixed-number breakdown for a negative improper result', () => {
    // 1/3 - 7/2 = (2 - 21)/6 = -19/6 -> whole -3, remainder 1/6
    const result = calculateFractionResult(1, 3, 7, 2, 'subtract');
    expect(result.numerator).toBe(-19);
    expect(result.denominator).toBe(6);
    expect(result.mixedNumber).toEqual({ whole: -3, numerator: 1, denominator: 6 });
  });

  it('does not produce a mixed number for a proper fraction', () => {
    // 1/2 + 1/3 = 5/6, |5| < 6, so no mixed number
    const result = calculateFractionResult(1, 2, 1, 3, 'add');
    expect(result.mixedNumber).toBeUndefined();
  });

  // --- Zero result ---
  it('produces 0/1 when the result is exactly zero', () => {
    // 1/2 - 1/2 = 0
    const result = calculateFractionResult(1, 2, 1, 2, 'subtract');
    expect(result.numerator).toBe(0);
    expect(result.denominator).toBe(1);
    expect(result.isWholeNumber).toBe(true);
  });

  // --- Negative denominators normalize correctly ---
  it('normalizes a negative denominator in either input fraction', () => {
    // 1/-2 + 1/2 = (1*2 + 1*-2) / (-2*2) = 0/-4 -> 0/1
    const result = calculateFractionResult(1, -2, 1, 2, 'add');
    expect(result.numerator).toBe(0);
    expect(result.denominator).toBe(1);
  });

  // --- Invalid inputs ---
  it('throws for a zero first denominator', () => {
    expect(() => calculateFractionResult(1, 0, 1, 2, 'add')).toThrow(RangeError);
  });

  it('throws for a zero second denominator', () => {
    expect(() => calculateFractionResult(1, 2, 1, 0, 'add')).toThrow(RangeError);
  });

  it('throws when dividing by a fraction with a zero numerator', () => {
    expect(() => calculateFractionResult(1, 2, 0, 5, 'divide')).toThrow(RangeError);
  });

  it('allows a zero numerator in the divisor for non-divide operations', () => {
    // 1/2 + 0/5 = 1/2 -- zero numerator is fine when not dividing
    const result = calculateFractionResult(1, 2, 0, 5, 'add');
    expect(result.numerator).toBe(1);
    expect(result.denominator).toBe(2);
  });

  it('throws for non-finite inputs', () => {
    expect(() => calculateFractionResult(NaN, 2, 1, 2, 'add')).toThrow(RangeError);
  });

  // --- Boundary values ---
  it('handles the maximum term bounds without producing NaN/Infinity', () => {
    const result = calculateFractionResult(
      FRACTION_INPUT_BOUNDS.MAX_TERM,
      1,
      FRACTION_INPUT_BOUNDS.MAX_TERM,
      1,
      'add',
    );
    expect(Number.isFinite(result.numerator)).toBe(true);
    expect(Number.isFinite(result.denominator)).toBe(true);
  });
});

describe('roundFractionValue', () => {
  it('rounds to 4 decimal places', () => {
    expect(roundFractionValue(5 / 6)).toBeCloseTo(0.8333, 4);
  });

  it('normalizes -0 to 0', () => {
    expect(Object.is(roundFractionValue(-0.00001), -0)).toBe(false);
  });
});

describe('validateNumerator1Input', () => {
  it('returns null for a valid integer', () => {
    expect(validateNumerator1Input('3')).toBeNull();
  });

  it('accepts a negative integer', () => {
    expect(validateNumerator1Input('-3')).toBeNull();
  });

  it('accepts zero', () => {
    expect(validateNumerator1Input('0')).toBeNull();
  });

  it('flags an empty field', () => {
    expect(validateNumerator1Input('')).toBe('NUMERATOR_1_REQUIRED');
  });

  it('flags non-numeric input', () => {
    expect(validateNumerator1Input('abc')).toBe('NUMERATOR_1_NOT_A_NUMBER');
  });

  it('flags a non-integer', () => {
    expect(validateNumerator1Input('1.5')).toBe('NUMERATOR_1_NOT_INTEGER');
  });

  it('flags a value out of range', () => {
    expect(validateNumerator1Input('99999')).toBe('NUMERATOR_1_OUT_OF_RANGE');
  });

  it('accepts the exact bounds', () => {
    expect(
      validateNumerator1Input(String(FRACTION_INPUT_BOUNDS.MIN_TERM)),
    ).toBeNull();
    expect(
      validateNumerator1Input(String(FRACTION_INPUT_BOUNDS.MAX_TERM)),
    ).toBeNull();
  });
});

describe('validateNumerator2Input', () => {
  it('returns null for a valid integer', () => {
    expect(validateNumerator2Input('4')).toBeNull();
  });

  it('flags an empty field', () => {
    expect(validateNumerator2Input('')).toBe('NUMERATOR_2_REQUIRED');
  });
});

describe('validateDenominator1Input', () => {
  it('returns null for a valid non-zero integer', () => {
    expect(validateDenominator1Input('5')).toBeNull();
  });

  it('flags an empty field', () => {
    expect(validateDenominator1Input('')).toBe('DENOMINATOR_1_REQUIRED');
  });

  it('flags non-numeric input', () => {
    expect(validateDenominator1Input('x')).toBe('DENOMINATOR_1_NOT_A_NUMBER');
  });

  it('flags a non-integer', () => {
    expect(validateDenominator1Input('2.5')).toBe('DENOMINATOR_1_NOT_INTEGER');
  });

  it('flags zero', () => {
    expect(validateDenominator1Input('0')).toBe('DENOMINATOR_1_ZERO');
  });

  it('flags a value out of range', () => {
    expect(validateDenominator1Input('-99999')).toBe(
      'DENOMINATOR_1_OUT_OF_RANGE',
    );
  });
});

describe('validateDenominator2Input', () => {
  it('returns null for a valid non-zero integer', () => {
    expect(validateDenominator2Input('7')).toBeNull();
  });

  it('flags zero', () => {
    expect(validateDenominator2Input('0')).toBe('DENOMINATOR_2_ZERO');
  });
});

describe('validateFractionInputs', () => {
  it('returns null for all fields when input is fully valid', () => {
    expect(validateFractionInputs('1', '2', '1', '3', 'add')).toEqual({
      numerator1Error: null,
      denominator1Error: null,
      numerator2Error: null,
      denominator2Error: null,
    });
  });

  it('reports errors for each field independently', () => {
    expect(validateFractionInputs('', '', '', '', 'add')).toEqual({
      numerator1Error: 'NUMERATOR_1_REQUIRED',
      denominator1Error: 'DENOMINATOR_1_REQUIRED',
      numerator2Error: 'NUMERATOR_2_REQUIRED',
      denominator2Error: 'DENOMINATOR_2_REQUIRED',
    });
  });

  it('flags DIVISOR_NUMERATOR_ZERO only when the operation is divide', () => {
    expect(
      validateFractionInputs('1', '2', '0', '5', 'divide').numerator2Error,
    ).toBe('DIVISOR_NUMERATOR_ZERO');
  });

  it('does not flag a zero second numerator for non-divide operations', () => {
    expect(
      validateFractionInputs('1', '2', '0', '5', 'add').numerator2Error,
    ).toBeNull();
    expect(
      validateFractionInputs('1', '2', '0', '5', 'multiply').numerator2Error,
    ).toBeNull();
  });
});
