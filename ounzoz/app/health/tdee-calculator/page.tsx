import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { TDEECalculator } from './components/TDEECalculator';
import { RelatedTools } from './components/RelatedTools';
import { TDEE_FAQ_ITEMS } from './faq-content';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/health/tdee-calculator';

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
      name: 'TDEE Calculator',
      item: TOOL_URL,
    },
  ],
};

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: TDEE_FAQ_ITEMS.map((item) => ({
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
  name: 'TDEE Calculator',
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

export default function TDEECalculatorPage() {
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

      <TDEECalculator
        title="TDEE Calculator"
        description="Calculate your Total Daily Energy Expenditure — the calories you burn in a day including activity."
        contentSlot={
          <ArticleLayout
            title="About the TDEE Calculator"
            sourceCitation="BMR based on the Mifflin-St Jeor equation; activity multipliers from the standard scale commonly paired with it."
          >
            <p>
              Total Daily Energy Expenditure (TDEE) is the total number
              of calories your body burns in a day — your resting
              metabolism (BMR) plus everything on top of it: walking,
              exercise, digesting food, and even fidgeting. It&apos;s
              the number that actually determines whether you gain,
              lose, or maintain weight at a given calorie intake.
            </p>
            <p>
              This calculator first estimates your BMR using the
              Mifflin-St Jeor equation, then multiplies it by an
              activity multiplier based on how active you typically
              are — a scale commonly used alongside both the
              Mifflin-St Jeor and the older Harris-Benedict equations.
              Someone who&apos;s sedentary multiplies their BMR by 1.2,
              while someone doing hard exercise most days multiplies by
              as much as 1.9 — a difference that can mean several
              hundred extra calories burned per day.
            </p>
            <p>
              TDEE is your maintenance level: eating close to it keeps
              your weight roughly stable over time. Eating consistently
              below it tends to produce weight loss; eating above it
              tends to produce weight gain. Like BMR, TDEE is a
              population-average estimate, not a precise measurement of
              your individual metabolism — real day-to-day energy burn
              varies with sleep, stress, illness, and how accurately
              you&apos;ve judged your own activity level. Recalculate
              it periodically as your weight or routine changes, and
              treat it as a starting point for adjustment rather than a
              fixed target.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={TDEE_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
