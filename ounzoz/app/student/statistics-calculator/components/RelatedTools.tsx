import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Curated cluster, not exhaustive (SEO.md Section 7's 2–4-link,
// genuine-relevance rule). Statistics Calculator is the natural bridge
// between the subject-matter cluster (Quadratic/Fraction) and the
// administrative cluster (GPA Calculator — itself a weighted-average
// calculation, statistics-adjacent) rather than sitting purely in one.
const STUDENT_CLUSTER_TOOLS = [
  {
    name: 'Quadratic Equation Solver',
    description: 'Solve ax² + bx + c = 0 for x.',
    href: '/student/quadratic-equation-solver',
  },
  {
    name: 'Fraction Calculator',
    description: 'Add, subtract, multiply, or divide two fractions.',
    href: '/student/fraction-calculator',
  },
  {
    name: 'GPA Calculator',
    description: 'Calculate your grade point average from your grades and credit hours.',
    href: '/student/gpa-calculator',
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
