import { useId } from 'react';
import type { UnitCategory } from '@/types/unit-converter';

export interface CategorySelectorProps {
  value: UnitCategory;
  onChange: (value: UnitCategory) => void;
}

const CATEGORY_OPTIONS: { value: UnitCategory; label: string }[] = [
  { value: 'length', label: 'Length' },
  { value: 'weight', label: 'Weight' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'volume', label: 'Volume' },
];

// Native <select> for the 4 conversion categories — same generic
// form-control language as FrequencySelector/CurrencySelect (label
// above, 44/48px height, cyan 2px focus border). Always holds a valid
// default (never null), so there's no error state to guard against.
export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const selectId = useId();

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <label
        htmlFor={selectId}
        className="font-[family-name:var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)]"
      >
        Category
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value as UnitCategory)}
        className="h-11 max-md:h-12 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-4)] font-[family-name:var(--font-body)] text-[var(--font-size-base)] text-[var(--color-text-primary)] outline-none transition-colors duration-150 focus:border-2 focus:border-[var(--color-brand-cyan)] focus:px-[calc(var(--space-4)-1px)]"
      >
        {CATEGORY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
