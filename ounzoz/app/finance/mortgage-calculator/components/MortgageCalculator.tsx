'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import type { BreadcrumbItem } from '@/types/shared';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  getMortgageResult,
  validateMortgageInputs,
} from '@/lib/calculators/mortgage';
import type {
  MortgageResult as MortgageResultType,
  MortgageValidationError,
} from '@/types/mortgage';
import { MortgageForm } from './MortgageForm';
import { MortgageResult } from './MortgageResult';

const UNEXPECTED_ERROR_MESSAGE =
  "We couldn't calculate that — please check your inputs and try again.";

export interface MortgageCalculatorProps {
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

// Top-level composition for this tool — owns all interactive state and is
// the only place that calls into lib/calculators/mortgage.ts. Mirrors
// LoanCalculator's structure, extended with three optional escrow fields
// (property tax, home insurance, HOA) that default to 0 when left blank.
export function MortgageCalculator({
  breadcrumbItems,
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: MortgageCalculatorProps) {
  const [homePrice, setHomePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [rate, setRate] = useState('');
  const [term, setTerm] = useState('');
  const [propertyTax, setPropertyTax] = useState('');
  const [homeInsurance, setHomeInsurance] = useState('');
  const [hoa, setHoa] = useState('');

  const [homePriceError, setHomePriceError] =
    useState<MortgageValidationError | null>(null);
  const [downPaymentError, setDownPaymentError] =
    useState<MortgageValidationError | null>(null);
  const [rateError, setRateError] = useState<MortgageValidationError | null>(
    null,
  );
  const [termError, setTermError] = useState<MortgageValidationError | null>(
    null,
  );
  const [propertyTaxError, setPropertyTaxError] =
    useState<MortgageValidationError | null>(null);
  const [homeInsuranceError, setHomeInsuranceError] =
    useState<MortgageValidationError | null>(null);
  const [hoaError, setHoaError] = useState<MortgageValidationError | null>(
    null,
  );

  const [result, setResult] = useState<MortgageResultType | null>(null);
  const [escrowInputs, setEscrowInputs] = useState({
    taxAndInsuranceMonthly: 0,
    hoaMonthly: 0,
  });
  // Separate from field-level errors: only set if validated input somehow
  // still fails to calculate. CLAUDE.md Section 8 — this is the defensive
  // backstop, not the primary validation path.
  const [unexpectedError, setUnexpectedError] = useState(false);

  function makeChangeHandler(
    setValue: (value: string) => void,
    error: MortgageValidationError | null,
    setError: (error: MortgageValidationError | null) => void,
  ) {
    return (value: string) => {
      setValue(value);
      if (error) setError(null);
    };
  }

  const handleHomePriceChange = makeChangeHandler(
    setHomePrice,
    homePriceError,
    setHomePriceError,
  );
  const handleDownPaymentChange = makeChangeHandler(
    setDownPayment,
    downPaymentError,
    setDownPaymentError,
  );
  const handleRateChange = makeChangeHandler(setRate, rateError, setRateError);
  const handleTermChange = makeChangeHandler(setTerm, termError, setTermError);
  const handlePropertyTaxChange = makeChangeHandler(
    setPropertyTax,
    propertyTaxError,
    setPropertyTaxError,
  );
  const handleHomeInsuranceChange = makeChangeHandler(
    setHomeInsurance,
    homeInsuranceError,
    setHomeInsuranceError,
  );
  const handleHOAChange = makeChangeHandler(setHoa, hoaError, setHoaError);

  function handleSubmit() {
    const validation = validateMortgageInputs(
      homePrice,
      downPayment,
      rate,
      term,
      propertyTax,
      homeInsurance,
      hoa,
    );
    setHomePriceError(validation.homePriceError);
    setDownPaymentError(validation.downPaymentError);
    setRateError(validation.rateError);
    setTermError(validation.termError);
    setPropertyTaxError(validation.propertyTaxError);
    setHomeInsuranceError(validation.homeInsuranceError);
    setHoaError(validation.hoaError);

    const hasError = Object.values(validation).some((error) => error !== null);
    if (hasError) {
      setResult(null);
      setUnexpectedError(false);
      return;
    }

    try {
      const annualPropertyTax = propertyTax.trim() === '' ? 0 : Number(propertyTax);
      const annualHomeInsurance =
        homeInsurance.trim() === '' ? 0 : Number(homeInsurance);
      const monthlyHOA = hoa.trim() === '' ? 0 : Number(hoa);

      const nextResult = getMortgageResult(
        Number(homePrice),
        Number(downPayment),
        Number(rate),
        Number(term),
        annualPropertyTax,
        annualHomeInsurance,
        monthlyHOA,
      );
      setResult(nextResult);
      setEscrowInputs({
        taxAndInsuranceMonthly: (annualPropertyTax + annualHomeInsurance) / 12,
        hoaMonthly: monthlyHOA,
      });
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
        <MortgageForm
          homePrice={homePrice}
          downPayment={downPayment}
          rate={rate}
          term={term}
          propertyTax={propertyTax}
          homeInsurance={homeInsurance}
          hoa={hoa}
          homePriceError={homePriceError}
          downPaymentError={downPaymentError}
          rateError={rateError}
          termError={termError}
          propertyTaxError={propertyTaxError}
          homeInsuranceError={homeInsuranceError}
          hoaError={hoaError}
          onHomePriceChange={handleHomePriceChange}
          onDownPaymentChange={handleDownPaymentChange}
          onRateChange={handleRateChange}
          onTermChange={handleTermChange}
          onPropertyTaxChange={handlePropertyTaxChange}
          onHomeInsuranceChange={handleHomeInsuranceChange}
          onHOAChange={handleHOAChange}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        unexpectedError ? (
          <ResultCard state="error" message={UNEXPECTED_ERROR_MESSAGE} />
        ) : (
          <MortgageResult
            result={result}
            taxAndInsuranceMonthly={escrowInputs.taxAndInsuranceMonthly}
            hoaMonthly={escrowInputs.hoaMonthly}
          />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
