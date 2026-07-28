import { ResultCard } from '@/components/shared/ResultCard';
import type { MortgageResult as MortgageResultType } from '@/types/mortgage';

export interface MortgageResultProps {
  result: MortgageResultType | null;
  /** Monthly-equivalent of annual property tax + home insurance — passed
   * separately from the combined `result.monthlyEscrow` so the
   * description line can show each component on its own, omitting any
   * that are zero. */
  taxAndInsuranceMonthly: number;
  /** Monthly HOA dues, same reasoning as taxAndInsuranceMonthly above. */
  hoaMonthly: number;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Output UI only — maps a MortgageResult (or its absence) onto the shared
// ResultCard's empty/success states. The headline number is the total
// estimated monthly payment (P&I + taxes/insurance/HOA) — what "mortgage
// calculator" searchers primarily want (DESIGN.md Section 1's signature
// moment). The description breaks down each component that's actually
// non-zero, same "show the components" pattern as LoanResult showing
// total interest/total cost.
export function MortgageResult({
  result,
  taxAndInsuranceMonthly,
  hoaMonthly,
}: MortgageResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter your home price, down payment, rate, and term to see your estimated monthly payment"
      />
    );
  }

  const parts = [
    `$${formatCurrency(result.monthlyPrincipalAndInterest)} principal & interest`,
  ];
  if (taxAndInsuranceMonthly > 0) {
    parts.push(`$${formatCurrency(taxAndInsuranceMonthly)} taxes & insurance`);
  }
  if (hoaMonthly > 0) {
    parts.push(`$${formatCurrency(hoaMonthly)} HOA`);
  }

  return (
    <ResultCard
      state="success"
      label="Estimated total monthly payment"
      value={`$${formatCurrency(result.totalMonthlyPayment)}`}
      description={parts.join(' + ')}
    />
  );
}
