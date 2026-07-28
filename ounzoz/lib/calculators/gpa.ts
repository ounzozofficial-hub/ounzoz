import type { GPAResult, GPARowValidationError, Grade } from '@/types/gpa';

// Standard unweighted US 4.0 scale with +/- grades — the most common
// scale used by mainstream US institutions. Grading scales genuinely
// vary by school (some skip +/-, some weight honors/AP courses, some use
// different point values entirely) — this is called out explicitly in
// the page content and FAQ rather than silently assumed away, since
// presenting one scale as definitive without that caveat would be a
// factual-accuracy problem (CLAUDE.md Section 15 / SEO.md Section 4).
export const GRADE_POINTS: Record<Grade, number> = {
  A: 4.0,
  'A-': 3.7,
  'B+': 3.3,
  B: 3.0,
  'B-': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  'D+': 1.3,
  D: 1.0,
  'D-': 0.7,
  F: 0.0,
};

export const GRADE_OPTIONS: Grade[] = Object.keys(GRADE_POINTS) as Grade[];

// Sanity bounds for a single course's credit load — not an institutional
// rule, just wide enough to cover real course loads (a 0.5-credit lab up
// to a 10-credit capstone/thesis course) while catching fat-fingered
// input (CLAUDE.md Section 8).
const MIN_CREDIT_HOURS = 0.5;
const MAX_CREDIT_HOURS = 10;

export interface CourseInput {
  grade: Grade;
  creditHours: number;
}

/**
 * Calculates a weighted-average GPA on the standard unweighted 4.0 scale.
 *
 * Formula: GPA = Σ(grade points × credit hours) / Σ(credit hours) — the
 * standard credit-hour-weighted GPA formula used by essentially every US
 * institution's registrar, regardless of the exact point scale in use.
 *
 * Pure function (CLAUDE.md Section 6). Assumes inputs already passed
 * validation; still range-checks defensively and throws RangeError
 * rather than ever producing NaN/Infinity (CLAUDE.md Section 8).
 *
 * @param courses - one or more {grade, creditHours} entries
 * @returns GPA rounded to 2 decimal places
 */
export function calculateGPA(courses: CourseInput[]): number {
  if (!Array.isArray(courses) || courses.length === 0) {
    throw new RangeError('courses must be a non-empty array');
  }

  let totalPoints = 0;
  let totalCreditHours = 0;

  for (const course of courses) {
    const points = GRADE_POINTS[course.grade];
    if (points === undefined) {
      throw new RangeError('grade must be a recognized Grade');
    }
    if (!Number.isFinite(course.creditHours) || course.creditHours <= 0) {
      throw new RangeError('creditHours must be a positive finite number');
    }
    totalPoints += points * course.creditHours;
    totalCreditHours += course.creditHours;
  }

  if (totalCreditHours <= 0) {
    throw new RangeError('total credit hours must be greater than zero');
  }

  return Math.round((totalPoints / totalCreditHours) * 100) / 100;
}

/**
 * Runs the full calculation and returns the GPA alongside the
 * course-count/credit-hour context, so the result panel can show how the
 * number was built (same "show the components" pattern used across the
 * platform).
 */
export function getGPAResult(courses: CourseInput[]): GPAResult {
  const gpa = calculateGPA(courses);
  const totalCreditHours = courses.reduce(
    (sum, course) => sum + course.creditHours,
    0,
  );

  return {
    gpa,
    totalCreditHours: Math.round(totalCreditHours * 100) / 100,
    courseCount: courses.length,
  };
}

// --- Validation (per-row) ---

export function validateGradeInput(
  grade: Grade | null,
): GPARowValidationError | null {
  return grade === null ? 'GRADE_REQUIRED' : null;
}

export function validateCreditHoursInput(
  creditHoursRaw: string,
): GPARowValidationError | null {
  const trimmed = creditHoursRaw.trim();
  if (trimmed === '') return 'CREDIT_HOURS_REQUIRED';

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return 'CREDIT_HOURS_NOT_A_NUMBER';
  if (value <= 0) return 'CREDIT_HOURS_NOT_POSITIVE';
  if (value < MIN_CREDIT_HOURS || value > MAX_CREDIT_HOURS) {
    return 'CREDIT_HOURS_OUT_OF_RANGE';
  }
  return null;
}

export function validateCourseRow(
  grade: Grade | null,
  creditHoursRaw: string,
): {
  gradeError: GPARowValidationError | null;
  creditHoursError: GPARowValidationError | null;
} {
  return {
    gradeError: validateGradeInput(grade),
    creditHoursError: validateCreditHoursInput(creditHoursRaw),
  };
}

export const GPA_INPUT_BOUNDS = {
  MIN_CREDIT_HOURS,
  MAX_CREDIT_HOURS,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const GPA_VALIDATION_MESSAGES: Record<GPARowValidationError, string> =
  {
    GRADE_REQUIRED: 'Select a grade for this course.',
    CREDIT_HOURS_REQUIRED: 'Enter the credit hours for this course.',
    CREDIT_HOURS_NOT_A_NUMBER: 'Credit hours must be a number.',
    CREDIT_HOURS_NOT_POSITIVE: 'Credit hours must be greater than zero.',
    CREDIT_HOURS_OUT_OF_RANGE: `Enter credit hours between ${MIN_CREDIT_HOURS} and ${MAX_CREDIT_HOURS}.`,
  };
