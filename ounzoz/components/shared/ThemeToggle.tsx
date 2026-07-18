'use client';

import { useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'ounzoz-theme';

type Theme = 'light' | 'dark';

/**
 * Reads the currently-applied theme from the DOM. The initial theme is set
 * synchronously by an inline script in the document head (see layout.tsx)
 * before hydration, so this just mirrors that state into React for the
 * toggle's visual affordance — it never causes a flash of the wrong theme.
 */
function getCurrentTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';
}

// Dark mode toggle, per DESIGN.md Section 14: visible/accessible control in
// the header, token-driven theming only (no component-level dark styles),
// explicit choice persisted after the user overrides the OS preference.
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Sync React state from the DOM attribute set by the theme-init script
    // in layout.tsx (which runs before hydration). This is a one-time read
    // of external state on mount, not a derived-state anti-pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(getCurrentTheme());
  }, []);

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      }
      aria-pressed={theme === 'dark'}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-150 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-cyan)]"
    >
      {theme === 'dark' ? (
        // Sun icon (shown when dark is active, offering to switch to light)
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        // Moon icon (shown when light is active, offering to switch to dark)
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  );
}
