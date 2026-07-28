export interface StudyTimeResult {
  /** Hours available per topic, rounded to 1 decimal place */
  hoursPerTopic: number;
  /** Total available study hours across the full period, rounded to 1 decimal place */
  totalAvailableHours: number;
  /** True when hoursPerTopic falls below the advisory threshold (DESIGN.md Section 11.1) */
  belowAdvisoryThreshold: boolean;
}

// Study Time Calculator only needs days/hoursPerDay/topics — a different
// field set from every other tool, so this is its own small,
// self-contained validation error type rather than reusing any existing
// union (CLAUDE.md Section 5).
export type StudyTimeValidationError =
  | 'DAYS_REQUIRED'
  | 'DAYS_NOT_A_NUMBER'
  | 'DAYS_NOT_POSITIVE'
  | 'DAYS_NOT_WHOLE_NUMBER'
  | 'DAYS_OUT_OF_RANGE'
  | 'HOURS_PER_DAY_REQUIRED'
  | 'HOURS_PER_DAY_NOT_A_NUMBER'
  | 'HOURS_PER_DAY_NOT_POSITIVE'
  | 'HOURS_PER_DAY_OUT_OF_RANGE'
  | 'TOPICS_REQUIRED'
  | 'TOPICS_NOT_A_NUMBER'
  | 'TOPICS_NOT_POSITIVE'
  | 'TOPICS_NOT_WHOLE_NUMBER'
  | 'TOPICS_OUT_OF_RANGE';
