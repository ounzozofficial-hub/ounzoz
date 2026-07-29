export type FractionOperation = 'add' | 'subtract' | 'multiply' | 'divide';

export interface FractionMixedNumber {
  whole: number;
  /** Always non-negative — the sign lives on `whole` */
  numerator: number;
  denominator: number;
}

export interface FractionResult {
  /** Simplified numerator (sign carried here; denominator is always positive) */
  numerator: number;
  denominator: number;
  /** Decimal equivalent, rounded to 4 decimal places */
  decimal: number;
  /** True when the simplified fraction reduces to a whole number (denominator === 1) */
  isWholeNumber: boolean;
  /** Present only when the result is an improper fraction (not a whole number) */
  mixedNumber?: FractionMixedNumber;
}

export type FractionValidationError =
  | 'NUMERATOR_1_REQUIRED'
  | 'NUMERATOR_1_NOT_A_NUMBER'
  | 'NUMERATOR_1_NOT_INTEGER'
  | 'NUMERATOR_1_OUT_OF_RANGE'
  | 'DENOMINATOR_1_REQUIRED'
  | 'DENOMINATOR_1_NOT_A_NUMBER'
  | 'DENOMINATOR_1_NOT_INTEGER'
  | 'DENOMINATOR_1_ZERO'
  | 'DENOMINATOR_1_OUT_OF_RANGE'
  | 'NUMERATOR_2_REQUIRED'
  | 'NUMERATOR_2_NOT_A_NUMBER'
  | 'NUMERATOR_2_NOT_INTEGER'
  | 'NUMERATOR_2_OUT_OF_RANGE'
  | 'DENOMINATOR_2_REQUIRED'
  | 'DENOMINATOR_2_NOT_A_NUMBER'
  | 'DENOMINATOR_2_NOT_INTEGER'
  | 'DENOMINATOR_2_ZERO'
  | 'DENOMINATOR_2_OUT_OF_RANGE'
  | 'DIVISOR_NUMERATOR_ZERO';
