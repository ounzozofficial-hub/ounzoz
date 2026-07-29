'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import type { BreadcrumbItem } from '@/types/shared';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  getBodyFatResult,
  validateBodyFatInputs,
} from '@/lib/calculators/body-fat';
import type { BiologicalSex } from '@/types/shared';
import type {
  BodyFatResult as BodyFatResultType,
  BodyFatValidationError,
} from '@/types/body-fat';
import { BodyFatForm } from './BodyFatForm';
import { BodyFatResult } from './BodyFatResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface BodyFatCalculatorProps {
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
// (height/neck/waist/hip/sex/result) and is the only place that calls
// into lib/calculators/body-fat.ts. Mirrors BMICalculator/TDEECalculator's
// structure exactly (established Phase 3+ template).
export function BodyFatCalculator({
  breadcrumbItems,
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: BodyFatCalculatorProps) {
  const [height, setHeight] = useState('');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [sex, setSex] = useState<BiologicalSex | null>(null);
  const [heightError, setHeightError] =
    useState<BodyFatValidationError | null>(null);
  const [neckError, setNeckError] = useState<BodyFatValidationError | null>(
    null,
  );
  const [waistError, setWaistError] = useState<BodyFatValidationError | null>(
    null,
  );
  const [hipError, setHipError] = useState<BodyFatValidationError | null>(
    null,
  );
  const [sexError, setSexError] = useState<BodyFatValidationError | null>(
    null,
  );
  const [result, setResult] = useState<BodyFatResultType | null>(null);
  // Separate from field-level errors: only set if validated input somehow
  // still fails to calculate. CLAUDE.md Section 8 — this is the defensive
  // backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handleHeightChange(value: string) {
    setHeight(value);
    if (heightError) setHeightError(null);
  }

  function handleNeckChange(value: string) {
    setNeck(value);
    if (neckError) setNeckError(null);
  }

  function handleWaistChange(value: string) {
    setWaist(value);
    if (waistError) setWaistError(null);
  }

  function handleHipChange(value: string) {
    setHip(value);
    if (hipError) setHipError(null);
  }

  function handleSexChange(value: BiologicalSex) {
    setSex(value);
    if (sexError) setSexError(null);
    // Hip only applies to the female formula — clear any stale hip error
    // (e.g. "required") the moment sex changes, since its relevance
    // depends on this field.
    if (hipError) setHipError(null);
  }

  function handleSubmit() {
    const validation = validateBodyFatInputs(height, neck, waist, hip, sex);
    setHeightError(validation.heightError);
    setNeckError(validation.neckError);
    setWaistError(validation.waistError);
    setHipError(validation.hipError);
    setSexError(validation.sexError);

    if (
      validation.heightError ||
      validation.neckError ||
      validation.waistError ||
      validation.hipError ||
      validation.sexError
    ) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      // sex is guaranteed non-null here: validation.sexError is null,
      // which only happens when sex !== null. Hip is only read for the
      // female formula, where validation already guaranteed it's a valid
      // number.
      const nextResult = getBodyFatResult(
        Number(height),
        Number(neck),
        Number(waist),
        sex as BiologicalSex,
        sex === 'female' ? Number(hip) : undefined,
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
        <BodyFatForm
          height={height}
          neck={neck}
          waist={waist}
          hip={hip}
          sex={sex}
          heightError={heightError}
          neckError={neckError}
          waistError={waistError}
          hipError={hipError}
          sexError={sexError}
          onHeightChange={handleHeightChange}
          onNeckChange={handleNeckChange}
          onWaistChange={handleWaistChange}
          onHipChange={handleHipChange}
          onSexChange={handleSexChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <BodyFatResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
