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
            sourceCitation="Calculated using the standard future-value-of-annuity formula: FV = P(1+i)ⁿ + PMT[((1+i)ⁿ − 1)/i], where P is your initial investment, PMT is your monthly contribution, i is the monthly rate, and n is the number of months. The expected annual return is a figure you supply — this tool does not suggest, estimate, or imply a historical or expected market return. Dollar-cost averaging defined per the SEC's investor.gov."
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
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Say you start with a $5,000 initial investment, contribute
              $300 every month, and assume a 7% expected annual return
              for 20 years. Plugging into the formula gives a projected
              balance of $176,471.69. Of that, $77,000 came directly from
              your own contributions ($5,000 + $300 × 240 months), and
              the remaining $99,471.69 is projected growth — in this
              example, growth outweighs your own contributions by more
              than 2 to 1, largely a function of time: the earliest
              contributions had two full decades to compound, while the
              last ones barely had any time to grow at all.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              An &quot;average&quot; annual return and a guaranteed,
              steady return are not the same thing, even though this
              calculator&apos;s constant-rate math can make them look
              interchangeable. Two investments can post the exact same
              average annual return over 20 years and still leave you
              with very different final balances, depending on when the
              good years and bad years actually happened — a pattern
              often called sequence-of-returns risk. A portfolio that
              loses money early, before most contributions have gone in,
              tends to recover better than one that loses money late,
              after a large balance has already built up — timing
              matters in a way a single constant &quot;expected
              return&quot; figure can&apos;t capture.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Where the growth assumption breaks down
            </h3>
            <p>
              This tool deliberately doesn&apos;t suggest a return
              figure — real returns vary by asset class, and no single
              defensible number applies to &quot;investing&quot; in
              general. It also doesn&apos;t subtract fees (fund expense
              ratios, brokerage or advisor fees), which compound against
              you the same way returns compound for you, quietly eating
              into the final balance over a multi-decade horizon even at
              seemingly small annual percentages. Taxes on gains and
              dividends, and inflation eroding what that future balance
              can actually buy, are left out too — reasons the number
              shown here is best read as a hypothetical ceiling on a
              &quot;smooth&quot; outcome, not a number to expect exactly.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to use this projection
            </h3>
            <p>
              Investing a fixed amount every month, the way this
              calculator&apos;s monthly-contribution field works, is
              generally called dollar-cost averaging — per the
              SEC&apos;s investor.gov, it means buying at whatever price
              the market happens to offer each period rather than trying
              to time a single lump-sum entry, which smooths out the
              effect of short-term price swings without changing the
              underlying return your investments earn. Use this tool to
              compare scenarios — a larger contribution, a longer
              horizon, a different return assumption — and treat the gap
              between &quot;contributions&quot; and &quot;growth&quot; in
              your result as a reminder of how much of long-term
              investing&apos;s payoff depends on time in the market, not
              the size of any one contribution.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Expected return vs. actual market return
            </h3>
            <p>
              The rate you enter is an assumption you supply, not a
              benchmark this tool implies or endorses. Compound annual
              growth rate (CAGR) — the standard way analysts describe how
              an investment actually performed over a past multi-year
              period, calculated as (ending value ÷ starting
              value)^(1/years) − 1 — measures history after the fact; the
              &quot;expected annual return&quot; field on this calculator
              asks you to guess at the future instead, which is an
              inherently less certain exercise. If you&apos;re
              benchmarking an assumption, comparing it to a real
              investment&apos;s historical CAGR over a similar length of
              time is a more grounded starting point than picking a round
              number.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={INVESTMENT_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
