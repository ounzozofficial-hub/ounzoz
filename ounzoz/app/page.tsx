import { ComponentPreview } from './_preview/ComponentPreview';

// Placeholder homepage — Phase 1 layout shell only.
// Tool listings, category hubs, and real homepage content are built in a
// later phase once tools exist (CLAUDE.md Section 4 / PROJECT.md Section 7).
export default function Home() {
  return (
    <>
      <div className="mx-auto flex max-w-[var(--content-max-width)] flex-col items-center px-4 py-20 text-center md:px-6 md:py-32">
        <h1 className="font-[var(--font-display)] text-[var(--font-size-2xl)] font-extrabold text-[var(--color-text-primary)]">
          OUNZOZ
        </h1>
        <p className="mt-[var(--space-4)] max-w-lg font-[var(--font-body)] text-[var(--font-size-lg)] text-[var(--color-text-secondary)]">
          Fast, practical, trustworthy tools — starting with calculators.
          Tools launching soon.
        </p>
      </div>

      {/* TEMPORARY — Phase 2 component verification. Remove once Phase 3
          ships a real tool page to review components against instead. */}
      <ComponentPreview />
    </>
  );
}
