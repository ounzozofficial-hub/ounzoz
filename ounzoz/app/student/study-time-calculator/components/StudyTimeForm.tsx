import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { STUDY_TIME_VALIDATION_MESSAGES } from '@/lib/calculators/study-time';
import type { StudyTimeValidationError } from '@/types/study-time';

export interface StudyTimeFormProps {
  days: string;
  hoursPerDay: string;
  topics: string;
  daysError: StudyTimeValidationError | null;
  hoursPerDayError: StudyTimeValidationError | null;
  topicsError: StudyTimeValidationError | null;
  onDaysChange: (value: string) => void;
  onHoursPerDayChange: (value: string) => void;
  onTopicsChange: (value: string) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/study-time.ts, and the
// calculation itself runs in StudyTimeCalculator on submit. Same flat
// three-field shape as Loan Calculator's form.
export function StudyTimeForm({
  days,
  hoursPerDay,
  topics,
  daysError,
  hoursPerDayError,
  topicsError,
  onDaysChange,
  onHoursPerDayChange,
  onTopicsChange,
  onSubmit,
}: StudyTimeFormProps) {
  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-[var(--space-5)]"
      >
        <Input
          label="Days until exam or deadline"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 14"
          value={days}
          onChange={(e) => onDaysChange(e.target.value)}
          errorText={
            daysError ? STUDY_TIME_VALIDATION_MESSAGES[daysError] : undefined
          }
        />
        <Input
          label="Hours available per day"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 3"
          value={hoursPerDay}
          onChange={(e) => onHoursPerDayChange(e.target.value)}
          errorText={
            hoursPerDayError
              ? STUDY_TIME_VALIDATION_MESSAGES[hoursPerDayError]
              : undefined
          }
        />
        <Input
          label="Number of topics to cover"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 6"
          value={topics}
          onChange={(e) => onTopicsChange(e.target.value)}
          errorText={
            topicsError
              ? STUDY_TIME_VALIDATION_MESSAGES[topicsError]
              : undefined
          }
        />
        <Button type="submit" variant="primary">
          Calculate Study Time
        </Button>
      </form>
    </Card>
  );
}
