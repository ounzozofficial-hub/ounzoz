import { ResultCard } from '@/components/shared/ResultCard';
import type { PercentageResult as PercentageResultType } from '@/types/percentage';

export interface PercentageResultProps {
  result: PercentageResultType | null;
}

// Trims to at most 2 decimal places without padding trailing zeros (e.g.
// 10 stays "10", 12.5 stays "12.5", 33.333333 becomes "33.33") — plain
// numbers here, not currency, so no forced 2-decimal padding.
function formatNumber(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

const DIRECTION_LABEL: Record<'increase' | 'decrease' | 'no-change', string> = {
  increase: 'Increase',
  decrease: 'Decrease',
  'no-change': 'No change',
};

// Output UI only — maps a PercentageResult (or its absence) onto the
// shared ResultCard's empty/success states. Unlike every prior tool, the
// headline value/unit/description shape genuinely differs per mode
// (that's the nature of a multi-mode utility, not three tools pretending
// to be one), so this switches on result.mode rather than having one
// fixed shape.
export function PercentageResult({ result }: PercentageResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter your numbers to see the result"
      />
    );
  }

  if (result.mode === 'percent-of') {
    return (
      <ResultCard
        state="success"
        label="Result"
        value={formatNumber(result.value)}
        description={`${formatNumber(result.percent)}% of ${formatNumber(result.ofValue)}`}
      />
    );
  }

  if (result.mode === 'is-what-percent') {
    return (
      <ResultCard
        state="success"
        label="Result"
        value={formatNumber(result.value)}
        unit="%"
        description={`${formatNumber(result.part)} is ${formatNumber(result.value)}% of ${formatNumber(result.whole)}`}
      />
    );
  }

  // percent-change
  return (
    <ResultCard
      state="success"
      label="Result"
      value={formatNumber(Math.abs(result.value))}
      unit="%"
      description={`${DIRECTION_LABEL[result.direction]} from ${formatNumber(result.fromValue)} to ${formatNumber(result.toValue)}`}
    />
  );
}
