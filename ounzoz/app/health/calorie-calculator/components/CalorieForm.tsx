import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { SexSelector } from '@/components/shared/SexSelector';
import { ActivityLevelSelector } from '@/components/shared/ActivityLevelSelector';
import { CALORIE_VALIDATION_MESSAGES } from '@/lib/calculators/calorie';
import type { ActivityLevel, BiologicalSex } from '@/types/shared';
import type { CalorieGoal, CalorieValidationError } from '@/types/calorie';
import { GoalSelector } from './GoalSelector';

export interface CalorieFormProps {
  weight: string;
  height: string;
  age: string;
  sex: BiologicalSex | null;
  activityLevel: ActivityLevel | null;
  goal: CalorieGoal | null;
  weightError: CalorieValidationError | null;
  heightError: CalorieValidationError | null;
  ageError: CalorieValidationError | null;
  sexError: CalorieValidationError | null;
  activityError: CalorieValidationError | null;
  goalError: CalorieValidationError | null;
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
// codes/messages come from lib/calculators/calorie.ts, and the
// calculation itself runs in CalorieCalculator on submit.
export function CalorieForm({
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
}: CalorieFormProps) {
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
            sexError ? CALORIE_VALIDATION_MESSAGES[sexError] : undefined
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
            weightError ? CALORIE_VALIDATION_MESSAGES[weightError] : undefined
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
            heightError ? CALORIE_VALIDATION_MESSAGES[heightError] : undefined
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
            ageError ? CALORIE_VALIDATION_MESSAGES[ageError] : undefined
          }
        />
        <ActivityLevelSelector
          value={activityLevel}
          onChange={onActivityChange}
          errorText={
            activityError
              ? CALORIE_VALIDATION_MESSAGES[activityError]
              : undefined
          }
        />
        <GoalSelector
          value={goal}
          onChange={onGoalChange}
          errorText={goalError ? CALORIE_VALIDATION_MESSAGES[goalError] : undefined}
        />
        <Button type="submit" variant="primary">
          Calculate Calories
        </Button>
      </form>
    </Card>
  );
}
