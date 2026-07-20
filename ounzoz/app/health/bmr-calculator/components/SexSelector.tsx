import { useId } from 'react';
import type { BiologicalSex } from '@/types/bmr';

export interface SexSelectorProps {
  value: BiologicalSex | null;
  onChange: (value: BiologicalSex) => void;
  errorText?: string;
}

const OPTIONS: { value: BiologicalSex; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

// A labeled radio group, styled to match the Input component's label
// position, error slot, and token usage (DESIGN.md Section 9) even
// though it isn't built from the shared Input component itself — Input
// only covers text/number fields. Kept local to bmr-calculator/ rather
// than components/shared/ since this is the only tool that needs it so
// far (CLAUDE.md Section 4 golden rule: extract only once genuinely
// shared by 2+ tools, not preemptively — TDEE Calculator will likely
// need the same control next, at which point it should move to
// components/shared/).
export function SexSelector({ value, onChange, errorText }: SexSelectorProps) {
  const groupId = useId();
  const hasError = Boolean(errorText);

  return (
    <fieldset className="flex flex-col gap-[var(--space-2)]">
      <legend className="font-[var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)]">
        Sex
      </legend>
      <div className="flex gap-[var(--space-3)]" role="radiogroup">
        {OPTIONS.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={`flex h-11 flex-1 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] border font-[var(--font-body)] text-[var(--font-size-base)] transition-colors duration-150 max-md:h-12 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--color-brand-cyan)] ${
                isSelected
                  ? 'border-[var(--color-brand-cyan)] border-2 bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium'
                  : hasError
                    ? 'border-[var(--color-error)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
              }`}
            >
              <input
                id={optionId}
                type="radio"
                name={groupId}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {hasError ? (
        <p className="font-[var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-error)]">
          {errorText}
        </p>
      ) : null}
    </fieldset>
  );
}
