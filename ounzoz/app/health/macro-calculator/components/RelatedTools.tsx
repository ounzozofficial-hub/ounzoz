import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Related tools — the health cluster now has 9 tools (PROJECT.md
// Section 7), so SEO.md Section 7's 2–4 cap means no page links to every
// other one. Macro joins the "energy / daily needs" group (BMR, TDEE,
// Calorie, Water Intake, Protein Intake, Macro), now 6 members. Macro
// shows its direct tier parent (Calorie — the calorie target this split
// is built from) and its closest sibling (Protein Intake — same
// grams-per-kg formula table, per lib/formulas/protein-formula.ts), plus
// TDEE and Water Intake. BMR is dropped as the least relevant member for
// this tool, same reasoning Protein Intake Calculator's RelatedTools
// applied (BMR doesn't factor into either tool's own calculation).
const HEALTH_CLUSTER_TOOLS = [
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
    name: 'TDEE Calculator',
    description: 'Find your Total Daily Energy Expenditure.',
    href: '/health/tdee-calculator',
  },
  {
    name: 'Water Intake Calculator',
    description: 'Estimate your daily water intake.',
    href: '/health/water-intake-calculator',
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
