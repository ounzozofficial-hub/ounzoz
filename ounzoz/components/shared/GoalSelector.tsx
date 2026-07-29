import { useId } from 'react';
import { CALORIE_GOAL_LABELS } from '@/lib/formulas/calorie-goal';
import type { CalorieGoal } from '@/types/shared';

export interface GoalSelectorProps {
  value: CalorieGoal | null;
  onChange: (value: CalorieGoal) => void;
  errorText?: string;
}

const GOALS = Object.keys(CALORIE_GOAL_LABELS) as CalorieGoal[];

// A labeled radio group for the 3 goals, styled identically to
// SexSelector (DESIGN.md Section 9 token usage, has[:focus-visible]
// outline ring). Moved to components/shared/ once a second tool (Macro
// Calculator) needed the same goal input that Calorie Calculator
// introduced (CLAUDE.md Section 4 golden rule: extract once genuinely
// shared by 2+ tools) — same pattern as SexSelector's and
// ActivityLevelSelector's earlier moves. Its data (CALORIE_GOAL_LABELS)
// comes from lib/formulas/calorie-goal.ts, not from any tool's calculator
// file, so this component doesn't create a dependency on Calorie
// Calculator or Macro Calculator specifically.
export function GoalSelector({ value, onChange, errorText }: GoalSelectorProps) {
  const groupId = useId();
  const hasError = Boolean(errorText);

  return (
    <fieldset className="flex flex-col gap-[var(--space-2)]">
      <legend className="font-[family-name:var(--font-body)] text-[var(--font-size-sm)] font-medium text-[var(--color-text-primary)]">
        Goal
      </legend>
      <div className="flex flex-col gap-[var(--space-2)] sm:flex-row sm:gap-[var(--space-3)]" role="radiogroup">
        {GOALS.map((goal) => {
          const optionId = `${groupId}-${goal}`;
          const isSelected = value === goal;
          return (
            <label
              key={goal}
              htmlFor={optionId}
              className={`flex h-11 flex-1 cursor-pointer items-center justify-center rounded-[var(--radius-sm)] border px-[var(--space-3)] text-center font-[family-name:var(--font-body)] text-[var(--font-size-base)] transition-colors duration-150 max-md:h-12 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--color-brand-cyan)] ${
                isSelected
                  ? 'border-[var(--color-brand-cyan)] border-2 bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium'
                  : hasError
                    ? 'border-[var(--color-error)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
              }`}
            >
              <input
                id={optionId}
                type="radio"
                name={groupId}
                value={goal}
                checked={isSelected}
                onChange={() => onChange(goal)}
                className="sr-only"
              />
              {CALORIE_GOAL_LABELS[goal]}
            </label>
          );
        })}
      </div>
      {hasError ? (
        <p className="font-[family-name:var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-error)]">
          {errorText}
        </p>
      ) : null}
    </fieldset>
  );
}
