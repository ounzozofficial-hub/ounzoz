import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { LoanCalculator } from './components/LoanCalculator';
import { RelatedTools } from './components/RelatedTools';
import { LOAN_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

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

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Finance', href: '/finance' },
  { name: 'Loan Calculator' },
];

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
        breadcrumbItems={breadcrumbItems}
        title="Loan Calculator"
        description="Estimate your monthly loan payment, total interest, and total cost."
        contentSlot={
          <ArticleLayout
            title="About the Loan Calculator"
            sourceCitation="Calculated using the standard loan amortization formula for a fixed-rate, fully-amortizing loan: monthly payment = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1], where P is principal, r is the monthly interest rate, and n is the number of monthly payments. Interest rate vs. APR distinction per the CFPB (Consumer Financial Protection Bureau)."
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
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Say you borrow $20,000 at a 6% annual rate for a 5-year
              term. The monthly rate is 6% ÷ 12 = 0.5%, and the number of
              payments is 5 × 12 = 60. Plugging those into the formula
              gives a monthly payment of $386.66. Over 60 payments,
              that&apos;s $23,199.60 paid in total — $3,199.60 of which is
              interest, the rest recovering the original $20,000
              principal.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception: interest rate vs. APR
            </h3>
            <p>
              The number typed into this calculator is the interest rate,
              not necessarily the number you&apos;ll see advertised as
              APR (Annual Percentage Rate). The CFPB draws the distinction
              directly: the interest rate is the cost of borrowing the
              money itself, while APR is the interest rate plus certain
              additional lender fees — origination charges, for
              instance — rolled into a single annualized figure. Because
              of those added fees, APR is always equal to or higher than
              the interest rate, and lenders are required by the Truth in
              Lending Act to disclose both, precisely so borrowers can
              compare loans on equal footing. If you&apos;re comparing
              this calculator&apos;s output to a real offer, make sure
              you&apos;re entering the interest rate, not the APR, or the
              payment shown will run a little low.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Where the standard formula falls short
            </h3>
            <p>
              Term length changes more than just the monthly number. Run
              the same $20,000 at 6% across a 3-year, 5-year, and 7-year
              term: the monthly payment drops from $608.44 to $386.66 to
              $292.17 as the term lengthens, but total interest paid
              climbs from $1,903.84 to $3,199.60 to $4,542.28 over the
              same set of terms. A lower payment isn&apos;t automatically
              the better deal — it usually means paying more in total for
              stretching the same debt over more months. This calculator
              also can&apos;t model a variable-rate loan, where the rate
              itself changes partway through the term, or extra payments
              toward principal, both of which would shift the real total
              away from what a fixed, no-extra-payments schedule shows
              here.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Using the result to compare offers
            </h3>
            <p>
              Treat the monthly payment and total interest figures as a
              baseline for comparing loan offers apples-to-apples, not as
              a guarantee of what any specific lender will approve you
              for. Run the same amount and term at a few different
              candidate rates to see how sensitive the payment is to the
              rate you&apos;re actually offered — even a percentage point
              or two makes a real difference at this scale, as the worked
              example above shows. Once you have real offers in hand,
              compare their APRs side by side rather than just their
              advertised rates, since APR already bakes in the fee
              differences between lenders.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Loan payment vs. total cost of borrowing
            </h3>
            <p>
              The monthly payment answers &quot;can I afford this each
              month&quot;; total interest answers a different
              question — &quot;what does this debt actually cost
              me.&quot; A loan with a smaller monthly payment can still be
              the more expensive choice once every payment is added up,
              exactly as the term-length comparison above shows. Both
              numbers matter, but for different reasons: budget around the
              monthly payment, and weigh the total cost of the loan —
              principal plus total interest — before deciding between two
              competing offers with different terms.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={LOAN_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
