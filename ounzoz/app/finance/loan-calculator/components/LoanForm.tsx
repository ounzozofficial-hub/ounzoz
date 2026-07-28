import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { LOAN_VALIDATION_MESSAGES } from '@/lib/calculators/loan';
import type { LoanValidationError } from '@/types/loan';

export interface LoanFormProps {
  amount: string;
  rate: string;
  term: string;
  amountError: LoanValidationError | null;
  rateError: LoanValidationError | null;
  termError: LoanValidationError | null;
  onAmountChange: (value: string) => void;
  onRateChange: (value: string) => void;
  onTermChange: (value: string) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/loan.ts, and the calculation
// itself runs in LoanCalculator on submit.
export function LoanForm({
  amount,
  rate,
  term,
  amountError,
  rateError,
  termError,
  onAmountChange,
  onRateChange,
  onTermChange,
  onSubmit,
}: LoanFormProps) {
  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-[var(--space-5)]"
      >
        <Input
          label="Loan amount"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 20000"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          errorText={
            amountError ? LOAN_VALIDATION_MESSAGES[amountError] : undefined
          }
        />
        <Input
          label="Annual interest rate (%)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 6.5"
          value={rate}
          onChange={(e) => onRateChange(e.target.value)}
          errorText={
            rateError ? LOAN_VALIDATION_MESSAGES[rateError] : undefined
          }
        />
        <Input
          label="Loan term (years)"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 5"
          value={term}
          onChange={(e) => onTermChange(e.target.value)}
          errorText={
            termError ? LOAN_VALIDATION_MESSAGES[termError] : undefined
          }
        />
        <Button type="submit" variant="primary">
          Calculate Payment
        </Button>
      </form>
    </Card>
  );
}
