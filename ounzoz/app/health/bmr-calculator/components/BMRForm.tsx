import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { BMR_VALIDATION_MESSAGES } from '@/lib/calculators/bmr';
import type { BiologicalSex, BMRValidationError } from '@/types/bmr';
import { SexSelector } from './SexSelector';

export interface BMRFormProps {
  weight: string;
  height: string;
  age: string;
  sex: BiologicalSex | null;
  weightError: BMRValidationError | null;
  heightError: BMRValidationError | null;
  ageError: BMRValidationError | null;
  sexError: BMRValidationError | null;
  onWeightChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onSexChange: (value: BiologicalSex) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/bmr.ts, and the calculation
// itself runs in BMRCalculator on submit.
export function BMRForm({
  weight,
  height,
  age,
  sex,
  weightError,
  heightError,
  ageError,
  sexError,
  onWeightChange,
  onHeightChange,
  onAgeChange,
  onSexChange,
  onSubmit,
}: BMRFormProps) {
  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-[var(--space-5)]"
      >
        <SexSelector
          value={sex}
          onChange={onSexChange}
          errorText={sexError ? BMR_VALIDATION_MESSAGES[sexError] : undefined}
        />
        <Input
          label="Weight (kg)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 70"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
          errorText={
            weightError ? BMR_VALIDATION_MESSAGES[weightError] : undefined
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
            heightError ? BMR_VALIDATION_MESSAGES[heightError] : undefined
          }
        />
        <Input
          label="Age (years)"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 30"
          value={age}
          onChange={(e) => onAgeChange(e.target.value)}
          errorText={ageError ? BMR_VALIDATION_MESSAGES[ageError] : undefined}
        />
        <Button type="submit" variant="primary">
          Calculate BMR
        </Button>
      </form>
    </Card>
  );
}
