import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

export { metadata } from './metadata';

const CATEGORY_URL = 'https://ounzoz.com/finance';

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
      name: 'Finance',
      item: CATEGORY_URL,
    },
  ],
};

// Finance tools shipped so far, in PROJECT.md Section 7's roadmap order —
// SEO.md Section 7: "Category pages link to every tool within that
// category, giving Google and users a clear hub-and-spoke structure."
// This completes 6 of 7 Finance tools — Currency Converter is deferred
// per an explicit product decision on its live exchange-rate data source
// (not an oversight), so it's intentionally omitted here rather than
// shown as a "coming soon" placeholder that would imply it's imminent.
const FINANCE_TOOLS = [
  {
    name: 'Loan Calculator',
    description: 'Estimate your monthly loan payment and total interest.',
    href: '/finance/loan-calculator',
  },
  {
    name: 'Mortgage Calculator',
    description: 'Estimate your monthly mortgage payment.',
    href: '/finance/mortgage-calculator',
  },
  {
    name: 'Compound Interest Calculator',
    description: 'See how a lump sum grows over time with compounding.',
    href: '/finance/compound-interest-calculator',
  },
  {
    name: 'Savings Calculator',
    description: 'See how your deposits and monthly savings can grow.',
    href: '/finance/savings-calculator',
  },
  {
    name: 'Investment Calculator',
    description: 'Project how your investments could grow over time.',
    href: '/finance/investment-calculator',
  },
  {
    name: 'Percentage Calculator',
    description: 'Find a percentage, a percent share, or a percent change.',
    href: '/finance/percentage-calculator',
  },
];

export default function FinanceCategoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto flex max-w-[var(--content-max-width)] flex-col gap-[var(--space-7)] px-4 py-[var(--space-7)] md:px-6">
        <header className="flex flex-col gap-[var(--space-2)]">
          <h1 className="font-[var(--font-display)] text-[var(--font-size-2xl)] font-extrabold text-[var(--color-text-primary)]">
            Finance Calculators
          </h1>
          <p className="max-w-2xl font-[var(--font-body)] text-[var(--font-size-lg)] text-[var(--color-text-secondary)]">
            Free, instant finance calculators covering loans, mortgages,
            interest, and savings — clear estimates to help you understand
            the numbers before you decide. Every tool runs its calculation
            entirely in your browser: no signup, no data stored.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2 md:grid-cols-3">
          {FINANCE_TOOLS.map((tool) => (
            <RelatedToolCard key={tool.name} {...tool} />
          ))}
        </div>
      </div>
    </>
  );
}
