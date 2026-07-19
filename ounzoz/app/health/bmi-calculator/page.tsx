import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { BMICalculator } from './components/BMICalculator';
import { RelatedTools } from './components/RelatedTools';
import { BMI_FAQ_ITEMS } from './faq-content';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/health/bmi-calculator';

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
      name: 'BMI Calculator',
      item: TOOL_URL,
    },
  ],
};

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below
// (schema must match visible content, never diverge from it).
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: BMI_FAQ_ITEMS.map((item) => ({
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
  name: 'BMI Calculator',
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

export default function BMICalculatorPage() {
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

      <BMICalculator
        title="BMI Calculator"
        description="Calculate your Body Mass Index and see which WHO weight category you fall into."
        contentSlot={
          <ArticleLayout
            title="About the BMI Calculator"
            sourceCitation="Formula and category thresholds based on the World Health Organization's BMI standard."
          >
            <p>
              Body Mass Index (BMI) is a simple screening measurement
              that relates your weight to your height, giving a quick
              indication of whether you fall into an underweight,
              healthy weight, overweight, or obese range. It doesn&apos;t
              measure body fat directly, but for most adults it
              correlates closely enough with body fat to be useful as a
              fast first check.
            </p>
            <p>
              This calculator uses the World Health Organization&apos;s
              standard BMI formula: weight in kilograms divided by
              height in meters squared (kg/m²). The WHO&apos;s
              classification is also what sets the category thresholds
              shown with your result — under 18.5 is underweight, 18.5
              to 24.9 is a normal weight, 25 to 29.9 is overweight, and
              30 and above is obese.
            </p>
            <p>
              BMI is a population-level screening tool, not a
              diagnosis. It doesn&apos;t distinguish between muscle and
              fat, so a very muscular person can register as
              &quot;overweight&quot; despite having low body fat, and
              an older adult with reduced muscle mass can register as
              &quot;normal&quot; despite having a higher proportion of
              fat. It also doesn&apos;t account for where fat is
              distributed on the body, which matters for health risk.
              If your BMI falls outside the normal range, or you have
              concerns about your weight more broadly, talk to a
              doctor — they can look at the full picture, not just one
              number.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={BMI_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
