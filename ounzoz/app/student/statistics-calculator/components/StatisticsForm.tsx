import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Textarea } from '@/components/shared/Textarea';
import { STATISTICS_VALIDATION_MESSAGES } from '@/lib/calculators/statistics';
import type { StatisticsValidationError } from '@/types/statistics';

export interface StatisticsFormProps {
  numbers: string;
  numbersError: StatisticsValidationError | null;
  onNumbersChange: (value: string) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/statistics.ts, and the
// calculation itself runs in StatisticsCalculator on submit. Single
// free-form Textarea rather than a dynamic row list, since a data set
// can be pasted directly (comma- or line-separated) far faster than
// adding one row per value.
export function StatisticsForm({
  numbers,
  numbersError,
  onNumbersChange,
  onSubmit,
}: StatisticsFormProps) {
  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-[var(--space-5)]"
      >
        <Textarea
          label="Numbers"
          placeholder={'e.g. 12, 15, 12, 18, 20\nor one number per line'}
          rows={6}
          value={numbers}
          onChange={(e) => onNumbersChange(e.target.value)}
          helperText="Separate values with commas or line breaks — at least 2 numbers."
          errorText={
            numbersError ? STATISTICS_VALIDATION_MESSAGES[numbersError] : undefined
          }
        />
        <Button type="submit" variant="primary">
          Calculate Statistics
        </Button>
      </form>
    </Card>
  );
}
