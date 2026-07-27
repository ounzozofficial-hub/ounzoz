import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { IdealWeightCalculator } from './components/IdealWeightCalculator';
import { RelatedTools } from './components/RelatedTools';
import { IDEAL_WEIGHT_FAQ_ITEMS } from './faq-content';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/health/ideal-weight-calculator';

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
      name: 'Ideal Weight Calculator',
      item: TOOL_URL,
    },
  ],
};

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: IDEAL_WEIGHT_FAQ_ITEMS.map((item) => ({
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
  name: 'Ideal Weight Calculator',
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

export default function IdealWeightCalculatorPage() {
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

      <IdealWeightCalculator
        title="Ideal Weight Calculator"
        description="Estimate your ideal body weight from your height and sex using the Devine formula."
        contentSlot={
          <ArticleLayout
            title="About the Ideal Weight Calculator"
            sourceCitation="Devine, B.J. (1974). 'Gentamicin therapy.' Drug Intelligence & Clinical Pharmacy, 8, 650–655."
          >
            <p>
              Ideal body weight is a reference figure — a single estimate
              of what a person&apos;s weight would be, based purely on
              height and sex, without factoring in their actual current
              weight, muscle mass, or frame size. It&apos;s a starting
              point for comparison, not a target to force yourself toward.
            </p>
            <p>
              This calculator uses the Devine formula, originally
              developed in 1974 to help clinicians estimate a
              patient&apos;s weight for calculating accurate drug dosages
              (like the antibiotic gentamicin, where dosing by actual body
              weight can be misleading in people who carry a lot of extra
              fat or fluid). It has since become the most widely
              referenced reference-weight formula in clinical practice —
              more commonly cited than alternatives like the Robinson,
              Miller, or Hamwi formulas. It sets a base weight at 5 feet
              tall (50 kg for men, 45.5 kg for women) and adds 2.3 kg for
              every inch above that.
            </p>
            <p>
              Because the formula only uses height and sex, it doesn&apos;t
              know anything about your actual body composition — a
              muscular, athletic person will often weigh noticeably more
              than their &quot;ideal weight&quot; here while being
              perfectly healthy. For a fuller picture, use this alongside
              BMI or Body Fat Calculator rather than treating this number
              in isolation.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={IDEAL_WEIGHT_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
