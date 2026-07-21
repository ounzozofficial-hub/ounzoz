import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { SexSelector } from '@/components/shared/SexSelector';
import { TDEE_VALIDATION_MESSAGES } from '@/lib/calculators/tdee';
import type { BiologicalSex } from '@/types/shared';
import type { ActivityLevel, TDEEValidationError } from '@/types/tdee';
import { ActivityLevelSelector } from './ActivityLevelSelector';

export interface TDEEFormProps {
  weight: string;
  height: string;
  age: string;
  sex: BiologicalSex | null;
  activityLevel: ActivityLevel | null;
  weightError: TDEEValidationError | null;
  heightError: TDEEValidationError | null;
  ageError: TDEEValidationError | null;
  sexError: TDEEValidationError | null;
  activityError: TDEEValidationError | null;
  onWeightChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onSexChange: (value: BiologicalSex) => void;
  onActivityChange: (value: ActivityLevel) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/tdee.ts, and the calculation
// itself runs in TDEECalculator on submit.
export function TDEEForm({
  weight,
  height,
  age,
  sex,
  activityLevel,
  weightError,
  heightError,
  ageError,
  sexError,
  activityError,
  onWeightChange,
  onHeightChange,
  onAgeChange,
  onSexChange,
  onActivityChange,
  onSubmit,
}: TDEEFormProps) {
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
          errorText={
            sexError ? TDEE_VALIDATION_MESSAGES[sexError] : undefined
          }
        />
        <Input
          label="Weight (kg)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 70"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
          errorText={
            weightError ? TDEE_VALIDATION_MESSAGES[weightError] : undefined
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
            heightError ? TDEE_VALIDATION_MESSAGES[heightError] : undefined
          }
        />
        <Input
          label="Age (years)"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 30"
          value={age}
          onChange={(e) => onAgeChange(e.target.value)}
          errorText={
            ageError ? TDEE_VALIDATION_MESSAGES[ageError] : undefined
          }
        />
        <ActivityLevelSelector
          value={activityLevel}
          onChange={onActivityChange}
          errorText={
            activityError
              ? TDEE_VALIDATION_MESSAGES[activityError]
              : undefined
          }
        />
        <Button type="submit" variant="primary">
          Calculate TDEE
        </Button>
      </form>
    </Card>
  );
}
