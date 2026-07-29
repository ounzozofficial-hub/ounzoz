import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Curated cluster, not exhaustive (SEO.md Section 7's 2–4-link,
// genuine-relevance rule) — Fraction Calculator is a subject-matter
// arithmetic tool, so it links to its two closest coursework siblings.
const STUDENT_CLUSTER_TOOLS = [
  {
    name: 'Quadratic Equation Solver',
    description: 'Solve ax² + bx + c = 0 for x.',
    href: '/student/quadratic-equation-solver',
  },
  {
    name: 'Unit Converter',
    description: 'Convert length, weight, temperature, and volume units.',
    href: '/student/unit-converter',
  },
  {
    name: 'Statistics Calculator',
    description: 'Get the mean, median, mode, and standard deviation of a data set.',
    href: '/student/statistics-calculator',
  },
];

export function RelatedTools() {
  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <h2 className="font-[family-name:var(--font-body)] text-[var(--font-size-xl)] font-semibold text-[var(--color-text-primary)]">
        Related tools
      </h2>
      <div className="grid grid-cols-1 gap-[var(--space-4)] md:grid-cols-3">
        {STUDENT_CLUSTER_TOOLS.map((tool) => (
          <RelatedToolCard key={tool.name} {...tool} />
        ))}
      </div>
    </div>
  );
}
