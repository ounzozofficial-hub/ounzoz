import { ResultCard } from '@/components/shared/ResultCard';
import type { FractionResult as FractionResultType } from '@/types/fraction';

export interface FractionResultProps {
  result: FractionResultType | null;
}

// Output UI only — maps a FractionResult (or its absence) onto the
// shared ResultCard. The headline value is the simplified fraction
// itself (or a plain integer when it reduces to a whole number); the
// description line adds the decimal equivalent and, for an improper
// result, the mixed-number form — same "show how the number was built"
// pattern used across the platform.
export function FractionResult({ result }: FractionResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter two fractions and an operation to see the result"
      />
    );
  }

  const value = result.isWholeNumber
    ? String(result.numerator)
    : `${result.numerator}/${result.denominator}`;

  const descriptionParts = [`= ${result.decimal}`];
  if (result.mixedNumber) {
    const isNegative = result.mixedNumber.whole < 0;
    const wholeAbs = Math.abs(result.mixedNumber.whole);
    descriptionParts.push(
      `= ${isNegative ? '−' : ''}${wholeAbs} ${result.mixedNumber.numerator}/${result.mixedNumber.denominator}`,
    );
  }

  return (
    <ResultCard
      state="success"
      label="Result"
      value={value}
      description={descriptionParts.join('  ')}
    />
  );
}
