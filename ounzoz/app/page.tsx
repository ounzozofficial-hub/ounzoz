import Link from 'next/link';
import { Button } from '@/components/shared/Button';

// Still a placeholder homepage — a full homepage with per-category tool
// grids comes later, once Student has its own category page too
// (CLAUDE.md Section 4 / PROJECT.md Section 7). For now it links to the
// category hubs that exist (/health, /finance), so every tool in those
// categories is reachable within 2 clicks of the homepage per SEO.md
// Section 7 (Homepage → Category → tool) rather than only by direct URL.
export default function Home() {
  return (
    <div className="mx-auto flex max-w-[var(--content-max-width)] flex-col items-center px-4 py-20 text-center md:px-6 md:py-32">
      <h1 className="font-[var(--font-display)] text-[var(--font-size-2xl)] font-extrabold text-[var(--color-text-primary)]">
        OUNZOZ
      </h1>
      <p className="mt-[var(--space-4)] max-w-lg font-[var(--font-body)] text-[var(--font-size-lg)] text-[var(--color-text-secondary)]">
        Fast, practical, trustworthy tools — starting with calculators.
        Student tools launching soon.
      </p>
      <div className="mt-[var(--space-6)] flex flex-wrap items-center justify-center gap-[var(--space-4)]">
        <Link href="/health">
          <Button variant="primary">Explore Health Calculators</Button>
        </Link>
        <Link href="/finance">
          <Button variant="secondary">Explore Finance Calculators</Button>
        </Link>
      </div>
    </div>
  );
}
