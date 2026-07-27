import { ResultCard } from '@/components/shared/ResultCard';
import type { BodyFatResult as BodyFatResultType } from '@/types/body-fat';

export interface BodyFatResultProps {
  result: BodyFatResultType | null;
}

// Output UI only — maps a BodyFatResult (or its absence) onto the shared
// ResultCard's empty/success states. Same pattern as BMIResult showing its
// WHO category label as the description line.
export function BodyFatResult({ result }: BodyFatResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter your measurements to estimate your body fat percentage"
      />
    );
  }

  return (
    <ResultCard
      state="success"
      label="Your body fat percentage"
      value={result.bodyFatPercentage.toFixed(1)}
      unit="%"
      description={result.category.label}
    />
  );
}
