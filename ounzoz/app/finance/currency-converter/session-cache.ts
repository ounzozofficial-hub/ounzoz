import type { CurrencyCode } from '@/types/currency';

// Session-scoped last-good-rate cache — the owner's explicit requirement:
// "cache the last successful rate client-side for the session so a brief
// API hiccup doesn't break repeat conversions." sessionStorage (not
// localStorage) is deliberate: this is a per-tab fallback, not a
// persistent record of rates across visits, which would risk showing a
// long-stale rate without the user realizing it.
//
// Deliberately not in lib/calculators/ — CLAUDE.md Section 6 requires
// lib/calculators functions to be pure with no DOM access; this is
// browser-storage side-effect code, so it lives alongside the client
// component that owns it instead.

const CACHE_PREFIX = 'ounzoz-fx-';

interface CachedRate {
  rate: number;
  fetchedAt: number;
}

function cacheKey(from: CurrencyCode, to: CurrencyCode): string {
  return `${CACHE_PREFIX}${from}-${to}`;
}

export function readCachedRate(
  from: CurrencyCode,
  to: CurrencyCode,
): CachedRate | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(cacheKey(from, to));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CachedRate>;
    if (typeof parsed.rate !== 'number' || !Number.isFinite(parsed.rate)) {
      return null;
    }
    return { rate: parsed.rate, fetchedAt: parsed.fetchedAt ?? 0 };
  } catch {
    // Malformed/blocked storage is a fallback-of-a-fallback concern, not
    // something that should ever break the primary conversion flow.
    return null;
  }
}

export function writeCachedRate(
  from: CurrencyCode,
  to: CurrencyCode,
  rate: number,
): void {
  if (typeof window === 'undefined') return;
  try {
    const entry: CachedRate = { rate, fetchedAt: Date.now() };
    window.sessionStorage.setItem(cacheKey(from, to), JSON.stringify(entry));
  } catch {
    // sessionStorage can throw (private browsing, storage full) — caching
    // is a nice-to-have fallback, never allowed to break the live path.
  }
}
