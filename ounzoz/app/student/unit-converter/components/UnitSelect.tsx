import { useId } from 'react';
import { UNIT_TABLES_BY_CATEGORY } from '@/lib/calculators/unit-converter';
import type { UnitCategory, UnitConverterUnit } from '@/types/unit-converter';

export interface UnitSelectProps {
  label: string;
  category: UnitCategory;
  value: UnitConverterUnit;
  onChange: (value: UnitConverterUnit) => void;
}

// Native <select> whose option list depends on the currently-chosen
// category — same generic form-control language as CurrencySelect
// (reused for both "From" and "To" via the `label` prop). Always holds a
// valid default (UnitConverterCalculator resets it whenever the category
// changes), so there's no error state to guard against.
export function UnitSelect({ label, category, value, onChange }: UnitSelectProps) {
  const selectId = useId();
  const units = UNIT_TABLES_BY_CATEGORY[category];

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <label
        htmlFor={selectId}
        className="font-[family-name:var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)]"
      >
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value as UnitConverterUnit)}
        className="h-11 max-md:h-12 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-4)] font-[family-name:var(--font-body)] text-[var(--font-size-base)] text-[var(--color-text-primary)] outline-none transition-colors duration-150 focus:border-2 focus:border-[var(--color-brand-cyan)] focus:px-[calc(var(--space-4)-1px)]"
      >
        {Object.entries(units).map(([unitKey, definition]) => (
          <option key={unitKey} value={unitKey}>
            {definition.label}
          </option>
        ))}
      </select>
    </div>
  );
}
