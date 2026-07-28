import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { PercentageCalculator } from './components/PercentageCalculator';
import { RelatedTools } from './components/RelatedTools';
import { PERCENTAGE_FAQ_ITEMS } from './faq-content';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/finance/percentage-calculator';

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
      name: 'Finance',
      item: 'https://ounzoz.com/finance',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Percentage Calculator',
      item: TOOL_URL,
    },
  ],
};

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: PERCENTAGE_FAQ_ITEMS.map((item) => ({
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
  name: 'Percentage Calculator',
  applicationCategory: 'FinanceApplication',
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

export default function PercentageCalculatorPage() {
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

      <PercentageCalculator
        title="Percentage Calculator"
        description="Find what a percentage of a number is, what percent one number is of another, or the percentage change between two values."
        contentSlot={
          <ArticleLayout
            title="About the Percentage Calculator"
            sourceCitation="Uses the three standard percentage formulas: (percent ÷ 100) × number for 'percent of', (part ÷ whole) × 100 for 'is what percent', and ((new − old) ÷ old) × 100 for percentage change."
          >
            <p>
              A percentage is just a way of expressing a number as a
              fraction of 100 — useful shorthand for comparing amounts
              that would otherwise be hard to compare directly. This
              calculator covers the three questions people most commonly
              need a percentage for, in one tool instead of three.
            </p>
            <p>
              <strong>% of a number</strong> answers questions like
              &quot;what is 20% of 50?&quot; — handy for discounts, tips,
              sales tax, and commissions. <strong>Is what %</strong>{' '}
              flips that around: given two amounts, it tells you what
              percentage one is of the other — useful for test scores,
              budget shares, or completion rates. <strong>% change</strong>{' '}
              measures how much a value grew or shrank between two points
              — the calculation behind price changes, population growth,
              and year-over-year statistics.
            </p>
            <p>
              Every mode uses the standard, unambiguous percentage formula
              for that calculation — there&apos;s no rounding trick or
              approximation involved. The one thing to watch for:
              percentage change is a relative measure, so a change from a
              very small starting number can produce a very large
              percentage even if the actual difference is small.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={PERCENTAGE_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
