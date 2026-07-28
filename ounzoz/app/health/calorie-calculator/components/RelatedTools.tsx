import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — the health cluster now has 9 tools (PROJECT.md
// Section 7), so SEO.md Section 7's 2–4 cap means no page links to every
// other one. The "energy / daily needs" group (BMR, TDEE, Calorie, Water
// Intake, Protein Intake, Macro) now has 6 members. Calorie drops BMR
// (2 tiers removed, the weakest direct relevance) to make room for Macro
// Calculator — Macro builds directly on Calorie's own result, the same
// tier relationship Calorie itself has with TDEE, so the link needs to
// be mutual (SEO.md Section 7: no orphan pages) rather than one-way.
// TDEE, Water Intake, and Protein Intake are unaffected.
const HEALTH_CLUSTER_TOOLS = [
  {
    name: 'TDEE Calculator',
    description: 'Find your Total Daily Energy Expenditure.',
    href: '/health/tdee-calculator',
  },
  {
    name: 'Water Intake Calculator',
    description: 'Estimate your daily water intake.',
    href: '/health/water-intake-calculator',
  },
  {
    name: 'Protein Intake Calculator',
    description: 'Estimate your daily protein target.',
    href: '/health/protein-intake-calculator',
  },
  {
    name: 'Macro Calculator',
    description: 'Get your daily protein, fat, and carb targets.',
    href: '/health/macro-calculator',
  },
];

export function RelatedTools() {
  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <h2 className="font-[var(--font-body)] text-[var(--font-size-xl)] font-semibold text-[var(--color-text-primary)]">
        Related tools
      </h2>
      <div className="grid grid-cols-1 gap-[var(--space-4)] md:grid-cols-3">
        {HEALTH_CLUSTER_TOOLS.map((tool) => (
          <RelatedToolCard key={tool.name} {...tool} />
        ))}
      </div>
    </div>
  );
}
