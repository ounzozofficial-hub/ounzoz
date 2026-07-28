import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { SAVINGS_VALIDATION_MESSAGES } from '@/lib/calculators/savings';
import type { SavingsValidationError } from '@/types/savings';

export interface SavingsFormProps {
  initialDeposit: string;
  monthlyContribution: string;
  rate: string;
  years: string;
  initialDepositError: SavingsValidationError | null;
  monthlyContributionError: SavingsValidationError | null;
  rateError: SavingsValidationError | null;
  yearsError: SavingsValidationError | null;
  onInitialDepositChange: (value: string) => void;
  onMonthlyContributionChange: (value: string) => void;
  onRateChange: (value: string) => void;
  onYearsChange: (value: string) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/savings.ts, and the
// calculation itself runs in SavingsCalculator on submit. Initial deposit
// and monthly contribution are both optional (helper text says so) —
// leaving one blank is valid as long as the other is filled in.
export function SavingsForm({
  initialDeposit,
  monthlyContribution,
  rate,
  years,
  initialDepositError,
  monthlyContributionError,
  rateError,
  yearsError,
  onInitialDepositChange,
  onMonthlyContributionChange,
  onRateChange,
  onYearsChange,
  onSubmit,
}: SavingsFormProps) {
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
          label="Initial deposit"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 1000"
          helperText={
            initialDepositError ? undefined : 'Leave blank if starting from $0.'
          }
          value={initialDeposit}
          onChange={(e) => onInitialDepositChange(e.target.value)}
          errorText={
            initialDepositError
              ? SAVINGS_VALIDATION_MESSAGES[initialDepositError]
              : undefined
          }
        />
        <Input
          label="Monthly contribution"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 200"
          helperText={
            monthlyContributionError
              ? undefined
              : 'Leave blank if not adding money regularly.'
          }
          value={monthlyContribution}
          onChange={(e) => onMonthlyContributionChange(e.target.value)}
          errorText={
            monthlyContributionError
              ? SAVINGS_VALIDATION_MESSAGES[monthlyContributionError]
              : undefined
          }
        />
        <Input
          label="Annual interest rate / APY (%)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 4.5"
          value={rate}
          onChange={(e) => onRateChange(e.target.value)}
          errorText={rateError ? SAVINGS_VALIDATION_MESSAGES[rateError] : undefined}
        />
        <Input
          label="Number of years"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 10"
          value={years}
          onChange={(e) => onYearsChange(e.target.value)}
          errorText={yearsError ? SAVINGS_VALIDATION_MESSAGES[yearsError] : undefined}
        />
        <Button type="submit" variant="primary">
          Calculate Savings Growth
        </Button>
      </form>
    </Card>
  );
}
