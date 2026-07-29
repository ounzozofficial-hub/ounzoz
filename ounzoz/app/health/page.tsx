import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { RelatedToolCard } from '@/components/shared/RelatedToolCard';
import { HEALTH_TOOLS } from '@/constants/health-tools';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const CATEGORY_URL = 'https://ounzoz.com/health';

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
      name: 'Health',
      item: CATEGORY_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Health' },
];

// Every Health tool, in PROJECT.md Section 7's roadmap order — SEO.md
// Section 7: "Category pages link to every tool within that category,
// giving Google and users a clear hub-and-spoke structure." This is the
// one page on the site allowed to list every tool in the category,
// unlike a tool page's own Related Tools section (capped at 2–4 by
// Section 7's genuine-relevance rule). List itself lives in
// constants/health-tools.ts, shared with app/sitemap.ts, so the two
// can't silently drift apart the way sitemap.ts's old hand-maintained
// slug list once did.

export default function HealthCategoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto flex max-w-[var(--content-max-width)] flex-col gap-[var(--space-7)] px-4 py-[var(--space-7)] md:px-6">
        <header className="flex flex-col gap-[var(--space-2)]">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="font-[family-name:var(--font-display)] text-[var(--font-size-2xl)] font-extrabold text-[var(--color-text-primary)]">
            Health Calculators
          </h1>
          <p className="max-w-2xl font-[family-name:var(--font-body)] text-[var(--font-size-lg)] text-[var(--color-text-secondary)]">
            Free, instant health calculators covering weight, energy, and
            nutrition — from BMI and daily calorie targets to macro splits
            and pregnancy due dates. Every tool runs its calculation
            entirely in your browser: no signup, no data stored.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2 md:grid-cols-3">
          {HEALTH_TOOLS.map((tool) => (
            <RelatedToolCard key={tool.name} {...tool} />
          ))}
        </div>
      </div>
    </>
  );
}
