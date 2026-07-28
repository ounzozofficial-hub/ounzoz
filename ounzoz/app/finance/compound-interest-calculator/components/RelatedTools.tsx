import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — Savings Calculator is now the tightest topical match
// (same time-value-of-money growth family — its contribution-based,
// savings-account-framed sibling), so it replaces Mortgage Calculator's
// looser amortization-cluster link here (same "tighten the cluster as
// closer matches ship" pattern the Health category used — see git log
// "Fix Macro Calculator orphan..."). Loan Calculator stays as a genuinely
// useful, if looser, Finance-category link. Investment Calculator (the
// third growth-family member) will be added here once it ships.
const FINANCE_CLUSTER_TOOLS = [
  {
    name: 'Savings Calculator',
    description: 'See how your deposits and monthly savings can grow.',
    href: '/finance/savings-calculator',
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
