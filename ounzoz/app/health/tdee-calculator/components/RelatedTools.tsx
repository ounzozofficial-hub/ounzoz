import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — SEO.md Section 7 health cluster: BMI ↔ BMR ↔ TDEE ↔
// Calorie Calculator. BMI and BMR are both real and link; Calorie
// Calculator is still "Coming soon" — same no-orphan/no-broken-link
// principle applied since Phase 1.
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
    description: 'Estimate daily calorie needs for your goal.',
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
