import { ResultCard } from '@/components/shared/ResultCard';
import type { InvestmentResult as InvestmentResultType } from '@/types/investment';

export interface InvestmentResultProps {
  result: InvestmentResultType | null;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Output UI only — maps an InvestmentResult (or its absence) onto the
// shared ResultCard's empty/success states. The headline number is the
// final projected balance (what "investment calculator" searchers
// primarily want to see); the description shows total contributed vs.
// estimated growth, same "show the components" pattern as SavingsResult
// showing total contributed/interest earned. "Growth," not "interest" —
// this is investment terminology, not a bank-account framing.
export function InvestmentResult({ result }: InvestmentResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter an initial investment or monthly contribution to see your projected growth"
      />
    );
  }

  const description = `$${formatCurrency(result.totalContributions)} contributed + $${formatCurrency(result.estimatedGrowth)} estimated growth`;

  return (
    <ResultCard
      state="success"
      label="Projected balance"
      value={`$${formatCurrency(result.finalBalance)}`}
      description={description}
    />
  );
}
