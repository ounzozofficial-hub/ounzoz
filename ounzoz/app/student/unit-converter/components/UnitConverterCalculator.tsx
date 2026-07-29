'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import type { BreadcrumbItem } from '@/types/shared';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  DEFAULT_UNITS_BY_CATEGORY,
  convertUnits,
  validateValueInput,
} from '@/lib/calculators/unit-converter';
import type {
  UnitCategory,
  UnitConverterResult as UnitConverterResultType,
  UnitConverterUnit,
  UnitConverterValidationError,
} from '@/types/unit-converter';
import { UnitConverterForm } from './UnitConverterForm';
import { UnitConverterResult } from './UnitConverterResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface UnitConverterCalculatorProps {
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
// (category/value/fromUnit/toUnit/result) and is the only place that
// calls into lib/calculators/unit-converter.ts. Unlike every other tool
// on the platform, the available From/To options depend on a third
// field (category), so changing category resets both unit selections to
// that category's sensible defaults rather than leaving a stale,
// no-longer-valid unit selected.
export function UnitConverterCalculator({
  breadcrumbItems,
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: UnitConverterCalculatorProps) {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState<UnitConverterUnit>(
    DEFAULT_UNITS_BY_CATEGORY.length.fromUnit,
  );
  const [toUnit, setToUnit] = useState<UnitConverterUnit>(
    DEFAULT_UNITS_BY_CATEGORY.length.toUnit,
  );
  const [valueError, setValueError] =
    useState<UnitConverterValidationError | null>(null);
  const [result, setResult] = useState<UnitConverterResultType | null>(null);
  // Separate from field-level errors: only set if validated input somehow
  // still fails to calculate. CLAUDE.md Section 8 — this is the defensive
  // backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function handleCategoryChange(nextCategory: UnitCategory) {
    setCategory(nextCategory);
    setFromUnit(DEFAULT_UNITS_BY_CATEGORY[nextCategory].fromUnit);
    setToUnit(DEFAULT_UNITS_BY_CATEGORY[nextCategory].toUnit);
    setValueError(null);
    setResult(null);
    setUnexpectedError(false);
  }

  function handleValueChange(nextValue: string) {
    setValue(nextValue);
    if (valueError) setValueError(null);
  }

  function handleSubmit() {
    const validationError = validateValueInput(value, category, fromUnit);
    setValueError(validationError);

    if (validationError) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      const nextResult = convertUnits(Number(value), category, fromUnit, toUnit);
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
        <UnitConverterForm
          category={category}
          value={value}
          fromUnit={fromUnit}
          toUnit={toUnit}
          valueError={valueError}
          onCategoryChange={handleCategoryChange}
          onValueChange={handleValueChange}
          onFromUnitChange={setFromUnit}
          onToUnitChange={setToUnit}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <UnitConverterResult result={result} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
