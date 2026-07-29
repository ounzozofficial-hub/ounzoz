import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { MacroCalculator } from './components/MacroCalculator';
import { RelatedTools } from './components/RelatedTools';
import { MACRO_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/health/macro-calculator';

// SEO.md Section 5: schema reflects actual page content only.
// BreadcrumbList — the category → tool path (SEO.md Section 5 table).
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
      item: 'https://ounzoz.com/health',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Macro Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Health', href: '/health' },
  { name: 'Macro Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: MACRO_FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

// SoftwareApplication — every interactive tool page per SEO.md Section 5.
// No aggregateRating/review fields: SEO.md explicitly forbids fabricated
// ratings, and this tool has no real reviews to cite.
const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Macro Calculator',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any (Web-based)',
  url: TOOL_URL,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

// No HowTo or Article schema — this page has no genuine step-by-step
// instructional content, per SEO.md Section 5's explicit rule against
// adding HowTo to a tool page just because it's a calculator.

export default function MacroCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />

      <MacroCalculator
        breadcrumbItems={breadcrumbItems}
        title="Macro Calculator"
        description="Find your daily protein, fat, and carbohydrate targets based on your calorie goal and activity level."
        contentSlot={
          <ArticleLayout
            title="About the Macro Calculator"
            sourceCitation="Protein target based on the U.S./Canada Dietary Reference Intakes and sports-nutrition activity guidance; fat target based on the 20–35% Acceptable Macronutrient Distribution Range; calorie split uses standard Atwater factors (4/9/4 kcal per gram)."
          >
            <p>
              A calorie target alone doesn&apos;t say what to actually eat —
              it just says how much energy to take in. Macro Calculator
              takes your daily calorie target and splits it into the three
              macronutrients that make it up: protein, fat, and
              carbohydrates, each measured in grams per day rather than
              calories, since that&apos;s how most nutrition labels and
              food tracking apps report them.
            </p>
            <p>
              Protein is calculated first, directly from your body weight
              and activity level — the same approach Protein Intake
              Calculator uses, since protein needs are driven by weight and
              training load rather than by how many calories you&apos;re
              eating. Fat is then set at 30% of your total calories, a
              practical midpoint within the commonly cited 20–35% range for
              dietary fat. Whatever calories remain after protein and fat
              are accounted for become your carbohydrate target.
            </p>
            <p>
              Because protein and fat are set first, an unusually low
              calorie target combined with a high activity level can leave
              little or no room for carbohydrates — this calculator flags
              that case rather than ever showing a negative or broken carb
              number. Recalculate whenever your weight, activity level, or
              calorie goal changes, since every macro here is derived from
              those inputs.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={MACRO_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
