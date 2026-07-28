import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — Loan Calculator is the first Finance tool to ship
// (PROJECT.md Section 7), so there's no other Finance tool to link to yet.
// Mortgage Calculator and Compound Interest Calculator are the next two on
// the roadmap and form the closest topical cluster with Loan Calculator
// (all three are amortization/interest-rate tools) — shown as
// RelatedToolCard's built-in "coming soon" state (no href) rather than a
// dead link, per CLAUDE.md Section 18. Swap in real hrefs as each ships.
const FINANCE_CLUSTER_TOOLS = [
  {
    name: 'Mortgage Calculator',
    description: 'Estimate your monthly mortgage payment.',
  },
  {
    name: 'Compound Interest Calculator',
    description: 'See how your savings or investments grow over time.',
  },
];

export function RelatedTools() {
  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <h2 className="font-[var(--font-body)] text-[var(--font-size-xl)] font-semibold text-[var(--color-text-primary)]">
        Related tools
      </h2>
      <div className="grid grid-cols-1 gap-[var(--space-4)] md:grid-cols-3">
        {FINANCE_CLUSTER_TOOLS.map((tool) => (
          <RelatedToolCard key={tool.name} {...tool} />
        ))}
      </div>
    </div>
  );
}
