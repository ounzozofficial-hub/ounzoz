'use client';

import { useState, type ReactNode } from 'react';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import { ResultCard } from '@/components/shared/ResultCard';
import {
  convertAmount,
  fetchExchangeRate,
  validateCurrencyInputs,
} from '@/lib/calculators/currency';
import type {
  CurrencyCode,
  CurrencyConversionResult,
  CurrencyValidationError,
} from '@/types/currency';
import { CurrencyForm } from './CurrencyForm';
import { CurrencyResult } from './CurrencyResult';
import { readCachedRate, writeCachedRate } from '../session-cache';

const API_UNAVAILABLE_MESSAGE =
  "Exchange rates are temporarily unavailable. Please try again in a moment.";

export interface CurrencyCalculatorProps {
  title: string;
  description: string;
  /** Pre-rendered server content — ArticleLayout, FAQ, related tools.
   * Passed in from page.tsx rather than owned here, same pattern as
   * every other tool. */
  contentSlot: ReactNode;
  faqSlot: ReactNode;
  relatedToolsSlot: ReactNode;
}

// Top-level composition — owns all interactive state and is the only
// place that calls into lib/calculators/currency.ts. Unlike every prior
// tool, submission is async (a live rate fetch) and has a third outcome
// beyond success/validation-error: the API call itself can fail, which is
// handled here via the graceful-degradation flow — try the live rate,
// fall back to a session-cached rate for the same pair if the fetch
// fails, and only show the hard error state if neither is available.
export function CurrencyCalculator({
  title,
  description,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: CurrencyCalculatorProps) {
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState<CurrencyCode>('USD');
  const [to, setTo] = useState<CurrencyCode>('EUR');
  const [amountError, setAmountError] =
    useState<CurrencyValidationError | null>(null);
  const [result, setResult] = useState<CurrencyConversionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Distinct from a validation error: the inputs were valid, but the live
  // rate service couldn't be reached and no session-cached fallback
  // existed for this pair. DESIGN.md Section 19 — a calm, specific
  // message, never a raw fetch error.
  const [apiError, setApiError] = useState(false);

  function handleAmountChange(value: string) {
    setAmount(value);
    if (amountError) setAmountError(null);
  }

  function handleSwap() {
    setFrom(to);
    setTo(from);
    setResult(null);
    setApiError(false);
  }

  async function handleSubmit() {
    const validation = validateCurrencyInputs(amount);
    setAmountError(validation.amountError);

    if (validation.amountError) {
      setResult(null);
      setApiError(false);
      return;
    }

    setIsLoading(true);
    setApiError(false);

    try {
      const rate = await fetchExchangeRate(from, to);
      writeCachedRate(from, to, rate);
      const convertedAmount = convertAmount(Number(amount), rate);
      setResult({ convertedAmount, rate, from, to, isCached: false });
      setApiError(false);
    } catch {
      // Live fetch failed (network error, non-OK response, timeout) —
      // fall back to a session-cached rate for this exact pair if one
      // exists, per the owner's explicit graceful-degradation requirement.
      const cached = readCachedRate(from, to);
      if (cached) {
        try {
          const convertedAmount = convertAmount(Number(amount), cached.rate);
          setResult({
            convertedAmount,
            rate: cached.rate,
            from,
            to,
            isCached: true,
          });
          setApiError(false);
        } catch {
          setResult(null);
          setApiError(true);
        }
      } else {
        setResult(null);
        setApiError(true);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CalculatorLayout
      title={title}
      description={description}
      inputSlot={
        <CurrencyForm
          amount={amount}
          from={from}
          to={to}
          amountError={amountError}
          isLoading={isLoading}
          onAmountChange={handleAmountChange}
          onFromChange={setFrom}
          onToChange={setTo}
          onSwap={handleSwap}
          onSubmit={handleSubmit}
        />
      }
      resultSlot={
        apiError ? (
          <ResultCard state="error" message={API_UNAVAILABLE_MESSAGE} />
        ) : (
          <CurrencyResult result={result} isLoading={isLoading} />
        )
      }
      contentSlot={contentSlot}
      faqSlot={faqSlot}
      relatedToolsSlot={relatedToolsSlot}
    />
  );
}
