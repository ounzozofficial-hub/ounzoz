import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — Loan Calculator is Mortgage's closest sibling (both are
// amortization/fixed-payment tools), now live. Compound Interest
// Calculator is next on the roadmap and forms the third leg of the same
// interest-rate cluster — shown as RelatedToolCard's "coming soon" state
// (no href) until it ships.
const FINANCE_CLUSTER_TOOLS = [
  {
    name: 'Loan Calculator',
    description: 'Estimate your monthly loan payment and total interest.',
    href: '/finance/loan-calculator',
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
