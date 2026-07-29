import type {
  StatisticsResult,
  StatisticsValidationError,
} from '@/types/statistics';

// Sanity bounds — a small in-class data set up to a genuinely large pasted
// list, and individual values wide enough for any realistic homework
// data set while catching fat-fingered input (CLAUDE.md Section 8).
const MIN_COUNT = 2;
const MAX_COUNT = 200;
const MIN_VALUE = -1_000_000;
const MAX_VALUE = 1_000_000;

/** Rounds to 2 decimal places and normalizes -0 to 0. */
export function roundStatisticsValue(value: number): number {
  return Math.round(value * 100) / 100 + 0;
}

/**
 * Splits free-form text into individual number tokens (as strings, not
 * yet parsed/validated) — accepts commas, semicolons, newlines, and
 * plain whitespace as separators so a pasted column, a comma list, or a
 * space-separated line all work the same way. Empty tokens (from
 * trailing separators, blank lines) are dropped.
 */
export function extractNumberTokens(raw: string): string[] {
  return raw
    .split(/[,;\n]+/)
    .flatMap((chunk) => chunk.trim().split(/\s+/))
    .map((token) => token.trim())
    .filter((token) => token !== '');
}

/** Parses already-validated text into a number array. */
export function parseNumberList(raw: string): number[] {
  return extractNumberTokens(raw).map(Number);
}

/**
 * Arithmetic mean: sum of values divided by count.
 * Pure function (CLAUDE.md Section 6). Assumes values already passed
 * validation; still guards against an empty array.
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) {
    throw new RangeError('values must contain at least one number');
  }
  const sum = values.reduce((total, value) => total + value, 0);
  return roundStatisticsValue(sum / values.length);
}

/**
 * Median: the middle value of the sorted list, or the average of the
 * two middle values when the count is even.
 */
export function calculateMedian(values: number[]): number {
  if (values.length === 0) {
    throw new RangeError('values must contain at least one number');
  }
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return roundStatisticsValue((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return roundStatisticsValue(sorted[mid]);
}

/**
 * Mode: the most frequently occurring value(s). Returns "No mode" when
 * every value appears exactly once (nothing actually repeats), or a
 * comma-joined list when multiple values are tied for the highest
 * frequency (a multi-modal data set) — never silently picks one
 * arbitrarily among ties.
 */
export function calculateMode(values: number[]): string {
  if (values.length === 0) {
    throw new RangeError('values must contain at least one number');
  }
  const frequency = new Map<number, number>();
  for (const value of values) {
    frequency.set(value, (frequency.get(value) ?? 0) + 1);
  }
  const maxFrequency = Math.max(...frequency.values());
  if (maxFrequency === 1) return 'No mode';

  const modes = [...frequency.entries()]
    .filter(([, count]) => count === maxFrequency)
    .map(([value]) => value)
    .sort((a, b) => a - b);
  return modes.map((value) => String(roundStatisticsValue(value))).join(', ');
}

/**
 * Population standard deviation: σ = √(Σ(x − mean)² / n). This tool
 * treats the entered numbers as the complete data set of interest (not
 * a sample used to infer a larger population), so it divides by n
 * rather than n − 1 — the population formula is the more defensible
 * default without knowing whether the numbers represent a sample.
 */
export function calculateStandardDeviation(values: number[]): number {
  if (values.length === 0) {
    throw new RangeError('values must contain at least one number');
  }
  const mean = values.reduce((total, value) => total + value, 0) / values.length;
  const variance =
    values.reduce((total, value) => total + (value - mean) ** 2, 0) /
    values.length;
  return roundStatisticsValue(Math.sqrt(variance));
}

/**
 * Runs the full set of statistics on a parsed number list.
 * Pure function (CLAUDE.md Section 6): deterministic, no I/O, no
 * DOM/React state. Assumes values already passed validation; still
 * guards against an empty array.
 */
export function getStatisticsResult(values: number[]): StatisticsResult {
  if (values.length === 0) {
    throw new RangeError('values must contain at least one number');
  }
  return {
    count: values.length,
    mean: calculateMean(values),
    median: calculateMedian(values),
    mode: calculateMode(values),
    standardDeviation: calculateStandardDeviation(values),
  };
}

// --- Validation ---

export function validateStatisticsInput(
  raw: string,
): StatisticsValidationError | null {
  const tokens = extractNumberTokens(raw);
  if (tokens.length === 0) return 'INPUT_REQUIRED';

  for (const token of tokens) {
    if (!Number.isFinite(Number(token))) return 'INPUT_CONTAINS_INVALID_NUMBER';
  }
  if (tokens.length < MIN_COUNT) return 'INPUT_TOO_FEW_VALUES';
  if (tokens.length > MAX_COUNT) return 'INPUT_TOO_MANY_VALUES';

  for (const token of tokens) {
    const value = Number(token);
    if (value < MIN_VALUE || value > MAX_VALUE) return 'INPUT_VALUE_OUT_OF_RANGE';
  }
  return null;
}

export const STATISTICS_INPUT_BOUNDS = {
  MIN_COUNT,
  MAX_COUNT,
  MIN_VALUE,
  MAX_VALUE,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const STATISTICS_VALIDATION_MESSAGES: Record<
  StatisticsValidationError,
  string
> = {
  INPUT_REQUIRED: 'Enter a list of numbers, separated by commas or one per line.',
  INPUT_CONTAINS_INVALID_NUMBER:
    'One or more entries is not a valid number — check for stray letters or symbols.',
  INPUT_TOO_FEW_VALUES: `Enter at least ${MIN_COUNT} numbers.`,
  INPUT_TOO_MANY_VALUES: `Enter no more than ${MAX_COUNT} numbers.`,
  INPUT_VALUE_OUT_OF_RANGE: `Each number must be between ${MIN_VALUE.toLocaleString('en-US')} and ${MAX_VALUE.toLocaleString('en-US')}.`,
};
