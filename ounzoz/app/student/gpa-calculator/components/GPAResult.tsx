import { ResultCard } from '@/components/shared/ResultCard';
import type { GPAResult as GPAResultType } from '@/types/gpa';

export interface GPAResultProps {
  result: GPAResultType | null;
}

// Output UI only — maps a GPAResult (or its absence) onto the shared
// ResultCard's empty/success states. Headline is the GPA itself (no
// unit — a GPA is already a self-contained figure on the 4.0 scale);
// description echoes course count and total credit hours, same "show
// how the number was built" pattern used across the platform.
export function GPAResult({ result }: GPAResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Add your courses and grades to see your GPA"
      />
    );
  }

  const courseWord = result.courseCount === 1 ? 'course' : 'courses';
  const description = `Based on ${result.courseCount} ${courseWord}, ${result.totalCreditHours} total credit hours`;

  return (
    <ResultCard
      state="success"
      label="Your GPA"
      value={result.gpa.toFixed(2)}
      description={description}
    />
  );
}
