'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import type { BreadcrumbItem } from '@/types/shared';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  getWaterIntakeResult,
  validateWaterIntakeInputs,
} from '@/lib/calculators/water-intake';
import type { ActivityLevel } from '@/types/shared';
import type {
  WaterIntakeResult as WaterIntakeResultType,
  WaterIntakeValidationError,
} from '@/types/water-intake';
import { WaterIntakeForm } from './WaterIntakeForm';
import { WaterIntakeResult } from './WaterIntakeResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface WaterIntakeCalculatorProps {
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
// (weight/activityLevel/result) and is the only place that calls into
// lib/calculators/water-intake.ts. Mirrors TDEECalculator's structure
// (established Phase 3+ template), minus the fields this tool doesn't
// need (height/age/sex).
export function WaterIntakeCalculator({
  breadcrumbItems,
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: WaterIntakeCalculatorProps) {
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(
    null,
  );
  const [weightError, setWeightError] =
    useState<WaterIntakeValidationError | null>(null);
  const [activityError, setActivityError] =
    useState<WaterIntakeValidationError | null>(null);
  const [result, setResult] = useState<WaterIntakeResultType | null>(null);
  // Separate from field-level errors: only set if validated input somehow
  // still fails to calculate. CLAUDE.md Section 8 — this is the defensive
  // backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handleWeightChange(value: string) {
    setWeight(value);
    if (weightError) setWeightError(null);
  }

  function handleActivityChange(value: ActivityLevel) {
    setActivityLevel(value);
    if (activityError) setActivityError(null);
  }

  function handleSubmit() {
    const validation = validateWaterIntakeInputs(weight, activityLevel);
    setWeightError(validation.weightError);
    setActivityError(validation.activityError);

    if (validation.weightError || validation.activityError) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      // activityLevel is guaranteed non-null here: validation.activityError
      // is null, which only happens when activityLevel !== null.
      const nextResult = getWaterIntakeResult(
        Number(weight),
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
      breadcrumbItems={breadcrumbItems}
      title={title}
      description={description}
      inputSlot={
        <WaterIntakeForm
          weight={weight}
          activityLevel={activityLevel}
          weightError={weightError}
          activityError={activityError}
          onWeightChange={handleWeightChange}
          onActivityChange={handleActivityChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <WaterIntakeResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
