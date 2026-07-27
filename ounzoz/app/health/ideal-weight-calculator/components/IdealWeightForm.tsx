import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { SexSelector } from '@/components/shared/SexSelector';
import { IDEAL_WEIGHT_VALIDATION_MESSAGES } from '@/lib/calculators/ideal-weight';
import type { BiologicalSex } from '@/types/shared';
import type { IdealWeightValidationError } from '@/types/ideal-weight';

export interface IdealWeightFormProps {
  height: string;
  sex: BiologicalSex | null;
  heightError: IdealWeightValidationError | null;
  sexError: IdealWeightValidationError | null;
  onHeightChange: (value: string) => void;
  onSexChange: (value: BiologicalSex) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/ideal-weight.ts, and the
// calculation itself runs in IdealWeightCalculator on submit. The
// simplest form on the platform so far — just height and sex, same tier
// as BMI.
export function IdealWeightForm({
  height,
  sex,
  heightError,
  sexError,
  onHeightChange,
  onSexChange,
  onSubmit,
}: IdealWeightFormProps) {
  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-[var(--space-5)]"
      >
        <SexSelector
          value={sex}
          onChange={onSexChange}
          errorText={
            sexError ? IDEAL_WEIGHT_VALIDATION_MESSAGES[sexError] : undefined
          }
        />
        <Input
          label="Height (cm)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 175"
          value={height}
          onChange={(e) => onHeightChange(e.target.value)}
          errorText={
            heightError
              ? IDEAL_WEIGHT_VALIDATION_MESSAGES[heightError]
              : undefined
          }
        />
        <Button type="submit" variant="primary">
          Calculate Ideal Weight
        </Button>
      </form>
    </Card>
  );
}
