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
          </ArticleLayout>
        }
        faqSlot={<FAQ items={FRACTION_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
