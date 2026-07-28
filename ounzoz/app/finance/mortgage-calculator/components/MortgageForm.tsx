import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Input } from '@/components/shared/Input';
import { MORTGAGE_VALIDATION_MESSAGES } from '@/lib/calculators/mortgage';
import type { MortgageValidationError } from '@/types/mortgage';

export interface MortgageFormProps {
  homePrice: string;
  downPayment: string;
  rate: string;
  term: string;
  propertyTax: string;
  homeInsurance: string;
  hoa: string;
  homePriceError: MortgageValidationError | null;
  downPaymentError: MortgageValidationError | null;
  rateError: MortgageValidationError | null;
  termError: MortgageValidationError | null;
  propertyTaxError: MortgageValidationError | null;
  homeInsuranceError: MortgageValidationError | null;
  hoaError: MortgageValidationError | null;
  onHomePriceChange: (value: string) => void;
  onDownPaymentChange: (value: string) => void;
  onRateChange: (value: string) => void;
  onTermChange: (value: string) => void;
  onPropertyTaxChange: (value: string) => void;
  onHomeInsuranceChange: (value: string) => void;
  onHOAChange: (value: string) => void;
  onSubmit: () => void;
}

// Input UI only — owns form markup and field-level error display. No
// calculation logic lives here (CLAUDE.md Section 4): validation error
// codes/messages come from lib/calculators/mortgage.ts, and the
// calculation itself runs in MortgageCalculator on submit. Property
// tax/insurance/HOA are optional — labeled as such, default to 0 when
// left blank.
export function MortgageForm({
  homePrice,
  downPayment,
  rate,
  term,
  propertyTax,
  homeInsurance,
  hoa,
  homePriceError,
  downPaymentError,
  rateError,
  termError,
  propertyTaxError,
  homeInsuranceError,
  hoaError,
  onHomePriceChange,
  onDownPaymentChange,
  onRateChange,
  onTermChange,
  onPropertyTaxChange,
  onHomeInsuranceChange,
  onHOAChange,
  onSubmit,
}: MortgageFormProps) {
  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-[var(--space-5)]"
      >
        <Input
          label="Home price"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 300000"
          value={homePrice}
          onChange={(e) => onHomePriceChange(e.target.value)}
          errorText={
            homePriceError
              ? MORTGAGE_VALIDATION_MESSAGES[homePriceError]
              : undefined
          }
        />
        <Input
          label="Down payment"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 60000"
          value={downPayment}
          onChange={(e) => onDownPaymentChange(e.target.value)}
          errorText={
            downPaymentError
              ? MORTGAGE_VALIDATION_MESSAGES[downPaymentError]
              : undefined
          }
        />
        <Input
          label="Annual interest rate (%)"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 6.5"
          value={rate}
          onChange={(e) => onRateChange(e.target.value)}
          errorText={
            rateError ? MORTGAGE_VALIDATION_MESSAGES[rateError] : undefined
          }
        />
        <Input
          label="Loan term (years)"
          type="number"
          inputMode="numeric"
          placeholder="e.g. 30"
          value={term}
          onChange={(e) => onTermChange(e.target.value)}
          errorText={
            termError ? MORTGAGE_VALIDATION_MESSAGES[termError] : undefined
          }
        />
        <Input
          label="Annual property tax"
          helperText="Optional — leave blank if unknown"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 3600"
          value={propertyTax}
          onChange={(e) => onPropertyTaxChange(e.target.value)}
          errorText={
            propertyTaxError
              ? MORTGAGE_VALIDATION_MESSAGES[propertyTaxError]
              : undefined
          }
        />
        <Input
          label="Annual home insurance"
          helperText="Optional — leave blank if unknown"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 1200"
          value={homeInsurance}
          onChange={(e) => onHomeInsuranceChange(e.target.value)}
          errorText={
            homeInsuranceError
              ? MORTGAGE_VALIDATION_MESSAGES[homeInsuranceError]
              : undefined
          }
        />
        <Input
          label="Monthly HOA dues"
          helperText="Optional — leave blank if none"
          type="number"
          inputMode="decimal"
          placeholder="e.g. 50"
          value={hoa}
          onChange={(e) => onHOAChange(e.target.value)}
          errorText={hoaError ? MORTGAGE_VALIDATION_MESSAGES[hoaError] : undefined}
        />
        <Button type="submit" variant="primary">
          Calculate Payment
        </Button>
      </form>
    </Card>
  );
}
