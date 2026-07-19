import { Card } from './Card';

interface ResultCardBaseProps {
  className?: string;
}

interface EmptyStateProps extends ResultCardBaseProps {
  state: 'empty';
  /** e.g. "Enter your weight and height to see your BMI" */
  message: string;
}

interface ErrorStateProps extends ResultCardBaseProps {
  state: 'error';
  /** Specific, actionable message — never a raw error or stack trace. */
  message: string;
}

interface SuccessStateProps extends ResultCardBaseProps {
  state: 'success';
  /** Short label above the result, e.g. "Your BMI" */
  label: string;
  /** The result itself, e.g. "22.4" — rendered at the signature scale. */
  value: string;
  /** Optional unit or qualifier next to the value, e.g. "kg/m²" */
  unit?: string;
  /** Optional supporting line under the result, e.g. "Normal weight" */
  description?: string;
}

export type ResultCardProps =
  | EmptyStateProps
  | ErrorStateProps
  | SuccessStateProps;

// The calculator result panel — DESIGN.md Section 1 & 11: this is the
// platform's one "signature moment," the single place per page allowed
// to be visually confident. Everything else on a tool page stays quiet
// so the result is what the user's eye lands on.
export function ResultCard(props: ResultCardProps) {
  if (props.state === 'empty') {
    // DESIGN.md Section 17: never a blank space — a quiet, inviting
    // placeholder, muted icon + one line of guidance, not styled like
    // an error.
    return (
      <Card
        className={`flex min-h-[160px] flex-col items-center justify-center gap-[var(--space-3)] text-center ${props.className ?? ''}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--color-text-secondary)]"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
        <p className="max-w-xs font-[var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
          {props.message}
        </p>
      </Card>
    );
  }

  if (props.state === 'error') {
    // DESIGN.md Section 19: calm, specific message inside the Result
    // Panel area — never a raw error, stack trace, or blank crash.
    return (
      <Card
        role="alert"
        className={`flex min-h-[160px] flex-col items-center justify-center gap-[var(--space-3)] text-center ${props.className ?? ''}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--color-error)]"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v5M12 16h.01" />
        </svg>
        <p className="max-w-xs font-[var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-error)]">
          {props.message}
        </p>
      </Card>
    );
  }

  // Success — DESIGN.md Section 6: shadow-lg specifically for "the result
  // panel when a calculation completes." Section 15: fade/slide-in on
  // appearance (see .animate-result-in in globals.css).
  return (
    <Card
      className={`animate-result-in flex flex-col items-center gap-[var(--space-2)] text-center shadow-[var(--shadow-lg)] ${props.className ?? ''}`}
    >
      <span className="font-[var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-secondary)]">
        {props.label}
      </span>
      <span className="flex items-baseline gap-[var(--space-2)]">
        <span className="font-[var(--font-display)] text-[var(--font-size-result)] font-extrabold leading-none text-[var(--color-brand-cyan)]">
          {props.value}
        </span>
        {props.unit ? (
          <span className="font-[var(--font-body)] text-[var(--font-size-lg)] text-[var(--color-text-secondary)]">
            {props.unit}
          </span>
        ) : null}
      </span>
      {props.description ? (
        <span className="font-[var(--font-body)] text-[var(--font-size-base)] text-[var(--color-text-primary)]">
          {props.description}
        </span>
      ) : null}
    </Card>
  );
}
