// ECB reference-rate currencies as served by frankfurter.app — a fixed,
// documented dataset (verified live 2026-07-28), not fabricated. See
// lib/calculators/currency.ts for the matching CURRENCY_LABELS/CURRENCY_CODES
// runtime data.
export type CurrencyCode =
  | 'AUD'
  | 'BRL'
  | 'CAD'
  | 'CHF'
  | 'CNY'
  | 'CZK'
  | 'DKK'
  | 'EUR'
  | 'GBP'
  | 'HKD'
  | 'HUF'
  | 'IDR'
  | 'ILS'
  | 'INR'
  | 'ISK'
  | 'JPY'
  | 'KRW'
  | 'MXN'
  | 'MYR'
  | 'NOK'
  | 'NZD'
  | 'PHP'
  | 'PLN'
  | 'RON'
  | 'SEK'
  | 'SGD'
  | 'THB'
  | 'TRY'
  | 'USD'
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
