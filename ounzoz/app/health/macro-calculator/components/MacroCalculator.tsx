'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import type { BreadcrumbItem } from '@/types/shared';
import { ResultCard } from '@/components/shared/ResultCard';
import { getMacroResult, validateMacroInputs } from '@/lib/calculators/macro';
import type { ActivityLevel, BiologicalSex, CalorieGoal } from '@/types/shared';
import type {
  MacroResult as MacroResultType,
  MacroValidationError,
} from '@/types/macro';
import { MacroForm } from './MacroForm';
import { MacroResult } from './MacroResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface MacroCalculatorProps {
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
// that calls into lib/calculators/macro.ts. Mirrors CalorieCalculator's
// structure exactly (same 6 fields, since Macro genuinely builds on
// Calorie's result — CLAUDE.md Section 5).
export function MacroCalculator({
  breadcrumbItems,
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: MacroCalculatorProps) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<BiologicalSex | null>(null);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(
    null,
  );
  const [goal, setGoal] = useState<CalorieGoal | null>(null);
  const [weightError, setWeightError] = useState<MacroValidationError | null>(
    null,
  );
  const [heightError, setHeightError] = useState<MacroValidationError | null>(
    null,
  );
  const [ageError, setAgeError] = useState<MacroValidationError | null>(null);
  const [sexError, setSexError] = useState<MacroValidationError | null>(null);
  const [activityError, setActivityError] =
    useState<MacroValidationError | null>(null);
  const [goalError, setGoalError] = useState<MacroValidationError | null>(
    null,
  );
  const [result, setResult] = useState<MacroResultType | null>(null);
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
    const validation = validateMacroInputs(
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
      const nextResult = getMacroResult(
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
        <MacroForm
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
          <MacroResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
