import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { ActivityLevelSelector } from '@/components/shared/ActivityLevelSelector';
import { PROTEIN_INTAKE_VALIDATION_MESSAGES } from '@/lib/calculators/protein-intake';
import type { ActivityLevel } from '@/types/shared';
import type { ProteinIntakeValidationError } from '@/types/protein-intake';

export interface ProteinIntakeFormProps {
  weight: string;
  activityLevel: ActivityLevel | null;
  weightError: ProteinIntakeValidationError | null;
  activityError: ProteinIntakeValidationError | null;
  onWeightChange: (value: string) => void;
  onActivityChange: (value: ActivityLevel) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/protein-intake.ts, and the
// calculation itself runs in ProteinIntakeCalculator on submit. Same
// simple shape as Water Intake's form — weight + activity level, reusing
// the shared ActivityLevelSelector.
export function ProteinIntakeForm({
  weight,
  activityLevel,
  weightError,
  activityError,
  onWeightChange,
  onActivityChange,
  onSubmit,
}: ProteinIntakeFormProps) {
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
              ? PROTEIN_INTAKE_VALIDATION_MESSAGES[weightError]
              : undefined
          }
        />
        <ActivityLevelSelector
          value={activityLevel}
          onChange={onActivityChange}
          errorText={
            activityError
              ? PROTEIN_INTAKE_VALIDATION_MESSAGES[activityError]
              : undefined
          }
        />
        <Button type="submit" variant="primary">
          Calculate Protein Intake
        </Button>
      </form>
    </Card>
  );
}
