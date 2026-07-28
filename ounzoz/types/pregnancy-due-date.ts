export interface GestationalAge {
  /** Completed weeks pregnant */
  weeks: number;
  /** Remaining days within the current week (0–6) */
  days: number;
}

export interface PregnancyDueDateResult {
  /** Estimated due date per Naegele's Rule (LMP + 280 days / 40 weeks) */
  dueDate: Date;
  /** Current gestational age, relative to the reference ("today") date
   * passed to getPregnancyDueDateResult */
  gestationalAge: GestationalAge;
  /** Trimester as of the same reference date: 1, 2, or 3 */
  trimester: 1 | 2 | 3;
  /** Days remaining until the estimated due date; negative once past it */
  daysRemaining: number;
}

// Pregnancy Due Date Calculator is a standalone tool with no relationship
// to any other tool's fields (CLAUDE.md Section 5) — this validation
// error set is its own, not built on any other tool's.
export type PregnancyDueDateValidationError =
  | 'LMP_DATE_REQUIRED'
  | 'LMP_DATE_INVALID'
  | 'LMP_DATE_IN_FUTURE'
  | 'LMP_DATE_TOO_FAR_IN_PAST';
