import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Grade Calculator is the second Student tool to ship — GPA Calculator is
// live, Study Time Calculator is next on the roadmap (PROJECT.md
// Section 7) but doesn't exist yet, so it uses RelatedToolCard's
// href-omitted "coming soon" state rather than a link that would 404.
const STUDENT_CLUSTER_TOOLS = [
  {
    name: 'GPA Calculator',
    description: 'Calculate your grade point average from your grades and credit hours.',
    href: '/student/gpa-calculator',
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
