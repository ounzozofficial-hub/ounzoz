import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — Currency Converter is general-purpose conversion math
// rather than a projection/amortization tool, similar in spirit to
// Percentage Calculator's loose Finance-cluster fit. Investment Calculator
// is the natural second link for anyone converting figures while sizing
// up a cross-currency investment scenario.
const FINANCE_CLUSTER_TOOLS = [
  {
    name: 'Percentage Calculator',
    description: 'Find a percentage, a percent share, or a percent change.',
    href: '/finance/percentage-calculator',
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
