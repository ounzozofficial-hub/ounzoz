import type {
  GradeResult,
  GradeRowValidationError,
  LetterGrade,
} from '@/types/grade';

const MIN_PERCENT = 0;
const MAX_PERCENT = 100;

// Standard US percentage-to-letter-grade scale (90/80/70/60 cutoffs).
// Institutions genuinely vary here — some shift the cutoffs (e.g. an A
// starting at 93, not 90) or add +/- letter grades — called out
// explicitly in the page content and FAQ rather than silently assumed
// away, same honest-disclaimer approach GPA Calculator takes for its own
// scale (CLAUDE.md Section 15 / SEO.md Section 4). Ordered descending by
// threshold so the first match in getLetterGrade is correct.
const LETTER_GRADE_THRESHOLDS: { min: number; grade: LetterGrade }[] = [
  { min: 90, grade: 'A' },
  { min: 80, grade: 'B' },
  { min: 70, grade: 'C' },
  { min: 60, grade: 'D' },
  { min: 0, grade: 'F' },
];

export interface CategoryInput {
  weight: number;
  score: number;
}

/**
 * Maps an overall percentage to a letter grade on the standard US scale.
 * Boundaries are inclusive on the lower end (exactly 90 is an A).
 */
export function getLetterGrade(percent: number): LetterGrade {
  if (!Number.isFinite(percent) || percent < 0) {
    throw new RangeError('percent must be a finite number of zero or more');
  }
  // LETTER_GRADE_THRESHOLDS always has a 0-min entry, so this is only
  // reached for a percent the guard above already rejected.
  const bracket = LETTER_GRADE_THRESHOLDS.find((t) => percent >= t.min);
  if (!bracket) {
    throw new RangeError('percent did not match any letter-grade bracket');
  }
  return bracket.grade;
}

/**
 * Calculates the overall weighted-category grade as a percentage.
 *
 * Formula: overall % = Σ(category score × category weight) / Σ(category
 * weight) — the standard weighted-average grade calculation used by
 * course syllabi that split grading into categories (homework, quizzes,
 * exams, etc.). Weights are normalized by their own sum rather than
 * requiring them to total exactly 100, so a partially-entered course (not
 * every category graded yet) still produces a correct weighted average of
 * what has been entered.
 *
 * Pure function (CLAUDE.md Section 6). Assumes inputs already passed
 * validation; still range-checks defensively and throws RangeError
 * rather than ever producing NaN/Infinity (CLAUDE.md Section 8).
 *
 * @param categories - one or more {weight, score} entries, each 0-100
 * @returns overall percentage rounded to 2 decimal places
 */
export function calculateOverallGrade(categories: CategoryInput[]): number {
  if (!Array.isArray(categories) || categories.length === 0) {
    throw new RangeError('categories must be a non-empty array');
  }

  let weightedSum = 0;
  let totalWeight = 0;

  for (const category of categories) {
    if (
      !Number.isFinite(category.weight) ||
      category.weight < MIN_PERCENT ||
      category.weight > MAX_PERCENT
    ) {
      throw new RangeError('weight must be a finite number between 0 and 100');
    }
    if (
      !Number.isFinite(category.score) ||
      category.score < MIN_PERCENT ||
      category.score > MAX_PERCENT
    ) {
      throw new RangeError('score must be a finite number between 0 and 100');
    }
    weightedSum += category.score * category.weight;
    totalWeight += category.weight;
  }

  if (totalWeight <= 0) {
    throw new RangeError('total weight must be greater than zero');
  }

  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

/**
 * Runs the full calculation and returns the overall percentage, letter
 * grade, and category-count/total-weight context together, so the result
 * panel can show how the number was built (same "show the components"
 * pattern used across the platform).
 */
export function getGradeResult(categories: CategoryInput[]): GradeResult {
  const overallPercent = calculateOverallGrade(categories);
  const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0);

  return {
    overallPercent,
    letterGrade: getLetterGrade(overallPercent),
    totalWeight: Math.round(totalWeight * 100) / 100,
    categoryCount: categories.length,
  };
}

// --- Validation (per-row) ---

export function validateWeightInput(
  weightRaw: string,
): GradeRowValidationError | null {
  const trimmed = weightRaw.trim();
  if (trimmed === '') return 'WEIGHT_REQUIRED';

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return 'WEIGHT_NOT_A_NUMBER';
  if (value < MIN_PERCENT || value > MAX_PERCENT) return 'WEIGHT_OUT_OF_RANGE';
  return null;
}

export function validateScoreInput(
  scoreRaw: string,
): GradeRowValidationError | null {
  const trimmed = scoreRaw.trim();
  if (trimmed === '') return 'SCORE_REQUIRED';

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return 'SCORE_NOT_A_NUMBER';
  if (value < MIN_PERCENT || value > MAX_PERCENT) return 'SCORE_OUT_OF_RANGE';
  return null;
}

export function validateCategoryRow(
  weightRaw: string,
  scoreRaw: string,
): {
  weightError: GradeRowValidationError | null;
  scoreError: GradeRowValidationError | null;
} {
  return {
    weightError: validateWeightInput(weightRaw),
    scoreError: validateScoreInput(scoreRaw),
  };
}

export const GRADE_INPUT_BOUNDS = {
  MIN_PERCENT,
  MAX_PERCENT,
} as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const GRADE_VALIDATION_MESSAGES: Record<
  GradeRowValidationError,
  string
> = {
  WEIGHT_REQUIRED: "Enter this category's weight.",
  WEIGHT_NOT_A_NUMBER: 'Weight must be a number.',
  WEIGHT_OUT_OF_RANGE: 'Weight must be between 0 and 100.',
  SCORE_REQUIRED: "Enter this category's score.",
  SCORE_NOT_A_NUMBER: 'Score must be a number.',
  SCORE_OUT_OF_RANGE: 'Score must be between 0 and 100.',
};
