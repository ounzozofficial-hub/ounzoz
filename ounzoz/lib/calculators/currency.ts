import type { CurrencyCode, CurrencyValidationError } from '@/types/currency';

// Currencies as served by frankfurter.dev v2's /currencies endpoint
// (verified live 2026-08-01 via a real request — see PROJECT.md currency
// converter entry) — a fixed, documented dataset, not fabricated or
// guessed. This is the 30 legacy ECB-only currencies (v1) plus every
// Arabic-region currency v2 added (AED, BHD, DZD, EGP, IQD, JOD, KWD,
// LBP, LYD, MAD, OMR, QAR, SAR, SDG, SYP, TND, YER) plus a set of other
// globally major currencies v1 didn't cover (ARS, BDT, CLP, COP, KES,
// NGN, PEN, PKR, RUB, TWD, UAH, VND). Hardcoded rather than fetched at
// runtime: this list changes rarely (on the order of years, not days),
// and fetching it would add a second network dependency/failure point
// for no real benefit over a static constant.
export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  AED: 'United Arab Emirates Dirham',
  ARS: 'Argentine Peso',
  AUD: 'Australian Dollar',
  BDT: 'Bangladeshi Taka',
  BHD: 'Bahraini Dinar',
  BRL: 'Brazilian Real',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CLP: 'Chilean Peso',
  CNY: 'Chinese Renminbi Yuan',
  COP: 'Colombian Peso',
  CZK: 'Czech Koruna',
  DKK: 'Danish Krone',
  DZD: 'Algerian Dinar',
  EGP: 'Egyptian Pound',
  EUR: 'Euro',
  GBP: 'British Pound',
  HKD: 'Hong Kong Dollar',
  HUF: 'Hungarian Forint',
  IDR: 'Indonesian Rupiah',
  ILS: 'Israeli New Shekel',
  INR: 'Indian Rupee',
  IQD: 'Iraqi Dinar',
  ISK: 'Icelandic Króna',
  JOD: 'Jordanian Dinar',
  JPY: 'Japanese Yen',
  KES: 'Kenyan Shilling',
  KRW: 'South Korean Won',
  KWD: 'Kuwaiti Dinar',
  LBP: 'Lebanese Pound',
  LYD: 'Libyan Dinar',
  MAD: 'Moroccan Dirham',
  MXN: 'Mexican Peso',
  MYR: 'Malaysian Ringgit',
  NGN: 'Nigerian Naira',
  NOK: 'Norwegian Krone',
  NZD: 'New Zealand Dollar',
  OMR: 'Omani Rial',
  PEN: 'Peruvian Sol',
  PHP: 'Philippine Peso',
  PKR: 'Pakistani Rupee',
  PLN: 'Polish Złoty',
  QAR: 'Qatari Riyal',
  RON: 'Romanian Leu',
  RUB: 'Russian Ruble',
  SAR: 'Saudi Riyal',
  SDG: 'Sudanese Pound',
  SEK: 'Swedish Krona',
  SGD: 'Singapore Dollar',
  SYP: 'Syrian Pound',
  THB: 'Thai Baht',
  TND: 'Tunisian Dinar',
  TRY: 'Turkish Lira',
  TWD: 'New Taiwan Dollar',
  UAH: 'Ukrainian Hryvnia',
  USD: 'United States Dollar',
  VND: 'Vietnamese Đồng',
  YER: 'Yemeni Rial',
  ZAR: 'South African Rand',
};

export const CURRENCY_CODES = Object.keys(CURRENCY_LABELS) as CurrencyCode[];

// v2 (api.frankfurter.dev/v2) — not v1 (api.frankfurter.app / .dev/v1,
// now frozen). v2 covers 165 active currencies including every Arabic
// currency, which v1's ECB-only ~30 did not. Confirmed via a live request
// before switching: v2's /rates endpoint takes base+quotes (not
// v1's /latest with from+to) and returns an array of {date, base, quote,
// rate} records (not v1's single {rates: {...}} object) — see
// FrankfurterRate below and fetchExchangeRate's parsing.
const FRANKFURTER_BASE_URL = 'https://api.frankfurter.dev/v2/rates';
const FETCH_TIMEOUT_MS = 8000;

const MIN_AMOUNT = 0.01;
const MAX_AMOUNT = 1_000_000_000;

