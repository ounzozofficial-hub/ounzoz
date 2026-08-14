import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { CompoundInterestCalculator } from './components/CompoundInterestCalculator';
import { RelatedTools } from './components/RelatedTools';
import { COMPOUND_INTEREST_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

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

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Finance', href: '/finance' },
  { name: 'Compound Interest Calculator' },
];

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
        breadcrumbItems={breadcrumbItems}
        title="Compound Interest Calculator"
        description="See how a lump-sum amount grows over time at a given interest rate and compounding frequency."
        contentSlot={
          <ArticleLayout
            title="About the Compound Interest Calculator"
            sourceCitation="Calculated using the standard compound interest formula: A = P × (1 + r/n)ⁿᵗ, where P is the starting principal, r is the annual interest rate, n is the number of compounding periods per year, and t is the number of years. Nominal rate vs. effective annual yield (APY) distinction per the Truth in Savings Act's implementing Regulation DD."
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
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Say you deposit a $5,000 lump sum at a 5% annual rate for
              10 years. Compounded annually, the formula gives a final
              balance of $8,144.47 — $3,144.47 in interest on top of the
              original $5,000. Switch only the compounding frequency to
              monthly, and the balance rises to $8,235.05 ($3,235.05 in
              interest); switch it again to daily, and it reaches
              $8,243.32 ($3,243.32 in interest). Notice how much of the
              gain from more frequent compounding — $90.58 of it — comes
              from the jump between annual and monthly, while the jump
              from monthly to daily adds only another $8.27: the same
              diminishing-returns pattern the FAQ below describes, shown
              here with real numbers.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              It&apos;s easy to assume interest rate is the only variable
              that matters, but time does more of the work than most
              people expect, because of how compounding stacks on itself.
              Doubling the interest rate in the example above (5% to 10%)
              more than doubles the interest earned over the same 10
              years, since each year&apos;s larger balance also
              compounds — growth under compound interest isn&apos;t
              linear with either rate or time, even though it can look
              that way over short periods.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Where a single lump-sum projection falls short
            </h3>
            <p>
              This tool intentionally models one deposit growing alone
              with no further money added — it doesn&apos;t represent an
              account you keep contributing to, which is a different (and
              for most savers, more realistic) scenario covered by
              Savings Calculator or Investment Calculator instead. It also
              can&apos;t account for a rate that changes over the
              projection period, taxes owed on interest as it&apos;s
              earned, or account fees — all of which would pull a real
              balance below this pure-math projection.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to use this result
            </h3>
            <p>
              Use the final balance and interest-earned figures to build
              intuition for how starting amount, rate, time horizon, and
              compounding frequency each move the outcome — change one
              variable at a time, as in the worked example above, to see
              which has the biggest effect on your specific numbers.
              It&apos;s most useful as a comparison tool (this rate vs.
              that one, this many years vs. that many) rather than as a
              forecast of an exact real-world balance.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Nominal rate vs. effective annual yield
            </h3>
            <p>
              The annual rate you enter here is a nominal rate — the
              stated percentage before accounting for how often it
              compounds. The actual amount that rate earns over a year,
              once compounding is factored in, is called the effective
              annual yield (in banking specifically, the Annual Percentage
              Yield, or APY, defined under the Truth in Savings Act and
              its implementing Regulation DD). Two accounts advertising
              the same nominal rate can pay out different amounts if one
              compounds more frequently than the other — exactly the gap
              the compounding-frequency comparison above illustrates, and
              why comparing nominal rates alone can be misleading.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={COMPOUND_INTEREST_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
