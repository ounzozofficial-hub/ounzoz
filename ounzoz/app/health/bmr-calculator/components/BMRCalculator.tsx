'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import { ResultCard } from '@/components/shared/ResultCard';
import { getBMRResult, validateBMRInputs } from '@/lib/calculators/bmr';
import type {
  BiologicalSex,
  BMRResult as BMRResultType,
  BMRValidationError,
} from '@/types/bmr';
import { BMRForm } from './BMRForm';
import { BMRResult } from './BMRResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface BMRCalculatorProps {
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
// (weight/height/age/sex/result) and is the only place that calls into
// lib/calculators/bmr.ts. Assembles the full CalculatorLayout itself
// because the input and result slots share state and must live under
// the same 'use client' boundary; the remaining slots are static and
// come pre-rendered from page.tsx (a Server Component). Mirrors
// BMICalculator's structure exactly (Phase 3 template).
export function BMRCalculator({
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: BMRCalculatorProps) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<BiologicalSex | null>(null);
  const [weightError, setWeightError] = useState<BMRValidationError | null>(
    null,
  );
  const [heightError, setHeightError] = useState<BMRValidationError | null>(
    null,
  );
  const [ageError, setAgeError] = useState<BMRValidationError | null>(null);
  const [sexError, setSexError] = useState<BMRValidationError | null>(null);
  const [result, setResult] = useState<BMRResultType | null>(null);
  // Separate from field-level errors: only set if validated input somehow
  // still fails to calculate. CLAUDE.md Section 8 — this is the defensive
  // backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handleWeightChange(value: string) {
    setWeight(value);
    if (weightError) setWeightError(null);
  }

  function handleHeightChange(value: string) {
    setHeight(value);
    if (heightError) setHeightError(null);
  }

  function handleAgeChange(value: string) {
    setAge(value);
    if (ageError) setAgeError(null);
  }

  function handleSexChange(value: BiologicalSex) {
    setSex(value);
    if (sexError) setSexError(null);
  }

  function handleSubmit() {
    const validation = validateBMRInputs(weight, height, age, sex);
    setWeightError(validation.weightError);
    setHeightError(validation.heightError);
    setAgeError(validation.ageError);
    setSexError(validation.sexError);

    if (
      validation.weightError ||
      validation.heightError ||
      validation.ageError ||
      validation.sexError
    ) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      // sex is guaranteed non-null here: validation.sexError is null,
      // which only happens when sex !== null.
      const nextResult = getBMRResult(
        Number(weight),
        Number(height),
        Number(age),
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
      title={title}
      description={description}
      inputSlot={
        <BMRForm
          weight={weight}
          height={height}
          age={age}
          sex={sex}
          weightError={weightError}
          heightError={heightError}
          ageError={ageError}
          sexError={sexError}
          onWeightChange={handleWeightChange}
          onHeightChange={handleHeightChange}
          onAgeChange={handleAgeChange}
          onSexChange={handleSexChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <BMRResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
