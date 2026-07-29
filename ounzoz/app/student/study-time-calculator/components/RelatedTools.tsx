import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Curated cluster, not exhaustive (SEO.md Section 7's 2–4-link,
// genuine-relevance rule) — PROJECT.md Section 7's pre-launch addition
// grew Student to 7 tools across two clusters (administrative: GPA/
// Grade/Study Time; subject-matter: Quadratic/Fraction/Statistics/Unit
// Converter). Study Time Calculator links to its two administrative
// siblings plus Statistics Calculator, the natural bridge into the
// subject cluster.
const STUDENT_CLUSTER_TOOLS = [
  {
    name: 'GPA Calculator',
    description:
      'Calculate your grade point average from your grades and credit hours.',
    href: '/student/gpa-calculator',
  },
  {
    name: 'Grade Calculator',
    description: 'Calculate your overall course grade from weighted categories.',
    href: '/student/grade-calculator',
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
