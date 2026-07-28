import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — Savings Calculator is the closest topical match (same
// contribution-based growth formula, sibling framing: savings-account
// APY vs. market investing). Compound Interest Calculator rounds this
// out as the third member of the time-value-of-money growth family
// (pure lump sum, selectable compounding frequency).
const FINANCE_CLUSTER_TOOLS = [
  {
    name: 'Savings Calculator',
    description: 'See how your deposits and monthly savings can grow.',
    href: '/finance/savings-calculator',
  },
  {
    name: 'Compound Interest Calculator',
    description: 'See how a lump sum grows over time with compounding.',
    href: '/finance/compound-interest-calculator',
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
