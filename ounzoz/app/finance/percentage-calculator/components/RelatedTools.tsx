import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — Percentage Calculator is general-purpose math rather
// than a projection/amortization tool, so it doesn't share a tight
// formula cluster with the rest of Finance. Loan and Mortgage are picked
// as genuinely relevant because "percentage" questions (discount rates,
// interest rates, down payment percentages) naturally come up while
// using either of them.
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
      <h2 className="font-[family-name:var(--font-body)] text-[var(--font-size-xl)] font-semibold text-[var(--color-text-primary)]">
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
