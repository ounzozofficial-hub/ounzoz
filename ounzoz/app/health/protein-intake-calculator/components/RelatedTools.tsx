import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — the health cluster now has 9 tools (PROJECT.md
// Section 7), so SEO.md Section 7's 2–4 cap means no page links to every
// other one. Protein Intake reuses the same ActivityLevelSelector as
// TDEE/Calorie/Water Intake and sits in the "energy / daily needs" group
// — now 6 members with Macro added. The BMI bridge is dropped (the
// weakest link here — BMI doesn't factor into this tool's calculation at
// all) to make room for Macro Calculator, which reuses this tool's own
// grams-per-kg protein formula table directly (lib/formulas/
// protein-formula.ts) — the closest sibling relationship in the group,
// and one that needs to be mutual (SEO.md Section 7: no orphan pages).
// TDEE, Calorie, and Water Intake are unaffected.
const HEALTH_CLUSTER_TOOLS = [
  {
    name: 'TDEE Calculator',
    description: 'Find your Total Daily Energy Expenditure.',
    href: '/health/tdee-calculator',
  },
  {
    name: 'Calorie Calculator',
    description: 'Find your daily calorie target for your goal.',
    href: '/health/calorie-calculator',
  },
  {
    name: 'Water Intake Calculator',
    description: 'Estimate your daily water intake.',
    href: '/health/water-intake-calculator',
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
