import { ResultCard } from '@/components/shared/ResultCard';
import type { CompoundInterestResult as CompoundInterestResultType } from '@/types/compound-interest';
import { COMPOUNDING_FREQUENCY_LABELS } from '@/lib/calculators/compound-interest';
import type { CompoundingFrequency } from '@/types/compound-interest';

export interface CompoundInterestResultProps {
  result: CompoundInterestResultType | null;
  frequency: CompoundingFrequency | null;
  years: string;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Output UI only — maps a CompoundInterestResult (or its absence) onto
// the shared ResultCard's empty/success states. The headline number is
// the final balance (what "compound interest calculator" searchers
// primarily want to see grow); the description shows interest earned and
// the compounding frequency used, same "show the components" pattern as
// LoanResult showing total interest/total cost.
export function CompoundInterestResult({
  result,
  frequency,
  years,
}: CompoundInterestResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter your starting amount, rate, and years to see it grow"
      />
    );
  }

  const frequencyLabel = frequency
    ? COMPOUNDING_FREQUENCY_LABELS[frequency].toLowerCase()
    : '';
  const description = `$${formatCurrency(result.interestEarned)} in interest earned over ${years} year${years === '1' ? '' : 's'}, compounded ${frequencyLabel}`;

  return (
    <ResultCard
      state="success"
      label="Final balance"
      value={`$${formatCurrency(result.finalBalance)}`}
      description={description}
    />
  );
}
