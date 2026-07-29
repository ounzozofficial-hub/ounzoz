'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import type { BreadcrumbItem } from '@/types/shared';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  getIsWhatPercentResult,
  getPercentChangeResult,
  getPercentOfResult,
  validatePercentageInputs,
} from '@/lib/calculators/percentage';
import type {
  PercentageMode,
  PercentageResult as PercentageResultType,
  PercentageValidationError,
} from '@/types/percentage';
import { PercentageForm } from './PercentageForm';
import { PercentageResult } from './PercentageResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface PercentageCalculatorProps {
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

// Top-level composition — owns all interactive state (mode + the two
// generic input fields + result) and is the only place that calls into
// lib/calculators/percentage.ts. Unlike every prior tool, the two input
// fields represent different things depending on the active mode, so a
// mode switch resets both fields/errors/result rather than carrying
// stale values across modes that no longer mean the same thing.
export function PercentageCalculator({
  breadcrumbItems,
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: PercentageCalculatorProps) {
  const [mode, setMode] = useState<PercentageMode>('percent-of');
  const [firstValue, setFirstValue] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const [firstError, setFirstError] =
    useState<PercentageValidationError | null>(null);
  const [secondError, setSecondError] =
    useState<PercentageValidationError | null>(null);
  const [result, setResult] = useState<PercentageResultType | null>(null);
  // Separate from field-level errors: only set if validated input somehow
  // still fails to calculate. CLAUDE.md Section 8 — this is the defensive
  // backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handleModeChange(nextMode: PercentageMode) {
    setMode(nextMode);
    setFirstValue('');
    setSecondValue('');
    setFirstError(null);
    setSecondError(null);
    setResult(null);
    setUnexpectedError(false);
  }

  function handleFirstValueChange(value: string) {
    setFirstValue(value);
    if (firstError) setFirstError(null);
  }

  function handleSecondValueChange(value: string) {
    setSecondValue(value);
    if (secondError) setSecondError(null);
  }

  function handleSubmit() {
    const validation = validatePercentageInputs(mode, firstValue, secondValue);
    setFirstError(validation.firstError);
    setSecondError(validation.secondError);

    if (validation.firstError || validation.secondError) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      const first = Number(firstValue);
      const second = Number(secondValue);
      const nextResult =
        mode === 'percent-of'
          ? getPercentOfResult(first, second)
          : mode === 'is-what-percent'
            ? getIsWhatPercentResult(first, second)
            : getPercentChangeResult(first, second);
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
        <PercentageForm
          mode={mode}
          firstValue={firstValue}
          secondValue={secondValue}
          firstError={firstError}
          secondError={secondError}
          onModeChange={handleModeChange}
          onFirstValueChange={handleFirstValueChange}
          onSecondValueChange={handleSecondValueChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <PercentageResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
