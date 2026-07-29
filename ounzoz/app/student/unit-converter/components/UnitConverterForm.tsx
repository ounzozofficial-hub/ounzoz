import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { UNIT_CONVERTER_VALIDATION_MESSAGES } from '@/lib/calculators/unit-converter';
import type {
  UnitCategory,
  UnitConverterUnit,
  UnitConverterValidationError,
} from '@/types/unit-converter';
import { CategorySelector } from './CategorySelector';
import { UnitSelect } from './UnitSelect';

export interface UnitConverterFormProps {
  category: UnitCategory;
  value: string;
  fromUnit: UnitConverterUnit;
  toUnit: UnitConverterUnit;
  valueError: UnitConverterValidationError | null;
  onCategoryChange: (category: UnitCategory) => void;
  onValueChange: (value: string) => void;
  onFromUnitChange: (unit: UnitConverterUnit) => void;
  onToUnitChange: (unit: UnitConverterUnit) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/unit-converter.ts, and the
// calculation itself runs in UnitConverterCalculator on submit. Category
// first (it determines which units are selectable), then the value and
// the From/To pair.
export function UnitConverterForm({
  category,
  value,
  fromUnit,
  toUnit,
  valueError,
  onCategoryChange,
  onValueChange,
  onFromUnitChange,
  onToUnitChange,
  onSubmit,
}: UnitConverterFormProps) {
  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-[var(--space-5)]"
      >
        <CategorySelector value={category} onChange={onCategoryChange} />
        <Input
          label="Value"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 10"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          errorText={
            valueError ? UNIT_CONVERTER_VALIDATION_MESSAGES[valueError] : undefined
          }
        />
        <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2">
          <UnitSelect
            label="From"
            category={category}
            value={fromUnit}
            onChange={onFromUnitChange}
          />
          <UnitSelect
            label="To"
            category={category}
            value={toUnit}
            onChange={onToUnitChange}
          />
        </div>
        <Button type="submit" variant="primary">
          Convert
        </Button>
      </form>
    </Card>
  );
}
