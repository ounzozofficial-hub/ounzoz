import { ResultCard } from '@/components/shared/ResultCard';
import type { BMRResult as BMRResultType } from '@/types/bmr';

export interface BMRResultProps {
  result: BMRResultType | null;
}

// Output UI only — maps a BMRResult (or its absence) onto the shared
// ResultCard's empty/success states. The error state is handled directly
// in BMRCalculator, since it needs to react to validation, not just the
// presence/absence of a result.
export function BMRResult({ result }: BMRResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter your details to see your BMR"
      />
    );
  }

  return (
    <ResultCard
      state="success"
      label="Your BMR"
      value={result.bmr.toLocaleString('en-US')}
      unit="cal/day"
      description="Calories burned at complete rest"
    />
  );
}
