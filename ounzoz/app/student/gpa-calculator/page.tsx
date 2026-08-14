import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { GPACalculator } from './components/GPACalculator';
import { RelatedTools } from './components/RelatedTools';
import { GPA_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/student/gpa-calculator';

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
      name: 'GPA Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Student', href: '/student' },
  { name: 'GPA Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: GPA_FAQ_ITEMS.map((item) => ({
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
  name: 'GPA Calculator',
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

export default function GPACalculatorPage() {
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

      <GPACalculator
        breadcrumbItems={breadcrumbItems}
        title="GPA Calculator"
        description="Calculate your grade point average from your course grades and credit hours."
        contentSlot={
          <ArticleLayout
            title="About the GPA Calculator"
            sourceCitation="Calculated using the standard credit-hour-weighted GPA formula on the common US unweighted 4.0 scale (A=4.0 through F=0.0, with standard +/- increments). Grading scales vary by institution — check your school's registrar for your exact official scale."
          >
            <p>
              Your grade point average (GPA) is a weighted average of
              every grade you&apos;ve earned, where each course counts in
              proportion to its credit hours. A 4-credit course pulls
              your GPA more than a 1-credit course does, which is why two
              students with the same letter grades can end up with
              different GPAs if their course loads were weighted
              differently.
            </p>
            <p>
              This calculator uses the formula every US registrar uses in
              some form: add up each course&apos;s grade points (on the
              4.0 scale) multiplied by its credit hours, then divide by
              the total credit hours across all your courses. Enter every
              course from a single term for a semester GPA, or every
              course you&apos;ve ever taken for a cumulative GPA — the
              math is the same either way.
            </p>
            <p>
              This is an unweighted calculation: it doesn&apos;t add
              bonus points for honors, AP, or IB courses the way some
              high schools&apos; official weighted scales do, and it uses
              the standard +/- 4.0 point values rather than any
              institution-specific variation. Treat the result as a
              reliable estimate, and check your school&apos;s own
              published scale if you need an exact official figure.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Say you took three courses in a term: an A- (3.7 points) in a
              4-credit course, a B+ (3.3 points) in a 3-credit course, and
              a B (3.0 points) in another 3-credit course. Multiply each
              grade&apos;s points by its credit hours: 3.7 × 4 = 14.8, 3.3
              × 3 = 9.9, and 3.0 × 3 = 9.0, for a total of 33.7 grade
              points. Divide by total credit hours (4 + 3 + 3 = 10): 33.7 ÷
              10 = 3.37 — the GPA this calculator would show for that
              term.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              It&apos;s tempting to think of GPA as a simple average of
              your letter grades, but it isn&apos;t — it&apos;s a
              credit-weighted average, so a single 1-credit elective pulls
              far less than a 4-credit core course. Two students with the
              exact same set of letter grades can end up with different
              GPAs if those grades landed on courses of different sizes.
              It&apos;s also easy to forget that a syllabus&apos;s letter
              grade and its GPA-scale point value aren&apos;t the same
              number — the letter is what you see on a transcript, but
              it&apos;s the 4.0-scale conversion that actually drives the
              GPA math.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Special cases this calculator doesn&apos;t model
            </h3>
            <p>
              Many US high schools use a weighted scale on top of the base
              4.0 system, adding bonus points for tougher courses — a
              common convention adds 0.5 points for Honors classes and 1.0
              point for AP or IB classes, so an A in an AP course can count
              as a 5.0 instead of a 4.0. There&apos;s no single national
              standard for this: bonus amounts, which courses qualify, and
              whether weighting is used at all vary by district and
              school. This calculator always uses the unweighted 4.0
              scale, so if your school weights grades, your official GPA
              may run higher than what you see here. Pass/fail courses are
              another common exception — most institutions exclude them
              from the GPA calculation entirely rather than assigning them
              a point value, so they generally shouldn&apos;t be entered
              here either.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to use your result
            </h3>
            <p>
              A single term&apos;s GPA is most useful compared against
              your own past terms, not against an absolute target picked
              in isolation — it tells you whether your current course mix
              and performance are trending up, flat, or down. If
              you&apos;re trying to reach a specific cumulative GPA by
              graduation, work backward: figure out how many credit hours
              you have left and what average grade points across them
              would move your cumulative number to where you want it,
              rather than treating any single term&apos;s GPA as the whole
              picture.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              GPA vs. class rank
            </h3>
            <p>
              GPA and class rank both summarize academic performance, but
              they measure different things. GPA is an absolute number
              based only on your own grades and credit hours — it
              doesn&apos;t change based on how anyone else in your class
              performed. Class rank is relative: it places your GPA
              against every other student&apos;s in the same cohort, so
              the same 3.37 GPA could be a strong rank at one school and a
              middling one at another, purely because of how the rest of
              that school&apos;s student body performed.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={GPA_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
