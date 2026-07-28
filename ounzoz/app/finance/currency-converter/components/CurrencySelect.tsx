import { useId } from 'react';
import { CURRENCY_CODES, CURRENCY_LABELS } from '@/lib/calculators/currency';
import type { CurrencyCode } from '@/types/currency';

export interface CurrencySelectProps {
  label: string;
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
}

// Native <select> for one of the 30 supported currencies — same generic
// form-control language as FrequencySelector on Compound Interest
// Calculator (label above, 44/48px height, cyan 2px focus border). Reused
// for both "From" and "To" via the `label` prop. No error state: unlike
// every other selector on the platform, this one always holds a valid
// default value (never null), so there's no invalid state to guard
// against — kept local to this tool since no other tool needs a currency
// input yet (CLAUDE.md Section 4).
export function CurrencySelect({
  label,
  value,
  onChange,
}: CurrencySelectProps) {
  const selectId = useId();

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <label
        htmlFor={selectId}
        className="font-[var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)]"
      >
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value as CurrencyCode)}
        className="h-11 max-md:h-12 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-4)] font-[var(--font-body)] text-[var(--font-size-base)] text-[var(--color-text-primary)] outline-none transition-colors duration-150 focus:border-2 focus:border-[var(--color-brand-cyan)] focus:px-[calc(var(--space-4)-1px)]"
      >
        {CURRENCY_CODES.map((code) => (
          <option key={code} value={code}>
            {code} — {CURRENCY_LABELS[code]}
          </option>
        ))}
      </select>
    </div>
  );
}
