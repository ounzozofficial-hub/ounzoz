export interface StatisticsResult {
  count: number;
  mean: number;
  median: number;
  /** Comma-joined list of the modal value(s), or "No mode" when no value repeats */
  mode: string;
  /** Population standard deviation, rounded to 2 decimal places */
  standardDeviation: number;
}

export type StatisticsValidationError =
  | 'INPUT_REQUIRED'
  | 'INPUT_CONTAINS_INVALID_NUMBER'
  | 'INPUT_TOO_FEW_VALUES'
  | 'INPUT_TOO_MANY_VALUES'
  | 'INPUT_VALUE_OUT_OF_RANGE';
