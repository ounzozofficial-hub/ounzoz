import { useId } from 'react';
import { COMPOUNDING_FREQUENCY_LABELS } from '@/lib/calculators/compound-interest';
import type { CompoundingFrequency } from '@/types/compound-interest';

export interface FrequencySelectorProps {
  value: CompoundingFrequency | null;
  onChange: (value: CompoundingFrequency) => void;
  errorText?: string;
}

const FREQUENCIES = Object.keys(
  COMPOUNDING_FREQUENCY_LABELS,
) as CompoundingFrequency[];

// A native <select> for the 5 compounding frequencies — same generic form
// control language as ActivityLevelSelector (label above, 44/48px height,
// cyan 2px focus border, error slot below). Kept local to this tool
// rather than components/shared/ since no other tool needs a compounding-
// frequency input yet (CLAUDE.md Section 4/5: only extract once genuinely
// shared by 2+ tools).
export function FrequencySelector({
  value,
  onChange,
  errorText,
}: FrequencySelectorProps) {
  const selectId = useId();
  const errorId = `${selectId}-error`;
  const hasError = Boolean(errorText);

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <label
        htmlFor={selectId}
        className="font-[family-name:var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)]"
      >
        Compounding frequency
      </label>
      <select
        id={selectId}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value as CompoundingFrequency)}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? errorId : undefined}
        className={`h-11 max-md:h-12 rounded-[var(--radius-sm)] border bg-[var(--color-surface)] px-[var(--space-4)] font-[family-name:var(--font-body)] text-[var(--font-size-base)] text-[var(--color-text-primary)] outline-none transition-colors duration-150 focus:border-2 focus:border-[var(--color-brand-cyan)] focus:px-[calc(var(--space-4)-1px)] ${
          hasError ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'
        }`}
      >
        <option value="" disabled>
          Select how often interest compounds
        </option>
        {FREQUENCIES.map((frequency) => (
          <option key={frequency} value={frequency}>
            {COMPOUNDING_FREQUENCY_LABELS[frequency]}
          </option>
        ))}
      </select>
      {hasError ? (
        <p
          id={errorId}
          className="font-[family-name:var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-error)]"
        >
          {errorText}
        </p>
      ) : null}
    </div>
  );
}
