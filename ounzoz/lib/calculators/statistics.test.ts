import { describe, expect, it } from 'vitest';
import {
  STATISTICS_INPUT_BOUNDS,
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateStandardDeviation,
  extractNumberTokens,
  getStatisticsResult,
  parseNumberList,
  roundStatisticsValue,
  validateStatisticsInput,
} from './statistics';

describe('extractNumberTokens', () => {
  it('splits a comma-separated list', () => {
    expect(extractNumberTokens('1, 2, 3')).toEqual(['1', '2', '3']);
  });

  it('splits a newline-separated list', () => {
    expect(extractNumberTokens('1\n2\n3')).toEqual(['1', '2', '3']);
  });

  it('splits a space-separated list', () => {
    expect(extractNumberTokens('1 2 3')).toEqual(['1', '2', '3']);
  });

  it('handles a mix of commas, newlines, and extra whitespace', () => {
    expect(extractNumberTokens(' 1,2\n 3 ,4\n\n5 ')).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
    ]);
  });

  it('drops empty tokens from trailing separators', () => {
    expect(extractNumberTokens('1, 2, ')).toEqual(['1', '2']);
  });

  it('returns an empty array for blank input', () => {
    expect(extractNumberTokens('   ')).toEqual([]);
  });

  it('preserves negative signs and decimals as single tokens', () => {
    expect(extractNumberTokens('-1.5, 2.75, -3')).toEqual([
      '-1.5',
      '2.75',
      '-3',
    ]);
  });
});

describe('calculateMean', () => {
  it('calculates the mean of a typical data set', () => {
    // [2,4,4,4,5,5,7,9] sum=40, count=8 -> 5
    expect(calculateMean([2, 4, 4, 4, 5, 5, 7, 9])).toBe(5);
  });

  it('rounds a non-exact mean to 2 decimal places', () => {
    // [1,2,3,4,5] sum=15/5 = 3
    expect(calculateMean([1, 2, 3, 4, 5])).toBe(3);
  });

  it('handles negative values', () => {
    expect(calculateMean([-1, -2, -3])).toBe(-2);
  });

  it('throws for an empty array', () => {
    expect(() => calculateMean([])).toThrow(RangeError);
  });
});

describe('calculateMedian', () => {
  it('returns the middle value for an odd-length list', () => {
    expect(calculateMedian([1, 2, 3, 4, 5])).toBe(3);
  });

  it('averages the two middle values for an even-length list', () => {
    // sorted [2,4,4,4,5,5,7,9], mid values at index 3,4 = 4,5 -> 4.5
    expect(calculateMedian([2, 4, 4, 4, 5, 5, 7, 9])).toBe(4.5);
  });

  it('does not require pre-sorted input', () => {
    expect(calculateMedian([5, 1, 3, 2, 4])).toBe(3);
  });

  it('handles negative values', () => {
    expect(calculateMedian([-5, -1, -3])).toBe(-3);
  });

  it('throws for an empty array', () => {
    expect(() => calculateMedian([])).toThrow(RangeError);
  });
});

describe('calculateMode', () => {
  it('returns the single most frequent value', () => {
    // [2,4,4,4,5,5,7,9]: 4 appears 3 times, most of any value
    expect(calculateMode([2, 4, 4, 4, 5, 5, 7, 9])).toBe('4');
  });

  it('returns "No mode" when every value appears exactly once', () => {
    expect(calculateMode([1, 2, 3, 4, 5])).toBe('No mode');
  });

  it('returns all tied values, sorted ascending, for a multi-modal set', () => {
    // [1,1,2,2,3]: 1 and 2 both appear twice
    expect(calculateMode([1, 1, 2, 2, 3])).toBe('1, 2');
  });

  it('handles a single-element array (no repeats possible)', () => {
    expect(calculateMode([5])).toBe('No mode');
  });

  it('throws for an empty array', () => {
    expect(() => calculateMode([])).toThrow(RangeError);
  });
});

