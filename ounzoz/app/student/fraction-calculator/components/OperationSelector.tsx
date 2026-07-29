import { useId } from 'react';
import type { FractionOperation } from '@/types/fraction';

export interface OperationSelectorProps {
  value: FractionOperation;
  onChange: (operation: FractionOperation) => void;
}

const OPERATION_OPTIONS: { operation: FractionOperation; label: string }[] = [
  { operation: 'add', label: '+ Add' },
  { operation: 'subtract', label: '− Subtract' },
  { operation: 'multiply', label: '× Multiply' },
  { operation: 'divide', label: '÷ Divide' },
];

// Tool-local operation switcher — same hidden-radio-behind-styled-label
// radiogroup pattern as ModeSelector (Percentage Calculator) and
// GoalSelector/SexSelector: keyboard-operable and screen-reader friendly
// without a custom tab widget. Kept local since this exact 4-operation
// set is specific to this tool (CLAUDE.md Section 4).
export function OperationSelector({ value, onChange }: OperationSelectorProps) {
  const groupId = useId();

  return (
    <fieldset className="flex flex-col gap-[var(--space-2)]">
      <legend className="font-[family-name:var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)]">
        Operation
      </legend>
      <div
        className="grid grid-cols-2 gap-[var(--space-2)] sm:grid-cols-4"
        role="radiogroup"
      >
        {OPERATION_OPTIONS.map((option) => {
          const optionId = `${groupId}-${option.operation}`;
          const isSelected = value === option.operation;
          return (
            <label
              key={option.operation}
              htmlFor={optionId}
              className={`flex h-11 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] border px-[var(--space-3)] text-center font-[family-name:var(--font-body)] text-[var(--font-size-base)] transition-colors duration-150 max-md:h-12 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--color-brand-cyan)] ${
                isSelected
                  ? 'border-[var(--color-brand-cyan)] border-2 bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
              }`}
            >
              <input
                id={optionId}
                type="radio"
                name={groupId}
                value={option.operation}
                checked={isSelected}
                onChange={() => onChange(option.operation)}
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
