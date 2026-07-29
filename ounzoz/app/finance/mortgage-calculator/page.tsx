import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { MortgageCalculator } from './components/MortgageCalculator';
import { RelatedTools } from './components/RelatedTools';
import { MORTGAGE_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/finance/mortgage-calculator';

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
      name: 'Mortgage Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Finance', href: '/finance' },
  { name: 'Mortgage Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: MORTGAGE_FAQ_ITEMS.map((item) => ({
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
  name: 'Mortgage Calculator',
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

export default function MortgageCalculatorPage() {
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

      <MortgageCalculator
        breadcrumbItems={breadcrumbItems}
        title="Mortgage Calculator"
        description="Estimate your monthly mortgage payment, including principal, interest, taxes, insurance, and HOA."
        contentSlot={
          <ArticleLayout
            title="About the Mortgage Calculator"
            sourceCitation="Principal & interest calculated using the standard loan amortization formula for a fixed-rate, fully-amortizing mortgage: monthly payment = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1], where P is the loan principal (home price minus down payment), r is the monthly interest rate, and n is the number of monthly payments."
          >
            <p>
              A mortgage payment is usually more than just principal and
              interest — property tax, home insurance, and HOA dues (if
              any) typically get bundled into the same monthly bill. This
              calculator estimates all four together from your home
              price, down payment, interest rate, and loan term, so the
              number you see is closer to what you&apos;d actually pay
              each month.
            </p>
            <p>
              Principal & interest use the same fixed-rate amortization
              math as any installment loan: each payment is split between
              interest and principal, with the interest portion shrinking
              and the principal portion growing over the term. Property
              tax and home insurance are entered as annual figures and
              divided by twelve; HOA dues are entered directly as a
              monthly amount. All three are optional and default to zero
              if you leave them blank.
            </p>
            <p>
              This is an estimate, not a loan offer or financial advice.
              It doesn&apos;t include private mortgage insurance (PMI),
              closing costs, or other lender fees, and it assumes a fixed
              rate for the entire term. Your actual rate and terms depend
              on factors like credit score, loan type, and lender policy
              — use this as a starting point for comparing scenarios, not
              a guaranteed figure.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={MORTGAGE_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
