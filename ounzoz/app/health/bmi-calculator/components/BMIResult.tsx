import { ResultCard } from '@/components/shared/ResultCard';
import type { BMIResult as BMIResultType } from '@/types/bmi';

export interface BMIResultProps {
  result: BMIResultType | null;
}

// Output UI only — maps a BMIResult (or its absence) onto the shared
// ResultCard's empty/success states. The error state is handled directly
// in BMICalculator, since it needs to react to validation, not just the
// presence/absence of a result.
export function BMIResult({ result }: BMIResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter your weight and height to see your BMI"
      />
    );
  }

  return (
    <ResultCard
      state="success"
      label="Your BMI"
      value={result.bmi.toFixed(1)}
      unit="kg/m²"
      description={result.category.label}
    />
  );
}
