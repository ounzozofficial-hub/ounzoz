import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — the health cluster now has 8 tools (PROJECT.md
// Section 7), so SEO.md Section 7's 2–4 cap means no page links to every
// other one. The "energy / daily needs" group (BMR, TDEE, Calorie, Water
// Intake, Protein Intake) now has 5 members, so Water Intake shows its
// closest sibling (Protein Intake — same weight+activity field set)
// alongside BMR, Calorie, and a bridge to BMI, dropping TDEE (TDEE
// already appears on BMR's and Calorie's pages). Same clustering rule
// applied consistently across all 5 Group A tools' RelatedTools.tsx.
const HEALTH_CLUSTER_TOOLS = [
  {
    name: 'BMR Calculator',
    description: 'Estimate your Basal Metabolic Rate.',
    href: '/health/bmr-calculator',
  },
  {
    name: 'Calorie Calculator',
    description: 'Find your daily calorie target for your goal.',
    href: '/health/calorie-calculator',
  },
  {
    name: 'Protein Intake Calculator',
    description: 'Estimate your daily protein target.',
    href: '/health/protein-intake-calculator',
  },
  {
    name: 'BMI Calculator',
    description: 'Check your Body Mass Index.',
    href: '/health/bmi-calculator',
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
