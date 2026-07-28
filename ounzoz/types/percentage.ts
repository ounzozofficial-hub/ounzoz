export type PercentageMode = 'percent-of' | 'is-what-percent' | 'percent-change';

export interface PercentOfResult {
  mode: 'percent-of';
  /** (percent / 100) × ofValue */
  value: number;
  percent: number;
  ofValue: number;
}

export interface IsWhatPercentResult {
  mode: 'is-what-percent';
  /** (part / whole) × 100 */
  value: number;
  part: number;
  whole: number;
}

export interface PercentChangeResult {
  mode: 'percent-change';
  /** ((toValue − fromValue) / fromValue) × 100 — signed: positive = increase, negative = decrease */
  value: number;
  direction: 'increase' | 'decrease' | 'no-change';
  fromValue: number;
  toValue: number;
}

// Discriminated union on `mode` so PercentageResult.tsx can render each
// mode's result without a separate result type per mode field in state.
export type PercentageResult =
  | PercentOfResult
  | IsWhatPercentResult
  | PercentChangeResult;

// Percentage Calculator is structurally different from every prior
// Finance tool — three independent calculation modes sharing a two-field
// form, rather than one fixed field set — so its validation errors are
// grouped by mode rather than by a single field name (CLAUDE.md Section
// 5: this is its own self-contained error type, not reused elsewhere).
export type PercentageValidationError =
  | 'PERCENT_REQUIRED'
  | 'PERCENT_NOT_A_NUMBER'
  | 'OF_REQUIRED'
  | 'OF_NOT_A_NUMBER'
  | 'PART_REQUIRED'
  | 'PART_NOT_A_NUMBER'
  | 'WHOLE_REQUIRED'
  | 'WHOLE_NOT_A_NUMBER'
  | 'WHOLE_CANNOT_BE_ZERO'
  | 'FROM_REQUIRED'
  | 'FROM_NOT_A_NUMBER'
  | 'FROM_CANNOT_BE_ZERO'
  | 'TO_REQUIRED'
  | 'TO_NOT_A_NUMBER';
