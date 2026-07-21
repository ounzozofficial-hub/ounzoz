import { useId } from 'react';
import { ACTIVITY_LEVEL_LABELS } from '@/lib/calculators/tdee';
import type { ActivityLevel } from '@/types/tdee';

export interface ActivityLevelSelectorProps {
  value: ActivityLevel | null;
  onChange: (value: ActivityLevel) => void;
  errorText?: string;
}

const ACTIVITY_LEVELS = Object.keys(ACTIVITY_LEVEL_LABELS) as ActivityLevel[];

// A native <select> for the 5 activity levels — DESIGN.md Section 9 has
// no dropdown-specific rules, so this reuses the same generic form
// control language as Input: label above, 44/48px height, 1px border,
// cyan 2px focus border, error slot below. A native select fits these
// options better than a radio group (5 long, descriptive labels vs.
// SexSelector's 2 short ones).
//
// Kept local to tdee-calculator/ for now — only this tool needs it.
// Calorie Calculator (next in the health cluster) will very likely need
// the same control, at which point it crosses the "genuinely shared by
// 2+ tools" threshold and should move to components/shared/, same as
// SexSelector did this phase.
export function ActivityLevelSelector({
  value,
  onChange,
  errorText,
}: ActivityLevelSelectorProps) {
  const selectId = useId();
  const errorId = `${selectId}-error`;
  const hasError = Boolean(errorText);

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <label
        htmlFor={selectId}
        className="font-[var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)]"
      >
        Activity level
      </label>
      <select
        id={selectId}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value as ActivityLevel)}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? errorId : undefined}
        className={`h-11 max-md:h-12 rounded-[var(--radius-sm)] border bg-[var(--color-surface)] px-[var(--space-4)] font-[var(--font-body)] text-[var(--font-size-base)] text-[var(--color-text-primary)] outline-none transition-colors duration-150 focus:border-2 focus:border-[var(--color-brand-cyan)] focus:px-[calc(var(--space-4)-1px)] ${
          hasError ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'
        }`}
      >
        <option value="" disabled>
          Select your activity level
        </option>
        {ACTIVITY_LEVELS.map((level) => (
          <option key={level} value={level}>
            {ACTIVITY_LEVEL_LABELS[level]}
          </option>
        ))}
      </select>
      {hasError ? (
        <p
          id={errorId}
          className="font-[var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-error)]"
        >
          {errorText}
        </p>
      ) : null}
    </div>
  );
}
