import { ResultCard } from '@/components/shared/ResultCard';
import type { GradeResult as GradeResultType } from '@/types/grade';

export interface GradeResultProps {
  result: GradeResultType | null;
}

// Output UI only — maps a GradeResult (or its absence) onto the shared
// ResultCard's empty/success states. Headline is the overall percentage;
// description states the letter grade plus category-count context, same
// "show how the number was built" pattern used across the platform.
export function GradeResult({ result }: GradeResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Add your grade categories to see your overall grade"
      />
    );
  }

  const categoryWord = result.categoryCount === 1 ? 'category' : 'categories';
  const description = `That's a ${result.letterGrade} (based on ${result.categoryCount} ${categoryWord})`;

  return (
    <ResultCard
      state="success"
      label="Your overall grade"
      value={result.overallPercent.toFixed(2)}
      unit="%"
      description={description}
    />
  );
}
