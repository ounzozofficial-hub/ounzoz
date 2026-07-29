'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import type { BreadcrumbItem } from '@/types/shared';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  getProteinIntakeResult,
  validateProteinIntakeInputs,
} from '@/lib/calculators/protein-intake';
import type { ActivityLevel } from '@/types/shared';
import type {
  ProteinIntakeResult as ProteinIntakeResultType,
  ProteinIntakeValidationError,
} from '@/types/protein-intake';
import { ProteinIntakeForm } from './ProteinIntakeForm';
import { ProteinIntakeResult } from './ProteinIntakeResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface ProteinIntakeCalculatorProps {
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
// lib/calculators/protein-intake.ts. Mirrors WaterIntakeCalculator's
// structure exactly (same field set: weight + activity level only).
export function ProteinIntakeCalculator({
  breadcrumbItems,
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: ProteinIntakeCalculatorProps) {
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(
    null,
  );
  const [weightError, setWeightError] =
    useState<ProteinIntakeValidationError | null>(null);
  const [activityError, setActivityError] =
    useState<ProteinIntakeValidationError | null>(null);
  const [result, setResult] = useState<ProteinIntakeResultType | null>(null);
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
    const validation = validateProteinIntakeInputs(weight, activityLevel);
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
      const nextResult = getProteinIntakeResult(
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
        <ProteinIntakeForm
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
          <ProteinIntakeResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
