import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { PREGNANCY_DUE_DATE_VALIDATION_MESSAGES } from '@/lib/calculators/pregnancy-due-date';
import type { PregnancyDueDateValidationError } from '@/types/pregnancy-due-date';

export interface PregnancyDueDateFormProps {
  lmpDate: string;
  lmpDateError: PregnancyDueDateValidationError | null;
  onLMPDateChange: (value: string) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/pregnancy-due-date.ts, and
// the calculation itself runs in PregnancyDueDateCalculator on submit.
// A native `type="date"` input is used rather than a text field — no
// native `max` attribute is set (that would need "today," which differs
// between this statically generated page's build time and the visitor's
// actual clock, risking a hydration mismatch); the future-date check
// instead runs entirely through validateLMPDateInput, same as every
// other range check on this platform (CLAUDE.md Section 8).
export function PregnancyDueDateForm({
  lmpDate,
  lmpDateError,
  onLMPDateChange,
  onSubmit,
}: PregnancyDueDateFormProps) {
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
          label="First day of your last menstrual period (LMP)"
          type="date"
          helperText="The first day of your last period — not the estimated conception date."
          value={lmpDate}
          onChange={(e) => onLMPDateChange(e.target.value)}
          errorText={
            lmpDateError
              ? PREGNANCY_DUE_DATE_VALIDATION_MESSAGES[lmpDateError]
              : undefined
          }
        />
        <Button type="submit" variant="primary">
          Calculate Due Date
        </Button>
      </form>
    </Card>
  );
}
