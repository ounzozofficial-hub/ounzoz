import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { GPA_VALIDATION_MESSAGES } from '@/lib/calculators/gpa';
import type { GPARowValidationError, Grade } from '@/types/gpa';
import { CourseRow } from './CourseRow';

export interface CourseRowState {
  grade: Grade | null;
  creditHours: string;
  gradeError: GPARowValidationError | null;
  creditHoursError: GPARowValidationError | null;
}

export interface GPAFormProps {
  rows: CourseRowState[];
  onGradeChange: (index: number, grade: Grade) => void;
  onCreditHoursChange: (index: number, value: string) => void;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  onSubmit: () => void;
}

// Input UI only — owns the dynamic course-row list and field-level error
// display. No calculation logic lives here (CLAUDE.md Section 4):
// validation error codes/messages come from lib/calculators/gpa.ts, the
// calculation itself runs in GPACalculator on submit. "Add course" is a
// secondary action; "Calculate GPA" stays the page's one primary button
// (DESIGN.md Section 8).
export function GPAForm({
  rows,
  onGradeChange,
  onCreditHoursChange,
  onAddRow,
  onRemoveRow,
  onSubmit,
}: GPAFormProps) {
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
            <CourseRow
              key={index}
              index={index}
              grade={row.grade}
              creditHours={row.creditHours}
              gradeError={
                row.gradeError
                  ? GPA_VALIDATION_MESSAGES[row.gradeError]
                  : undefined
              }
              creditHoursError={
                row.creditHoursError
                  ? GPA_VALIDATION_MESSAGES[row.creditHoursError]
                  : undefined
              }
              onGradeChange={(grade) => onGradeChange(index, grade)}
              onCreditHoursChange={(value) =>
                onCreditHoursChange(index, value)
              }
              onRemove={() => onRemoveRow(index)}
              canRemove={rows.length > 1}
            />
          ))}
        </div>

        <Button type="button" variant="secondary" onClick={onAddRow}>
          Add course
        </Button>

        <Button type="submit" variant="primary">
          Calculate GPA
        </Button>
      </form>
    </Card>
  );
}
