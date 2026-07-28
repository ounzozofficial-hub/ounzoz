import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { GRADE_VALIDATION_MESSAGES } from '@/lib/calculators/grade';
import type { GradeRowValidationError } from '@/types/grade';
import { CategoryRow } from './CategoryRow';

export interface CategoryRowState {
  categoryName: string;
  weight: string;
  score: string;
  weightError: GradeRowValidationError | null;
  scoreError: GradeRowValidationError | null;
}

export interface GradeFormProps {
  rows: CategoryRowState[];
  onCategoryNameChange: (index: number, value: string) => void;
  onWeightChange: (index: number, value: string) => void;
  onScoreChange: (index: number, value: string) => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  onSubmit: () => void;
}

// Input UI only — owns the dynamic category-row list and field-level
// error display. No calculation logic lives here (CLAUDE.md Section 4):
// validation error codes/messages come from lib/calculators/grade.ts, the
// calculation itself runs in GradeCalculator on submit. "Add category" is
// a secondary action; "Calculate Grade" stays the page's one primary
// button (DESIGN.md Section 8).
//
// Shows a running weight total as helper text — not a hard requirement
// that weights sum to 100 (the formula normalizes correctly either way),
// but a genuinely useful sanity-check for a student who may not have
// entered every category yet.
export function GradeForm({
  rows,
  onCategoryNameChange,
  onWeightChange,
  onScoreChange,
  onAddRow,
  onRemoveRow,
  onSubmit,
}: GradeFormProps) {
  const weightTotal = rows.reduce((sum, row) => {
    const parsed = Number(row.weight.trim());
    return Number.isFinite(parsed) ? sum + parsed : sum;
  }, 0);

  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-[var(--space-4)]"
      >
        <div className="flex flex-col gap-[var(--space-4)]">
          {rows.map((row, index) => (
            <CategoryRow
              key={index}
              index={index}
              categoryName={row.categoryName}
              weight={row.weight}
              score={row.score}
              weightError={
                row.weightError
                  ? GRADE_VALIDATION_MESSAGES[row.weightError]
                  : undefined
              }
              scoreError={
                row.scoreError
                  ? GRADE_VALIDATION_MESSAGES[row.scoreError]
                  : undefined
              }
              onCategoryNameChange={(value) =>
                onCategoryNameChange(index, value)
              }
              onWeightChange={(value) => onWeightChange(index, value)}
              onScoreChange={(value) => onScoreChange(index, value)}
              onRemove={() => onRemoveRow(index)}
              canRemove={rows.length > 1}
            />
          ))}
        </div>

        <p className="font-[var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
          Weights total: {Math.round(weightTotal * 100) / 100}%
        </p>

        <Button type="button" variant="secondary" onClick={onAddRow}>
          Add category
        </Button>

        <Button type="submit" variant="primary">
          Calculate Grade
        </Button>
      </form>
    </Card>
  );
}
