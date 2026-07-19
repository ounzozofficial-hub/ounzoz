import { useId, type InputHTMLAttributes } from 'react';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  helperText?: string;
  errorText?: string;
  id?: string;
}

// DESIGN.md Section 9:
// - Label always above the input (never placeholder-as-label).
// - 44px desktop / 48px mobile height, 1px border, radius-sm.
// - Focus: border becomes brand cyan, 2px.
// - Error state: border becomes --color-error, helper text swaps to the
//   specific validation message in --color-error (never color-only —
//   text change carries the signal too).
// Accessibility (CLAUDE.md Section 16 / DESIGN.md Section 16): label is
// programmatically associated via htmlFor/id, and errorText is wired to
// aria-describedby + aria-invalid so screen readers announce it.
export function Input({
  label,
  helperText,
  errorText,
  id,
  className = '',
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(errorText);

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <label
        htmlFor={inputId}
        className="font-[var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)]"
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={hasError || undefined}
        aria-describedby={
          hasError ? errorId : helperText ? helperId : undefined
        }
        className={`h-11 max-md:h-12 rounded-[var(--radius-sm)] border bg-[var(--color-surface)] px-[var(--space-4)] font-[var(--font-body)] text-[var(--font-size-base)] text-[var(--color-text-primary)] outline-none transition-colors duration-150 focus:border-2 focus:border-[var(--color-brand-cyan)] focus:px-[calc(var(--space-4)-1px)] ${
          hasError
            ? 'border-[var(--color-error)]'
            : 'border-[var(--color-border)]'
        } ${className}`}
        {...rest}
      />
      {hasError ? (
        <p
          id={errorId}
          className="font-[var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-error)]"
        >
          {errorText}
        </p>
      ) : helperText ? (
        <p
          id={helperId}
          className="font-[var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-text-secondary)]"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
