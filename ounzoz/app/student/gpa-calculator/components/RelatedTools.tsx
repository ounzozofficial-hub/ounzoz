import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Curated cluster, not exhaustive (SEO.md Section 7's 2–4-link,
// genuine-relevance rule) — PROJECT.md Section 7's pre-launch addition
// grew Student to 7 tools across two clusters (administrative: GPA/
// Grade/Study Time; subject-matter: Quadratic/Fraction/Statistics/Unit
// Converter). GPA Calculator links to its two administrative siblings
// plus Statistics Calculator, the natural bridge into the subject
// cluster (a GPA is itself a weighted average, statistics-adjacent).
const STUDENT_CLUSTER_TOOLS = [
  {
    name: 'Grade Calculator',
    description: 'Calculate your overall course grade from weighted categories.',
    href: '/student/grade-calculator',
  },
  {
    name: 'Study Time Calculator',
    description: 'Plan how much time to spend studying before an exam.',
    href: '/student/study-time-calculator',
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
