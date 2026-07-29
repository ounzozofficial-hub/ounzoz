import { useId } from 'react';
import { GRADE_OPTIONS } from '@/lib/calculators/gpa';
import type { Grade } from '@/types/gpa';

export interface GradeSelectProps {
  value: Grade | null;
  onChange: (grade: Grade) => void;
  errorText?: string;
  id?: string;
}

// Tool-local selector (native <select>, not a shared component) — GPA
// Calculator is the only tool so far needing a compact per-row dropdown
// rather than the button-group style of ActivityLevelSelector/
// GoalSelector (CLAUDE.md Section 4: only extract to shared once
// genuinely reused by 2+ tools). Styled to match Input's border/radius/
// height/focus tokens exactly (DESIGN.md Section 9) so it reads as the
// same design system, not a one-off.
export function GradeSelect({ value, onChange, errorText, id }: GradeSelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;
  const hasError = Boolean(errorText);

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <label
        htmlFor={selectId}
        className="font-[family-name:var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)]"
      >
        Grade
      </label>
      <select
        id={selectId}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value as Grade)}
        aria-invalid={hasError || undefined}
        aria-describedby={hasError ? errorId : undefined}
        className={`h-11 max-md:h-12 rounded-[var(--radius-sm)] border bg-[var(--color-surface)] px-[var(--space-4)] font-[family-name:var(--font-body)] text-[var(--font-size-base)] text-[var(--color-text-primary)] outline-none transition-colors duration-150 focus:border-2 focus:border-[var(--color-brand-cyan)] focus:px-[calc(var(--space-4)-1px)] ${
          hasError ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'
        }`}
      >
        <option value="" disabled>
          Select grade
        </option>
        {GRADE_OPTIONS.map((grade) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </select>
      {hasError ? (
        <p
          id={errorId}
          className="font-[family-name:var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-error)]"
        >
          {errorText}
        </p>
      ) : null}
    </div>
  );
}
