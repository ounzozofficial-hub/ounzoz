import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { COMPOUND_INTEREST_VALIDATION_MESSAGES } from '@/lib/calculators/compound-interest';
import type {
  CompoundInterestValidationError,
  CompoundingFrequency,
} from '@/types/compound-interest';
import { FrequencySelector } from './FrequencySelector';

export interface CompoundInterestFormProps {
  principal: string;
  rate: string;
  frequency: CompoundingFrequency | null;
  years: string;
  principalError: CompoundInterestValidationError | null;
  rateError: CompoundInterestValidationError | null;
  frequencyError: CompoundInterestValidationError | null;
  yearsError: CompoundInterestValidationError | null;
  onPrincipalChange: (value: string) => void;
  onRateChange: (value: string) => void;
  onFrequencyChange: (value: CompoundingFrequency) => void;
  onYearsChange: (value: string) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/compound-interest.ts, and the
// calculation itself runs in CompoundInterestCalculator on submit.
export function CompoundInterestForm({
  principal,
  rate,
  frequency,
  years,
  principalError,
  rateError,
  frequencyError,
  yearsError,
  onPrincipalChange,
  onRateChange,
  onFrequencyChange,
  onYearsChange,
  onSubmit,
}: CompoundInterestFormProps) {
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
          label="Starting amount"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 10000"
          value={principal}
          onChange={(e) => onPrincipalChange(e.target.value)}
          errorText={
            principalError
              ? COMPOUND_INTEREST_VALIDATION_MESSAGES[principalError]
              : undefined
          }
        />
        <Input
          label="Annual interest rate (%)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 5"
          value={rate}
          onChange={(e) => onRateChange(e.target.value)}
          errorText={
            rateError ? COMPOUND_INTEREST_VALIDATION_MESSAGES[rateError] : undefined
          }
        />
        <FrequencySelector
          value={frequency}
          onChange={onFrequencyChange}
          errorText={
            frequencyError
              ? COMPOUND_INTEREST_VALIDATION_MESSAGES[frequencyError]
              : undefined
          }
        />
        <Input
          label="Number of years"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 10"
          value={years}
          onChange={(e) => onYearsChange(e.target.value)}
          errorText={
            yearsError ? COMPOUND_INTEREST_VALIDATION_MESSAGES[yearsError] : undefined
          }
        />
        <Button type="submit" variant="primary">
          Calculate Growth
        </Button>
      </form>
    </Card>
  );
}
