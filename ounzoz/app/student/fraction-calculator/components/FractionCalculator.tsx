'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import type { BreadcrumbItem } from '@/types/shared';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  calculateFractionResult,
  validateFractionInputs,
} from '@/lib/calculators/fraction';
import type {
  FractionOperation,
  FractionResult as FractionResultType,
  FractionValidationError,
} from '@/types/fraction';
import { FractionForm } from './FractionForm';
import { FractionResult } from './FractionResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface FractionCalculatorProps {
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
// (two numerator/denominator pairs, operation, result) and is the only
// place that calls into lib/calculators/fraction.ts.
export function FractionCalculator({
  breadcrumbItems,
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: FractionCalculatorProps) {
  const [numerator1, setNumerator1] = useState('');
  const [denominator1, setDenominator1] = useState('');
  const [numerator2, setNumerator2] = useState('');
  const [denominator2, setDenominator2] = useState('');
  const [operation, setOperation] = useState<FractionOperation>('add');
  const [numerator1Error, setNumerator1Error] =
    useState<FractionValidationError | null>(null);
  const [denominator1Error, setDenominator1Error] =
    useState<FractionValidationError | null>(null);
  const [numerator2Error, setNumerator2Error] =
    useState<FractionValidationError | null>(null);
  const [denominator2Error, setDenominator2Error] =
    useState<FractionValidationError | null>(null);
  const [result, setResult] = useState<FractionResultType | null>(null);
  // Separate from field-level errors: only set if validated input somehow
  // still fails to calculate. CLAUDE.md Section 8 — this is the defensive
  // backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handleNumerator1Change(value: string) {
    setNumerator1(value);
    if (numerator1Error) setNumerator1Error(null);
  }

  function handleDenominator1Change(value: string) {
    setDenominator1(value);
    if (denominator1Error) setDenominator1Error(null);
  }

  function handleNumerator2Change(value: string) {
    setNumerator2(value);
    if (numerator2Error) setNumerator2Error(null);
  }

  function handleDenominator2Change(value: string) {
    setDenominator2(value);
    if (denominator2Error) setDenominator2Error(null);
  }

  function handleOperationChange(value: FractionOperation) {
    setOperation(value);
    // Re-validate the second numerator immediately on operation switch:
    // DIVISOR_NUMERATOR_ZERO only applies to divide, so switching away
    // from divide should clear a stale error and switching to divide
    // with an existing zero numerator should surface it right away.
    if (numerator2Error) setNumerator2Error(null);
  }

  function handleSubmit() {
    const validation = validateFractionInputs(
      numerator1,
      denominator1,
      numerator2,
      denominator2,
      operation,
    );
    setNumerator1Error(validation.numerator1Error);
    setDenominator1Error(validation.denominator1Error);
    setNumerator2Error(validation.numerator2Error);
    setDenominator2Error(validation.denominator2Error);

    if (
      validation.numerator1Error ||
      validation.denominator1Error ||
      validation.numerator2Error ||
      validation.denominator2Error
    ) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      const nextResult = calculateFractionResult(
        Number(numerator1),
        Number(denominator1),
        Number(numerator2),
        Number(denominator2),
        operation,
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
        <FractionForm
          numerator1={numerator1}
          denominator1={denominator1}
          numerator2={numerator2}
          denominator2={denominator2}
          operation={operation}
          numerator1Error={numerator1Error}
          denominator1Error={denominator1Error}
          numerator2Error={numerator2Error}
          denominator2Error={denominator2Error}
          onNumerator1Change={handleNumerator1Change}
          onDenominator1Change={handleDenominator1Change}
          onNumerator2Change={handleNumerator2Change}
          onDenominator2Change={handleDenominator2Change}
          onOperationChange={handleOperationChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <FractionResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
