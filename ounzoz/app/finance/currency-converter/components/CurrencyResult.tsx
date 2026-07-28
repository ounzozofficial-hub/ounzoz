import { ResultCard } from '@/components/shared/ResultCard';
import type { CurrencyConversionResult } from '@/types/currency';

export interface CurrencyResultProps {
  result: CurrencyConversionResult | null;
  isLoading: boolean;
}

function formatAmount(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatRate(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 6 });
}

// Output UI only — maps a CurrencyConversionResult (or its absence/loading
// state) onto the shared ResultCard's states. This is the first tool
// whose result depends on a live network call rather than pure local
// input, so it's also the first to need a loading treatment: rather than
// adding a new ResultCard variant (a shared component every other tool
// also depends on), the loading state reuses the existing "empty" state
// with a specific in-progress message — DESIGN.md Section 18 just
// requires a visible, non-blank indicator, which this satisfies without
// touching shared code.
export function CurrencyResult({ result, isLoading }: CurrencyResultProps) {
  if (isLoading) {
    return (
      <ResultCard
        state="empty"
        message="Fetching the latest exchange rate…"
      />
    );
  }

  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter an amount and choose currencies to convert"
      />
    );
  }

  return (
    <ResultCard
      state="success"
      label="Converted amount"
      value={formatAmount(result.convertedAmount)}
      unit={result.to}
      description={`1 ${result.from} = ${formatRate(result.rate)} ${result.to}`}
      advisory={
        result.isCached
          ? 'Showing a rate from earlier this session — live rates are temporarily unavailable.'
          : undefined
      }
    />
  );
}
