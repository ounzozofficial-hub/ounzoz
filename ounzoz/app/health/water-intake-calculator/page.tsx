import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { WaterIntakeCalculator } from './components/WaterIntakeCalculator';
import { RelatedTools } from './components/RelatedTools';
import { WATER_INTAKE_FAQ_ITEMS } from './faq-content';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/health/water-intake-calculator';

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
      name: 'Water Intake Calculator',
      item: TOOL_URL,
    },
  ],
};

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: WATER_INTAKE_FAQ_ITEMS.map((item) => ({
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
  name: 'Water Intake Calculator',
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

export default function WaterIntakeCalculatorPage() {
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

      <WaterIntakeCalculator
        title="Water Intake Calculator"
        description="Estimate how much water to drink daily based on your weight and activity level."
        contentSlot={
          <ArticleLayout
            title="About the Water Intake Calculator"
            sourceCitation="Baseline of 35 mL per kg of body weight per day is a widely used practical hydration guideline for healthy adults, broadly consistent with the U.S. National Academies of Medicine's 2004 Dietary Reference Intakes for total water. Activity-level adjustment reflects general fluid-replacement guidance (e.g. American College of Sports Medicine) rather than a single standardized figure."
          >
            <p>
              Staying properly hydrated supports nearly everything your
              body does — regulating temperature, cushioning joints,
              transporting nutrients, and keeping concentration and energy
              levels steady. But &quot;drink eight glasses a day&quot; is a
              one-size-fits-all rule that ignores the fact that a
              50&nbsp;kg person and a 100&nbsp;kg person don&apos;t need the
              same amount of water.
            </p>
            <p>
              This calculator uses a simple, weight-based baseline — about
              35&nbsp;mL of fluid per kilogram of body weight per day — a
              practical guideline commonly used for estimating healthy
              adult fluid needs, then adds an activity-level adjustment on
              top, since exercise increases fluid loss through sweat.
              Unlike calorie-burn formulas, there&apos;s no single
              universally standardized number for exactly how much extra
              fluid each activity level requires, so this adjustment is a
              practical estimate rather than a precise physiological
              calculation.
            </p>
            <p>
              The result shown is fluid/beverage intake specifically —
              it doesn&apos;t include the roughly 20% of daily water most
              people get from food. Treat this as a helpful daily target
              rather than a strict requirement: individual needs shift with
              climate, health conditions, and how your body responds, so
              adjust based on thirst, urine color, and how you feel rather
              than chasing the exact number.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={WATER_INTAKE_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
