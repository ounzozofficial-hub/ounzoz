import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { StudyTimeCalculator } from './components/StudyTimeCalculator';
import { RelatedTools } from './components/RelatedTools';
import { STUDY_TIME_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/student/study-time-calculator';

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
      name: 'Study Time Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Student', href: '/student' },
  { name: 'Study Time Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: STUDY_TIME_FAQ_ITEMS.map((item) => ({
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
  name: 'Study Time Calculator',
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

export default function StudyTimeCalculatorPage() {
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

      <StudyTimeCalculator
        breadcrumbItems={breadcrumbItems}
        title="Study Time Calculator"
        description="Split your available study time evenly across your exam topics based on your deadline and daily schedule."
        contentSlot={
          <ArticleLayout
            title="About the Study Time Calculator"
            sourceCitation="This tool performs a simple time-allocation calculation (available hours ÷ number of topics) rather than citing a study-hours guideline — how much total time any given exam or course requires varies too much by subject, institution, and student to state as a single verifiable rule."
          >
            <p>
              Cramming everything into the last couple of days rarely goes
              well, and it&apos;s easy to lose track of how your remaining
              time actually breaks down once you&apos;ve got several
              chapters, units, or topics left to review. This calculator
              takes the guesswork out of that: tell it how many days you
              have, how many hours you can realistically study each day,
              and how many topics you need to cover, and it splits your
              available time evenly across them.
            </p>
            <p>
              The math is straightforward — total available hours (days ×
              hours per day) divided by the number of topics you&apos;ve
              entered. If the result comes out to less than an hour per
              topic, the calculator flags it, since that&apos;s often a
              sign it&apos;s worth starting sooner, trimming your scope, or
              freeing up more study time per day.
            </p>
            <p>
              One thing this tool intentionally doesn&apos;t do: tell you
              how many total hours you <em>should</em> be studying. That
              depends on the subject, the course, and you — this
              calculator only helps you divide up the time you&apos;ve
              already decided you can commit, treating every topic
              equally. If some topics are harder than others, it&apos;s
              worth manually weighting your plan toward them rather than
              splitting time perfectly evenly.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={STUDY_TIME_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
