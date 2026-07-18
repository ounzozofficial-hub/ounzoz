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
        {/* Horizontal logo — wordmark in Poppins ExtraBold per DESIGN.md Section 3 */}
        <Link
          href="/"
          className="flex items-center gap-2 font-[var(--font-display)] text-xl font-extrabold tracking-tight text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-cyan)]"
        >
          <span>
            OUNZO
            <span className="text-[var(--color-brand-cyan)]">Z</span>
          </span>
        </Link>

        {/* Nav placeholder — category links are not wired up yet since no
            category/tool pages exist in this phase (avoids dead links). */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 font-[var(--font-body)] text-sm font-medium text-white/70 md:flex"
        >
          <span>Health</span>
          <span>Finance</span>
          <span>Student</span>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
