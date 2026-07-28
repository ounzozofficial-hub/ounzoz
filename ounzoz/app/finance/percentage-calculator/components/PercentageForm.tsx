import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { PERCENTAGE_VALIDATION_MESSAGES } from '@/lib/calculators/percentage';
import type { PercentageMode, PercentageValidationError } from '@/types/percentage';
import { ModeSelector } from './ModeSelector';

export interface PercentageFormProps {
  mode: PercentageMode;
  firstValue: string;
  secondValue: string;
  firstError: PercentageValidationError | null;
  secondError: PercentageValidationError | null;
  onModeChange: (mode: PercentageMode) => void;
  onFirstValueChange: (value: string) => void;
  onSecondValueChange: (value: string) => void;
  onSubmit: () => void;
}

// Per-mode field copy — the same two-input form is reused across all
// three modes, but the labels/placeholders/button text change to match
// what's actually being asked, per mode. Kept local to this form (not a
// separate constants/ file) since it's only ever read here.
const MODE_FIELD_CONFIG: Record<
  PercentageMode,
  {
    firstLabel: string;
    firstPlaceholder: string;
    secondLabel: string;
    secondPlaceholder: string;
    buttonLabel: string;
  }
> = {
  'percent-of': {
    firstLabel: 'Percentage (%)',
    firstPlaceholder: 'e.g. 20',
    secondLabel: 'Of this number',
    secondPlaceholder: 'e.g. 50',
    buttonLabel: 'Calculate',
  },
  'is-what-percent': {
    firstLabel: 'This number',
    firstPlaceholder: 'e.g. 25',
    secondLabel: 'Is what percent of this number',
    secondPlaceholder: 'e.g. 200',
    buttonLabel: 'Calculate',
  },
  'percent-change': {
    firstLabel: 'From this value',
    firstPlaceholder: 'e.g. 80',
    secondLabel: 'To this value',
    secondPlaceholder: 'e.g. 100',
    buttonLabel: 'Calculate',
  },
};

// Input UI only — owns form markup, the mode switcher, and field-level
// error display. No calculation logic lives here (CLAUDE.md Section 4):
// validation error codes/messages come from lib/calculators/percentage.ts,
// and the calculation itself runs in PercentageCalculator on submit.
export function PercentageForm({
  mode,
  firstValue,
  secondValue,
  firstError,
  secondError,
  onModeChange,
  onFirstValueChange,
  onSecondValueChange,
  onSubmit,
}: PercentageFormProps) {
  const config = MODE_FIELD_CONFIG[mode];

  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-[var(--space-5)]"
      >
        <ModeSelector value={mode} onChange={onModeChange} />
        <Input
          label={config.firstLabel}
          type="number"
          inputMode="decimal"
          placeholder={config.firstPlaceholder}
          value={firstValue}
          onChange={(e) => onFirstValueChange(e.target.value)}
          errorText={
            firstError ? PERCENTAGE_VALIDATION_MESSAGES[firstError] : undefined
          }
        />
        <Input
          label={config.secondLabel}
          type="number"
          inputMode="decimal"
          placeholder={config.secondPlaceholder}
          value={secondValue}
          onChange={(e) => onSecondValueChange(e.target.value)}
          errorText={
            secondError ? PERCENTAGE_VALIDATION_MESSAGES[secondError] : undefined
          }
        />
        <Button type="submit" variant="primary">
          {config.buttonLabel}
        </Button>
      </form>
    </Card>
  );
}
