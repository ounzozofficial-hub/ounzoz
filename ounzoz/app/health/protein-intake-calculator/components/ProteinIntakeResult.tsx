import { ResultCard } from '@/components/shared/ResultCard';
import type { ProteinIntakeResult as ProteinIntakeResultType } from '@/types/protein-intake';

export interface ProteinIntakeResultProps {
  result: ProteinIntakeResultType | null;
}

// Output UI only — maps a ProteinIntakeResult (or its absence) onto the
// shared ResultCard's empty/success states. Description shows the
// grams-per-kg multiplier that was used, same "show the components"
// pattern as WaterIntakeResult showing its baseline/bonus breakdown.
export function ProteinIntakeResult({ result }: ProteinIntakeResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter your weight and activity level to see your daily protein target"
      />
    );
  }

  return (
    <ResultCard
      state="success"
      label="Your daily protein target"
      value={result.totalGrams.toLocaleString('en-US')}
      unit="g/day"
      description={`Based on ${result.gramsPerKg} g per kg of body weight`}
    />
  );
}
