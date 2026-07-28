import type {
  IsWhatPercentResult,
  PercentChangeResult,
  PercentageMode,
  PercentageValidationError,
  PercentOfResult,
} from '@/types/percentage';

/**
 * Rounds a percentage-math result to a sane precision (6 decimal places)
 * to strip floating-point noise (e.g. 33.330000000000005) before it ever
 * reaches the UI — CLAUDE.md Section 8. The UI rounds further for
 * display (2 decimals, trailing zeros trimmed); this function only
 * guards against raw float artifacts, not display formatting.
 */
export function roundPercentageValue(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

/**
 * "What is X% of Y?" — the most common percentage-calculator query
 * (discounts, tips, tax). Formula: (percent / 100) × ofValue.
 */
export function calculatePercentOf(percent: number, ofValue: number): number {
  if (!Number.isFinite(percent)) {
    throw new RangeError('percent must be a finite number');
  }
  if (!Number.isFinite(ofValue)) {
    throw new RangeError('ofValue must be a finite number');
  }
  return roundPercentageValue((percent / 100) * ofValue);
}

/**
 * "X is what percent of Y?" — e.g. test scores, budget shares. Formula:
 * (part / whole) × 100. whole must not be zero (undefined otherwise).
 */
export function calculateIsWhatPercent(part: number, whole: number): number {
  if (!Number.isFinite(part)) {
    throw new RangeError('part must be a finite number');
  }
  if (!Number.isFinite(whole) || whole === 0) {
    throw new RangeError('whole must be a non-zero finite number');
  }
  return roundPercentageValue((part / whole) * 100);
}

/**
 * Percentage change from one value to another — e.g. price changes,
 * growth/decline stats. Formula: ((toValue − fromValue) / fromValue) ×
 * 100. fromValue must not be zero (percentage change from zero is
 * mathematically undefined). Result is signed: positive = increase,
 * negative = decrease, zero = no change.
 */
export function calculatePercentChange(
  fromValue: number,
  toValue: number,
): number {
  if (!Number.isFinite(fromValue) || fromValue === 0) {
    throw new RangeError('fromValue must be a non-zero finite number');
  }
  if (!Number.isFinite(toValue)) {
    throw new RangeError('toValue must be a finite number');
  }
  return roundPercentageValue(((toValue - fromValue) / fromValue) * 100);
}

export function getPercentOfResult(
  percent: number,
  ofValue: number,
): PercentOfResult {
  return {
    mode: 'percent-of',
    value: calculatePercentOf(percent, ofValue),
    percent,
    ofValue,
  };
}

export function getIsWhatPercentResult(
  part: number,
  whole: number,
): IsWhatPercentResult {
  return {
    mode: 'is-what-percent',
    value: calculateIsWhatPercent(part, whole),
    part,
    whole,
  };
}

export function getPercentChangeResult(
  fromValue: number,
  toValue: number,
): PercentChangeResult {
  const value = calculatePercentChange(fromValue, toValue);
  const direction = value > 0 ? 'increase' : value < 0 ? 'decrease' : 'no-change';
  return { mode: 'percent-change', value, direction, fromValue, toValue };
}

// --- Validation ---

function validateRequiredNumber(
  raw: string,
  requiredError: PercentageValidationError,
  notANumberError: PercentageValidationError,
): PercentageValidationError | null {
  const trimmed = raw.trim();
  if (trimmed === '') return requiredError;
  if (!Number.isFinite(Number(trimmed))) return notANumberError;
  return null;
}

interface ModeFieldErrors {
  firstError: PercentageValidationError | null;
  secondError: PercentageValidationError | null;
}

export function validatePercentOfInputs(
  percentRaw: string,
  ofRaw: string,
): ModeFieldErrors {
  return {
    firstError: validateRequiredNumber(
      percentRaw,
      'PERCENT_REQUIRED',
      'PERCENT_NOT_A_NUMBER',
    ),
    secondError: validateRequiredNumber(ofRaw, 'OF_REQUIRED', 'OF_NOT_A_NUMBER'),
  };
}

export function validateIsWhatPercentInputs(
  partRaw: string,
  wholeRaw: string,
): ModeFieldErrors {
  const firstError = validateRequiredNumber(
    partRaw,
    'PART_REQUIRED',
    'PART_NOT_A_NUMBER',
  );
  let secondError = validateRequiredNumber(
    wholeRaw,
    'WHOLE_REQUIRED',
    'WHOLE_NOT_A_NUMBER',
  );
  if (!secondError && Number(wholeRaw.trim()) === 0) {
    secondError = 'WHOLE_CANNOT_BE_ZERO';
  }
  return { firstError, secondError };
}

export function validatePercentChangeInputs(
  fromRaw: string,
  toRaw: string,
): ModeFieldErrors {
  let firstError = validateRequiredNumber(
    fromRaw,
    'FROM_REQUIRED',
    'FROM_NOT_A_NUMBER',
  );
  if (!firstError && Number(fromRaw.trim()) === 0) {
    firstError = 'FROM_CANNOT_BE_ZERO';
  }
  const secondError = validateRequiredNumber(toRaw, 'TO_REQUIRED', 'TO_NOT_A_NUMBER');
  return { firstError, secondError };
}

/** Dispatches to the right mode-specific validator — the single entry point PercentageCalculator calls on submit. */
export function validatePercentageInputs(
  mode: PercentageMode,
  firstRaw: string,
  secondRaw: string,
): ModeFieldErrors {
  switch (mode) {
    case 'percent-of':
      return validatePercentOfInputs(firstRaw, secondRaw);
    case 'is-what-percent':
      return validateIsWhatPercentInputs(firstRaw, secondRaw);
    case 'percent-change':
      return validatePercentChangeInputs(firstRaw, secondRaw);
  }
}

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const PERCENTAGE_VALIDATION_MESSAGES: Record<
  PercentageValidationError,
  string
> = {
  PERCENT_REQUIRED: 'Enter a percentage.',
  PERCENT_NOT_A_NUMBER: 'Percentage must be a number.',
  OF_REQUIRED: 'Enter the number to calculate the percentage of.',
  OF_NOT_A_NUMBER: 'This value must be a number.',
  PART_REQUIRED: 'Enter the first number.',
  PART_NOT_A_NUMBER: 'This value must be a number.',
  WHOLE_REQUIRED: 'Enter the second number.',
  WHOLE_NOT_A_NUMBER: 'This value must be a number.',
  WHOLE_CANNOT_BE_ZERO:
    'This value cannot be zero (dividing by zero is undefined).',
  FROM_REQUIRED: 'Enter the starting value.',
  FROM_NOT_A_NUMBER: 'This value must be a number.',
  FROM_CANNOT_BE_ZERO:
    'The starting value cannot be zero (percentage change from zero is undefined).',
  TO_REQUIRED: 'Enter the ending value.',
  TO_NOT_A_NUMBER: 'This value must be a number.',
};
