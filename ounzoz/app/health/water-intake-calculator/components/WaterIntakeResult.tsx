import { ResultCard } from '@/components/shared/ResultCard';
import type { WaterIntakeResult as WaterIntakeResultType } from '@/types/water-intake';

export interface WaterIntakeResultProps {
  result: WaterIntakeResultType | null;
}

// Output UI only — maps a WaterIntakeResult (or its absence) onto the
// shared ResultCard's empty/success states. The headline number is
// liters/day (the everyday unit people think in); the description shows
// the ml breakdown (baseline + activity bonus), same "show the
// components" pattern as TDEEResult showing BMR or CalorieResult showing
// TDEE.
export function WaterIntakeResult({ result }: WaterIntakeResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter your weight and activity level to see your daily water intake"
      />
    );
  }

  const liters = (result.totalMl / 1000).toFixed(2);
  const description =
    result.activityBonusMl > 0
      ? `${result.baselineMl.toLocaleString('en-US')} ml baseline + ${result.activityBonusMl.toLocaleString('en-US')} ml for activity`
      : `${result.baselineMl.toLocaleString('en-US')} ml baseline, no activity adjustment`;

  return (
    <ResultCard
      state="success"
      label="Your daily water intake"
      value={liters}
      unit="L/day"
      description={description}
    />
  );
}
