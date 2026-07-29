import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// All 3 Student tools are now live (PROJECT.md Section 7) — both entries
// are real links.
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
