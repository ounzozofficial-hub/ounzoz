'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import type { BreadcrumbItem } from '@/types/shared';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  getSavingsResult,
  validateSavingsInputs,
} from '@/lib/calculators/savings';
import type {
  SavingsResult as SavingsResultType,
  SavingsValidationError,
} from '@/types/savings';
import { SavingsForm } from './SavingsForm';
import { SavingsResult } from './SavingsResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface SavingsCalculatorProps {
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
// (initialDeposit/monthlyContribution/rate/years/result) and is the only
// place that calls into lib/calculators/savings.ts. Mirrors
// CompoundInterestCalculator's structure (established Finance-tool
// template), with initial deposit + monthly contribution in place of a
// single principal + selectable frequency.
export function SavingsCalculator({
  breadcrumbItems,
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: SavingsCalculatorProps) {
  const [initialDeposit, setInitialDeposit] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [initialDepositError, setInitialDepositError] =
    useState<SavingsValidationError | null>(null);
  const [monthlyContributionError, setMonthlyContributionError] =
    useState<SavingsValidationError | null>(null);
  const [rateError, setRateError] = useState<SavingsValidationError | null>(
    null,
  );
  const [yearsError, setYearsError] = useState<SavingsValidationError | null>(
    null,
  );
  const [result, setResult] = useState<SavingsResultType | null>(null);
  // Separate from field-level errors: only set if validated input somehow
  // still fails to calculate. CLAUDE.md Section 8 — this is the defensive
  // backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handleInitialDepositChange(value: string) {
    setInitialDeposit(value);
    if (initialDepositError) setInitialDepositError(null);
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
    const validation = validateSavingsInputs(
      initialDeposit,
      monthlyContribution,
      rate,
      years,
    );
    setInitialDepositError(validation.initialDepositError);
    setMonthlyContributionError(validation.monthlyContributionError);
    setRateError(validation.rateError);
    setYearsError(validation.yearsError);

    if (
      validation.initialDepositError ||
      validation.monthlyContributionError ||
      validation.rateError ||
      validation.yearsError
    ) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      const nextResult = getSavingsResult(
        Number(initialDeposit.trim() || '0'),
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
        <SavingsForm
          initialDeposit={initialDeposit}
          monthlyContribution={monthlyContribution}
          rate={rate}
          years={years}
          initialDepositError={initialDepositError}
          monthlyContributionError={monthlyContributionError}
          rateError={rateError}
          yearsError={yearsError}
          onInitialDepositChange={handleInitialDepositChange}
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
          <SavingsResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
