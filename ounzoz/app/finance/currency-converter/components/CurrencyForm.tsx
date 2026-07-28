import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { CURRENCY_VALIDATION_MESSAGES } from '@/lib/calculators/currency';
import type { CurrencyCode, CurrencyValidationError } from '@/types/currency';
import { CurrencySelect } from './CurrencySelect';

export interface CurrencyFormProps {
  amount: string;
  from: CurrencyCode;
  to: CurrencyCode;
  amountError: CurrencyValidationError | null;
  isLoading: boolean;
  onAmountChange: (value: string) => void;
  onFromChange: (value: CurrencyCode) => void;
  onToChange: (value: CurrencyCode) => void;
  onSwap: () => void;
  onSubmit: () => void;
}

// Inline spinner shown inside the primary button while a rate fetch is in
// flight — DESIGN.md Section 18: "the button shows a brief inline
// spinner... rather than disabling silently." Uses Tailwind's built-in
// animate-spin utility (no custom keyframes needed); already neutralized
// under prefers-reduced-motion by the global rule in globals.css.
function ButtonSpinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.3"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Input UI only — this is the first tool on the platform with an async
// submit action (a live rate fetch), so it's also the first to need a
// loading affordance on its primary button. No calculation/network logic
// lives here (CLAUDE.md Section 4) — this component only owns markup and
// renders the loading/error state it's handed by CurrencyCalculator.
export function CurrencyForm({
  amount,
  from,
  to,
  amountError,
  isLoading,
  onAmountChange,
  onFromChange,
  onToChange,
  onSwap,
  onSubmit,
}: CurrencyFormProps) {
  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-[var(--space-5)]"
      >
        <Input
          label="Amount"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 100"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          errorText={
            amountError
              ? CURRENCY_VALIDATION_MESSAGES[amountError]
              : undefined
          }
        />
        <div className="grid grid-cols-1 items-end gap-[var(--space-3)] sm:grid-cols-[1fr_auto_1fr]">
          <CurrencySelect label="From" value={from} onChange={onFromChange} />
          <button
            type="button"
            onClick={onSwap}
            aria-label="Swap currencies"
            className="hidden h-11 w-11 shrink-0 items-center justify-center self-end rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-background)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-cyan)] sm:flex"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 3v14M7 17l-4-4M7 17l4-4M17 21V7M17 7l4 4M17 7l-4 4" />
            </svg>
          </button>
          <CurrencySelect label="To" value={to} onChange={onToChange} />
        </div>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-[var(--space-2)]">
              <ButtonSpinner />
              Converting…
            </span>
          ) : (
            'Convert'
          )}
        </Button>
      </form>
    </Card>
  );
}
