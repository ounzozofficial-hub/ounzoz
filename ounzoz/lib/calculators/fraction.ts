import type {
  FractionOperation,
  FractionResult,
  FractionValidationError,
} from '@/types/fraction';

// Sanity bounds — wide enough for any realistic arithmetic-homework
// fraction while catching fat-fingered input (CLAUDE.md Section 8).
const MIN_TERM = -10000;
const MAX_TERM = 10000;

/** Rounds to 4 decimal places and normalizes -0 to 0. */
export function roundFractionValue(value: number): number {
  return Math.round(value * 10000) / 10000 + 0;
}

/** Euclidean algorithm — greatest common divisor of two integers (sign-independent). */
export function greatestCommonDivisor(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return x;
}

interface RawFraction {
  numerator: number;
  denominator: number;
}

/**
 * Reduces a fraction to lowest terms and normalizes sign so the
 * denominator is always positive (e.g. 2/-4 -> -1/2, not 1/-2).
 * Pure function: throws rather than dividing by zero.
 */
export function simplifyFraction(
  numerator: number,
  denominator: number,
): RawFraction {
  if (denominator === 0) {
    throw new RangeError('denominator must not be zero');
  }
  if (numerator === 0) {
    return { numerator: 0, denominator: 1 };
  }

  const sign = denominator < 0 ? -1 : 1;
  const num = numerator * sign;
  const den = denominator * sign;
  const divisor = greatestCommonDivisor(num, den);
  return { numerator: num / divisor, denominator: den / divisor };
}

/**
 * Combines two fractions (n1/d1 <op> n2/d2) using the standard
 * cross-multiplication formulas, then simplifies the result via GCD
 * reduction:
 * - add:      (n1·d2 + n2·d1) / (d1·d2)
 * - subtract: (n1·d2 − n2·d1) / (d1·d2)
 * - multiply: (n1·n2) / (d1·d2)
 * - divide:   (n1·d2) / (d1·n2) — n2 must be non-zero (dividing by a
 *   zero-valued fraction is undefined).
 *
 * Pure function (CLAUDE.md Section 6): deterministic, no I/O, no
 * DOM/React state. Assumes inputs already passed validation; still
 * guards defensively against zero denominators/divisors.
 */
export function calculateFractionResult(
  numerator1: number,
  denominator1: number,
  numerator2: number,
  denominator2: number,
  operation: FractionOperation,
): FractionResult {
  if (!Number.isFinite(numerator1) || !Number.isFinite(denominator1)) {
    throw new RangeError('the first fraction must be finite numbers');
  }
  if (!Number.isFinite(numerator2) || !Number.isFinite(denominator2)) {
    throw new RangeError('the second fraction must be finite numbers');
  }
  if (denominator1 === 0 || denominator2 === 0) {
    throw new RangeError('denominators must not be zero');
  }

  let rawNumerator: number;
  let rawDenominator: number;

  switch (operation) {
    case 'add':
      rawNumerator = numerator1 * denominator2 + numerator2 * denominator1;
      rawDenominator = denominator1 * denominator2;
      break;
    case 'subtract':
      rawNumerator = numerator1 * denominator2 - numerator2 * denominator1;
      rawDenominator = denominator1 * denominator2;
      break;
    case 'multiply':
      rawNumerator = numerator1 * numerator2;
      rawDenominator = denominator1 * denominator2;
      break;
    case 'divide':
      if (numerator2 === 0) {
        throw new RangeError('cannot divide by a fraction with a zero numerator');
      }
      rawNumerator = numerator1 * denominator2;
      rawDenominator = denominator1 * numerator2;
      break;
  }

  const simplified = simplifyFraction(rawNumerator, rawDenominator);
  const decimal = roundFractionValue(simplified.numerator / simplified.denominator);
  const isWholeNumber = simplified.denominator === 1;

  let mixedNumber: FractionResult['mixedNumber'];
  if (!isWholeNumber && Math.abs(simplified.numerator) > simplified.denominator) {
    const whole = Math.trunc(simplified.numerator / simplified.denominator);
    const remainder = simplified.numerator - whole * simplified.denominator;
    mixedNumber = {
      whole,
      numerator: Math.abs(remainder),
      denominator: simplified.denominator,
    };
  }

  return {
    numerator: simplified.numerator,
    denominator: simplified.denominator,
    decimal,
    isWholeNumber,
    mixedNumber,
  };
}

// --- Validation ---

function validateIntegerTerm(
  raw: string,
  requiredError: FractionValidationError,
  notANumberError: FractionValidationError,
  notIntegerError: FractionValidationError,
  outOfRangeError: FractionValidationError,
): FractionValidationError | null {
  const trimmed = raw.trim();
  if (trimmed === '') return requiredError;

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return notANumberError;
  if (!Number.isInteger(value)) return notIntegerError;
  if (value < MIN_TERM || value > MAX_TERM) return outOfRangeError;
  return null;
}

export function validateNumerator1Input(
  raw: string,
): FractionValidationError | null {
  return validateIntegerTerm(
    raw,
    'NUMERATOR_1_REQUIRED',
    'NUMERATOR_1_NOT_A_NUMBER',
    'NUMERATOR_1_NOT_INTEGER',
    'NUMERATOR_1_OUT_OF_RANGE',
  );
}

