import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — the health cluster now has 8 tools (PROJECT.md
// Section 7), so SEO.md Section 7's 2–4 cap means no page links to every
// other one. The "energy / daily needs" group (BMR, TDEE, Calorie, Water
// Intake, Protein Intake) now has 5 members — more than fits alongside a
// bridge, so Calorie shows BOTH weight+activity "sibling" tools (Water
// Intake, Protein Intake) instead of bridging to BMI, since Calorie is
// itself a "how much should I consume today" tool closely related to
// both. Same clustering rule applied consistently across all 5 Group A
// tools' RelatedTools.tsx.
const HEALTH_CLUSTER_TOOLS = [
  {
    name: 'BMR Calculator',
    description: 'Estimate your Basal Metabolic Rate.',
    href: '/health/bmr-calculator',
  },
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
