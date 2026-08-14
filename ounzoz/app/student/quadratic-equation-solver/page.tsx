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
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Take x² − 7x + 12 = 0, so a = 1, b = −7, c = 12. The
              discriminant is b² − 4ac = (−7)² − 4(1)(12) = 49 − 48 =
              1, which is positive, so there are two distinct real
              roots. Plugging into the formula: x = (−7 ± √1) / 2 =
              (7 ± 1) / 2, giving x = 4 and x = 3 — which checks out,
              since (x − 4)(x − 3) expands back to x² − 7x + 12.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              It&apos;s easy to assume every quadratic equation has two
              real-number solutions, since that&apos;s the case most
              textbook practice problems are built around. In reality,
              a good number of quadratics — any with a negative
              discriminant — have no real solutions at all. It&apos;s
              also a common slip to drop the sign on b when reading
              coefficients out of an equation: in ax² + bx + c = 0, a
              term written as −5x means b = −5, not b = 5, and getting
              that sign wrong flips the roots to incorrect values even
              though the rest of the arithmetic is done correctly.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              When there&apos;s no real solution
            </h3>
            <p>
              Take x² + 2x + 5 = 0: the discriminant is 2² − 4(1)(5) =
              4 − 20 = −16, which is negative. Graphically, this means
              the parabola y = x² + 2x + 5 never touches the x-axis — it
              sits entirely above it, since its minimum value is
              positive. The two solutions are still mathematically
              valid, but they&apos;re complex numbers: −1 + 2i and −1 −
              2i (real part −1, imaginary part ±2, from −b/2a and
              √16/2a). This calculator reports that pairing directly
              rather than showing a real number that wouldn&apos;t
              actually satisfy the original equation.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to check your result
            </h3>
            <p>
              Vieta&apos;s formulas give a fast sanity check without
              re-solving anything: for ax² + bx + c = 0, the sum of the
              roots always equals −b/a, and their product always equals
              c/a. In the worked example above, 4 + 3 = 7, and −b/a =
              −(−7)/1 = 7 — it matches. Their product, 4 × 3 = 12, also
              matches c/a = 12/1 = 12. If your two roots don&apos;t
              satisfy both checks, it&apos;s worth re-entering your
              coefficients rather than trusting the result.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              The quadratic formula vs. factoring
            </h3>
            <p>
              Factoring — rewriting ax² + bx + c as a product like (x
              − 4)(x − 3) — is often faster by hand when the roots are
              small whole numbers, but it only works cleanly when such
              factors exist and can take real trial and error to spot.
              The quadratic formula always works, for any a, b, and c,
              including messy decimals or a negative discriminant that
              no amount of factoring would reveal cleanly. This
              calculator always uses the formula rather than attempting
              to factor, precisely because it has to handle every
              possible input, not just the tidy cases a textbook
              chooses to illustrate.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={QUADRATIC_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
