import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — deliberately different from every other tool's
// RelatedTools.tsx. This tool is date-based (LMP + Naegele's Rule) with
// no shared formula, field, or genuine topical tie to any of the other 9
// Health tools, which are all weight/energy-based (CLAUDE.md Section 5:
// no cross-tool dependency should be invented where none is genuine).
// SEO.md Section 7 requires "genuine topical relevance — not generic
// explore more filler links," so rather than force 2–4 weak cross-links
// here, this page instead links to the new /health category hub
// (app/health/page.tsx), which lists every Health tool and gives this
// page (and every tool) real hub-and-spoke reachability per Section 7 —
// this was flagged and confirmed with the project owner rather than
// guessed at.
export function RelatedTools() {
  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <h2 className="font-[family-name:var(--font-body)] text-[var(--font-size-xl)] font-semibold text-[var(--color-text-primary)]">
        Explore more health tools
      </h2>
      <div className="grid grid-cols-1 gap-[var(--space-4)] md:grid-cols-3">
        <RelatedToolCard
          name="Health Calculators"
          description="Browse all 10 health tools, including BMI, calorie, and macro calculators."
          href="/health"
        />
      </div>
    </div>
  );
}
