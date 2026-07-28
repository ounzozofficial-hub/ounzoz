import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — Compound Interest Calculator is the closest topical
// match (same time-value-of-money growth family: this tool is its
// contribution-based, savings-account-framed sibling). Loan Calculator
// rounds this out with a genuinely useful, if looser, Finance-category
// link. Investment Calculator (the third member of this growth-tool
// family) isn't live yet — shown as "coming soon" rather than a dead
// link, per RelatedToolCard's built-in convention.
const FINANCE_CLUSTER_TOOLS = [
  {
    name: 'Compound Interest Calculator',
    description: 'See how a lump sum grows over time with compounding.',
    href: '/finance/compound-interest-calculator',
  },
  {
    name: 'Loan Calculator',
    description: 'Estimate your monthly loan payment and total interest.',
    href: '/finance/loan-calculator',
  },
  {
    name: 'Investment Calculator',
    description: 'Project how your investments could grow over time.',
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
