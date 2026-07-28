import { ResultCard } from '@/components/shared/ResultCard';
import type { LoanResult as LoanResultType } from '@/types/loan';

export interface LoanResultProps {
  result: LoanResultType | null;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Output UI only — maps a LoanResult (or its absence) onto the shared
// ResultCard's empty/success states. The headline number is the monthly
// payment (what "loan calculator" searchers primarily want — DESIGN.md
// Section 1's signature moment); the description shows total interest and
// total cost, same "show the components" pattern as WaterIntakeResult
// showing baseline + activity bonus.
export function LoanResult({ result }: LoanResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter your loan amount, rate, and term to see your monthly payment"
      />
    );
  }

  const description = `$${formatCurrency(result.totalInterest)} total interest · $${formatCurrency(result.totalPaid)} total cost`;

  return (
    <ResultCard
      state="success"
      label="Estimated monthly payment"
      value={`$${formatCurrency(result.monthlyPayment)}`}
      description={description}
    />
  );
}
