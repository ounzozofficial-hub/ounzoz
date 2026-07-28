import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

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

// Every Health tool, in PROJECT.md Section 7's roadmap order — SEO.md
// Section 7: "Category pages link to every tool within that category,
// giving Google and users a clear hub-and-spoke structure." This is the
// one page on the site allowed to list every tool in the category,
// unlike a tool page's own Related Tools section (capped at 2–4 by
// Section 7's genuine-relevance rule).
const HEALTH_TOOLS = [
  {
    name: 'BMI Calculator',
    description: 'Check your Body Mass Index and WHO weight category.',
    href: '/health/bmi-calculator',
  },
  {
    name: 'BMR Calculator',
    description: 'Estimate your Basal Metabolic Rate.',
    href: '/health/bmr-calculator',
  },
  {
    name: 'TDEE Calculator',
    description: 'Find your Total Daily Energy Expenditure.',
    href: '/health/tdee-calculator',
  },
  {
    name: 'Body Fat Calculator',
    description: 'Estimate body fat percentage using the U.S. Navy method.',
    href: '/health/body-fat-calculator',
  },
  {
    name: 'Ideal Weight Calculator',
    description: 'See an estimated healthy weight range for your height.',
    href: '/health/ideal-weight-calculator',
  },
  {
    name: 'Calorie Calculator',
    description: 'Find your daily calorie target for your goal.',
    href: '/health/calorie-calculator',
  },
  {
    name: 'Water Intake Calculator',
    description: 'Estimate your daily water intake.',
    href: '/health/water-intake-calculator',
  },
  {
    name: 'Protein Intake Calculator',
    description: 'Estimate your daily protein target.',
    href: '/health/protein-intake-calculator',
  },
  {
    name: 'Macro Calculator',
    description: 'Get your daily protein, fat, and carb targets.',
    href: '/health/macro-calculator',
  },
  {
    name: 'Pregnancy Due Date Calculator',
    description: 'Estimate your due date from your last period.',
    href: '/health/pregnancy-due-date-calculator',
  },
];

export default function HealthCategoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto flex max-w-[var(--content-max-width)] flex-col gap-[var(--space-7)] px-4 py-[var(--space-7)] md:px-6">
        <header className="flex flex-col gap-[var(--space-2)]">
          <h1 className="font-[var(--font-display)] text-[var(--font-size-2xl)] font-extrabold text-[var(--color-text-primary)]">
            Health Calculators
          </h1>
          <p className="max-w-2xl font-[var(--font-body)] text-[var(--font-size-lg)] text-[var(--color-text-secondary)]">
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
