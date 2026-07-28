import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { GPACalculator } from './components/GPACalculator';
import { RelatedTools } from './components/RelatedTools';
import { GPA_FAQ_ITEMS } from './faq-content';

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
          </ArticleLayout>
        }
        faqSlot={<FAQ items={GPA_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
