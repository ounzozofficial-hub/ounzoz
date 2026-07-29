import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — Savings Calculator and Investment Calculator are the
// tightest topical matches (same time-value-of-money growth family —
// this tool's contribution-based siblings), so Investment now replaces
// Loan Calculator's looser link here (same "tighten the cluster as
// closer matches ship" pattern the Health category used — see git log
// "Fix Macro Calculator orphan...").
const FINANCE_CLUSTER_TOOLS = [
  {
    name: 'Savings Calculator',
    description: 'See how your deposits and monthly savings can grow.',
    href: '/finance/savings-calculator',
  },
  {
    name: 'Investment Calculator',
    description: 'Project how your investments could grow over time.',
    href: '/finance/investment-calculator',
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
