import { Input } from '@/components/shared/Input';
import type { Grade } from '@/types/gpa';
import { GradeSelect } from './GradeSelect';

export interface CourseRowProps {
  index: number;
  grade: Grade | null;
  creditHours: string;
  gradeError?: string;
  creditHoursError?: string;
  onGradeChange: (grade: Grade) => void;
  onCreditHoursChange: (value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

// One row of the dynamic course list — grade + credit hours + a remove
// button. Input UI only, no calculation logic (CLAUDE.md Section 4).
export function CourseRow({
  index,
  grade,
  creditHours,
  gradeError,
  creditHoursError,
  onGradeChange,
  onCreditHoursChange,
  onRemove,
  canRemove,
}: CourseRowProps) {
  return (
    <div className="flex flex-col gap-[var(--space-3)] border-b border-[var(--color-border)] pb-[var(--space-4)] last:border-b-0 last:pb-0">
      <div className="flex items-center justify-between">
        <span className="font-[var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-secondary)]">
          Course {index + 1}
        </span>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove course ${index + 1}`}
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-background)] hover:text-[var(--color-error)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-cyan)]"
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
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-[var(--space-4)]">
        <GradeSelect value={grade} onChange={onGradeChange} errorText={gradeError} />
        <Input
          label="Credit hours"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 3"
          value={creditHours}
          onChange={(e) => onCreditHoursChange(e.target.value)}
          errorText={creditHoursError}
        />
      </div>
    </div>
  );
}
