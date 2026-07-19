// Placeholder homepage — a real homepage with tool listings and category
// hubs comes later, once enough tools exist to list (CLAUDE.md Section 4 /
// PROJECT.md Section 7). For now this stays a minimal shell.
export default function Home() {
  return (
    <div className="mx-auto flex max-w-[var(--content-max-width)] flex-col items-center px-4 py-20 text-center md:px-6 md:py-32">
      <h1 className="font-[var(--font-display)] text-[var(--font-size-2xl)] font-extrabold text-[var(--color-text-primary)]">
        OUNZOZ
      </h1>
      <p className="mt-[var(--space-4)] max-w-lg font-[var(--font-body)] text-[var(--font-size-lg)] text-[var(--color-text-secondary)]">
        Fast, practical, trustworthy tools — starting with calculators.
        Tools launching soon.
      </p>
    </div>
  );
}
