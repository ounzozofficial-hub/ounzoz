'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  getPregnancyDueDateResult,
  parseLMPDate,
  validateLMPDateInput,
} from '@/lib/calculators/pregnancy-due-date';
import type {
  PregnancyDueDateResult as PregnancyDueDateResultType,
  PregnancyDueDateValidationError,
} from '@/types/pregnancy-due-date';
import { PregnancyDueDateForm } from './PregnancyDueDateForm';
import { PregnancyDueDateResult } from './PregnancyDueDateResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface PregnancyDueDateCalculatorProps {
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
// (lmpDate/result) and is the only place that calls into
// lib/calculators/pregnancy-due-date.ts. Standalone tool (CLAUDE.md
// Section 5): unlike Macro's tiered fields, this introduces its own
// single date field with no relationship to any other tool.
export function PregnancyDueDateCalculator({
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: PregnancyDueDateCalculatorProps) {
  const [lmpDate, setLMPDate] = useState('');
  const [lmpDateError, setLMPDateError] =
    useState<PregnancyDueDateValidationError | null>(null);
  const [result, setResult] = useState<PregnancyDueDateResultType | null>(
    null,
  );
  // Separate from field-level errors: only set if validated input somehow
  // still fails to calculate. CLAUDE.md Section 8 — this is the defensive
  // backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handleLMPDateChange(value: string) {
    setLMPDate(value);
    if (lmpDateError) setLMPDateError(null);
  }

  function handleSubmit() {
    // "Today" is read once per submit, right here at the client
    // boundary — never inside lib/calculators/pregnancy-due-date.ts,
    // which takes it as an explicit parameter so every function there
    // stays a pure, deterministic, independently testable unit
    // (CLAUDE.md Section 6).
    const today = new Date();
    const validationError = validateLMPDateInput(lmpDate, today);
    setLMPDateError(validationError);

    if (validationError) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      const nextResult = getPregnancyDueDateResult(
        parseLMPDate(lmpDate),
        today,
      );
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
        <PregnancyDueDateForm
          lmpDate={lmpDate}
          lmpDateError={lmpDateError}
          onLMPDateChange={handleLMPDateChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <PregnancyDueDateResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
