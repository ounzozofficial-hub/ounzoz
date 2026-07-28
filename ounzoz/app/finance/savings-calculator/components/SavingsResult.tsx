import { ResultCard } from '@/components/shared/ResultCard';
import type { SavingsResult as SavingsResultType } from '@/types/savings';

export interface SavingsResultProps {
  result: SavingsResultType | null;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Output UI only — maps a SavingsResult (or its absence) onto the shared
// ResultCard's empty/success states. The headline number is the final
// balance (what "savings calculator" searchers primarily want to see);
// the description shows total contributed vs. interest earned, same
// "show the components" pattern as LoanResult showing total interest/
// total cost.
export function SavingsResult({ result }: SavingsResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter a deposit or monthly contribution to see your savings grow"
      />
    );
  }

  const description = `$${formatCurrency(result.totalContributions)} contributed + $${formatCurrency(result.interestEarned)} interest earned`;

  return (
    <ResultCard
      state="success"
      label="Final balance"
      value={`$${formatCurrency(result.finalBalance)}`}
      description={description}
    />
  );
}
