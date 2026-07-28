import type { CurrencyCode, CurrencyValidationError } from '@/types/currency';

// ECB reference-rate currencies as served by frankfurter.app's /currencies
// endpoint (verified live 2026-07-28) — a fixed, documented dataset, not
// fabricated or guessed. Hardcoded rather than fetched at runtime: this
// list changes rarely (on the order of years, not days), and fetching it
// would add a second network dependency/failure point for no real benefit
// over a static constant.
export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  AUD: 'Australian Dollar',
  BRL: 'Brazilian Real',
  CAD: 'Canadian Dollar',
  CHF: 'Swiss Franc',
  CNY: 'Chinese Renminbi Yuan',
  CZK: 'Czech Koruna',
  DKK: 'Danish Krone',
  EUR: 'Euro',
  GBP: 'British Pound',
  HKD: 'Hong Kong Dollar',
  HUF: 'Hungarian Forint',
  IDR: 'Indonesian Rupiah',
  ILS: 'Israeli New Shekel',
  INR: 'Indian Rupee',
  ISK: 'Icelandic Króna',
  JPY: 'Japanese Yen',
  KRW: 'South Korean Won',
  MXN: 'Mexican Peso',
  MYR: 'Malaysian Ringgit',
  NOK: 'Norwegian Krone',
  NZD: 'New Zealand Dollar',
  PHP: 'Philippine Peso',
  PLN: 'Polish Złoty',
  RON: 'Romanian Leu',
  SEK: 'Swedish Krona',
  SGD: 'Singapore Dollar',
  THB: 'Thai Baht',
  TRY: 'Turkish Lira',
  USD: 'United States Dollar',
  ZAR: 'South African Rand',
};

export const CURRENCY_CODES = Object.keys(CURRENCY_LABELS) as CurrencyCode[];

const FRANKFURTER_BASE_URL = 'https://api.frankfurter.app/latest';
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

interface FrankfurterLatestResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

/**
 * Fetches the current from→to exchange rate from frankfurter.app (a free,
 * keyless, ECB reference-rate service — see the tool's ArticleLayout
 * content for the full sourcing/timeliness disclaimer). Identical
 * currencies short-circuit to a rate of 1 without a network call, since
 * that's mathematically certain rather than fetched data.
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
      `${FRANKFURTER_BASE_URL}?from=${from}&to=${to}`,
      { signal: controller.signal },
    );

    if (!response.ok) {
      throw new Error(
        `Exchange rate request failed with status ${response.status}`,
      );
    }

    const data = (await response.json()) as FrankfurterLatestResponse;
    const rate = data?.rates?.[to];

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
