'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import type { BreadcrumbItem } from '@/types/shared';
import { ResultCard } from '@/components/shared/ResultCard';
import { getLoanResult, validateLoanInputs } from '@/lib/calculators/loan';
import type {
  LoanResult as LoanResultType,
  LoanValidationError,
} from '@/types/loan';
import { LoanForm } from './LoanForm';
import { LoanResult } from './LoanResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface LoanCalculatorProps {
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
// (amount/rate/term/result) and is the only place that calls into
// lib/calculators/loan.ts. Mirrors WaterIntakeCalculator's structure
// (established Health-tool template), adapted to three numeric fields
// instead of weight + activity level.
export function LoanCalculator({
  breadcrumbItems,
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: LoanCalculatorProps) {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [term, setTerm] = useState('');
  const [amountError, setAmountError] = useState<LoanValidationError | null>(
    null,
  );
  const [rateError, setRateError] = useState<LoanValidationError | null>(
    null,
  );
  const [termError, setTermError] = useState<LoanValidationError | null>(
    null,
  );
  const [result, setResult] = useState<LoanResultType | null>(null);
  // Separate from field-level errors: only set if validated input somehow
  // still fails to calculate. CLAUDE.md Section 8 — this is the defensive
  // backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handleAmountChange(value: string) {
    setAmount(value);
    if (amountError) setAmountError(null);
  }

  function handleRateChange(value: string) {
    setRate(value);
    if (rateError) setRateError(null);
  }

  function handleTermChange(value: string) {
    setTerm(value);
    if (termError) setTermError(null);
  }

  function handleSubmit() {
    const validation = validateLoanInputs(amount, rate, term);
    setAmountError(validation.amountError);
    setRateError(validation.rateError);
    setTermError(validation.termError);

    if (validation.amountError || validation.rateError || validation.termError) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      const nextResult = getLoanResult(
        Number(amount),
        Number(rate),
        Number(term),
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
      breadcrumbItems={breadcrumbItems}
      title={title}
      description={description}
      inputSlot={
        <LoanForm
          amount={amount}
          rate={rate}
          term={term}
          amountError={amountError}
          rateError={rateError}
          termError={termError}
          onAmountChange={handleAmountChange}
          onRateChange={handleRateChange}
          onTermChange={handleTermChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <LoanResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
