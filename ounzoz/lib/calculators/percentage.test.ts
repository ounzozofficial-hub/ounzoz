import { describe, expect, it } from 'vitest';
import {
  calculateIsWhatPercent,
  calculatePercentChange,
  calculatePercentOf,
  getIsWhatPercentResult,
  getPercentChangeResult,
  getPercentOfResult,
  roundPercentageValue,
  validateIsWhatPercentInputs,
  validatePercentChangeInputs,
  validatePercentOfInputs,
  validatePercentageInputs,
} from './percentage';

describe('calculatePercentOf', () => {
  // --- Normal / expected cases ---
  it('calculates 20% of 50', () => {
    expect(calculatePercentOf(20, 50)).toBe(10);
  });

  it('calculates 45% of 200', () => {
    expect(calculatePercentOf(45, 200)).toBe(90);
  });

  it('calculates 12.5% of 80 (decimal percent)', () => {
    expect(calculatePercentOf(12.5, 80)).toBe(10);
  });

  it('calculates a percentage over 100%', () => {
    // 150% of 40 = 60
    expect(calculatePercentOf(150, 40)).toBe(60);
  });

  it('handles a negative percent', () => {
    expect(calculatePercentOf(-20, 50)).toBe(-10);
  });

  it('handles a negative "of" value', () => {
    expect(calculatePercentOf(20, -50)).toBe(-10);
  });

  // --- Boundary / zero cases ---
  it('returns 0 for 0%', () => {
    expect(calculatePercentOf(0, 100)).toBe(0);
  });

  it('returns 0 for 0 "of" value', () => {
    expect(calculatePercentOf(50, 0)).toBe(0);
  });

  it('returns the same value for 100%', () => {
    expect(calculatePercentOf(100, 100)).toBe(100);
  });

  // --- Invalid inputs ---
  it('throws for NaN percent', () => {
    expect(() => calculatePercentOf(NaN, 100)).toThrow(RangeError);
  });

  it('throws for Infinity "of" value', () => {
    expect(() => calculatePercentOf(20, Infinity)).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculatePercentOf(33.33, 300);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('calculateIsWhatPercent', () => {
  // --- Normal / expected cases ---
  it('calculates 25 is what percent of 200', () => {
    expect(calculateIsWhatPercent(25, 200)).toBe(12.5);
  });

  it('calculates 50 is what percent of 50', () => {
    expect(calculateIsWhatPercent(50, 50)).toBe(100);
  });

  it('handles a negative part', () => {
    expect(calculateIsWhatPercent(-25, 200)).toBe(-12.5);
  });

  it('handles a negative whole', () => {
    expect(calculateIsWhatPercent(25, -100)).toBe(-25);
  });

  // --- Boundary cases ---
  it('returns 0 when part is 0', () => {
    expect(calculateIsWhatPercent(0, 50)).toBe(0);
  });

  it('returns 100 when part equals whole', () => {
    expect(calculateIsWhatPercent(42, 42)).toBe(100);
  });

  // --- Invalid inputs ---
  it('throws when whole is zero', () => {
    expect(() => calculateIsWhatPercent(25, 0)).toThrow(RangeError);
  });

  it('throws for NaN part', () => {
    expect(() => calculateIsWhatPercent(NaN, 50)).toThrow(RangeError);
  });

  it('throws for Infinity whole', () => {
    expect(() => calculateIsWhatPercent(25, Infinity)).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculateIsWhatPercent(33, 99);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('calculatePercentChange', () => {
  // --- Normal / expected cases ---
  it('calculates a 25% increase from 80 to 100', () => {
    expect(calculatePercentChange(80, 100)).toBe(25);
  });

  it('calculates a 20% decrease from 100 to 80', () => {
    expect(calculatePercentChange(100, 80)).toBe(-20);
  });

  it('calculates a 50% decrease from 200 to 100', () => {
    expect(calculatePercentChange(200, 100)).toBe(-50);
  });

  it('reports no change when from equals to', () => {
    expect(calculatePercentChange(50, 50)).toBe(0);
  });

  it('handles a negative "from" value correctly per the formula', () => {
    // ((-25) - (-50)) / (-50) * 100 = (25 / -50) * 100 = -50
    expect(calculatePercentChange(-50, -25)).toBe(-50);
  });

  it('calculates a change to a negative value', () => {
    // ((-10) - 10) / 10 * 100 = -200
    expect(calculatePercentChange(10, -10)).toBe(-200);
  });

  // --- Invalid inputs ---
  it('throws when fromValue is zero', () => {
    expect(() => calculatePercentChange(0, 100)).toThrow(RangeError);
  });

  it('throws for NaN toValue', () => {
    expect(() => calculatePercentChange(80, NaN)).toThrow(RangeError);
  });

  it('throws for Infinity fromValue', () => {
    expect(() => calculatePercentChange(Infinity, 100)).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    const result = calculatePercentChange(37, 111);
    expect(Number.isFinite(result)).toBe(true);
  });
});

describe('roundPercentageValue', () => {
  it('strips floating-point noise beyond 6 decimal places', () => {
    // 1/3 * 100 = 33.333333333333336 in raw JS float math
    const raw = (1 / 3) * 100;
    expect(roundPercentageValue(raw)).toBe(33.333333);
  });
});

describe('getPercentOfResult', () => {
  it('returns the mode, value, and original inputs', () => {
    const result = getPercentOfResult(20, 50);
    expect(result).toEqual({ mode: 'percent-of', value: 10, percent: 20, ofValue: 50 });
  });
});

describe('getIsWhatPercentResult', () => {
  it('returns the mode, value, and original inputs', () => {
    const result = getIsWhatPercentResult(25, 200);
    expect(result).toEqual({
      mode: 'is-what-percent',
      value: 12.5,
      part: 25,
      whole: 200,
    });
  });
});

describe('getPercentChangeResult', () => {
  it('labels a positive change as an increase', () => {
    const result = getPercentChangeResult(80, 100);
    expect(result).toEqual({
      mode: 'percent-change',
      value: 25,
      direction: 'increase',
      fromValue: 80,
      toValue: 100,
    });
  });

  it('labels a negative change as a decrease', () => {
    const result = getPercentChangeResult(100, 80);
    expect(result.direction).toBe('decrease');
  });

  it('labels a zero change as no-change', () => {
    const result = getPercentChangeResult(50, 50);
    expect(result.direction).toBe('no-change');
  });
});

describe('validatePercentOfInputs', () => {
  it('returns null errors for valid input', () => {
    expect(validatePercentOfInputs('20', '50')).toEqual({
      firstError: null,
      secondError: null,
    });
  });

  it('flags empty fields as required', () => {
    expect(validatePercentOfInputs('', '')).toEqual({
      firstError: 'PERCENT_REQUIRED',
      secondError: 'OF_REQUIRED',
    });
  });

  it('flags non-numeric fields', () => {
    expect(validatePercentOfInputs('abc', 'xyz')).toEqual({
      firstError: 'PERCENT_NOT_A_NUMBER',
      secondError: 'OF_NOT_A_NUMBER',
    });
  });

  it('accepts zero and negative numbers as valid', () => {
    expect(validatePercentOfInputs('0', '-50')).toEqual({
      firstError: null,
      secondError: null,
    });
  });
});

describe('validateIsWhatPercentInputs', () => {
  it('returns null errors for valid input', () => {
    expect(validateIsWhatPercentInputs('25', '200')).toEqual({
      firstError: null,
      secondError: null,
    });
  });

  it('flags a zero whole specifically, not just "not a number"', () => {
    expect(validateIsWhatPercentInputs('25', '0')).toEqual({
      firstError: null,
      secondError: 'WHOLE_CANNOT_BE_ZERO',
    });
  });

  it('flags empty fields as required', () => {
    expect(validateIsWhatPercentInputs('', '')).toEqual({
      firstError: 'PART_REQUIRED',
      secondError: 'WHOLE_REQUIRED',
    });
  });
});

describe('validatePercentChangeInputs', () => {
  it('returns null errors for valid input', () => {
    expect(validatePercentChangeInputs('80', '100')).toEqual({
      firstError: null,
      secondError: null,
    });
  });

  it('flags a zero "from" value specifically', () => {
    expect(validatePercentChangeInputs('0', '100')).toEqual({
      firstError: 'FROM_CANNOT_BE_ZERO',
      secondError: null,
    });
  });

  it('allows a zero "to" value', () => {
    expect(validatePercentChangeInputs('80', '0')).toEqual({
      firstError: null,
      secondError: null,
    });
  });

  it('flags empty fields as required', () => {
    expect(validatePercentChangeInputs('', '')).toEqual({
      firstError: 'FROM_REQUIRED',
      secondError: 'TO_REQUIRED',
    });
  });
});

describe('validatePercentageInputs (mode dispatch)', () => {
  it('dispatches to the percent-of validator', () => {
    expect(validatePercentageInputs('percent-of', '', '')).toEqual({
      firstError: 'PERCENT_REQUIRED',
      secondError: 'OF_REQUIRED',
    });
  });

  it('dispatches to the is-what-percent validator', () => {
    expect(validatePercentageInputs('is-what-percent', '', '')).toEqual({
      firstError: 'PART_REQUIRED',
      secondError: 'WHOLE_REQUIRED',
    });
  });

  it('dispatches to the percent-change validator', () => {
    expect(validatePercentageInputs('percent-change', '', '')).toEqual({
      firstError: 'FROM_REQUIRED',
      secondError: 'TO_REQUIRED',
    });
  });
});
