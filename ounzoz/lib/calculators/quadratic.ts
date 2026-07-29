import type { QuadraticResult, QuadraticValidationError } from '@/types/quadratic';

// Sanity bounds on each coefficient — wide enough for any realistic
// algebra-course equation while catching fat-fingered input (CLAUDE.md
// Section 8), same "generous but bounded" convention used across every
// prior tool's sanity bounds.
const MIN_COEFFICIENT = -10000;
const MAX_COEFFICIENT = 10000;

/**
 * Rounds to 4 decimal places and normalizes -0 to 0 — algebra results
 * are often exact or near-exact (e.g. 1.9999999999999998 from float
 * arithmetic), so this strips that noise before it ever reaches the UI
 * (CLAUDE.md Section 8), the same role roundPercentageValue plays for
 * the Percentage Calculator.
 */
export function roundQuadraticValue(value: number): number {
  return Math.round(value * 10000) / 10000 + 0;
}

/**
 * Solves ax² + bx + c = 0 via the quadratic formula:
 * x = (−b ± √(b² − 4ac)) / 2a.
 *
 * The discriminant (b² − 4ac) determines which of three cases applies:
 * - > 0: two distinct real roots
 * - = 0: one repeated real root
 * - < 0: no real roots — the two roots are a complex conjugate pair.
 *   This case is reported as such (realPart/imaginaryPart), never as a
 *   fabricated real number (CLAUDE.md Section 8's "never let invalid
 *   math reach the UI" extends to never presenting a complex result as
 *   if it were real).
 *
 * Pure function (CLAUDE.md Section 6): deterministic, no I/O, no
 * DOM/React state. Assumes inputs already passed validation; still
 * guards defensively (a must be non-zero — otherwise this isn't a
 * quadratic equation) rather than ever dividing by zero.
 *
 * @param a - coefficient of x², must not be 0
 * @param b - coefficient of x
 * @param c - constant term
 */
export function solveQuadraticEquation(
  a: number,
  b: number,
  c: number,
): QuadraticResult {
  if (!Number.isFinite(a) || a === 0) {
    throw new RangeError('a must be a non-zero finite number');
  }
  if (!Number.isFinite(b)) {
    throw new RangeError('b must be a finite number');
  }
  if (!Number.isFinite(c)) {
    throw new RangeError('c must be a finite number');
  }

  const rawDiscriminant = b * b - 4 * a * c;
  const discriminant = roundQuadraticValue(rawDiscriminant);

  if (rawDiscriminant > 0) {
    const sqrtDiscriminant = Math.sqrt(rawDiscriminant);
    return {
      rootType: 'two-real',
      root1: roundQuadraticValue((-b + sqrtDiscriminant) / (2 * a)),
      root2: roundQuadraticValue((-b - sqrtDiscriminant) / (2 * a)),
      discriminant,
    };
  }

  if (rawDiscriminant === 0) {
    return {
      rootType: 'one-real',
      root: roundQuadraticValue(-b / (2 * a)),
      discriminant,
    };
  }

  return {
    rootType: 'complex',
    realPart: roundQuadraticValue(-b / (2 * a)),
    imaginaryPart: roundQuadraticValue(Math.sqrt(-rawDiscriminant) / (2 * Math.abs(a))),
    discriminant,
  };
}

// --- Validation ---

export function validateAInput(aRaw: string): QuadraticValidationError | null {
  const trimmed = aRaw.trim();
  if (trimmed === '') return 'A_REQUIRED';

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return 'A_NOT_A_NUMBER';
  if (value === 0) return 'A_ZERO';
  if (value < MIN_COEFFICIENT || value > MAX_COEFFICIENT) return 'A_OUT_OF_RANGE';
  return null;
}

export function validateBInput(bRaw: string): QuadraticValidationError | null {
  const trimmed = bRaw.trim();
  if (trimmed === '') return 'B_REQUIRED';

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return 'B_NOT_A_NUMBER';
  if (value < MIN_COEFFICIENT || value > MAX_COEFFICIENT) return 'B_OUT_OF_RANGE';
  return null;
}

export function validateCInput(cRaw: string): QuadraticValidationError | null {
  const trimmed = cRaw.trim();
  if (trimmed === '') return 'C_REQUIRED';

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return 'C_NOT_A_NUMBER';
  if (value < MIN_COEFFICIENT || value > MAX_COEFFICIENT) return 'C_OUT_OF_RANGE';
  return null;
}

export function validateQuadraticInputs(
  aRaw: string,
  bRaw: string,
  cRaw: string,
): {
  aError: QuadraticValidationError | null;
  bError: QuadraticValidationError | null;
  cError: QuadraticValidationError | null;
} {
  return {
    aError: validateAInput(aRaw),
    bError: validateBInput(bRaw),
    cError: validateCInput(cRaw),
  };
}

export const QUADRATIC_INPUT_BOUNDS = {
  MIN_COEFFICIENT,
  MAX_COEFFICIENT,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const QUADRATIC_VALIDATION_MESSAGES: Record<
  QuadraticValidationError,
  string
> = {
  A_REQUIRED: 'Enter the coefficient of x² (a).',
  A_NOT_A_NUMBER: 'a must be a number.',
  A_ZERO:
    'a cannot be zero — with a = 0 this is a linear equation, not a quadratic one.',
  A_OUT_OF_RANGE: `Enter a value for a between ${MIN_COEFFICIENT} and ${MAX_COEFFICIENT}.`,
  B_REQUIRED: 'Enter the coefficient of x (b).',
  B_NOT_A_NUMBER: 'b must be a number.',
  B_OUT_OF_RANGE: `Enter a value for b between ${MIN_COEFFICIENT} and ${MAX_COEFFICIENT}.`,
  C_REQUIRED: 'Enter the constant term (c).',
  C_NOT_A_NUMBER: 'c must be a number.',
  C_OUT_OF_RANGE: `Enter a value for c between ${MIN_COEFFICIENT} and ${MAX_COEFFICIENT}.`,
};
