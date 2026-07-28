'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  getCompoundInterestResult,
  validateCompoundInterestInputs,
} from '@/lib/calculators/compound-interest';
import type {
  CompoundInterestResult as CompoundInterestResultType,
  CompoundInterestValidationError,
  CompoundingFrequency,
} from '@/types/compound-interest';
import { CompoundInterestForm } from './CompoundInterestForm';
import { CompoundInterestResult } from './CompoundInterestResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface CompoundInterestCalculatorProps {
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
// (principal/rate/frequency/years/result) and is the only place that
// calls into lib/calculators/compound-interest.ts. Mirrors
// LoanCalculator's structure (established Finance-tool template), with a
// fourth field (compounding frequency) in place of a loan term.
export function CompoundInterestCalculator({
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: CompoundInterestCalculatorProps) {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [frequency, setFrequency] = useState<CompoundingFrequency | null>(
    null,
  );
  const [years, setYears] = useState('');
  const [principalError, setPrincipalError] =
    useState<CompoundInterestValidationError | null>(null);
  const [rateError, setRateError] =
    useState<CompoundInterestValidationError | null>(null);
  const [frequencyError, setFrequencyError] =
    useState<CompoundInterestValidationError | null>(null);
  const [yearsError, setYearsError] =
    useState<CompoundInterestValidationError | null>(null);
  const [result, setResult] = useState<CompoundInterestResultType | null>(
    null,
  );
  // Separate from field-level errors: only set if validated input somehow
  // still fails to calculate. CLAUDE.md Section 8 — this is the defensive
  // backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handlePrincipalChange(value: string) {
    setPrincipal(value);
    if (principalError) setPrincipalError(null);
  }

  function handleRateChange(value: string) {
    setRate(value);
    if (rateError) setRateError(null);
  }

  function handleFrequencyChange(value: CompoundingFrequency) {
    setFrequency(value);
    if (frequencyError) setFrequencyError(null);
  }

  function handleYearsChange(value: string) {
    setYears(value);
    if (yearsError) setYearsError(null);
  }

  function handleSubmit() {
    const validation = validateCompoundInterestInputs(
      principal,
      rate,
      frequency,
      years,
    );
    setPrincipalError(validation.principalError);
    setRateError(validation.rateError);
    setFrequencyError(validation.frequencyError);
    setYearsError(validation.yearsError);

    if (
      validation.principalError ||
      validation.rateError ||
      validation.frequencyError ||
      validation.yearsError
    ) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      // frequency is guaranteed non-null here: validation.frequencyError
      // is null, which only happens when frequency !== null.
      const nextResult = getCompoundInterestResult(
        Number(principal),
        Number(rate),
        frequency as CompoundingFrequency,
        Number(years),
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
        <CompoundInterestForm
          principal={principal}
          rate={rate}
          frequency={frequency}
          years={years}
          principalError={principalError}
          rateError={rateError}
          frequencyError={frequencyError}
          yearsError={yearsError}
          onPrincipalChange={handlePrincipalChange}
          onRateChange={handleRateChange}
          onFrequencyChange={handleFrequencyChange}
          onYearsChange={handleYearsChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <CompoundInterestResult
            result={result}
            frequency={frequency}
            years={years}
          />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
