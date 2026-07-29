import { useId } from 'react';
import type { PercentageMode } from '@/types/percentage';

export interface ModeSelectorProps {
  value: PercentageMode;
  onChange: (mode: PercentageMode) => void;
}

const MODE_OPTIONS: { mode: PercentageMode; label: string }[] = [
  { mode: 'percent-of', label: '% of a number' },
  { mode: 'is-what-percent', label: 'Is what %' },
  { mode: 'percent-change', label: '% change' },
];

// Tool-local mode switcher — this option set (the three calculation
// modes) only exists on this one tool, so it stays here rather than
// components/shared/ per CLAUDE.md Section 4's "only extract once
// genuinely shared by 2+ tools" rule. Styled as the same radiogroup
// pattern as GoalSelector/SexSelector (hidden native radio input behind
// a styled label, so it's keyboard-operable and screen-reader friendly
// out of the box) rather than reinventing a custom tab widget.
export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  const groupId = useId();

  return (
    <fieldset className="flex flex-col gap-[var(--space-2)]">
      <legend className="font-[family-name:var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)]">
        What do you want to calculate?
      </legend>
      <div
        className="flex flex-col gap-[var(--space-2)] sm:flex-row sm:gap-[var(--space-3)]"
        role="radiogroup"
      >
        {MODE_OPTIONS.map((option) => {
          const optionId = `${groupId}-${option.mode}`;
          const isSelected = value === option.mode;
          return (
            <label
              key={option.mode}
              htmlFor={optionId}
              className={`flex h-11 flex-1 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] border px-[var(--space-3)] text-center font-[family-name:var(--font-body)] text-[var(--font-size-base)] transition-colors duration-150 max-md:h-12 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--color-brand-cyan)] ${
                isSelected
                  ? 'border-[var(--color-brand-cyan)] border-2 bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
              }`}
            >
              <input
                id={optionId}
                type="radio"
                name={groupId}
                value={option.mode}
                checked={isSelected}
                onChange={() => onChange(option.mode)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
