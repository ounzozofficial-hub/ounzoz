import { ResultCard } from '@/components/shared/ResultCard';
import type { PregnancyDueDateResult as PregnancyDueDateResultType } from '@/types/pregnancy-due-date';

export interface PregnancyDueDateResultProps {
  result: PregnancyDueDateResultType | null;
}

function formatDueDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// Output UI only — maps a PregnancyDueDateResult (or its absence) onto
// the shared ResultCard's empty/success states. The due date is clearly
// one headline value (not a co-equal set like Macro's breakdown grid —
// DESIGN.md Section 11.2 only applies there), so this uses the standard
// value/description/advisory shape. The advisory slot carries the
// medical-estimate caution this tool's YMYL-adjacent content requires on
// every single result, not just an edge case (PROJECT.md Section 5,
// CLAUDE.md Section 10) — unlike Calorie's advisory, which only appears
// conditionally below a safety floor.
export function PregnancyDueDateResult({
  result,
}: PregnancyDueDateResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter the first day of your last period to see your estimated due date"
      />
    );
  }

  const { gestationalAge, trimester, daysRemaining } = result;
  const weekLabel = `${gestationalAge.weeks} week${gestationalAge.weeks === 1 ? '' : 's'}, ${gestationalAge.days} day${gestationalAge.days === 1 ? '' : 's'} pregnant`;
  const timingLabel =
    daysRemaining >= 0
      ? `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} to go`
      : `${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) === 1 ? '' : 's'} past your estimated due date`;

  return (
    <ResultCard
      state="success"
      label="Your estimated due date"
      value={formatDueDate(result.dueDate)}
      description={`${weekLabel} · Trimester ${trimester} · ${timingLabel}`}
      advisory="This is an estimate based on Naegele's Rule, not a diagnosis. Only about 5% of babies are born on their exact due date, and a full-term birth is anywhere from 37 to 42 weeks — your doctor's estimate (based on an ultrasound) may differ from this calculation and should be treated as more accurate."
    />
  );
}
