'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import type { BreadcrumbItem } from '@/types/shared';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  getInvestmentResult,
  validateInvestmentInputs,
} from '@/lib/calculators/investment';
import type {
  InvestmentResult as InvestmentResultType,
  InvestmentValidationError,
} from '@/types/investment';
import { InvestmentForm } from './InvestmentForm';
import { InvestmentResult } from './InvestmentResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface InvestmentCalculatorProps {
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
// (initialInvestment/monthlyContribution/rate/years/result) and is the
// only place that calls into lib/calculators/investment.ts. Mirrors
// SavingsCalculator's structure (same field shape, independent
// implementation per CLAUDE.md Section 5).
export function InvestmentCalculator({
  breadcrumbItems,
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: InvestmentCalculatorProps) {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [initialInvestmentError, setInitialInvestmentError] =
    useState<InvestmentValidationError | null>(null);
  const [monthlyContributionError, setMonthlyContributionError] =
    useState<InvestmentValidationError | null>(null);
  const [rateError, setRateError] =
    useState<InvestmentValidationError | null>(null);
  const [yearsError, setYearsError] =
    useState<InvestmentValidationError | null>(null);
  const [result, setResult] = useState<InvestmentResultType | null>(null);
  // Separate from field-level errors: only set if validated input somehow
  // still fails to calculate. CLAUDE.md Section 8 — this is the defensive
  // backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handleInitialInvestmentChange(value: string) {
    setInitialInvestment(value);
    if (initialInvestmentError) setInitialInvestmentError(null);
    if (monthlyContributionError === 'NOTHING_TO_CALCULATE')
      setMonthlyContributionError(null);
  }

  function handleMonthlyContributionChange(value: string) {
    setMonthlyContribution(value);
    if (monthlyContributionError) setMonthlyContributionError(null);
  }

  function handleRateChange(value: string) {
    setRate(value);
    if (rateError) setRateError(null);
  }

  function handleYearsChange(value: string) {
    setYears(value);
    if (yearsError) setYearsError(null);
  }

  function handleSubmit() {
    const validation = validateInvestmentInputs(
      initialInvestment,
      monthlyContribution,
      rate,
      years,
    );
    setInitialInvestmentError(validation.initialInvestmentError);
    setMonthlyContributionError(validation.monthlyContributionError);
    setRateError(validation.rateError);
    setYearsError(validation.yearsError);

    if (
      validation.initialInvestmentError ||
      validation.monthlyContributionError ||
      validation.rateError ||
      validation.yearsError
    ) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      const nextResult = getInvestmentResult(
        Number(initialInvestment.trim() || '0'),
        Number(monthlyContribution.trim() || '0'),
        Number(rate),
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
      breadcrumbItems={breadcrumbItems}
      title={title}
      description={description}
      inputSlot={
        <InvestmentForm
          initialInvestment={initialInvestment}
          monthlyContribution={monthlyContribution}
          rate={rate}
          years={years}
          initialInvestmentError={initialInvestmentError}
          monthlyContributionError={monthlyContributionError}
          rateError={rateError}
          yearsError={yearsError}
          onInitialInvestmentChange={handleInitialInvestmentChange}
          onMonthlyContributionChange={handleMonthlyContributionChange}
          onRateChange={handleRateChange}
          onYearsChange={handleYearsChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <InvestmentResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
