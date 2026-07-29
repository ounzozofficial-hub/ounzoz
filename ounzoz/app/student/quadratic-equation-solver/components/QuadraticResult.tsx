import { ResultCard } from '@/components/shared/ResultCard';
import type { QuadraticResult as QuadraticResultType } from '@/types/quadratic';

export interface QuadraticResultProps {
  result: QuadraticResultType | null;
}

// Output UI only — maps a QuadraticResult (or its absence) onto the
// shared ResultCard. Three distinct shapes depending on the discriminant:
// two real roots use the breakdown grid (DESIGN.md Section 11.2, a
// co-equal x1/x2 pair), one repeated root uses the standard single value,
// and the complex case never presents a fabricated real number — the
// headline value plainly states there is no real solution, with the
// actual complex conjugate pair shown as supporting context.
export function QuadraticResult({ result }: QuadraticResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter a, b, and c to solve for x"
      />
    );
  }

  if (result.rootType === 'two-real') {
    return (
      <ResultCard
        state="success"
        label="Solutions for x"
        description={`Discriminant = ${result.discriminant} — two real roots`}
        breakdown={[
          { label: 'x₁', value: String(result.root1) },
          { label: 'x₂', value: String(result.root2) },
        ]}
      />
    );
  }

  if (result.rootType === 'one-real') {
    return (
      <ResultCard
        state="success"
        label="Solution for x (repeated root)"
        value={String(result.root)}
        description="Discriminant = 0 — one repeated real root"
      />
    );
  }

  return (
    <ResultCard
      state="success"
      label="Solution for x"
      value="No real roots"
      description={`Discriminant = ${result.discriminant} (negative) — complex roots: ${result.realPart} ± ${result.imaginaryPart}i`}
    />
  );
}
