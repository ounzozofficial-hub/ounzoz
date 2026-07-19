export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface BMICategoryInfo {
  category: BMICategory;
  /** Human-readable label, e.g. "Normal weight" */
  label: string;
}

export interface BMIResult {
  /** BMI value rounded to 1 decimal place, e.g. 22.4 */
  bmi: number;
  category: BMICategoryInfo;
}

export type BMIValidationError =
  | 'WEIGHT_REQUIRED'
  | 'HEIGHT_REQUIRED'
  | 'WEIGHT_NOT_A_NUMBER'
  | 'HEIGHT_NOT_A_NUMBER'
  | 'WEIGHT_NOT_POSITIVE'
  | 'HEIGHT_NOT_POSITIVE'
  | 'WEIGHT_OUT_OF_RANGE'
  | 'HEIGHT_OUT_OF_RANGE';
