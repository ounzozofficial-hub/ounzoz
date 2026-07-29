import { describe, expect, it } from 'vitest';
import {
  QUADRATIC_INPUT_BOUNDS,
  roundQuadraticValue,
  solveQuadraticEquation,
  validateAInput,
  validateBInput,
  validateCInput,
  validateQuadraticInputs,
} from './quadratic';

describe('solveQuadraticEquation', () => {
  // --- Two distinct real roots (discriminant > 0) ---
  it('solves x² - 3x + 2 = 0 -> roots 1 and 2', () => {
    // discriminant = 9 - 8 = 1, sqrt = 1
    // root1 = (3 + 1) / 2 = 2, root2 = (3 - 1) / 2 = 1
    const result = solveQuadraticEquation(1, -3, 2);
    expect(result).toEqual({
      rootType: 'two-real',
      root1: 2,
      root2: 1,
      discriminant: 1,
    });
  });

  it('solves 2x² + 5x - 3 = 0 -> roots 0.5 and -3', () => {
    // discriminant = 25 - 4*2*(-3) = 25 + 24 = 49, sqrt = 7
    // root1 = (-5 + 7) / 4 = 0.5, root2 = (-5 - 7) / 4 = -3
    const result = solveQuadraticEquation(2, 5, -3);
    expect(result).toEqual({
      rootType: 'two-real',
      root1: 0.5,
      root2: -3,
      discriminant: 49,
    });
  });

  it('solves with a negative leading coefficient: -x² + 4 = 0 -> roots -2 and 2', () => {
    // discriminant = 0 - 4*(-1)*4 = 16, sqrt = 4
    // root1 = (0 + 4) / -2 = -2, root2 = (0 - 4) / -2 = 2
    const result = solveQuadraticEquation(-1, 0, 4);
    expect(result).toEqual({
      rootType: 'two-real',
      root1: -2,
      root2: 2,
      discriminant: 16,
    });
  });

  // --- One repeated real root (discriminant = 0) ---
  it('solves x² + 2x + 1 = 0 -> repeated root -1', () => {
    // discriminant = 4 - 4 = 0, root = -2 / 2 = -1
    const result = solveQuadraticEquation(1, 2, 1);
    expect(result).toEqual({
      rootType: 'one-real',
      root: -1,
      discriminant: 0,
    });
  });

  it('solves 4x² - 4x + 1 = 0 -> repeated root 0.5', () => {
    // discriminant = 16 - 16 = 0, root = 4 / 8 = 0.5
    const result = solveQuadraticEquation(4, -4, 1);
    expect(result).toEqual({
      rootType: 'one-real',
      root: 0.5,
      discriminant: 0,
    });
  });

  // --- Complex roots (discriminant < 0) — never fabricated as real ---
  it('solves x² + 1 = 0 -> complex roots 0 ± 1i, no real answer fabricated', () => {
    // discriminant = 0 - 4 = -4
    // realPart = -0 / 2 = 0, imaginaryPart = sqrt(4) / 2 = 1
    const result = solveQuadraticEquation(1, 0, 1);
    expect(result).toEqual({
      rootType: 'complex',
      realPart: 0,
      imaginaryPart: 1,
      discriminant: -4,
    });
  });

  it('solves -x² + 2x - 5 = 0 -> complex roots 1 ± 2i', () => {
    // discriminant = 4 - 4*(-1)*(-5) = 4 - 20 = -16
    // realPart = -2 / (2*-1) = 1, imaginaryPart = sqrt(16) / (2*1) = 2
    const result = solveQuadraticEquation(-1, 2, -5);
    expect(result).toEqual({
      rootType: 'complex',
      realPart: 1,
      imaginaryPart: 2,
      discriminant: -16,
    });
  });

  it('always returns a non-negative imaginaryPart regardless of sign of a', () => {
    const result = solveQuadraticEquation(-1, 2, -5);
    expect(result.rootType).toBe('complex');
    if (result.rootType === 'complex') {
      expect(result.imaginaryPart).toBeGreaterThan(0);
    }
  });

  // --- Boundary values ---
  it('handles the maximum coefficient bounds without producing NaN/Infinity', () => {
    const result = solveQuadraticEquation(
      QUADRATIC_INPUT_BOUNDS.MAX_COEFFICIENT,
      QUADRATIC_INPUT_BOUNDS.MAX_COEFFICIENT,
      QUADRATIC_INPUT_BOUNDS.MAX_COEFFICIENT,
    );
    const values =
      result.rootType === 'two-real'
        ? [result.root1, result.root2]
        : result.rootType === 'one-real'
          ? [result.root]
          : [result.realPart, result.imaginaryPart];
    for (const v of values) {
      expect(Number.isFinite(v)).toBe(true);
    }
    expect(Number.isFinite(result.discriminant)).toBe(true);
  });

  it('handles the minimum (most negative) coefficient bounds without producing NaN/Infinity', () => {
    const result = solveQuadraticEquation(
      QUADRATIC_INPUT_BOUNDS.MIN_COEFFICIENT,
      QUADRATIC_INPUT_BOUNDS.MIN_COEFFICIENT,
      QUADRATIC_INPUT_BOUNDS.MIN_COEFFICIENT,
    );
    expect(Number.isFinite(result.discriminant)).toBe(true);
  });

  it('never returns -0 for a root that lands exactly on zero', () => {
    // x² - 4 = 0 -> roots 2 and -2, but check a case landing on 0 exactly:
    // x² + 0x + 0 = 0 -> discriminant 0, repeated root 0 (not -0)
    const result = solveQuadraticEquation(1, 0, 0);
    expect(result).toEqual({ rootType: 'one-real', root: 0, discriminant: 0 });
    if (result.rootType === 'one-real') {
      expect(Object.is(result.root, -0)).toBe(false);
    }
  });

  // --- Invalid inputs ---
  it('throws when a is zero', () => {
    expect(() => solveQuadraticEquation(0, 2, 1)).toThrow(RangeError);
  });

  it('throws when a is NaN', () => {
    expect(() => solveQuadraticEquation(NaN, 2, 1)).toThrow(RangeError);
  });

  it('throws when b is Infinity', () => {
    expect(() => solveQuadraticEquation(1, Infinity, 1)).toThrow(RangeError);
  });

  it('throws when c is NaN', () => {
    expect(() => solveQuadraticEquation(1, 2, NaN)).toThrow(RangeError);
  });
});

