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

export interface BreakdownItem {
  /** e.g. "Protein" */
  label: string;
  /** e.g. "98" */
  value: string;
  /** e.g. "g" */
  unit?: string;
}

interface SuccessStateProps extends ResultCardBaseProps {
  state: 'success';
  /** Short label above the result, e.g. "Your BMI" */
  label: string;
  /** The result itself, e.g. "22.4" — rendered at the signature scale.
   * Mutually exclusive with `breakdown` — provide exactly one. */
  value?: string;
  /** Optional unit or qualifier next to the value, e.g. "kg/m²" */
  unit?: string;
  /** Optional supporting line, e.g. "Normal weight". With `breakdown`,
   * this is the total/context line shown above the grid instead (e.g.
   * "2,556 cal/day total") — DESIGN.md Section 11.2. */
  description?: string;
  /** Optional advisory/safety note — DESIGN.md Section 11.1: a valid
   * result that still warrants a caution (e.g. a calorie target below the
   * safe-minimum floor). Never alters `value`; only adds context. */
  advisory?: string;
  /** For tools whose result is a small set of co-equal named values (e.g.
   * a protein/fat/carb split) rather than one headline number — DESIGN.md
   * Section 11.2. Mutually exclusive with `value` — provide exactly one. */
  breakdown?: BreakdownItem[];
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
      {props.breakdown ? (
        // DESIGN.md Section 11.2: a small set of co-equal named values
        // (e.g. protein/fat/carbs) rather than one headline number. The
        // total/context line (if any) comes first, then an equal-weight
        // grid of stat tiles at --font-size-xl — a smaller scale than
        // --font-size-result, since this is a set of results, not THE
        // signature number.
        <>
          {props.description ? (
            <span className="font-[var(--font-body)] text-[var(--font-size-base)] text-[var(--color-text-secondary)]">
              {props.description}
            </span>
          ) : null}
          <div className="mt-[var(--space-2)] grid w-full grid-cols-1 gap-[var(--space-4)] sm:grid-cols-3">
            {props.breakdown.map((item) => (
              <div key={item.label} className="flex flex-col items-center">
                <span className="font-[var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
                  {item.label}
                </span>
                <span className="flex items-baseline gap-[var(--space-1)]">
                  <span className="font-[var(--font-display)] text-[var(--font-size-xl)] font-extrabold leading-none text-[var(--color-brand-cyan)]">
                    {item.value}
                  </span>
                  {item.unit ? (
                    <span className="font-[var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
                      {item.unit}
                    </span>
                  ) : null}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
      {props.advisory ? (
        <span
          role="note"
          className="mt-[var(--space-1)] flex items-start gap-[var(--space-2)] rounded-[var(--radius-sm)] bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] px-[var(--space-3)] py-[var(--space-2)] text-left font-[var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-warning)]"
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
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            <path d="M12 9v4M12 17h.01" />
          </svg>
          <span>{props.advisory}</span>
        </span>
      ) : null}
    </Card>
  );
}
