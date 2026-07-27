import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { ActivityLevelSelector } from '@/components/shared/ActivityLevelSelector';
import { WATER_INTAKE_VALIDATION_MESSAGES } from '@/lib/calculators/water-intake';
import type { ActivityLevel } from '@/types/shared';
import type { WaterIntakeValidationError } from '@/types/water-intake';

export interface WaterIntakeFormProps {
  weight: string;
  activityLevel: ActivityLevel | null;
  weightError: WaterIntakeValidationError | null;
  activityError: WaterIntakeValidationError | null;
  onWeightChange: (value: string) => void;
  onActivityChange: (value: ActivityLevel) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/water-intake.ts, and the
// calculation itself runs in WaterIntakeCalculator on submit. Simplest
// form on the platform alongside Ideal Weight's — just weight and
// activity level, reusing the shared ActivityLevelSelector.
export function WaterIntakeForm({
  weight,
  activityLevel,
  weightError,
  activityError,
  onWeightChange,
  onActivityChange,
  onSubmit,
}: WaterIntakeFormProps) {
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
            weightError
              ? WATER_INTAKE_VALIDATION_MESSAGES[weightError]
              : undefined
          }
        />
        <ActivityLevelSelector
          value={activityLevel}
          onChange={onActivityChange}
          errorText={
            activityError
              ? WATER_INTAKE_VALIDATION_MESSAGES[activityError]
              : undefined
          }
        />
        <Button type="submit" variant="primary">
          Calculate Water Intake
        </Button>
      </form>
    </Card>
  );
}
