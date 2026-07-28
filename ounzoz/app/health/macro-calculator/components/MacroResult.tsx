import { ResultCard } from '@/components/shared/ResultCard';
import type { MacroResult as MacroResultType } from '@/types/macro';

export interface MacroResultProps {
  result: MacroResultType | null;
}

// Output UI only — maps a MacroResult (or its absence) onto the shared
// ResultCard's empty/success states. Protein/fat/carbs are a small set of
// co-equal named values rather than one headline number, so this uses
// ResultCard's breakdown grid (DESIGN.md Section 11.2) instead of the
// standard value/description pair — same pattern CalorieResult uses for
// its single-value case, but for a multi-valued result.
export function MacroResult({ result }: MacroResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter your details and goal to see your macro split"
      />
    );
  }

  return (
    <ResultCard
      state="success"
      label="Your daily macro split"
      description={`${result.calories.toLocaleString('en-US')} cal/day total`}
      breakdown={[
        { label: 'Protein', value: result.proteinGrams.toLocaleString('en-US'), unit: 'g' },
        { label: 'Fat', value: result.fatGrams.toLocaleString('en-US'), unit: 'g' },
        { label: 'Carbs', value: result.carbGrams.toLocaleString('en-US'), unit: 'g' },
      ]}
    />
  );
}
