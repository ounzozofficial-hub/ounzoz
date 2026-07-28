import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { LoanCalculator } from './components/LoanCalculator';
import { RelatedTools } from './components/RelatedTools';
import { LOAN_FAQ_ITEMS } from './faq-content';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/finance/loan-calculator';

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
      name: 'Loan Calculator',
      item: TOOL_URL,
    },
  ],
};

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: LOAN_FAQ_ITEMS.map((item) => ({
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
  name: 'Loan Calculator',
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

export default function LoanCalculatorPage() {
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

      <LoanCalculator
        title="Loan Calculator"
        description="Estimate your monthly loan payment, total interest, and total cost."
        contentSlot={
          <ArticleLayout
            title="About the Loan Calculator"
            sourceCitation="Calculated using the standard loan amortization formula for a fixed-rate, fully-amortizing loan: monthly payment = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1], where P is principal, r is the monthly interest rate, and n is the number of monthly payments."
          >
            <p>
              Whether you&apos;re considering a personal loan, an auto loan,
              or any other fixed-rate installment loan, the questions are
              usually the same: what will the monthly payment actually be,
              and how much will the loan cost in total once every payment
              is added up? This calculator answers both from three simple
              inputs — the loan amount, the annual interest rate, and the
              term in years.
            </p>
            <p>
              It assumes a fixed interest rate and equal monthly payments
              for the full term, the standard structure for most personal
              and auto loans. Each payment is split between interest and
              principal, with the interest portion shrinking and the
              principal portion growing as the loan is paid down — the
              total interest figure shown here is the sum of every
              interest portion across the full schedule.
            </p>
            <p>
              This is an estimate, not a loan offer or financial advice.
              It doesn&apos;t include origination fees, insurance, or other
              charges a lender may add, and it assumes a fixed rate for the
              entire term — a variable-rate loan can change your actual
              payment over time. The rate you&apos;re offered depends on
              factors like credit score and lender policy, so use this
              number as a starting point for comparing offers, not as a
              guaranteed figure.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={LOAN_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
