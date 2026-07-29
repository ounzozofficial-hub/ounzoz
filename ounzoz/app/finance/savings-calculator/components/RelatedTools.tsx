import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — Compound Interest Calculator and Investment Calculator
// are the closest topical matches (same time-value-of-money growth
// family: this tool is the contribution-based, savings-account-framed
// sibling of both). Investment Calculator is now live, so its "coming
// soon" placeholder is replaced with a real mutual link.
const FINANCE_CLUSTER_TOOLS = [
  {
    name: 'Compound Interest Calculator',
    description: 'See how a lump sum grows over time with compounding.',
    href: '/finance/compound-interest-calculator',
  },
  {
    name: 'Investment Calculator',
    description: 'Project how your investments could grow over time.',
    href: '/finance/investment-calculator',
  },
  {
    name: 'Loan Calculator',
    description: 'Estimate your monthly loan payment and total interest.',
    href: '/finance/loan-calculator',
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
