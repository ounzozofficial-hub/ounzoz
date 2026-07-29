import { useId, type TextareaHTMLAttributes } from 'react';

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  helperText?: string;
  errorText?: string;
  id?: string;
}

// Multi-line text entry — same form-control language as Input.tsx (label
// above, 1px border/radius-sm, cyan 2px focus border, error slot below,
// DESIGN.md Section 9) but sized for a block of text rather than a single
// value. First needed by Statistics Calculator's comma/line-separated
// number list; extracted straight to shared/ rather than started locally,
// since a free-form multi-value list input is a generic form primitive
// (like Input.tsx), not tool-specific business logic.
export function Textarea({
  label,
  helperText,
  errorText,
  id,
  className = '',
  rows = 4,
  ...rest
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const helperId = `${textareaId}-helper`;
  const errorId = `${textareaId}-error`;
  const hasError = Boolean(errorText);

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <label
        htmlFor={textareaId}
        className="font-[family-name:var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)]"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        rows={rows}
        aria-invalid={hasError || undefined}
        aria-describedby={
          hasError ? errorId : helperText ? helperId : undefined
        }
        className={`resize-y rounded-[var(--radius-sm)] border bg-[var(--color-surface)] px-[var(--space-4)] py-[var(--space-3)] font-[family-name:var(--font-body)] text-[var(--font-size-base)] text-[var(--color-text-primary)] outline-none transition-colors duration-150 focus:border-2 focus:border-[var(--color-brand-cyan)] focus:px-[calc(var(--space-4)-1px)] focus:py-[calc(var(--space-3)-1px)] ${
          hasError
            ? 'border-[var(--color-error)]'
            : 'border-[var(--color-border)]'
        } ${className}`}
        {...rest}
      />
      {hasError ? (
        <p
          id={errorId}
          className="font-[family-name:var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-error)]"
        >
          {errorText}
        </p>
      ) : helperText ? (
        <p
          id={helperId}
          className="font-[family-name:var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-text-secondary)]"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
