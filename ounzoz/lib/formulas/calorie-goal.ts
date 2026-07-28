import type { CalorieGoal } from '@/types/shared';

// Human-readable labels for the 3 goals — started inside
// lib/calculators/calorie.ts (Calorie-only), moved here once Macro
// Calculator also needed the same labels for its own GoalSelector usage
// (CLAUDE.md Section 5). Note this is only the labels table: the actual
// ±500 kcal/day CALORIE_ADJUSTMENTS formula stays local to
// lib/calculators/calorie.ts, since Macro never needs that adjustment
// directly — it gets the already-adjusted total via getCalorieResult.
export const CALORIE_GOAL_LABELS: Record<CalorieGoal, string> = {
  lose: 'Lose weight',
  maintain: 'Maintain weight',
  gain: 'Gain weight',
};
