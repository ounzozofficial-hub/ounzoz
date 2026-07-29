import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { FRACTION_VALIDATION_MESSAGES } from '@/lib/calculators/fraction';
import type { FractionOperation, FractionValidationError } from '@/types/fraction';
import { OperationSelector } from './OperationSelector';

export interface FractionFormProps {
  numerator1: string;
  denominator1: string;
  numerator2: string;
  denominator2: string;
  operation: FractionOperation;
  numerator1Error: FractionValidationError | null;
  denominator1Error: FractionValidationError | null;
  numerator2Error: FractionValidationError | null;
  denominator2Error: FractionValidationError | null;
  onNumerator1Change: (value: string) => void;
  onDenominator1Change: (value: string) => void;
  onNumerator2Change: (value: string) => void;
  onDenominator2Change: (value: string) => void;
  onOperationChange: (operation: FractionOperation) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/fraction.ts, and the
// calculation itself runs in FractionCalculator on submit. Two
// numerator/denominator pairs laid out side by side per fraction, with
// the operation selector between them so the form reads left-to-right
// the same way the equation does (fraction 1, operation, fraction 2).
export function FractionForm({
  numerator1,
  denominator1,
  numerator2,
  denominator2,
  operation,
  numerator1Error,
  denominator1Error,
  numerator2Error,
  denominator2Error,
  onNumerator1Change,
  onDenominator1Change,
  onNumerator2Change,
  onDenominator2Change,
  onOperationChange,
  onSubmit,
}: FractionFormProps) {
  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-[var(--space-5)]"
      >
        <p className="font-[family-name:var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)]">
          First fraction
        </p>
        <div className="grid grid-cols-2 gap-[var(--space-4)]">
          <Input
            label="Numerator"
            type="number"
            inputMode="numeric"
            placeholder="e.g. 1"
            value={numerator1}
            onChange={(e) => onNumerator1Change(e.target.value)}
            errorText={
              numerator1Error
                ? FRACTION_VALIDATION_MESSAGES[numerator1Error]
                : undefined
            }
          />
          <Input
            label="Denominator"
            type="number"
            inputMode="numeric"
            placeholder="e.g. 2"
            value={denominator1}
            onChange={(e) => onDenominator1Change(e.target.value)}
            errorText={
              denominator1Error
                ? FRACTION_VALIDATION_MESSAGES[denominator1Error]
                : undefined
            }
          />
        </div>

        <OperationSelector value={operation} onChange={onOperationChange} />

        <p className="font-[family-name:var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)]">
          Second fraction
        </p>
        <div className="grid grid-cols-2 gap-[var(--space-4)]">
          <Input
            label="Numerator"
            type="number"
            inputMode="numeric"
            placeholder="e.g. 1"
            value={numerator2}
            onChange={(e) => onNumerator2Change(e.target.value)}
            errorText={
              numerator2Error
                ? FRACTION_VALIDATION_MESSAGES[numerator2Error]
                : undefined
            }
          />
          <Input
            label="Denominator"
            type="number"
            inputMode="numeric"
            placeholder="e.g. 3"
            value={denominator2}
            onChange={(e) => onDenominator2Change(e.target.value)}
            errorText={
              denominator2Error
                ? FRACTION_VALIDATION_MESSAGES[denominator2Error]
                : undefined
            }
          />
        </div>

        <Button type="submit" variant="primary">
          Calculate
        </Button>
      </form>
    </Card>
  );
}
