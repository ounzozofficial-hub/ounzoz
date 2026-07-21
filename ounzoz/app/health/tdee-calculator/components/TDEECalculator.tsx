'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import { ResultCard } from '@/components/shared/ResultCard';
import { getTDEEResult, validateTDEEInputs } from '@/lib/calculators/tdee';
import type { BiologicalSex } from '@/types/shared';
import type {
  ActivityLevel,
  TDEEResult as TDEEResultType,
  TDEEValidationError,
} from '@/types/tdee';
import { TDEEForm } from './TDEEForm';
import { TDEEResult } from './TDEEResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface TDEECalculatorProps {
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
// (weight/height/age/sex/activityLevel/result) and is the only place
// that calls into lib/calculators/tdee.ts. Mirrors BMICalculator and
// BMRCalculator's structure exactly (established Phase 3/4 template).
export function TDEECalculator({
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: TDEECalculatorProps) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<BiologicalSex | null>(null);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(
    null,
  );
  const [weightError, setWeightError] = useState<TDEEValidationError | null>(
    null,
  );
  const [heightError, setHeightError] = useState<TDEEValidationError | null>(
    null,
  );
  const [ageError, setAgeError] = useState<TDEEValidationError | null>(null);
  const [sexError, setSexError] = useState<TDEEValidationError | null>(null);
  const [activityError, setActivityError] =
    useState<TDEEValidationError | null>(null);
  const [result, setResult] = useState<TDEEResultType | null>(null);
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

  function handleActivityChange(value: ActivityLevel) {
    setActivityLevel(value);
    if (activityError) setActivityError(null);
  }

  function handleSubmit() {
    const validation = validateTDEEInputs(
      weight,
      height,
      age,
      sex,
      activityLevel,
    );
    setWeightError(validation.weightError);
    setHeightError(validation.heightError);
    setAgeError(validation.ageError);
    setSexError(validation.sexError);
    setActivityError(validation.activityError);

    if (
      validation.weightError ||
      validation.heightError ||
      validation.ageError ||
      validation.sexError ||
      validation.activityError
    ) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      // sex and activityLevel are guaranteed non-null here: their
      // validation errors were both null, which only happens when set.
      const nextResult = getTDEEResult(
        Number(weight),
        Number(height),
        Number(age),
        sex as BiologicalSex,
        activityLevel as ActivityLevel,
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
        <TDEEForm
          weight={weight}
          height={height}
          age={age}
          sex={sex}
          activityLevel={activityLevel}
          weightError={weightError}
          heightError={heightError}
          ageError={ageError}
          sexError={sexError}
          activityError={activityError}
          onWeightChange={handleWeightChange}
          onHeightChange={handleHeightChange}
          onAgeChange={handleAgeChange}
          onSexChange={handleSexChange}
          onActivityChange={handleActivityChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <TDEEResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
