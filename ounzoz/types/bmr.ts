export type { BiologicalSex } from './shared';

export interface BMRResult {
  /** Basal Metabolic Rate in calories/day, rounded to the nearest whole number */
  bmr: number;
}

export type BMRValidationError =
  | 'WEIGHT_REQUIRED'
  | 'HEIGHT_REQUIRED'
  | 'AGE_REQUIRED'
  | 'SEX_REQUIRED'
  | 'WEIGHT_NOT_A_NUMBER'
  | 'HEIGHT_NOT_A_NUMBER'
  | 'AGE_NOT_A_NUMBER'
  | 'WEIGHT_NOT_POSITIVE'
  | 'HEIGHT_NOT_POSITIVE'
  | 'AGE_NOT_POSITIVE'
  | 'WEIGHT_OUT_OF_RANGE'
  | 'HEIGHT_OUT_OF_RANGE'
  | 'AGE_OUT_OF_RANGE'
  | 'AGE_NOT_WHOLE_NUMBER';
