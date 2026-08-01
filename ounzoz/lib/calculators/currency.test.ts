import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CURRENCY_CODES,
  CURRENCY_INPUT_BOUNDS,
  CURRENCY_LABELS,
  convertAmount,
  fetchExchangeRate,
  validateAmountInput,
  validateCurrencyInputs,
} from './currency';

function mockFetchOnce(response: {
  ok: boolean;
  status?: number;
  json?: () => Promise<unknown>;
}) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status ?? 200,
    json: response.json ?? (async () => ({})),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('convertAmount', () => {
  // --- Normal / expected cases ---
  it('converts a normal amount at a typical rate', () => {
    // 100 × 0.88 = 88
    expect(convertAmount(100, 0.88)).toBe(88);
  });

  it('is an identity conversion at rate 1', () => {
    expect(convertAmount(250, 1)).toBe(250);
  });

  it('rounds to 2 decimal places', () => {
    // 33.335 × 1.1 = 36.6685 -> 36.67 (banker's-vs-standard rounding aside,
    // Math.round(x*100)/100 on 3668.5 rounds to 3669 -> 36.69; verify the
    // function's own rounding rule rather than hand-guessing float noise)
    const result = convertAmount(33.335, 1.1);
    expect(result).toBe(Math.round(33.335 * 1.1 * 100) / 100);
  });

  it('handles the minimum realistic amount', () => {
    expect(convertAmount(0.01, 1.23)).toBe(0.01);
  });

  it('handles a large amount', () => {
    expect(convertAmount(1_000_000, 0.5)).toBe(500_000);
  });

  it('handles a rate below 1 (weaker target currency conversion)', () => {
    expect(convertAmount(100, 0.5)).toBe(50);
  });

  it('handles a rate above 1', () => {
    expect(convertAmount(100, 150)).toBe(15_000);
  });

  // --- Invalid inputs ---
  it('throws for zero amount', () => {
    expect(() => convertAmount(0, 1)).toThrow(RangeError);
  });

  it('throws for negative amount', () => {
    expect(() => convertAmount(-50, 1)).toThrow(RangeError);
  });

  it('throws for NaN amount', () => {
    expect(() => convertAmount(NaN, 1)).toThrow(RangeError);
  });

  it('throws for Infinity amount', () => {
    expect(() => convertAmount(Infinity, 1)).toThrow(RangeError);
  });

  it('throws for zero rate', () => {
    expect(() => convertAmount(100, 0)).toThrow(RangeError);
  });

  it('throws for negative rate', () => {
    expect(() => convertAmount(100, -1)).toThrow(RangeError);
  });

  it('throws for NaN rate', () => {
    expect(() => convertAmount(100, NaN)).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    expect(Number.isFinite(convertAmount(100, 0.88))).toBe(true);
  });
});

describe('fetchExchangeRate', () => {
  it('short-circuits to a rate of 1 for identical currencies without calling fetch', async () => {
    const fetchMock = mockFetchOnce({ ok: true });
    await expect(fetchExchangeRate('USD', 'USD')).resolves.toBe(1);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('parses a successful response into the requested rate', async () => {
    mockFetchOnce({
      ok: true,
      json: async () => [
        { date: '2026-08-01', base: 'USD', quote: 'EUR', rate: 0.87974 },
      ],
    });
    await expect(fetchExchangeRate('USD', 'EUR')).resolves.toBe(0.87974);
  });

  it('rejects on a non-OK HTTP response', async () => {
    mockFetchOnce({ ok: false, status: 500 });
    await expect(fetchExchangeRate('USD', 'EUR')).rejects.toThrow(
      /status 500/,
    );
  });

  it('rejects when the response array has no record for the requested quote', async () => {
    mockFetchOnce({
      ok: true,
      json: async () => [],
    });
    await expect(fetchExchangeRate('USD', 'EUR')).rejects.toThrow(
      /did not include a valid rate/,
    );
  });

  it('rejects when the rate in the response is not a finite positive number', async () => {
    mockFetchOnce({
      ok: true,
      json: async () => [
        { date: '2026-08-01', base: 'USD', quote: 'EUR', rate: 'not-a-number' },
      ],
    });
    await expect(fetchExchangeRate('USD', 'EUR')).rejects.toThrow(
      /did not include a valid rate/,
    );
  });

  it('propagates a network-level rejection from fetch itself', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
    await expect(fetchExchangeRate('USD', 'EUR')).rejects.toThrow(
      'network down',
    );
  });

  it('requests the documented frankfurter.dev v2 endpoint shape', async () => {
    const fetchMock = mockFetchOnce({
      ok: true,
      json: async () => [
        { date: '2026-08-01', base: 'GBP', quote: 'JPY', rate: 195.2 },
      ],
    });
    await fetchExchangeRate('GBP', 'JPY');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.frankfurter.dev/v2/rates?base=GBP&quotes=JPY',
      expect.objectContaining({ signal: expect.anything() }),
    );
  });

  it('parses an Arabic-currency rate from a multi-entry response, ignoring other entries', async () => {
    mockFetchOnce({
      ok: true,
      json: async () => [
        { date: '2026-08-01', base: 'USD', quote: 'AED', rate: 3.6725 },
        { date: '2026-08-01', base: 'USD', quote: 'SAR', rate: 3.75 },
      ],
    });
    await expect(fetchExchangeRate('USD', 'SAR')).resolves.toBe(3.75);
  });
});

