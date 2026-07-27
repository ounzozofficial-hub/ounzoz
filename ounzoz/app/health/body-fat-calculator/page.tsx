import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { BodyFatCalculator } from './components/BodyFatCalculator';
import { RelatedTools } from './components/RelatedTools';
import { BODY_FAT_FAQ_ITEMS } from './faq-content';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/health/body-fat-calculator';

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
      name: 'Body Fat Calculator',
      item: TOOL_URL,
    },
  ],
};

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: BODY_FAT_FAQ_ITEMS.map((item) => ({
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
  name: 'Body Fat Calculator',
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

export default function BodyFatCalculatorPage() {
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

      <BodyFatCalculator
        title="Body Fat Calculator"
        description="Estimate your body fat percentage using the US Navy circumference method — just a tape measure needed."
        contentSlot={
          <ArticleLayout
            title="About the Body Fat Calculator"
            sourceCitation="US Navy circumference method (Hodgdon & Beckett, 1984, Naval Health Research Center); body fat categories per the American Council on Exercise (ACE)."
          >
            <p>
              Body fat percentage tells you what portion of your body
              weight is fat versus everything else — muscle, bone, water,
              and organs. Unlike BMI, which only looks at weight relative
              to height, this measure directly reflects body composition,
              so two people with the same BMI can have very different
              body fat percentages depending on how much muscle they
              carry.
            </p>
            <p>
              This calculator uses the US Navy circumference method: a
              formula built from your height plus a few tape-measure
              readings (neck and waist for men; neck, waist, and hip for
              women). It was developed for the US Navy&apos;s own body
              composition standards specifically because it&apos;s
              accurate enough for practical use without calipers or a
              DEXA scan — just a flexible tape measure and a few
              centimeters of precision.
            </p>
            <p>
              Your result includes a category — Essential Fat, Athletic,
              Fitness, Average, or Obese — based on the American Council
              on Exercise&apos;s sex-specific classification bands. These
              are descriptive ranges, not a diagnosis: body fat naturally
              varies with age, training history, and genetics. For the
              most reliable trend over time, measure at the same time of
              day, in the same conditions, and track changes over weeks
              rather than reacting to any single reading.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={BODY_FAT_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
