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
            sourceCitation="This tool performs a simple time-allocation calculation (available hours ÷ number of topics) rather than citing a study-hours guideline — how much total time any given exam or course requires varies too much by subject, institution, and student to state as a single verifiable rule. Spacing/distributed-practice research cited per Cepeda et al. (2006), Psychological Bulletin."
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
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Say your exam is 14 days away, you can realistically study 3
              hours a day, and you have 8 topics to cover. Total available
              hours: 14 × 3 = 42 hours. Divide by topics: 42 ÷ 8 = 5.25,
              which this calculator rounds to 5.3 hours per topic — above
              the 1-hour advisory threshold, so no warning would show for
              this particular plan.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              More total hours doesn&apos;t automatically mean better
              retention, especially if most of those hours end up
              massed into the final day or two before the exam. A
              widely cited 2006 meta-analysis by Cepeda, Pashler, Vul,
              Wixted, and Rohrer, published in Psychological Bulletin,
              reviewed hundreds of learning experiments and found that
              spacing study sessions out over time consistently produced
              better long-term retention than massing the same total
              amount of study time into a short window — the effect this
              calculator&apos;s day-by-day allocation is built to
              encourage, even though it doesn&apos;t schedule individual
              sessions for you.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Where the even split breaks down
            </h3>
            <p>
              Splitting time perfectly evenly across topics is a
              reasonable default, but it assumes every topic takes the
              same effort to learn — rarely true in practice. A topic
              you already understand well needs less of your allotted
              share, while a genuinely difficult one may need more than
              its even split provides. The same applies to how the days
              themselves are used: this tool treats every day&apos;s
              hours as interchangeable, but the spacing research above
              suggests that revisiting a topic on a later day, rather
              than only studying it once in one long block, is generally
              more effective than the total-hours number alone captures.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to use your result
            </h3>
            <p>
              Treat the hours-per-topic figure as a planning floor, not a
              strict budget — it tells you roughly how much runway
              you&apos;re working with, so you can decide whether to
              start sooner, trim your topic list, or accept a lighter
              pass on some material. If the number is comfortably above
              the advisory threshold, consider spreading a topic&apos;s
              hours across more than one day rather than studying it in a
              single sitting, since that spacing is what the research
              above associates with better retention.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Time allocation vs. total study load
            </h3>
            <p>
              This tool answers a narrower question than it might first
              seem to: given time you&apos;ve already decided to commit,
              how should it be divided. It doesn&apos;t answer the
              separate question of how much total study time a course or
              exam actually warrants, which depends on the subject,
              your existing familiarity with the material, and the
              exam&apos;s difficulty — factors too individual to reduce
              to a single formula. Use this calculator once you&apos;ve
              already estimated your total available hours; use your own
              judgment, a syllabus, or an instructor&apos;s guidance to
              decide what that total should be in the first place.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={STUDY_TIME_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
