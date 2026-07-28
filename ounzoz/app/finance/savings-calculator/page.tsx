import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { SavingsCalculator } from './components/SavingsCalculator';
import { RelatedTools } from './components/RelatedTools';
import { SAVINGS_FAQ_ITEMS } from './faq-content';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/finance/savings-calculator';

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
      name: 'Savings Calculator',
      item: TOOL_URL,
    },
  ],
};

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: SAVINGS_FAQ_ITEMS.map((item) => ({
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
  name: 'Savings Calculator',
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

export default function SavingsCalculatorPage() {
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

      <SavingsCalculator
        title="Savings Calculator"
        description="See how your initial deposit and monthly contributions can grow over time."
        contentSlot={
          <ArticleLayout
            title="About the Savings Calculator"
            sourceCitation="Calculated using the standard future-value-of-annuity formula: FV = P(1+i)ⁿ + PMT[((1+i)ⁿ − 1)/i], where P is your initial deposit, PMT is your monthly contribution, i is the monthly interest rate, and n is the number of months."
          >
            <p>
              A savings account grows two ways: the interest your balance
              earns, and the money you add to it yourself. This calculator
              projects both together — starting from an optional initial
              deposit, adding a fixed contribution every month, and letting
              the whole balance earn interest that compounds monthly, the
              same way most savings accounts actually work.
            </p>
            <p>
              You only need to fill in a deposit or a monthly contribution
              — not necessarily both. Enter the annual interest rate as an
              APY (Annual Percentage Yield), since that&apos;s how banks
              typically advertise savings rates, and it already reflects
              the effect of compounding rather than a raw, uncompounded
              rate.
            </p>
            <p>
              The result is a projection, not a guarantee: it assumes your
              rate stays constant for the entire period, which real
              savings APYs rarely do — banks adjust rates over time based
              on broader interest-rate conditions. It also doesn&apos;t
              account for taxes on the interest you earn or for inflation
              eroding the real value of that balance. Use it to compare
              scenarios (a higher contribution, a longer timeline, a
              better rate) rather than as a promised future balance.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={SAVINGS_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
