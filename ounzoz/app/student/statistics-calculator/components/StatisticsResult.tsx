import { ResultCard } from '@/components/shared/ResultCard';
import type { StatisticsResult as StatisticsResultType } from '@/types/statistics';

export interface StatisticsResultProps {
  result: StatisticsResultType | null;
}

// Output UI only — maps a StatisticsResult (or its absence) onto the
// shared ResultCard. Mean/median/mode/standard-deviation are four
// co-equal named values rather than one headline number, so this uses
// ResultCard's breakdown grid (DESIGN.md Section 11.2) — same pattern
// MacroResult uses for its three-way protein/fat/carb split, sized for
// four tiles instead of three.
export function StatisticsResult({ result }: StatisticsResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter at least 2 numbers to see the statistics"
      />
    );
  }

  return (
    <ResultCard
      state="success"
      label="Statistics"
      description={`Based on ${result.count} values`}
      breakdown={[
        { label: 'Mean', value: String(result.mean) },
        { label: 'Median', value: String(result.median) },
        { label: 'Mode', value: result.mode },
        { label: 'Std Dev', value: String(result.standardDeviation) },
      ]}
    />
  );
}
