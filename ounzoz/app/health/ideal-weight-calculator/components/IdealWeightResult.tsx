import { ResultCard } from '@/components/shared/ResultCard';
import type { IdealWeightResult as IdealWeightResultType } from '@/types/ideal-weight';

export interface IdealWeightResultProps {
  result: IdealWeightResultType | null;
}

// Output UI only — maps an IdealWeightResult (or its absence) onto the
// shared ResultCard's empty/success states.
export function IdealWeightResult({ result }: IdealWeightResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter your height and sex to see your ideal weight"
      />
    );
  }

  return (
    <ResultCard
      state="success"
      label="Your ideal weight"
      value={result.idealWeightKg.toLocaleString('en-US', {
        maximumFractionDigits: 1,
      })}
      unit="kg"
      description="Based on the Devine formula"
    />
  );
}
