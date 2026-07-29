import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — Mortgage and Compound Interest Calculators have both
// now shipped, so their "coming soon" placeholders become real links
// (mutual linking, matching the pattern the Health category used each
// time a new clustered tool shipped — see git log "Fix Macro Calculator
// orphan...").
const FINANCE_CLUSTER_TOOLS = [
  {
    name: 'Mortgage Calculator',
    description: 'Estimate your monthly mortgage payment.',
    href: '/finance/mortgage-calculator',
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
