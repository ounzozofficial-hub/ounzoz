import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { InvestmentCalculator } from './components/InvestmentCalculator';
import { RelatedTools } from './components/RelatedTools';
import { INVESTMENT_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/finance/investment-calculator';

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
      name: 'Investment Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Finance', href: '/finance' },
  { name: 'Investment Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: INVESTMENT_FAQ_ITEMS.map((item) => ({
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
  name: 'Investment Calculator',
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

export default function InvestmentCalculatorPage() {
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

      <InvestmentCalculator
        breadcrumbItems={breadcrumbItems}
        title="Investment Calculator"
        description="Project how an initial investment and monthly contributions could grow over time at a return you choose."
        contentSlot={
          <ArticleLayout
            title="About the Investment Calculator"
            sourceCitation="Calculated using the standard future-value-of-annuity formula: FV = P(1+i)ⁿ + PMT[((1+i)ⁿ − 1)/i], where P is your initial investment, PMT is your monthly contribution, i is the monthly rate, and n is the number of months. The expected annual return is a figure you supply — this tool does not suggest, estimate, or imply a historical or expected market return."
          >
            <p>
              This calculator projects how an initial investment, plus a
              fixed contribution every month, could grow over time —
              assuming a constant annual return that you choose. It uses
              the same time-value-of-money math behind most investment
              projections: your money grows on itself, and every
              contribution you add gets the same chance to grow for
              however long is left on your time horizon.
            </p>
            <p>
              You supply the expected annual return yourself. This tool
              deliberately does not suggest a number — real investment
              returns depend entirely on what you invest in, and vary
              significantly from year to year, so any single figure
              presented here would be a guess dressed up as guidance.
              Base your assumption on your own research into the specific
              investments you&apos;re considering, or on advice from a
              qualified financial advisor.
            </p>
            <p>
              Treat the result as a hypothetical illustration, not a
              forecast or a promise. It assumes a perfectly constant
              return every year, which real markets never actually
              deliver, and it doesn&apos;t subtract fees, taxes, or
              inflation. Use it to compare scenarios — a bigger monthly
              contribution, a longer time horizon, a different return
              assumption — rather than to predict an exact future
              balance. Nothing here is financial advice or a
              recommendation to invest.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={INVESTMENT_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