/**
 * Converts an amount using an already-fetched rate. Pure, synchronous,
 * network-free (CLAUDE.md Section 6) — the only part of this tool that
 * touches the network is fetchExchangeRate below. Kept as a separate
 * function specifically so the conversion math itself is deterministically
 * testable independent of network conditions.
 *
 * @param amount - the amount to convert, in the `from` currency
 * @param rate - units of `to` currency per 1 unit of `from` currency
 * @returns converted amount rounded to 2 decimal places
 */
export function convertAmount(amount: number, rate: number): number {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new RangeError('amount must be a positive finite number');
  }
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new RangeError('rate must be a positive finite number');
  }
  return Math.round(amount * rate * 100) / 100;
}

interface FrankfurterRate {
  date: string;
  base: string;
  quote: string;
  rate: number;
}

/**
 * Fetches the current from→to exchange rate from frankfurter.dev's v2 API
 * (a free, keyless service blending rates from many central banks — see
 * the tool's ArticleLayout content for the full sourcing/timeliness
 * disclaimer). Identical currencies short-circuit to a rate of 1 without
 * a network call, since that's mathematically certain rather than fetched
 * data.
 *
 * Not a pure function (network I/O) — deliberately thin and isolated from
 * convertAmount so its error paths (non-OK response, malformed body,
 * timeout) can be tested deterministically against a mocked fetch rather
 * than depending on real network access during `npm test`.
 *
 * @throws Error if the request fails, times out, or the response doesn't
 *   contain a usable rate. Callers (CurrencyCalculator) catch this and
 *   fall back to a session-cached rate if one exists, or surface the
 *   "temporarily unavailable" error state (DESIGN.md Section 19) —
 *   graceful degradation lives at the call site, not in here.
 */
export async function fetchExchangeRate(
  from: CurrencyCode,
  to: CurrencyCode,
): Promise<number> {
  if (from === to) return 1;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${FRANKFURTER_BASE_URL}?base=${from}&quotes=${to}`,
      { signal: controller.signal },
    );

    if (!response.ok) {
      throw new Error(
        `Exchange rate request failed with status ${response.status}`,
      );
    }

    // v2's /rates returns an array of {date, base, quote, rate} records
    // (one per requested quote currency), unlike v1's single
    // {rates: {CODE: number}} object — find the record for `to` rather
    // than indexing into a map.
    const data = (await response.json()) as FrankfurterRate[];
    const match = Array.isArray(data)
      ? data.find((entry) => entry.quote === to)
      : undefined;
    const rate = match?.rate;

    if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) {
      throw new Error('Exchange rate response did not include a valid rate');
    }

    return rate;
  } finally {
    clearTimeout(timeoutId);
  }
}

// --- Validation ---
// Only Amount is validated here — From/To are native <select> elements
// that always hold a valid default value (never null/empty), so there's
// no equivalent "required" state for them the way every other tool's
// selectors need (CLAUDE.md Section 8 still applies: this just means the
// selects have no invalid state to guard against, not that validation was
// skipped).

export function validateAmountInput(
  amountRaw: string,
): CurrencyValidationError | null {
  const trimmed = amountRaw.trim();
  if (trimmed === '') return 'AMOUNT_REQUIRED';

  const amount = Number(trimmed);
  if (!Number.isFinite(amount)) return 'AMOUNT_NOT_A_NUMBER';
  if (amount <= 0) return 'AMOUNT_NOT_POSITIVE';
  if (amount < MIN_AMOUNT || amount > MAX_AMOUNT) return 'AMOUNT_OUT_OF_RANGE';
  return null;
}

export function validateCurrencyInputs(amountRaw: string): {
  amountError: CurrencyValidationError | null;
} {
  return { amountError: validateAmountInput(amountRaw) };
}

export const CURRENCY_INPUT_BOUNDS = { MIN_AMOUNT, MAX_AMOUNT } as const;

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const CURRENCY_VALIDATION_MESSAGES: Record<
  CurrencyValidationError,
  string
> = {
  AMOUNT_REQUIRED: 'Enter an amount to convert.',
  AMOUNT_NOT_A_NUMBER: 'Amount must be a number.',
  AMOUNT_NOT_POSITIVE: 'Amount must be greater than zero.',
  AMOUNT_OUT_OF_RANGE: `Enter an amount between ${MIN_AMOUNT} and ${MAX_AMOUNT.toLocaleString('en-US')}.`,
};
