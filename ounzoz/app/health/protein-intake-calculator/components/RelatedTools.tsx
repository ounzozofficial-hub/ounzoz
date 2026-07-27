import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — the health cluster now has 8 tools (PROJECT.md
// Section 7), so SEO.md Section 7's 2–4 cap means no page links to every
// other one. Protein Intake reuses the same ActivityLevelSelector as
// TDEE/Calorie/Water Intake and sits in the "energy / daily needs" group
// — with 5 members that group fills its 4 slots with the direct tier
// chain (TDEE, Calorie) plus its closest sibling (Water Intake — same
// weight+activity field set) and a bridge to BMI, dropping BMR (BMR
// doesn't use activity level at all, the least relevant member of the
// group for this tool). Same clustering rule applied consistently
// across all 5 Group A tools' RelatedTools.tsx.
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
