import { ResultCard } from '@/components/shared/ResultCard';
import type { TDEEResult as TDEEResultType } from '@/types/tdee';

export interface TDEEResultProps {
  result: TDEEResultType | null;
}

// Output UI only — maps a TDEEResult (or its absence) onto the shared
// ResultCard's empty/success states. TDEE is the headline number (the
// signature element); BMR is shown as the description line underneath
// for context, since TDEE is derived directly from it.
export function TDEEResult({ result }: TDEEResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter your details to see your daily calorie needs"
      />
    );
  }

  return (
    <ResultCard
      state="success"
      label="Your TDEE"
      value={result.tdee.toLocaleString('en-US')}
      unit="cal/day"
      description={`Based on a BMR of ${result.bmr.toLocaleString('en-US')} cal/day`}
    />
  );
}
