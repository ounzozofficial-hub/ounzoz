import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { FractionCalculator } from './components/FractionCalculator';
import { RelatedTools } from './components/RelatedTools';
import { FRACTION_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/student/fraction-calculator';

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
      name: 'Student',
      item: 'https://ounzoz.com/student',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Fraction Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Student', href: '/student' },
  { name: 'Fraction Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FRACTION_FAQ_ITEMS.map((item) => ({
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
  name: 'Fraction Calculator',
  applicationCategory: 'EducationApplication',
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

export default function FractionCalculatorPage() {
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

      <FractionCalculator
        breadcrumbItems={breadcrumbItems}
        title="Fraction Calculator"
        description="Add, subtract, multiply, or divide two fractions and get the simplified result instantly."
        contentSlot={
          <ArticleLayout
            title="About the Fraction Calculator"
            sourceCitation="Uses the standard cross-multiplication formulas for fraction arithmetic, then simplifies the result via GCD (greatest common divisor) reduction."
          >
            <p>
              Fractions come up constantly in math coursework — combining
              measurements, working through algebra, or just checking a
              homework answer — and the arithmetic gets error-prone fast
              once you&apos;re finding common denominators or
              cross-multiplying by hand. This tool takes two fractions and
              an operation (add, subtract, multiply, or divide) and
              returns the exact simplified result, so you can check your
              own work or skip straight to the next step of a larger
              problem.
            </p>
            <p>
              Every result is automatically reduced to lowest terms —
              the same simplification you&apos;d do by hand, using the
              greatest common divisor of the numerator and denominator.
              You&apos;ll also see the decimal equivalent, and if the
              result is an improper fraction (numerator larger than the
              denominator), its mixed-number form too, so you can read
              the answer however your assignment expects it.
            </p>
            <p>
              A couple of rules to keep in mind: neither denominator can
              be zero (that&apos;s not a valid fraction), and when
              dividing, the second fraction&apos;s numerator can&apos;t be
              zero either, since that would mean dividing by zero. Both
              numerators and denominators should be whole numbers — if
              you&apos;re starting from a decimal, convert it to a
              fraction first.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Say you&apos;re adding 3/4 and 5/6. Cross-multiply into a
              common denominator: (3 × 6 + 5 × 4) / (4 × 6) = (18 + 20)
              / 24 = 38/24. That fraction isn&apos;t in lowest terms yet
              — the greatest common divisor of 38 and 24 is 2, so
              dividing both by 2 simplifies it to 19/12. Since the
              numerator is larger than the denominator, this calculator
              also shows it as a mixed number: 1 whole plus 7/12
              remaining (12 fits into 19 once, with 7 left over), and as
              a decimal: 19 ÷ 12 = 1.5833.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              The single most common fraction-arithmetic mistake is
              adding or subtracting numerators and denominators straight
              across — treating 3/4 + 5/6 as (3+5)/(4+6) = 8/10. That&apos;s
              wrong; fractions only add correctly once they share a
              common denominator, which is exactly why this calculator
              cross-multiplies rather than combining the numbers
              directly. That pitfall is specific to addition and
              subtraction — multiplication genuinely does work straight
              across (numerator × numerator, denominator ×
              denominator), which is part of why the two operations get
              confused.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Cases worth double-checking
            </h3>
            <p>
              Mixed numbers (like 1½) can&apos;t be entered directly —
              this tool expects a plain numerator and denominator, so
              convert a mixed number to an improper fraction first
              (multiply the whole number by the denominator and add the
              numerator: 1½ becomes (1×2+1)/2 = 3/2). Negative fractions
              work correctly regardless of which term carries the minus
              sign, but the simplified result always normalizes the sign
              onto the numerator with a positive denominator, so −3/4 and
              3/−4 both simplify to the same −3/4. And a whole number is
              just a fraction with a denominator of 1 — enter 5 as 5/1 if
              you need to combine it with another fraction.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Reading your result
            </h3>
            <p>
              Which form of the answer to use depends on what you&apos;re
              doing with it next. The simplified fraction is generally
              the expected form for a homework answer unless told
              otherwise; the mixed number is often preferred when the
              result represents a real-world quantity, like a length or
              a recipe measurement, since “1 and 7/12” is easier to picture
              than “19/12.” The decimal is most useful when you need to
              compare the result against another number quickly, or feed
              it into a further calculation that doesn&apos;t use
              fractions.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Fractions vs. decimals vs. percentages
            </h3>
            <p>
              All three are different notations for the same underlying
              value — 3/4, 0.75, and 75% all represent an identical
              quantity. Fractions are exact and show the relationship
              between parts and a whole clearly, which is why they&apos;re
              the standard form in algebra and geometry. Decimals are
              easier to compare at a glance and to type into most
              calculators, but some fractions (like 1/3) only convert to
              a decimal that repeats forever, so a decimal answer is
              sometimes a rounded approximation rather than an exact
              value the way the fraction itself is.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={FRACTION_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
