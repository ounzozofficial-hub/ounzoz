'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import type { BreadcrumbItem } from '@/types/shared';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  solveQuadraticEquation,
  validateQuadraticInputs,
} from '@/lib/calculators/quadratic';
import type {
  QuadraticResult as QuadraticResultType,
  QuadraticValidationError,
} from '@/types/quadratic';
import { QuadraticForm } from './QuadraticForm';
import { QuadraticResult } from './QuadraticResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface QuadraticCalculatorProps {
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
// (a/b/c/result) and is the only place that calls into
// lib/calculators/quadratic.ts. Same flat three-field template as
// Study Time / Loan Calculator.
export function QuadraticCalculator({
  breadcrumbItems,
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: QuadraticCalculatorProps) {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [aError, setAError] = useState<QuadraticValidationError | null>(null);
  const [bError, setBError] = useState<QuadraticValidationError | null>(null);
  const [cError, setCError] = useState<QuadraticValidationError | null>(null);
  const [result, setResult] = useState<QuadraticResultType | null>(null);
  // Separate from field-level errors: only set if validated input somehow
  // still fails to calculate. CLAUDE.md Section 8 — this is the defensive
  // backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handleAChange(value: string) {
    setA(value);
    if (aError) setAError(null);
  }

  function handleBChange(value: string) {
    setB(value);
    if (bError) setBError(null);
  }

  function handleCChange(value: string) {
    setC(value);
    if (cError) setCError(null);
  }

  function handleSubmit() {
    const validation = validateQuadraticInputs(a, b, c);
    setAError(validation.aError);
    setBError(validation.bError);
    setCError(validation.cError);

    if (validation.aError || validation.bError || validation.cError) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      const nextResult = solveQuadraticEquation(Number(a), Number(b), Number(c));
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
        <QuadraticForm
          a={a}
          b={b}
          c={c}
          aError={aError}
          bError={bError}
          cError={cError}
          onAChange={handleAChange}
          onBChange={handleBChange}
          onCChange={handleCChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <QuadraticResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
