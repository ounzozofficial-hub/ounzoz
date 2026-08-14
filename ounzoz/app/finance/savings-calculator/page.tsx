import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { SavingsCalculator } from './components/SavingsCalculator';
import { RelatedTools } from './components/RelatedTools';
import { SAVINGS_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

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

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Finance', href: '/finance' },
  { name: 'Savings Calculator' },
];

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
        breadcrumbItems={breadcrumbItems}
        title="Savings Calculator"
        description="See how your initial deposit and monthly contributions can grow over time."
        contentSlot={
          <ArticleLayout
            title="About the Savings Calculator"
            sourceCitation="Calculated using the standard future-value-of-annuity formula: FV = P(1+i)ⁿ + PMT[((1+i)ⁿ − 1)/i], where P is your initial deposit, PMT is your monthly contribution, i is the monthly interest rate, and n is the number of months. APY defined per the Truth in Savings Act's implementing Regulation DD; emergency-fund guidance per the CFPB (Consumer Financial Protection Bureau)."
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
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Say you start with a $1,000 initial deposit, add $200 every
              month, and earn a 4% APY for 10 years. Plugging into the
              formula gives a final balance of $30,940.79. Of that,
              $25,000 came directly from your own deposits and
              contributions ($1,000 + $200 × 120 months), and the
              remaining $5,940.79 is interest the account earned along
              the way — roughly 19% of the final balance came from
              interest alone, not from money you put in.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              People often assume any two rates with the same number mean
              the same thing, but the number that matters for comparing
              accounts is APY specifically, not a plain, uncompounded
              interest rate. Per the Truth in Savings Act (implemented
              through Regulation DD, now maintained by the CFPB), banks
              are required to disclose the APY precisely because it
              already factors in compounding, making it the only number
              that lets you compare two accounts on equal footing — a
              bank quoting a lower nominal rate with more frequent
              compounding can sometimes out-earn a higher rate compounded
              less often.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Where this projection runs into limits
            </h3>
            <p>
              This tool assumes your rate holds perfectly steady for the
              entire time horizon, but real savings APYs move with
              broader interest-rate conditions — a bank can and does
              change its rate with little notice, so a 10-year projection
              at today&apos;s rate is a snapshot, not a forecast. It also
              doesn&apos;t subtract taxes owed on the interest you earn
              (interest income is generally taxable) or account for
              inflation, which erodes what that final balance can
              actually buy by the time you reach it — both mean the real,
              spendable value of the projected balance is lower than the
              raw number shown.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to use this result
            </h3>
            <p>
              Use the final-balance and interest-earned breakdown to test
              how sensitive your goal is to each input — a higher monthly
              contribution, a longer timeline, or a better rate. Because a
              meaningful share of long-term growth comes from
              interest-on-interest rather than your own contributions (as
              in the worked example above), starting sooner, even with a
              smaller amount, is usually more powerful than waiting to
              contribute more later. If this balance is meant to be an
              emergency fund specifically, the CFPB&apos;s general
              guidance is to target roughly three to six months of
              essential expenses — housing, groceries, utilities,
              transportation, and routine medical costs — as a savings
              goal, though the right amount depends on your own income
              stability and expenses.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Savings vs. investing
            </h3>
            <p>
              This calculator models a savings-account-style APY, which
              is why its rate is capped at a realistic bank-savings
              range: savings accounts prioritize safety and liquidity
              over growth, typically holding your balance in
              cash-equivalent, FDIC-insured deposits. Investment
              Calculator models a different kind of growth — money placed
              in securities like stocks or funds, which can earn a higher
              expected return over the long run but carries real risk of
              loss that a savings account doesn&apos;t. Which is
              appropriate depends on the money&apos;s purpose: savings
              for a near-term goal or emergency fund generally belongs
              somewhere safe and liquid, while money with a longer time
              horizon can typically afford to take on the added risk
              investing carries.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={SAVINGS_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
