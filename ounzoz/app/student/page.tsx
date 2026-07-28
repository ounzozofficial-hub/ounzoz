import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

export { metadata } from './metadata';

const CATEGORY_URL = 'https://ounzoz.com/student';

// SEO.md Section 5: schema reflects actual page content only — this page
// is a category hub, not a tool page, so only BreadcrumbList applies
// here (the same Home → Category path every tool page's own breadcrumb
// continues from). FAQPage/SoftwareApplication are tool-page-specific
// per the Section 5 schema-type table and are deliberately not added
// here.
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://ounzoz.com/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Student',
      item: CATEGORY_URL,
    },
  ],
};

// Student tools shipped so far, in PROJECT.md Section 7's roadmap order —
// SEO.md Section 7: "Category pages link to every tool within that
// category, giving Google and users a clear hub-and-spoke structure."
// Only GPA Calculator exists at this point; Grade Calculator and Study
// Time Calculator will be appended here as they ship.
const STUDENT_TOOLS = [
  {
    name: 'GPA Calculator',
    description: 'Calculate your grade point average from your grades and credit hours.',
    href: '/student/gpa-calculator',
  },
];

export default function StudentCategoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto flex max-w-[var(--content-max-width)] flex-col gap-[var(--space-7)] px-4 py-[var(--space-7)] md:px-6">
        <header className="flex flex-col gap-[var(--space-2)]">
          <h1 className="font-[var(--font-display)] text-[var(--font-size-2xl)] font-extrabold text-[var(--color-text-primary)]">
            Student Calculators
          </h1>
          <p className="max-w-2xl font-[var(--font-body)] text-[var(--font-size-lg)] text-[var(--color-text-secondary)]">
            Free, instant calculators for students — GPA, grades, and
            study planning. Every tool runs its calculation entirely in
            your browser: no signup, no data stored.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2 md:grid-cols-3">
          {STUDENT_TOOLS.map((tool) => (
            <RelatedToolCard key={tool.name} {...tool} />
          ))}
        </div>
      </div>
    </>
  );
}
