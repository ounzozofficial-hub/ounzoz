import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { QuadraticCalculator } from './components/QuadraticCalculator';
import { RelatedTools } from './components/RelatedTools';
import { QUADRATIC_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/student/quadratic-equation-solver';

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
      name: 'Quadratic Equation Solver',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Student', href: '/student' },
  { name: 'Quadratic Equation Solver' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: QUADRATIC_FAQ_ITEMS.map((item) => ({
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
  name: 'Quadratic Equation Solver',
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

export default function QuadraticEquationSolverPage() {
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

      <QuadraticCalculator
        breadcrumbItems={breadcrumbItems}
        title="Quadratic Equation Solver"
        description="Solve ax² + bx + c = 0 for x — enter your coefficients to get real or complex roots instantly."
        contentSlot={
          <ArticleLayout
            title="About the Quadratic Equation Solver"
            sourceCitation="Solves using the standard quadratic formula: x = (−b ± √(b² − 4ac)) / 2a."
          >
            <p>
              A quadratic equation has the form ax² + bx + c = 0, where a
              can&apos;t be zero — it&apos;s one of the core equation
              types covered in algebra, showing up anywhere a relationship
              involves a squared term: projectile motion, area problems,
              and plenty of standardized-test questions. Solving one by
              hand means correctly applying the quadratic formula and
              simplifying a square root, which is easy to get wrong under
              time pressure. This tool does the arithmetic instantly so
              you can check your work or move straight to interpreting
              the answer.
            </p>
            <p>
              The key to understanding the result is the discriminant —
              the b² − 4ac term under the square root. When it&apos;s
              positive, the equation has two distinct real solutions.
              When it&apos;s exactly zero, both solutions land on the
              same value, so there&apos;s only one repeated root. When
              it&apos;s negative, there&apos;s no real number that
              satisfies the equation — the two solutions are a complex
              conjugate pair instead, which this tool reports explicitly
              rather than showing a real number that isn&apos;t actually
              a valid answer.
            </p>
            <p>
              Enter your three coefficients exactly as they appear in
              your equation, including their signs — for 2x² − 5x + 3 =
              0, that&apos;s a = 2, b = −5, c = 3. The one input that has
              to follow a rule is a: it can&apos;t be zero, since a
              missing x² term means the equation isn&apos;t quadratic in
              the first place.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={QUADRATIC_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
