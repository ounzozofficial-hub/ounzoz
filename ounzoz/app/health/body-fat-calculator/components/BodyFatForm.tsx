import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { SexSelector } from '@/components/shared/SexSelector';
import { BODY_FAT_VALIDATION_MESSAGES } from '@/lib/calculators/body-fat';
import type { BiologicalSex } from '@/types/shared';
import type { BodyFatValidationError } from '@/types/body-fat';

export interface BodyFatFormProps {
  height: string;
  neck: string;
  waist: string;
  hip: string;
  sex: BiologicalSex | null;
  heightError: BodyFatValidationError | null;
  neckError: BodyFatValidationError | null;
  waistError: BodyFatValidationError | null;
  hipError: BodyFatValidationError | null;
  sexError: BodyFatValidationError | null;
  onHeightChange: (value: string) => void;
  onNeckChange: (value: string) => void;
  onWaistChange: (value: string) => void;
  onHipChange: (value: string) => void;
  onSexChange: (value: BiologicalSex) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/body-fat.ts, and the
// calculation itself runs in BodyFatCalculator on submit.
//
// Hip is only shown for the female formula (the male Navy formula never
// reads it) — same "show only what applies" principle as any other
// conditional field, kept simple since there's only one such field here.
export function BodyFatForm({
  height,
  neck,
  waist,
  hip,
  sex,
  heightError,
  neckError,
  waistError,
  hipError,
  sexError,
  onHeightChange,
  onNeckChange,
  onWaistChange,
  onHipChange,
  onSexChange,
  onSubmit,
}: BodyFatFormProps) {
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
            sexError ? BODY_FAT_VALIDATION_MESSAGES[sexError] : undefined
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
            heightError ? BODY_FAT_VALIDATION_MESSAGES[heightError] : undefined
          }
        />
        <Input
          label="Neck circumference (cm)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 38"
          value={neck}
          onChange={(e) => onNeckChange(e.target.value)}
          helperText="Measure just below the larynx (Adam's apple)."
          errorText={
            neckError ? BODY_FAT_VALIDATION_MESSAGES[neckError] : undefined
          }
        />
        <Input
          label="Waist circumference (cm)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 85"
          value={waist}
          onChange={(e) => onWaistChange(e.target.value)}
          helperText={
            sex === 'female'
              ? 'Measure at the narrowest point, above the belly button.'
              : 'Measure at the navel.'
          }
          errorText={
            waistError ? BODY_FAT_VALIDATION_MESSAGES[waistError] : undefined
          }
        />
        {sex === 'female' ? (
          <Input
            label="Hip circumference (cm)"
            type="number"
            inputMode="decimal"
            placeholder="e.g. 100"
            value={hip}
            onChange={(e) => onHipChange(e.target.value)}
            helperText="Measure at the widest point of the hips."
            errorText={
              hipError ? BODY_FAT_VALIDATION_MESSAGES[hipError] : undefined
            }
          />
        ) : null}
        <Button type="submit" variant="primary">
          Calculate Body Fat
        </Button>
      </form>
    </Card>
  );
}
