'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  getGPAResult,
  validateCourseRow,
} from '@/lib/calculators/gpa';
import type { GPAResult as GPAResultType, Grade } from '@/types/gpa';
import { GPAForm, type CourseRowState } from './GPAForm';
import { GPAResult } from './GPAResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

const EMPTY_ROW: CourseRowState = {
  grade: null,
  creditHours: '',
  gradeError: null,
  creditHoursError: null,
};

export interface GPACalculatorProps {
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
// dynamic course-row list + result) and is the only place that calls
// into lib/calculators/gpa.ts. Structurally different from every prior
// tool: a variable-length list of rows rather than a fixed field set, so
// state is an array validated row-by-row (CLAUDE.md Section 8 — every
// input validated, no partial rows silently ignored) rather than a flat
// set of named fields.
export function GPACalculator({
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: GPACalculatorProps) {
  const [rows, setRows] = useState<CourseRowState[]>([{ ...EMPTY_ROW }]);
  const [result, setResult] = useState<GPAResultType | null>(null);
  // Separate from field-level errors: only set if fully validated rows
  // somehow still fail to calculate. CLAUDE.md Section 8 — this is the
  // defensive backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handleGradeChange(index: number, grade: Grade) {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, grade, gradeError: null } : row,
      ),
    );
  }

  function handleCreditHoursChange(index: number, value: string) {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? { ...row, creditHours: value, creditHoursError: null }
          : row,
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
      const { gradeError, creditHoursError } = validateCourseRow(
        row.grade,
        row.creditHours,
      );
      return { ...row, gradeError, creditHoursError };
    });
    setRows(validatedRows);

    const hasAnyError = validatedRows.some(
      (row) => row.gradeError || row.creditHoursError,
    );
    if (hasAnyError) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      const courses = validatedRows.map((row) => ({
        // gradeError/creditHoursError are both null here, so grade is
        // guaranteed non-null and creditHours is a valid finite number.
        grade: row.grade as Grade,
        creditHours: Number(row.creditHours),
      }));
      const nextResult = getGPAResult(courses);
      setResult(nextResult);
      setUnexpectedError(false);
    } catch {
      // Front-end validation already guards against this in normal use;
      // this only fires if that guard is ever bypassed. Never let a raw
      // exception, NaN, or Infinity reach the UI.
      setResult(null);
      setUnexpectedError(true);
    }
  }

  return (
    <CalculatorLayout
      title={title}
      description={description}
      inputSlot={
        <GPAForm
          rows={rows}
          onGradeChange={handleGradeChange}
          onCreditHoursChange={handleCreditHoursChange}
          onAddRow={handleAddRow}
          onRemoveRow={handleRemoveRow}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <GPAResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
