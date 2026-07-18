// Site footer — DESIGN.md Section 1 & 2: brand-defining surface, navy
// background. Category/legal links are placeholders (plain text, not
// anchors) until those pages exist, to avoid publishing dead links.
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[var(--color-brand-navy)]">
      <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <span className="font-[var(--font-display)] text-lg font-extrabold text-white">
              OUNZO<span className="text-[var(--color-brand-cyan)]">Z</span>
            </span>
            <p className="mt-3 max-w-xs font-[var(--font-body)] text-sm text-white/60">
              Fast, practical, trustworthy tools — starting with calculators.
            </p>
          </div>

          <div>
            <h2 className="font-[var(--font-body)] text-sm font-semibold text-white">
              Health
            </h2>
            <p className="mt-3 font-[var(--font-body)] text-sm text-white/50">
              Coming soon
            </p>
          </div>

          <div>
            <h2 className="font-[var(--font-body)] text-sm font-semibold text-white">
              Finance
            </h2>
            <p className="mt-3 font-[var(--font-body)] text-sm text-white/50">
              Coming soon
            </p>
          </div>

          <div>
            <h2 className="font-[var(--font-body)] text-sm font-semibold text-white">
              Student
            </h2>
            <p className="mt-3 font-[var(--font-body)] text-sm text-white/50">
              Coming soon
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="font-[var(--font-body)] text-xs text-white/40">
            © {year} OUNZOZ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