describe('calculateStandardDeviation', () => {
  it('calculates population standard deviation for a typical data set', () => {
    // [2,4,4,4,5,5,7,9]: mean=5, variance=32/8=4, stddev=sqrt(4)=2
    expect(calculateStandardDeviation([2, 4, 4, 4, 5, 5, 7, 9])).toBe(2);
  });

  it('calculates standard deviation for a data set with no repeats', () => {
    // [1,2,3,4,5]: mean=3, variance=10/5=2, stddev=sqrt(2)=1.41421356... -> 1.41
    expect(calculateStandardDeviation([1, 2, 3, 4, 5])).toBe(1.41);
  });

  it('calculates standard deviation for a bimodal data set', () => {
    // [1,1,2,2,3]: mean=1.8, variance=2.8/5=0.56, stddev=sqrt(0.56)=0.7483... -> 0.75
    expect(calculateStandardDeviation([1, 1, 2, 2, 3])).toBe(0.75);
  });

  it('returns 0 for a data set where every value is identical', () => {
    expect(calculateStandardDeviation([5, 5, 5, 5])).toBe(0);
  });

  it('throws for an empty array', () => {
    expect(() => calculateStandardDeviation([])).toThrow(RangeError);
  });
});

describe('getStatisticsResult', () => {
  it('returns mean, median, mode, and standard deviation together', () => {
    const result = getStatisticsResult([2, 4, 4, 4, 5, 5, 7, 9]);
    expect(result).toEqual({
      count: 8,
      mean: 5,
      median: 4.5,
      mode: '4',
      standardDeviation: 2,
    });
  });

  it('matches the individual calculate* functions for the same input', () => {
    const values = [1, 2, 3, 4, 5];
    const result = getStatisticsResult(values);
    expect(result.mean).toBe(calculateMean(values));
    expect(result.median).toBe(calculateMedian(values));
    expect(result.mode).toBe(calculateMode(values));
    expect(result.standardDeviation).toBe(calculateStandardDeviation(values));
  });

  it('throws for an empty array', () => {
    expect(() => getStatisticsResult([])).toThrow(RangeError);
  });
});

describe('parseNumberList', () => {
  it('parses a valid comma-separated string into numbers', () => {
    expect(parseNumberList('1, 2, 3')).toEqual([1, 2, 3]);
  });

  it('parses negative and decimal numbers', () => {
    expect(parseNumberList('-1.5, 2.75')).toEqual([-1.5, 2.75]);
  });
});

describe('roundStatisticsValue', () => {
  it('rounds to 2 decimal places', () => {
    expect(roundStatisticsValue(1 / 3)).toBe(0.33);
  });

  it('normalizes -0 to 0', () => {
    expect(Object.is(roundStatisticsValue(-0.001), -0)).toBe(false);
  });
});

describe('validateStatisticsInput', () => {
  it('returns null for a valid comma-separated list', () => {
    expect(validateStatisticsInput('1, 2, 3, 4')).toBeNull();
  });

  it('returns null for a valid newline-separated list', () => {
    expect(validateStatisticsInput('1\n2\n3\n4')).toBeNull();
  });

  it('flags an empty field', () => {
    expect(validateStatisticsInput('')).toBe('INPUT_REQUIRED');
  });

  it('flags whitespace-only input', () => {
    expect(validateStatisticsInput('   ')).toBe('INPUT_REQUIRED');
  });

  it('flags a non-numeric entry among otherwise valid numbers', () => {
    expect(validateStatisticsInput('1, two, 3')).toBe(
      'INPUT_CONTAINS_INVALID_NUMBER',
    );
  });

  it('flags a single-value input as too few', () => {
    expect(validateStatisticsInput('5')).toBe('INPUT_TOO_FEW_VALUES');
  });

  it('accepts the exact minimum count', () => {
    expect(validateStatisticsInput('1, 2')).toBeNull();
  });

  it('flags a value out of range', () => {
    expect(
      validateStatisticsInput(
        `1, ${STATISTICS_INPUT_BOUNDS.MAX_VALUE + 1}`,
      ),
    ).toBe('INPUT_VALUE_OUT_OF_RANGE');
  });

  it('accepts a value at the exact maximum bound', () => {
    expect(
      validateStatisticsInput(`1, ${STATISTICS_INPUT_BOUNDS.MAX_VALUE}`),
    ).toBeNull();
  });

  it('flags a list exceeding the maximum count', () => {
    const tooMany = Array.from({ length: STATISTICS_INPUT_BOUNDS.MAX_COUNT + 1 }, (_, i) => i).join(',');
    expect(validateStatisticsInput(tooMany)).toBe('INPUT_TOO_MANY_VALUES');
  });

  it('accepts a list at the exact maximum count', () => {
    const maxCount = Array.from({ length: STATISTICS_INPUT_BOUNDS.MAX_COUNT }, (_, i) => i).join(',');
    expect(validateStatisticsInput(maxCount)).toBeNull();
  });
});
