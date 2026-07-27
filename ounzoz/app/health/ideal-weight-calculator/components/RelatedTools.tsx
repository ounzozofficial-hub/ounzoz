import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — SEO.md Section 7 caps this at 2–4 genuinely relevant
// links, and the health cluster now has 6 tools, so no page can link to
// every other one. This tool sits in the "body composition / target
// weight" group with BMI and Body Fat Calculator, bridged to the
// "energy" group (BMR, TDEE, Calorie) via BMR and Calorie specifically —
// TDEE is dropped here since it's the one tool least related to a target
// weight question. Same bridging rule applied consistently across BMI's,
// Body Fat's, BMR's, TDEE's, and Calorie's RelatedTools.tsx.
const HEALTH_CLUSTER_TOOLS = [
  {
    name: 'BMI Calculator',
    description: 'Check your Body Mass Index.',
    href: '/health/bmi-calculator',
  },
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
    name: 'Body Fat Calculator',
    description: 'Estimate your body fat percentage.',
    href: '/health/body-fat-calculator',
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