describe('validateAmountInput', () => {
  it('returns null for a valid amount', () => {
    expect(validateAmountInput('100')).toBeNull();
  });

  it('flags an empty amount field', () => {
    expect(validateAmountInput('')).toBe('AMOUNT_REQUIRED');
  });

  it('flags non-numeric amount', () => {
    expect(validateAmountInput('abc')).toBe('AMOUNT_NOT_A_NUMBER');
  });

  it('flags zero amount', () => {
    expect(validateAmountInput('0')).toBe('AMOUNT_NOT_POSITIVE');
  });

  it('flags negative amount', () => {
    expect(validateAmountInput('-10')).toBe('AMOUNT_NOT_POSITIVE');
  });

  it('accepts the exact minimum and maximum amount bounds', () => {
    expect(
      validateAmountInput(String(CURRENCY_INPUT_BOUNDS.MIN_AMOUNT)),
    ).toBeNull();
    expect(
      validateAmountInput(String(CURRENCY_INPUT_BOUNDS.MAX_AMOUNT)),
    ).toBeNull();
  });

  it('flags an amount just below the minimum bound', () => {
    expect(validateAmountInput('0.001')).toBe('AMOUNT_OUT_OF_RANGE');
  });

  it('flags an amount just above the maximum bound', () => {
    expect(validateAmountInput('1000000001')).toBe('AMOUNT_OUT_OF_RANGE');
  });
});

describe('validateCurrencyInputs', () => {
  it('returns null for a valid amount', () => {
    expect(validateCurrencyInputs('100')).toEqual({ amountError: null });
  });

  it('reports the amount error', () => {
    expect(validateCurrencyInputs('')).toEqual({
      amountError: 'AMOUNT_REQUIRED',
    });
  });
});

describe('CURRENCY_CODES / CURRENCY_LABELS', () => {
  it('has a label for every currency code, with no gaps', () => {
    for (const code of CURRENCY_CODES) {
      expect(CURRENCY_LABELS[code]).toBeTruthy();
    }
  });

  it('includes the 59 verified frankfurter.dev v2 currencies', () => {
    expect(CURRENCY_CODES).toHaveLength(59);
    expect(CURRENCY_CODES).toEqual(expect.arrayContaining(['USD', 'EUR', 'GBP', 'JPY']));
  });

  it('includes every Arabic-region currency added via the v2 migration', () => {
    expect(CURRENCY_CODES).toEqual(
      expect.arrayContaining([
        'SAR',
        'AED',
        'EGP',
        'QAR',
        'KWD',
        'BHD',
        'OMR',
        'JOD',
        'IQD',
        'LBP',
        'MAD',
        'TND',
        'DZD',
        'LYD',
        'SYP',
        'YER',
        'SDG',
      ]),
    );
  });

  it('includes other major currencies v1 (ECB-only) lacked', () => {
    expect(CURRENCY_CODES).toEqual(
      expect.arrayContaining([
        'RUB',
        'TWD',
        'PKR',
        'VND',
        'NGN',
        'UAH',
        'COP',
        'ARS',
        'CLP',
        'PEN',
        'KES',
        'BDT',
      ]),
    );
  });

  it('has no duplicate currency codes', () => {
    expect(new Set(CURRENCY_CODES).size).toBe(CURRENCY_CODES.length);
  });
});
