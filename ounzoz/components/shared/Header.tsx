import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

// Site header — DESIGN.md Section 1 & 2: brand-defining surface, carries
// full Navy/Cyan/Yellow identity (navy background) regardless of the
// active light/dark theme, per Section 14 ("brand accent colors remain
// the same ... only background/surface/text tokens shift").
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color-brand-navy)] shadow-[var(--shadow-sm)]">
      <div className="mx-auto flex h-16 max-w-[var(--content-max-width)] items-center justify-between px-4 md:px-6">
        {/* Horizontal logo — wordmark in Poppins ExtraBold per DESIGN.md
            Section 3. Hover/focus opacity shift gives it a clickable
            affordance, matching the nav links beside it. */}
        <Link
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-white transition-opacity duration-150 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-cyan)]"
        >
          <span>
            OUNZO
            <span className="text-[var(--color-brand-cyan)]">Z</span>
          </span>
        </Link>

        {/* All three V1 category pages now exist (Health, Finance,
            Student), so every nav entry is a real link — none point to a
            page that doesn't exist yet (avoided per CLAUDE.md Section 18). */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 font-[family-name:var(--font-body)] text-sm font-medium text-white/70 md:flex"
        >
          <Link
            href="/health"
            className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-cyan)]"
          >
            Health
          </Link>
          <Link
            href="/finance"
            className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-cyan)]"
          >
            Finance
          </Link>
          <Link
            href="/student"
            className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-cyan)]"
          >
            Student
          </Link>
          <Link
            href="/shop"
            className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-cyan)] text-[var(--color-brand-yellow)] font-semibold"
          >
            Student
          </Link>
          <Link
            href="/shop"
            className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-cyan)] text-[var(--color-brand-yellow)] font-semibold"
          >
            Shop
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
