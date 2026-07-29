import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { GradeCalculator } from './components/GradeCalculator';
import { RelatedTools } from './components/RelatedTools';
import { GRADE_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/student/grade-calculator';

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
      name: 'Grade Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Student', href: '/student' },
  { name: 'Grade Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: GRADE_FAQ_ITEMS.map((item) => ({
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
  name: 'Grade Calculator',
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

export default function GradeCalculatorPage() {
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

      <GradeCalculator
        breadcrumbItems={breadcrumbItems}
        title="Grade Calculator"
        description="Calculate your overall course grade from weighted categories like homework, quizzes, and exams."
        contentSlot={
          <ArticleLayout
            title="About the Grade Calculator"
            sourceCitation="Calculated using the standard weighted-category grade formula every syllabus that splits grading into categories (homework, quizzes, exams, etc.) uses, mapped to the common 90/80/70/60 US letter-grade scale. Exact category weights and letter-grade cutoffs vary by course — check your syllabus for your instructor's specific breakdown."
          >
            <p>
              Most courses don&apos;t grade everything the same way — a
              final exam usually counts for more than a single homework
              assignment. This calculator handles that by letting you
              enter each grading category separately, along with how much
              it&apos;s worth, and combining them into one overall grade.
            </p>
            <p>
              The math is a weighted average: multiply each category&apos;s
              score by its weight, add those up, and divide by the total
              weight. Entering Homework at 20% with a 90% score and a
              Final Exam at 80% with a 75% score, for example, weighs the
              exam four times as heavily as the homework in your final
              number — which matches how your instructor is actually
              grading you.
            </p>
            <p>
              You don&apos;t need your weights to add up to exactly 100%
              to get a useful number. If you&apos;ve only got grades back
              for some categories so far, enter just those — the
              calculator normalizes by whatever total weight you&apos;ve
              entered, and shows that total so you can see how much of
              your final grade it actually represents.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={GRADE_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
