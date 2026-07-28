import { ResultCard } from '@/components/shared/ResultCard';
import type { StudyTimeResult as StudyTimeResultType } from '@/types/study-time';

export interface StudyTimeResultProps {
  result: StudyTimeResultType | null;
}

// Output UI only — maps a StudyTimeResult (or its absence) onto the
// shared ResultCard's empty/success states. The headline number is hours
// per topic (the actionable planning number); the description gives the
// total available time for context, same "show how the number was built"
// pattern used across the platform. When hours per topic falls below the
// advisory threshold, it's surfaced via ResultCard's advisory slot
// (DESIGN.md Section 11.1) — the number itself is never changed.
export function StudyTimeResult({ result }: StudyTimeResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter your deadline, daily study time, and topics to see your plan"
      />
    );
  }

  return (
    <ResultCard
      state="success"
      label="Study time per topic"
      value={result.hoursPerTopic.toFixed(1)}
      unit="hrs/topic"
      description={`${result.totalAvailableHours.toFixed(1)} total hours available`}
      advisory={
        result.belowAdvisoryThreshold
          ? "That's under an hour per topic — consider starting sooner, narrowing your scope, or freeing up more study time per day."
          : undefined
      }
    />
  );
}
