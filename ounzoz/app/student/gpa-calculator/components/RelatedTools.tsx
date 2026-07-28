import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// GPA Calculator is the first Student tool to ship — Grade Calculator
// and Study Time Calculator are next on the roadmap (PROJECT.md
// Section 7) but don't exist yet, so they use RelatedToolCard's
// href-omitted "coming soon" state rather than a link that would 404
// (same approach Loan Calculator used when it was the first Finance
// tool to ship).
const STUDENT_CLUSTER_TOOLS = [
  {
    name: 'Grade Calculator',
    description: 'Find the grade you need on your next assessment.',
  },
  {
    name: 'Study Time Calculator',
    description: 'Plan how much time to spend studying before an exam.',
  },
];

export function RelatedTools() {
  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <h2 className="font-[var(--font-body)] text-[var(--font-size-xl)] font-semibold text-[var(--color-text-primary)]">
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
