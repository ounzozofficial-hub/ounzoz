import { Input } from '@/components/shared/Input';

export interface CategoryRowProps {
  index: number;
  categoryName: string;
  weight: string;
  score: string;
  weightError?: string;
  scoreError?: string;
  onCategoryNameChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onScoreChange: (value: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

// One row of the dynamic category list — optional name + weight + score
// + a remove button. Input UI only, no calculation logic (CLAUDE.md
// Section 4). Structurally close to GPA Calculator's CourseRow, but
// implemented independently (no shared import) per CLAUDE.md Tool
// Independence — this tool has an extra optional label field CourseRow
// doesn't need.
export function CategoryRow({
  index,
  categoryName,
  weight,
  score,
  weightError,
  scoreError,
  onCategoryNameChange,
  onWeightChange,
  onScoreChange,
  onRemove,
  canRemove,
}: CategoryRowProps) {
  return (
    <div className="flex flex-col gap-[var(--space-3)] border-b border-[var(--color-border)] pb-[var(--space-4)] last:border-b-0 last:pb-0">
      <div className="flex items-center justify-between">
        <span className="font-[var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-secondary)]">
          Category {index + 1}
        </span>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove category ${index + 1}`}
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
      <Input
        label="Category name (optional)"
        type="text"
        placeholder="e.g. Homework"
        value={categoryName}
        onChange={(e) => onCategoryNameChange(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-[var(--space-4)]">
        <Input
          label="Weight (%)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 40"
          value={weight}
          onChange={(e) => onWeightChange(e.target.value)}
          errorText={weightError}
        />
        <Input
          label="Score (%)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 90"
          value={score}
          onChange={(e) => onScoreChange(e.target.value)}
          errorText={scoreError}
        />
      </div>
    </div>
  );
}
