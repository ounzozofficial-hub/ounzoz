import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — the health cluster now has 7 tools (PROJECT.md
// Section 7), so SEO.md Section 7's 2–4 cap means no page links to every
// other one. Water Intake reuses the same ActivityLevelSelector as BMR/
// TDEE/Calorie and sits in that "energy / daily needs" group — with 4
// members that group already fills 3 in-group slots + 1 bridge to BMI,
// leaving no room for a second bridge into the "body composition /
// target weight" group (BMI, Body Fat, Ideal Weight). Same clustering
// rule applied consistently across BMR's, TDEE's, and Calorie's
// RelatedTools.tsx.
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
    name: 'Calorie Calculator',
    description: 'Find your daily calorie target for your goal.',
    href: '/health/calorie-calculator',
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