describe('roundQuadraticValue', () => {
  it('rounds to 4 decimal places', () => {
    expect(roundQuadraticValue(1 / 3)).toBe(0.3333);
  });

  it('normalizes -0 to 0', () => {
    expect(Object.is(roundQuadraticValue(-0.00001), -0)).toBe(false);
    expect(roundQuadraticValue(-0.00001)).toBe(0);
  });
});

describe('validateAInput', () => {
  it('returns null for a valid non-zero value', () => {
    expect(validateAInput('2')).toBeNull();
  });

  it('accepts a negative value', () => {
    expect(validateAInput('-3')).toBeNull();
  });

  it('flags an empty field', () => {
    expect(validateAInput('')).toBe('A_REQUIRED');
  });

  it('flags non-numeric input', () => {
    expect(validateAInput('abc')).toBe('A_NOT_A_NUMBER');
  });

  it('flags zero', () => {
    expect(validateAInput('0')).toBe('A_ZERO');
  });

  it('accepts the exact minimum and maximum bounds', () => {
    expect(
      validateAInput(String(QUADRATIC_INPUT_BOUNDS.MIN_COEFFICIENT)),
    ).toBeNull();
    expect(
      validateAInput(String(QUADRATIC_INPUT_BOUNDS.MAX_COEFFICIENT)),
    ).toBeNull();
  });

  it('flags a value just above the maximum bound', () => {
    expect(validateAInput('10001')).toBe('A_OUT_OF_RANGE');
  });

  it('flags a value just below the minimum bound', () => {
    expect(validateAInput('-10001')).toBe('A_OUT_OF_RANGE');
  });
});

describe('validateBInput', () => {
  it('returns null for a valid value', () => {
    expect(validateBInput('5')).toBeNull();
  });

  it('accepts zero (b may legitimately be zero)', () => {
    expect(validateBInput('0')).toBeNull();
  });

  it('flags an empty field', () => {
    expect(validateBInput('')).toBe('B_REQUIRED');
  });

  it('flags non-numeric input', () => {
    expect(validateBInput('xyz')).toBe('B_NOT_A_NUMBER');
  });

  it('flags a value out of range', () => {
    expect(validateBInput('99999')).toBe('B_OUT_OF_RANGE');
  });
});

describe('validateCInput', () => {
  it('returns null for a valid value', () => {
    expect(validateCInput('-7')).toBeNull();
  });

  it('accepts zero (c may legitimately be zero)', () => {
    expect(validateCInput('0')).toBeNull();
  });

  it('flags an empty field', () => {
    expect(validateCInput('')).toBe('C_REQUIRED');
  });

  it('flags non-numeric input', () => {
    expect(validateCInput('!!')).toBe('C_NOT_A_NUMBER');
  });

  it('flags a value out of range', () => {
    expect(validateCInput('-99999')).toBe('C_OUT_OF_RANGE');
  });
});

describe('validateQuadraticInputs', () => {
  it('returns null for all fields when input is fully valid', () => {
    expect(validateQuadraticInputs('1', '-3', '2')).toEqual({
      aError: null,
      bError: null,
      cError: null,
    });
  });

  it('reports errors for each field independently', () => {
    expect(validateQuadraticInputs('', '', '')).toEqual({
      aError: 'A_REQUIRED',
      bError: 'B_REQUIRED',
      cError: 'C_REQUIRED',
    });
  });

  it('flags only the invalid field, leaving the valid ones null', () => {
    expect(validateQuadraticInputs('1', '2', '')).toEqual({
      aError: null,
      bError: null,
      cError: 'C_REQUIRED',
    });
  });

  it('flags a alone when a is zero but b/c are valid', () => {
    expect(validateQuadraticInputs('0', '2', '3')).toEqual({
      aError: 'A_ZERO',
      bError: null,
      cError: null,
    });
  });
});
