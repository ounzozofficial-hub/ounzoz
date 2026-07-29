import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Study Time Calculator is the third and final Student tool to ship
// (PROJECT.md Section 7) — both GPA Calculator and Grade Calculator are
// already live, so both entries are real links.
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
