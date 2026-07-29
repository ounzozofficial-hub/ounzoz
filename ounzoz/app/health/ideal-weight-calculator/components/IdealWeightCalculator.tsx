'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import type { BreadcrumbItem } from '@/types/shared';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  getIdealWeightResult,
  validateIdealWeightInputs,
} from '@/lib/calculators/ideal-weight';
import type { BiologicalSex } from '@/types/shared';
import type {
  IdealWeightResult as IdealWeightResultType,
  IdealWeightValidationError,
} from '@/types/ideal-weight';
import { IdealWeightForm } from './IdealWeightForm';
import { IdealWeightResult } from './IdealWeightResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface IdealWeightCalculatorProps {
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
// (height/sex/result) and is the only place that calls into
// lib/calculators/ideal-weight.ts. Mirrors BMICalculator's structure
// exactly (same tier: height + sex only, established Phase 3 template).
export function IdealWeightCalculator({
  breadcrumbItems,
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: IdealWeightCalculatorProps) {
  const [height, setHeight] = useState('');
  const [sex, setSex] = useState<BiologicalSex | null>(null);
  const [heightError, setHeightError] =
    useState<IdealWeightValidationError | null>(null);
  const [sexError, setSexError] =
    useState<IdealWeightValidationError | null>(null);
  const [result, setResult] = useState<IdealWeightResultType | null>(null);
  // Separate from field-level errors: only set if validated input somehow
  // still fails to calculate. CLAUDE.md Section 8 — this is the defensive
  // backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handleHeightChange(value: string) {
    setHeight(value);
    if (heightError) setHeightError(null);
  }

  function handleSexChange(value: BiologicalSex) {
    setSex(value);
    if (sexError) setSexError(null);
  }

  function handleSubmit() {
    const validation = validateIdealWeightInputs(height, sex);
    setHeightError(validation.heightError);
    setSexError(validation.sexError);

    if (validation.heightError || validation.sexError) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      // sex is guaranteed non-null here: validation.sexError is null,
      // which only happens when sex !== null.
      const nextResult = getIdealWeightResult(
        Number(height),
        sex as BiologicalSex,
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
        <IdealWeightForm
          height={height}
          sex={sex}
          heightError={heightError}
          sexError={sexError}
          onHeightChange={handleHeightChange}
          onSexChange={handleSexChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <IdealWeightResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
