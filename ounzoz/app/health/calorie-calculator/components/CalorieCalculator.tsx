'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import type { BreadcrumbItem } from '@/types/shared';
import { ResultCard } from '@/components/shared/ResultCard';
import { getCalorieResult, validateCalorieInputs } from '@/lib/calculators/calorie';
import type { ActivityLevel, BiologicalSex } from '@/types/shared';
import type {
  CalorieGoal,
  CalorieResult as CalorieResultType,
  CalorieValidationError,
} from '@/types/calorie';
import { CalorieForm } from './CalorieForm';
import { CalorieResult } from './CalorieResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface CalorieCalculatorProps {
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
// (weight/height/age/sex/activityLevel/goal/result) and is the only place
// that calls into lib/calculators/calorie.ts. Mirrors TDEECalculator's
// structure exactly (established Phase 3/4/6 template).
export function CalorieCalculator({
  breadcrumbItems,
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: CalorieCalculatorProps) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<BiologicalSex | null>(null);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(
    null,
  );
  const [goal, setGoal] = useState<CalorieGoal | null>(null);
  const [weightError, setWeightError] =
    useState<CalorieValidationError | null>(null);
  const [heightError, setHeightError] =
    useState<CalorieValidationError | null>(null);
  const [ageError, setAgeError] = useState<CalorieValidationError | null>(
    null,
  );
  const [sexError, setSexError] = useState<CalorieValidationError | null>(
    null,
  );
  const [activityError, setActivityError] =
    useState<CalorieValidationError | null>(null);
  const [goalError, setGoalError] = useState<CalorieValidationError | null>(
    null,
  );
  const [result, setResult] = useState<CalorieResultType | null>(null);
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

  function handleGoalChange(value: CalorieGoal) {
    setGoal(value);
    if (goalError) setGoalError(null);
  }

  function handleSubmit() {
    const validation = validateCalorieInputs(
      weight,
      height,
      age,
      sex,
      activityLevel,
      goal,
    );
    setWeightError(validation.weightError);
    setHeightError(validation.heightError);
    setAgeError(validation.ageError);
    setSexError(validation.sexError);
    setActivityError(validation.activityError);
    setGoalError(validation.goalError);

    if (
      validation.weightError ||
      validation.heightError ||
      validation.ageError ||
      validation.sexError ||
      validation.activityError ||
      validation.goalError
    ) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      // sex, activityLevel, and goal are guaranteed non-null here: their
      // validation errors were all null, which only happens when set.
      const nextResult = getCalorieResult(
        Number(weight),
        Number(height),
        Number(age),
        sex as BiologicalSex,
        activityLevel as ActivityLevel,
        goal as CalorieGoal,
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
        <CalorieForm
          weight={weight}
          height={height}
          age={age}
          sex={sex}
          activityLevel={activityLevel}
          goal={goal}
          weightError={weightError}
          heightError={heightError}
          ageError={ageError}
          sexError={sexError}
          activityError={activityError}
          goalError={goalError}
          onWeightChange={handleWeightChange}
          onHeightChange={handleHeightChange}
          onAgeChange={handleAgeChange}
          onSexChange={handleSexChange}
          onActivityChange={handleActivityChange}
          onGoalChange={handleGoalChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <CalorieResult result={result} sex={sex} goal={goal} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
