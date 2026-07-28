import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { CompoundInterestCalculator } from './components/CompoundInterestCalculator';
import { RelatedTools } from './components/RelatedTools';
import { COMPOUND_INTEREST_FAQ_ITEMS } from './faq-content';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/finance/compound-interest-calculator';

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
      name: 'Compound Interest Calculator',
      item: TOOL_URL,
    },
  ],
};

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: COMPOUND_INTEREST_FAQ_ITEMS.map((item) => ({
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
  name: 'Compound Interest Calculator',
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

export default function CompoundInterestCalculatorPage() {
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

      <CompoundInterestCalculator
        title="Compound Interest Calculator"
        description="See how a lump-sum amount grows over time at a given interest rate and compounding frequency."
        contentSlot={
          <ArticleLayout
            title="About the Compound Interest Calculator"
            sourceCitation="Calculated using the standard compound interest formula: A = P × (1 + r/n)ⁿᵗ, where P is the starting principal, r is the annual interest rate, n is the number of compounding periods per year, and t is the number of years."
          >
            <p>
              Compound interest is what makes money grow faster over time
              than simple interest alone — instead of earning interest on
              just your original amount, you earn interest on your
              interest too, and that snowballing effect gets stronger the
              longer money is left to grow. This calculator shows exactly
              how a single starting amount compounds over time at a given
              annual rate.
            </p>
            <p>
              The one input that makes this calculator different from a
              simple growth estimate is compounding frequency — how often
              interest is added to the balance. Choosing annually,
              semi-annually, quarterly, monthly, or daily compounding
              changes the result even at the exact same interest rate,
              because more frequent compounding means interest starts
              earning its own interest sooner. The difference is real but
              shrinks the more frequently you already compound — the jump
              from annual to monthly compounding matters far more than the
              jump from monthly to daily.
            </p>
            <p>
              This tool models a single lump sum with no additional
              deposits along the way — it&apos;s meant to make the
              mechanics of compounding clear, not to replace a full
              savings or investment projection. The result is a
              mathematical projection based on the rate you enter, not a
              guaranteed return: real savings and investment rates change
              over time, so use this as an illustration of how compounding
              works rather than a promise of what you&apos;ll actually
              earn.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={COMPOUND_INTEREST_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
