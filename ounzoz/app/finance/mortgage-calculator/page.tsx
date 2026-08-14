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
            sourceCitation="Principal & interest calculated using the standard loan amortization formula for a fixed-rate, fully-amortizing mortgage: monthly payment = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1], where P is the loan principal (home price minus down payment), r is the monthly interest rate, and n is the number of monthly payments. PMI and down-payment guidance per the CFPB (Consumer Financial Protection Bureau); the 28/36 affordability guideline is a commonly cited mortgage-industry benchmark, not a universal requirement."
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
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Say you&apos;re buying a $400,000 home with a $40,000 (10%)
              down payment, a 6.5% interest rate, and a 30-year term. The
              loan principal is $400,000 − $40,000 = $360,000. Plugging
              that into the amortization formula gives a monthly
              principal & interest payment of $2,275.44. Add $6,000 a
              year in property tax and $1,500 a year in home insurance
              (÷12 = $625/month combined, with no HOA in this example),
              and the total estimated monthly payment comes to $2,900.44
              — over $600 more than principal & interest alone.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception: what this payment doesn&apos;t
              include
            </h3>
            <p>
              A 10% down payment like the one above falls short of the
              20% threshold conventional lenders use, so this scenario
              would typically also require private mortgage insurance
              (PMI) — a real added monthly cost this calculator
              deliberately doesn&apos;t estimate, since PMI rates vary by
              lender, credit score, and loan type with no single standard
              figure to apply. The CFPB is explicit that PMI protects the
              lender, not the borrower — it exists to cover the
              lender&apos;s loss if you stop making payments, and it
              doesn&apos;t protect you from foreclosure if that happens.
              Per the same CFPB guidance, putting 20% or more down on a
              conventional loan removes the PMI requirement entirely; in
              the example above, an $80,000 (20%) down payment instead of
              $40,000 would drop the principal to $320,000 and the
              principal & interest payment to $2,022.62 — lower not just
              because of the smaller loan, but also because PMI would no
              longer apply.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              When the standard payment estimate doesn&apos;t fit
            </h3>
            <p>
              This calculator assumes a fixed rate for the full term, the
              standard structure for most conventional mortgages — it
              doesn&apos;t model an adjustable-rate mortgage (ARM), where
              the rate (and payment) can change after an initial fixed
              period, sometimes substantially. It also doesn&apos;t apply
              any affordability guideline: a commonly cited lending
              benchmark, the 28/36 rule, suggests keeping total housing
              costs at or below 28% of gross monthly income and total
              debt payments at or below 36%, though actual lender
              requirements vary by loan program and can differ from this
              general guideline. This tool calculates whatever payment
              your inputs produce regardless of where that lands relative
              to your income, so a technically correct payment estimate
              can still be one a lender — or your own budget — wouldn&apos;t
              consider affordable.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to use this estimate
            </h3>
            <p>
              Use the total monthly payment as a planning figure for
              comparing home prices, down payment sizes, and rates
              against each other — not as a final number to budget
              around before getting a real loan estimate. Since PMI,
              closing costs, and lender fees aren&apos;t included, treat
              this calculator&apos;s output as a floor on your likely
              payment rather than a ceiling, especially at a down payment
              below 20%. A formal loan estimate from an actual lender,
              required by law to disclose the APR and all fees, is the
              number to rely on before making a purchase decision.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Monthly payment vs. total interest paid
            </h3>
            <p>
              The monthly payment answers what you&apos;ll owe each
              month; total interest answers what the loan costs over its
              full life. In the 30-year, $360,000 example above, total
              interest paid over the full term comes to roughly $459,158
              — more than the original loan amount itself, a direct
              consequence of how much interest accrues on a large
              principal over three decades. A shorter term or a larger
              down payment both reduce that total, even when they raise
              or barely change the monthly payment, which is why the two
              numbers are worth weighing together rather than optimizing
              for the smaller monthly figure alone.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={MORTGAGE_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
