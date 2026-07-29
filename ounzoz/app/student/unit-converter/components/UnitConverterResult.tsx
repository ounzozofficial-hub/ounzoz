import { ResultCard } from '@/components/shared/ResultCard';
import { UNIT_TABLES_BY_CATEGORY } from '@/lib/calculators/unit-converter';
import type { UnitConverterResult as UnitConverterResultType } from '@/types/unit-converter';

export interface UnitConverterResultProps {
  result: UnitConverterResultType | null;
}

// Output UI only — maps a UnitConverterResult (or its absence) onto the
// shared ResultCard. The headline value is the converted number with its
// unit symbol; the description spells out the full "X unit = Y unit"
// conversion for context.
export function UnitConverterResult({ result }: UnitConverterResultProps) {
  if (!result) {
    return (
      <ResultCard
        state="empty"
        message="Enter a value and choose units to convert"
      />
    );
  }

  const units = UNIT_TABLES_BY_CATEGORY[result.category];
  const fromSymbol = units[result.fromUnit]?.symbol ?? '';
  const toSymbol = units[result.toUnit]?.symbol ?? '';

  return (
    <ResultCard
      state="success"
      label="Converted value"
      value={String(result.convertedValue)}
      unit={toSymbol}
      description={`${result.value} ${fromSymbol} = ${result.convertedValue} ${toSymbol}`}
    />
  );
}
