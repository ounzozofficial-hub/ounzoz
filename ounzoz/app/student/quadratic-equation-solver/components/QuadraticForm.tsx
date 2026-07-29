import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { QUADRATIC_VALIDATION_MESSAGES } from '@/lib/calculators/quadratic';
import type { QuadraticValidationError } from '@/types/quadratic';

export interface QuadraticFormProps {
  a: string;
  b: string;
  c: string;
  aError: QuadraticValidationError | null;
  bError: QuadraticValidationError | null;
  cError: QuadraticValidationError | null;
  onAChange: (value: string) => void;
  onBChange: (value: string) => void;
  onCChange: (value: string) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/quadratic.ts, and the
// calculation itself runs in QuadraticCalculator on submit. Flat
// three-field shape, same template as Loan/Study Time Calculator.
export function QuadraticForm({
  a,
  b,
  c,
  aError,
  bError,
  cError,
  onAChange,
  onBChange,
  onCChange,
  onSubmit,
}: QuadraticFormProps) {
  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-[var(--space-5)]"
      >
        <p className="font-[family-name:var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
          Solve ax² + bx + c = 0
        </p>
        <Input
          label="a (coefficient of x²)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 1"
          value={a}
          onChange={(e) => onAChange(e.target.value)}
          errorText={aError ? QUADRATIC_VALIDATION_MESSAGES[aError] : undefined}
        />
        <Input
          label="b (coefficient of x)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. -3"
          value={b}
          onChange={(e) => onBChange(e.target.value)}
          errorText={bError ? QUADRATIC_VALIDATION_MESSAGES[bError] : undefined}
        />
        <Input
          label="c (constant term)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 2"
          value={c}
          onChange={(e) => onCChange(e.target.value)}
          errorText={cError ? QUADRATIC_VALIDATION_MESSAGES[cError] : undefined}
        />
        <Button type="submit" variant="primary">
          Solve for x
        </Button>
      </form>
    </Card>
  );
}
