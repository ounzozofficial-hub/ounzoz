// Frankfurter v2 (api.frankfurter.dev/v2) currencies — a blended,
// multi-central-bank dataset (verified live 2026-08-01), not fabricated.
// This is the 30 legacy ECB-only currencies plus every Arabic-region
// currency and a set of other globally major currencies v2 added beyond
// v1's ECB-only list. See lib/calculators/currency.ts for the matching
// CURRENCY_LABELS/CURRENCY_CODES runtime data.
export type CurrencyCode =
  | 'AED'
  | 'ARS'
  | 'AUD'
  | 'BDT'
  | 'BHD'
  | 'BRL'
  | 'CAD'
  | 'CHF'
  | 'CLP'
  | 'CNY'
  | 'COP'
  | 'CZK'
  | 'DKK'
  | 'DZD'
  | 'EGP'
  | 'EUR'
  | 'GBP'
  | 'HKD'
  | 'HUF'
  | 'IDR'
  | 'ILS'
  | 'INR'
  | 'IQD'
  | 'ISK'
  | 'JOD'
  | 'JPY'
  | 'KES'
  | 'KRW'
  | 'KWD'
  | 'LBP'
  | 'LYD'
  | 'MAD'
  | 'MXN'
  | 'MYR'
  | 'NGN'
  | 'NOK'
  | 'NZD'
  | 'OMR'
  | 'PEN'
  | 'PHP'
  | 'PKR'
  | 'PLN'
  | 'QAR'
  | 'RON'
  | 'RUB'
  | 'SAR'
  | 'SDG'
  | 'SEK'
  | 'SGD'
  | 'SYP'
  | 'THB'
  | 'TND'
  | 'TRY'
  | 'TWD'
  | 'UAH'
  | 'USD'
  | 'VND'
  | 'YER'
  | 'ZAR';

export interface CurrencyConversionResult {
  convertedAmount: number;
  /** Units of `to` currency per 1 unit of `from` currency. */
  rate: number;
  from: CurrencyCode;
  to: CurrencyCode;
  /** True when this result used a session-cached rate because the live
   * fetch failed — ResultCard's advisory slot surfaces this to the user
   * (DESIGN.md Section 11.1). Never set silently. */
  isCached: boolean;
}

// Currency Converter is the only tool with a live external dependency, so
// unlike every other tool's field-level error set, there's no FROM/TO
// validation error here — the two currency selects always hold a valid
// default value (never null/empty), only Amount can be genuinely invalid.
export type CurrencyValidationError =
  | 'AMOUNT_REQUIRED'
  | 'AMOUNT_NOT_A_NUMBER'
  | 'AMOUNT_NOT_POSITIVE'
  | 'AMOUNT_OUT_OF_RANGE';
