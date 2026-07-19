import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { BMI_VALIDATION_MESSAGES } from '@/lib/calculators/bmi';
import type { BMIValidationError } from '@/types/bmi';

export interface BMIFormProps {
  weight: string;
  height: string;
  weightError: BMIValidationError | null;
  heightError: BMIValidationError | null;
  onWeightChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display.
// No calculation logic lives here (CLAUDE.md Section 4): validation
// error codes and messages both come from lib/calculators/bmi.ts, and
// the actual calculation runs in BMICalculator on submit.
export function BMIForm({
  weight,
  height,
  weightError,
  heightError,
  onWeightChange,
  onHeightChange,
  onSubmit,
}: BMIFormProps) {
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
          label="Weight (kg)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 70"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
          errorText={
            weightError ? BMI_VALIDATION_MESSAGES[weightError] : undefined
          }
        />
        <Input
          label="Height (cm)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 175"
          value={height}
          onChange={(e) => onHeightChange(e.target.value)}
          errorText={
            heightError ? BMI_VALIDATION_MESSAGES[heightError] : undefined
          }
        />
        <Button type="submit" variant="primary">
          Calculate BMI
        </Button>
      </form>
    </Card>
  );
}
