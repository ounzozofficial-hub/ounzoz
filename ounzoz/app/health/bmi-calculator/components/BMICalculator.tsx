'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import { ResultCard } from '@/components/shared/ResultCard';
import { getBMIResult, validateBMIInputs } from '@/lib/calculators/bmi';
import type {
  BMIResult as BMIResultType,
  BMIValidationError,
} from '@/types/bmi';
import { BMIForm } from './BMIForm';
import { BMIResult } from './BMIResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface BMICalculatorProps {
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
// (weight/height/result) and is the only place that calls into
// lib/calculators/bmi.ts. Assembles the full CalculatorLayout itself
// because the input and result slots share state and must live under
// the same 'use client' boundary; the remaining slots are static and
// come pre-rendered from page.tsx (a Server Component), keeping
// CLAUDE.md Section 14 ("Server Components by default") intact for
// everything that doesn't need interactivity.
export function BMICalculator({
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: BMICalculatorProps) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [weightError, setWeightError] = useState<BMIValidationError | null>(
    null,
  );
  const [heightError, setHeightError] = useState<BMIValidationError | null>(
    null,
  );
  const [result, setResult] = useState<BMIResultType | null>(null);
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

  function handleSubmit() {
    const validation = validateBMIInputs(weight, height);
    setWeightError(validation.weightError);
    setHeightError(validation.heightError);

    if (validation.weightError || validation.heightError) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      const nextResult = getBMIResult(Number(weight), Number(height));
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
        <BMIForm
          weight={weight}
          height={height}
          weightError={weightError}
          heightError={heightError}
          onWeightChange={handleWeightChange}
          onHeightChange={handleHeightChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <BMIResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
