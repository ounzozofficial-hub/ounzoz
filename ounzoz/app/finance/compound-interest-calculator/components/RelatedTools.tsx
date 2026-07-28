import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — Compound Interest isn't a tight amortization-cluster
// match with Loan/Mortgage (those are fixed-payment/debt tools; this is
// a growth/lump-sum tool), but a loose Finance-category link is still
// genuinely useful to a visitor thinking about their finances broadly.
// Savings Calculator and Investment Calculator (both closer topical
// matches — same time-value-of-money family) will be added here once
// they ship.
const FINANCE_CLUSTER_TOOLS = [
  {
    name: 'Loan Calculator',
    description: 'Estimate your monthly loan payment and total interest.',
    href: '/finance/loan-calculator',
  },
  {
    name: 'Mortgage Calculator',
    description: 'Estimate your monthly mortgage payment.',
    href: '/finance/mortgage-calculator',
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
