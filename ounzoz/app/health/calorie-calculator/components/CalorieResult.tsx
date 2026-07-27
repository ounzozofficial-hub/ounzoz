import { ResultCard } from '@/components/shared/ResultCard';
import { CALORIE_GOAL_LABELS, MIN_SAFE_CALORIES } from '@/lib/calculators/calorie';
import type { BiologicalSex } from '@/types/shared';
import type { CalorieGoal, CalorieResult as CalorieResultType } from '@/types/calorie';

export interface CalorieResultProps {
  result: CalorieResultType | null;
  sex: BiologicalSex | null;
  goal: CalorieGoal | null;
}

// Output UI only — maps a CalorieResult (or its absence) onto the shared
// ResultCard's empty/success states. The daily calorie target is the
// headline number (the signature element); TDEE is shown as the
// description line underneath for context, same pattern as TDEEResult
// showing BMR. When the target falls below the standard safe-minimum
// floor, it's surfaced via ResultCard's advisory slot (DESIGN.md Section
// 11.1) — the number itself is never changed.
export function CalorieResult({ result, sex, goal }: CalorieResultProps) {
  if (!result || !sex || !goal) {
    return (
      <ResultCard
        state="empty"
        message="Enter your details and goal to see your daily calorie target"
      />
    );
  }

  const goalLabel = CALORIE_GOAL_LABELS[goal].toLowerCase();
  const safeMinimum = MIN_SAFE_CALORIES[sex];
  const sexLabel = sex === 'female' ? 'women' : 'men';

  return (
    <ResultCard
      state="success"
      label="Your daily calorie target"
      value={result.calories.toLocaleString('en-US')}
      unit="cal/day"
      description={`To ${goalLabel}, based on a TDEE of ${result.tdee.toLocaleString('en-US')} cal/day`}
      advisory={
        result.belowSafeMinimum
          ? `This is below the commonly recommended minimum of ${safeMinimum.toLocaleString('en-US')} calories/day for ${sexLabel} — consider consulting a healthcare provider before following it.`
          : undefined
      }
    />
  );
}
