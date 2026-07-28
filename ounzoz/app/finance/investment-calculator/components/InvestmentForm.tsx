import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { INVESTMENT_VALIDATION_MESSAGES } from '@/lib/calculators/investment';
import type { InvestmentValidationError } from '@/types/investment';

export interface InvestmentFormProps {
  initialInvestment: string;
  monthlyContribution: string;
  rate: string;
  years: string;
  initialInvestmentError: InvestmentValidationError | null;
  monthlyContributionError: InvestmentValidationError | null;
  rateError: InvestmentValidationError | null;
  yearsError: InvestmentValidationError | null;
  onInitialInvestmentChange: (value: string) => void;
  onMonthlyContributionChange: (value: string) => void;
  onRateChange: (value: string) => void;
  onYearsChange: (value: string) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/investment.ts, and the
// calculation itself runs in InvestmentCalculator on submit. Initial
// investment and monthly contribution are both optional (helper text
// says so) — leaving one blank is valid as long as the other is filled
// in.
export function InvestmentForm({
  initialInvestment,
  monthlyContribution,
  rate,
  years,
  initialInvestmentError,
  monthlyContributionError,
  rateError,
  yearsError,
  onInitialInvestmentChange,
  onMonthlyContributionChange,
  onRateChange,
  onYearsChange,
  onSubmit,
}: InvestmentFormProps) {
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
          label="Initial investment"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 5000"
          helperText={
            initialInvestmentError
              ? undefined
              : 'Leave blank if starting from $0.'
          }
          value={initialInvestment}
          onChange={(e) => onInitialInvestmentChange(e.target.value)}
          errorText={
            initialInvestmentError
              ? INVESTMENT_VALIDATION_MESSAGES[initialInvestmentError]
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
              : 'Leave blank if not investing regularly.'
          }
          value={monthlyContribution}
          onChange={(e) => onMonthlyContributionChange(e.target.value)}
          errorText={
            monthlyContributionError
              ? INVESTMENT_VALIDATION_MESSAGES[monthlyContributionError]
              : undefined
          }
        />
        <Input
          label="Expected annual return (%)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 7"
          helperText={
            rateError
              ? undefined
              : 'An assumption you choose — this tool does not suggest one.'
          }
          value={rate}
          onChange={(e) => onRateChange(e.target.value)}
          errorText={
            rateError ? INVESTMENT_VALIDATION_MESSAGES[rateError] : undefined
          }
        />
        <Input
          label="Time horizon (years)"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 20"
          value={years}
          onChange={(e) => onYearsChange(e.target.value)}
          errorText={
            yearsError ? INVESTMENT_VALIDATION_MESSAGES[yearsError] : undefined
          }
        />
        <Button type="submit" variant="primary">
          Calculate Investment Growth
        </Button>
      </form>
    </Card>
  );
}
