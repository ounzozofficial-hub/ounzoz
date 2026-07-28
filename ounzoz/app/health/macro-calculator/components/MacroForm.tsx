import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { SexSelector } from '@/components/shared/SexSelector';
import { ActivityLevelSelector } from '@/components/shared/ActivityLevelSelector';
import { GoalSelector } from '@/components/shared/GoalSelector';
import { MACRO_VALIDATION_MESSAGES } from '@/lib/calculators/macro';
import type { ActivityLevel, BiologicalSex, CalorieGoal } from '@/types/shared';
import type { MacroValidationError } from '@/types/macro';

export interface MacroFormProps {
  weight: string;
  height: string;
  age: string;
  sex: BiologicalSex | null;
  activityLevel: ActivityLevel | null;
  goal: CalorieGoal | null;
  weightError: MacroValidationError | null;
  heightError: MacroValidationError | null;
  ageError: MacroValidationError | null;
  sexError: MacroValidationError | null;
  activityError: MacroValidationError | null;
  goalError: MacroValidationError | null;
  onWeightChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onSexChange: (value: BiologicalSex) => void;
  onActivityChange: (value: ActivityLevel) => void;
  onGoalChange: (value: CalorieGoal) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/macro.ts, and the calculation
// itself runs in MacroCalculator on submit. Same 6 fields as
// CalorieForm's, since Macro genuinely builds on Calorie's result
// (CLAUDE.md Section 5) and introduces no new inputs.
export function MacroForm({
  weight,
  height,
  age,
  sex,
  activityLevel,
  goal,
  weightError,
  heightError,
  ageError,
  sexError,
  activityError,
  goalError,
  onWeightChange,
  onHeightChange,
  onAgeChange,
  onSexChange,
  onActivityChange,
  onGoalChange,
  onSubmit,
}: MacroFormProps) {
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
          errorText={sexError ? MACRO_VALIDATION_MESSAGES[sexError] : undefined}
        />
        <Input
          label="Weight (kg)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 70"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
          errorText={
            weightError ? MACRO_VALIDATION_MESSAGES[weightError] : undefined
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
            heightError ? MACRO_VALIDATION_MESSAGES[heightError] : undefined
          }
        />
        <Input
          label="Age (years)"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 30"
          value={age}
          onChange={(e) => onAgeChange(e.target.value)}
          errorText={ageError ? MACRO_VALIDATION_MESSAGES[ageError] : undefined}
        />
        <ActivityLevelSelector
          value={activityLevel}
          onChange={onActivityChange}
          errorText={
            activityError ? MACRO_VALIDATION_MESSAGES[activityError] : undefined
          }
        />
        <GoalSelector
          value={goal}
          onChange={onGoalChange}
          errorText={goalError ? MACRO_VALIDATION_MESSAGES[goalError] : undefined}
        />
        <Button type="submit" variant="primary">
          Calculate Macros
        </Button>
      </form>
    </Card>
  );
}
