'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import type { BreadcrumbItem } from '@/types/shared';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  getStatisticsResult,
  parseNumberList,
  validateStatisticsInput,
} from '@/lib/calculators/statistics';
import type {
  StatisticsResult as StatisticsResultType,
  StatisticsValidationError,
} from '@/types/statistics';
import { StatisticsForm } from './StatisticsForm';
import { StatisticsResult } from './StatisticsResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface StatisticsCalculatorProps {
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

// Top-level composition for this tool — owns all interactive state
// (numbers/result) and is the only place that calls into
// lib/calculators/statistics.ts. Single free-form field, simpler than
// the flat-multi-field template used elsewhere.
export function StatisticsCalculator({
  breadcrumbItems,
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: StatisticsCalculatorProps) {
  const [numbers, setNumbers] = useState('');
  const [numbersError, setNumbersError] =
    useState<StatisticsValidationError | null>(null);
  const [result, setResult] = useState<StatisticsResultType | null>(null);
  // Separate from field-level errors: only set if validated input somehow
  // still fails to calculate. CLAUDE.md Section 8 — this is the defensive
  // backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handleNumbersChange(value: string) {
    setNumbers(value);
    if (numbersError) setNumbersError(null);
  }

  function handleSubmit() {
    const validationError = validateStatisticsInput(numbers);
    setNumbersError(validationError);

    if (validationError) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      const nextResult = getStatisticsResult(parseNumberList(numbers));
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
      breadcrumbItems={breadcrumbItems}
      title={title}
      description={description}
      inputSlot={
        <StatisticsForm
          numbers={numbers}
          numbersError={numbersError}
          onNumbersChange={handleNumbersChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <StatisticsResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
