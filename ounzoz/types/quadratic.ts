interface QuadraticResultBase {
  /** b² − 4ac, rounded to 4 decimal places */
  discriminant: number;
}

export interface QuadraticTwoRealResult extends QuadraticResultBase {
  rootType: 'two-real';
  root1: number;
  root2: number;
}

export interface QuadraticOneRealResult extends QuadraticResultBase {
  rootType: 'one-real';
  root: number;
}

/** discriminant < 0: no real roots. realPart/imaginaryPart describe the
 * complex conjugate pair (realPart ± imaginaryPart·i) — shown as
 * supporting context, never presented as a real answer. */
export interface QuadraticComplexResult extends QuadraticResultBase {
  rootType: 'complex';
  realPart: number;
  imaginaryPart: number;
}

export type QuadraticResult =
  | QuadraticTwoRealResult
  | QuadraticOneRealResult
  | QuadraticComplexResult;

export type QuadraticValidationError =
  | 'A_REQUIRED'
  | 'A_NOT_A_NUMBER'
  | 'A_ZERO'
  | 'A_OUT_OF_RANGE'
  | 'B_REQUIRED'
  | 'B_NOT_A_NUMBER'
  | 'B_OUT_OF_RANGE'
  | 'C_REQUIRED'
  | 'C_NOT_A_NUMBER'
  | 'C_OUT_OF_RANGE';
