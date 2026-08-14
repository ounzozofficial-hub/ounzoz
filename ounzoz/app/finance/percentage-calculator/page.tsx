import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { PercentageCalculator } from './components/PercentageCalculator';
import { RelatedTools } from './components/RelatedTools';
import { PERCENTAGE_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/finance/percentage-calculator';

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
      name: 'Percentage Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Finance', href: '/finance' },
  { name: 'Percentage Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: PERCENTAGE_FAQ_ITEMS.map((item) => ({
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
  name: 'Percentage Calculator',
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

export default function PercentageCalculatorPage() {
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

      <PercentageCalculator
        breadcrumbItems={breadcrumbItems}
        title="Percentage Calculator"
        description="Find what a percentage of a number is, what percent one number is of another, or the percentage change between two values."
        contentSlot={
          <ArticleLayout
            title="About the Percentage Calculator"
            sourceCitation="Uses the three standard percentage formulas: (percent ÷ 100) × number for 'percent of', (part ÷ whole) × 100 for 'is what percent', and ((new − old) ÷ old) × 100 for percentage change."
          >
            <p>
              A percentage is just a way of expressing a number as a
              fraction of 100 — useful shorthand for comparing amounts
              that would otherwise be hard to compare directly. This
              calculator covers the three questions people most commonly
              need a percentage for, in one tool instead of three.
            </p>
            <p>
              <strong>% of a number</strong> answers questions like
              &quot;what is 20% of 50?&quot; — handy for discounts, tips,
              sales tax, and commissions. <strong>Is what %</strong>{' '}
              flips that around: given two amounts, it tells you what
              percentage one is of the other — useful for test scores,
              budget shares, or completion rates. <strong>% change</strong>{' '}
              measures how much a value grew or shrank between two points
              — the calculation behind price changes, population growth,
              and year-over-year statistics.
            </p>
            <p>
              Every mode uses the standard, unambiguous percentage formula
              for that calculation — there&apos;s no rounding trick or
              approximation involved. The one thing to watch for:
              percentage change is a relative measure, so a change from a
              very small starting number can produce a very large
              percentage even if the actual difference is small.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Take all three modes with fresh numbers. <strong>% of a
              number:</strong> 15% of 80 is (15 ÷ 100) × 80 = 12.{' '}
              <strong>Is what %:</strong> 45 is what percent of 180? (45 ÷
              180) × 100 = 25%. <strong>% change:</strong> going from 250
              to 300 is ((300 − 250) ÷ 250) × 100 = 20%, an increase.
              Each mode applies the same underlying idea — a ratio
              expressed out of 100 — to a different question.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              A common mistake is assuming percentage changes are
              additive — that a 10% increase followed by a 10% decrease
              returns a value to where it started. It doesn&apos;t:
              increasing 100 by 10% gives 110, and decreasing 110 by 10%
              gives 99, not 100, because the second percentage is
              calculated on a different (larger) base than the first.
              Percentage changes always apply to whatever the current
              value is at that moment, not to some fixed original number,
              which is why chaining several percentage changes together
              rarely produces the result intuition suggests.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Where percentages can mislead
            </h3>
            <p>
              Percentage change is a relative measure, so it can make a
              small absolute difference look dramatic, or a large one
              look modest, depending entirely on the size of the starting
              value. A figure going from 1 to 2 is a 100% increase —
              technically correct, but a change of exactly one unit —
              while a figure going from 1,000,000 to 1,900,000 is a 90%
              increase representing a far larger real-world shift. Always
              check the underlying values behind a percentage change
              before treating the percentage alone as the full picture,
              especially in news or statistics where only the percentage
              tends to get reported.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to use these results
            </h3>
            <p>
              Use &quot;% of a number&quot; whenever you know a rate and
              a base and want the resulting amount (discounts, tips, tax,
              commissions); use &quot;Is what %&quot; when you have two
              amounts and want the relationship between them (test
              scores, budget shares, completion rates); use &quot;%
              change&quot; when you&apos;re comparing a value at two
              points in time or two states (price changes, growth rates,
              before-and-after comparisons). Picking the mode that
              matches your actual question, rather than reverse-engineering
              one mode&apos;s formula into another&apos;s, is the fastest
              way to get a trustworthy number.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A percentage compared to a ratio
            </h3>
            <p>
              A percentage is really just a ratio with the denominator
              fixed at 100 — &quot;20%,&quot; &quot;1:5,&quot; and
              &quot;0.2&quot; all describe the exact same relationship
              between two quantities, expressed three different ways.
              Percentages are useful specifically because comparing two
              percentages is more intuitive than comparing two ratios
              with different denominators — a 3-in-8 chance versus a
              5-in-16 chance takes a moment to work out, while 37.5%
              versus 31.25% doesn&apos;t. Converting a ratio or fraction
              to a percentage is exactly what &quot;Is what %&quot; mode
              does — take the ratio, multiply by 100, and the comparison
              becomes immediate.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={PERCENTAGE_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
