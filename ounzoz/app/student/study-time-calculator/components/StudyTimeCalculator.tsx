'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  getStudyTimeResult,
  validateStudyTimeInputs,
} from '@/lib/calculators/study-time';
import type {
  StudyTimeResult as StudyTimeResultType,
  StudyTimeValidationError,
} from '@/types/study-time';
import { StudyTimeForm } from './StudyTimeForm';
import { StudyTimeResult } from './StudyTimeResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface StudyTimeCalculatorProps {
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
// (days/hoursPerDay/topics/result) and is the only place that calls into
// lib/calculators/study-time.ts. Mirrors LoanCalculator's structure (flat
// three-field template, no dynamic row list needed here).
export function StudyTimeCalculator({
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: StudyTimeCalculatorProps) {
  const [days, setDays] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [topics, setTopics] = useState('');
  const [daysError, setDaysError] = useState<StudyTimeValidationError | null>(
    null,
  );
  const [hoursPerDayError, setHoursPerDayError] =
    useState<StudyTimeValidationError | null>(null);
  const [topicsError, setTopicsError] =
    useState<StudyTimeValidationError | null>(null);
  const [result, setResult] = useState<StudyTimeResultType | null>(null);
  // Separate from field-level errors: only set if validated input somehow
  // still fails to calculate. CLAUDE.md Section 8 — this is the defensive
  // backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handleDaysChange(value: string) {
    setDays(value);
    if (daysError) setDaysError(null);
  }

  function handleHoursPerDayChange(value: string) {
    setHoursPerDay(value);
    if (hoursPerDayError) setHoursPerDayError(null);
  }

  function handleTopicsChange(value: string) {
    setTopics(value);
    if (topicsError) setTopicsError(null);
  }

  function handleSubmit() {
    const validation = validateStudyTimeInputs(days, hoursPerDay, topics);
    setDaysError(validation.daysError);
    setHoursPerDayError(validation.hoursPerDayError);
    setTopicsError(validation.topicsError);

    if (
      validation.daysError ||
      validation.hoursPerDayError ||
      validation.topicsError
    ) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      const nextResult = getStudyTimeResult(
        Number(days),
        Number(hoursPerDay),
        Number(topics),
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
        <StudyTimeForm
          days={days}
          hoursPerDay={hoursPerDay}
          topics={topics}
          daysError={daysError}
          hoursPerDayError={hoursPerDayError}
          topicsError={topicsError}
          onDaysChange={handleDaysChange}
          onHoursPerDayChange={handleHoursPerDayChange}
          onTopicsChange={handleTopicsChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <StudyTimeResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