export function validateNumerator2Input(
  raw: string,
): FractionValidationError | null {
  return validateIntegerTerm(
    raw,
    'NUMERATOR_2_REQUIRED',
    'NUMERATOR_2_NOT_A_NUMBER',
    'NUMERATOR_2_NOT_INTEGER',
    'NUMERATOR_2_OUT_OF_RANGE',
  );
}

export function validateDenominator1Input(
  raw: string,
): FractionValidationError | null {
  const trimmed = raw.trim();
  if (trimmed === '') return 'DENOMINATOR_1_REQUIRED';

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return 'DENOMINATOR_1_NOT_A_NUMBER';
  if (!Number.isInteger(value)) return 'DENOMINATOR_1_NOT_INTEGER';
  if (value === 0) return 'DENOMINATOR_1_ZERO';
  if (value < MIN_TERM || value > MAX_TERM) return 'DENOMINATOR_1_OUT_OF_RANGE';
  return null;
}

export function validateDenominator2Input(
  raw: string,
): FractionValidationError | null {
  const trimmed = raw.trim();
  if (trimmed === '') return 'DENOMINATOR_2_REQUIRED';

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return 'DENOMINATOR_2_NOT_A_NUMBER';
  if (!Number.isInteger(value)) return 'DENOMINATOR_2_NOT_INTEGER';
  if (value === 0) return 'DENOMINATOR_2_ZERO';
  if (value < MIN_TERM || value > MAX_TERM) return 'DENOMINATOR_2_OUT_OF_RANGE';
  return null;
}

export function validateFractionInputs(
  numerator1Raw: string,
  denominator1Raw: string,
  numerator2Raw: string,
  denominator2Raw: string,
  operation: FractionOperation,
): {
  numerator1Error: FractionValidationError | null;
  denominator1Error: FractionValidationError | null;
  numerator2Error: FractionValidationError | null;
  denominator2Error: FractionValidationError | null;
} {
  const numerator1Error = validateNumerator1Input(numerator1Raw);
  const denominator1Error = validateDenominator1Input(denominator1Raw);
  let numerator2Error = validateNumerator2Input(numerator2Raw);
  const denominator2Error = validateDenominator2Input(denominator2Raw);

  // Operation-dependent rule (mirrors PercentageCalculator's WHOLE_CANNOT_BE_ZERO
  // pattern): dividing by a fraction whose numerator is 0 is undefined,
  // but only when the operation is actually division.
  if (
    !numerator2Error &&
    operation === 'divide' &&
    Number(numerator2Raw.trim()) === 0
  ) {
    numerator2Error = 'DIVISOR_NUMERATOR_ZERO';
  }

  return {
    numerator1Error,
    denominator1Error,
    numerator2Error,
    denominator2Error,
  };
}

export const FRACTION_INPUT_BOUNDS = {
  MIN_TERM,
  MAX_TERM,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const FRACTION_VALIDATION_MESSAGES: Record<
  FractionValidationError,
  string
> = {
  NUMERATOR_1_REQUIRED: 'Enter the numerator of the first fraction.',
  NUMERATOR_1_NOT_A_NUMBER: 'The numerator must be a number.',
  NUMERATOR_1_NOT_INTEGER: 'The numerator must be a whole number.',
  NUMERATOR_1_OUT_OF_RANGE: `Enter a numerator between ${MIN_TERM} and ${MAX_TERM}.`,
  DENOMINATOR_1_REQUIRED: 'Enter the denominator of the first fraction.',
  DENOMINATOR_1_NOT_A_NUMBER: 'The denominator must be a number.',
  DENOMINATOR_1_NOT_INTEGER: 'The denominator must be a whole number.',
  DENOMINATOR_1_ZERO: 'The denominator cannot be zero.',
  DENOMINATOR_1_OUT_OF_RANGE: `Enter a denominator between ${MIN_TERM} and ${MAX_TERM}.`,
  NUMERATOR_2_REQUIRED: 'Enter the numerator of the second fraction.',
  NUMERATOR_2_NOT_A_NUMBER: 'The numerator must be a number.',
  NUMERATOR_2_NOT_INTEGER: 'The numerator must be a whole number.',
  NUMERATOR_2_OUT_OF_RANGE: `Enter a numerator between ${MIN_TERM} and ${MAX_TERM}.`,
  DENOMINATOR_2_REQUIRED: 'Enter the denominator of the second fraction.',
  DENOMINATOR_2_NOT_A_NUMBER: 'The denominator must be a number.',
  DENOMINATOR_2_NOT_INTEGER: 'The denominator must be a whole number.',
  DENOMINATOR_2_ZERO: 'The denominator cannot be zero.',
  DENOMINATOR_2_OUT_OF_RANGE: `Enter a denominator between ${MIN_TERM} and ${MAX_TERM}.`,
  DIVISOR_NUMERATOR_ZERO:
    'Cannot divide by a fraction with a zero numerator (that fraction equals zero).',
};
