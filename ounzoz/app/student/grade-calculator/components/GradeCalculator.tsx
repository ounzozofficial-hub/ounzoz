'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import type { BreadcrumbItem } from '@/types/shared';
import { ResultCard } from '@/components/shared/ResultCard';
import { getGradeResult, validateCategoryRow } from '@/lib/calculators/grade';
import type { GradeResult as GradeResultType } from '@/types/grade';
import { GradeForm, type CategoryRowState } from './GradeForm';
import { GradeResult } from './GradeResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

const EMPTY_ROW: CategoryRowState = {
  categoryName: '',
  weight: '',
  score: '',
  weightError: null,
  scoreError: null,
};

export interface GradeCalculatorProps {
  breadcrumbItems: BreadcrumbItem[];
  title: string;
  description: string;
  /** Pre-rendered server content — ArticleLayout, FAQ, related tools.
   * Passed in from page.tsx rather than owned here, since none of it
   * needs client interactivity; only the form + result do. */
  contentSlot: ReactNode;
  faqSlot: ReactNode;
  relatedToolsSlot: ReactNode;
}

// Top-level composition for this tool — owns all interactive state (the
// dynamic category-row list + result) and is the only place that calls
// into lib/calculators/grade.ts. Same dynamic-row-list shape as GPA
// Calculator, implemented independently (CLAUDE.md Tool Independence):
// state is an array validated row-by-row (CLAUDE.md Section 8 — every
// input validated, no partial rows silently ignored).
export function GradeCalculator({
  breadcrumbItems,
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: GradeCalculatorProps) {
  const [rows, setRows] = useState<CategoryRowState[]>([{ ...EMPTY_ROW }]);
  const [result, setResult] = useState<GradeResultType | null>(null);
  // Separate from field-level errors: only set if fully validated rows
  // somehow still fail to calculate. CLAUDE.md Section 8 — this is the
  // defensive backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handleCategoryNameChange(index: number, value: string) {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, categoryName: value } : row,
      ),
    );
  }

  function handleWeightChange(index: number, value: string) {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, weight: value, weightError: null } : row,
      ),
    );
  }

  function handleScoreChange(index: number, value: string) {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, score: value, scoreError: null } : row,
      ),
    );
  }

  function handleAddRow() {
    setRows((prev) => [...prev, { ...EMPTY_ROW }]);
    setResult(null);
  }

  function handleRemoveRow(index: number) {
    setRows((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev,
    );
    setResult(null);
  }

  function handleSubmit() {
    const validatedRows = rows.map((row) => {
      const { weightError, scoreError } = validateCategoryRow(
        row.weight,
        row.score,
      );
      return { ...row, weightError, scoreError };
    });
    setRows(validatedRows);

    const hasAnyError = validatedRows.some(
      (row) => row.weightError || row.scoreError,
    );
    if (hasAnyError) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      const categories = validatedRows.map((row) => ({
        // weightError/scoreError are both null here, so weight and score
        // are guaranteed valid finite numbers in range.
        weight: Number(row.weight),
        score: Number(row.score),
      }));
      const nextResult = getGradeResult(categories);
      setResult(nextResult);
      setUnexpectedError(false);
    } catch {
      // Front-end validation already guards against this in normal use
      // (including the all-zero-weight edge case, which per-row bounds
      // checking alone can't catch); this only fires if that guard is
      // ever bypassed. Never let a raw exception, NaN, or Infinity reach
      // the UI.
      setResult(null);
      setUnexpectedError(true);
    }
  }

  return (
    <CalculatorLayout
      breadcrumbItems={breadcrumbItems}
      title={title}
      description={description}
      inputSlot={
        <GradeForm
          rows={rows}
          onCategoryNameChange={handleCategoryNameChange}
          onWeightChange={handleWeightChange}
          onScoreChange={handleScoreChange}
          onAddRow={handleAddRow}
          onRemoveRow={handleRemoveRow}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <GradeResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
