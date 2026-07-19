import { Card } from '@/components/shared/Card';

// Related tools — SEO.md Section 7 clusters BMI with BMR, TDEE, and
// Calorie Calculator in the health cluster (PROJECT.md Section 7). None
// of those exist yet, so this renders a "Coming soon" state instead of
// dead links, following the same no-orphan/no-broken-link principle
// already applied to the header nav in Phase 1. Swap each card for a
// real <Link> the moment its tool ships.
const UPCOMING_HEALTH_TOOLS = [
  {
    name: 'BMR Calculator',
    description: 'Estimate your Basal Metabolic Rate.',
  },
  {
    name: 'TDEE Calculator',
    description: 'Find your Total Daily Energy Expenditure.',
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
        {UPCOMING_HEALTH_TOOLS.map((tool) => (
          <Card
            key={tool.name}
            className="flex flex-col gap-[var(--space-1)] opacity-70"
          >
            <span className="inline-block w-fit rounded-[var(--radius-full)] bg-[var(--color-background)] px-[var(--space-3)] py-[var(--space-1)] font-[var(--font-body)] text-[var(--font-size-xs)] font-semibold text-[var(--color-text-secondary)]">
              Coming soon
            </span>
            <span className="font-[var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              {tool.name}
            </span>
            <span className="font-[var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
              {tool.description}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
