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
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Say your syllabus splits grading into Homework (20%,
              currently at 90%), Quizzes (30%, currently at 82%), and a
              Final Exam (50%, currently at 75%). Multiply each score by
              its weight: 90 × 20 = 1,800, 82 × 30 = 2,460, and 75 × 50
              = 3,750, for a total of 8,010. Divide by the total weight
              (20 + 30 + 50 = 100): 8,010 ÷ 100 = 80.1% — which lands
              in the B range (80–89.9%) on this calculator&apos;s standard
              letter-grade scale.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              It&apos;s easy to assume a simple average of your category
              scores tells you your grade, but a plain average treats a
              5%-weighted homework category the same as a 40%-weighted
              final exam — which isn&apos;t how weighted grading actually
              works. In the worked example above, a plain average of 90,
              82, and 75 would give 82.3%, noticeably higher than the
              correct 80.1% weighted result, because it ignores that the
              lowest score (the final) carries the most weight. Always
              use the weighted formula when your syllabus assigns
              different weights to different categories.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Special cases this calculator doesn&apos;t model
            </h3>
            <p>
              Many syllabi include policies this calculator doesn&apos;t
              apply automatically: dropping your lowest quiz or homework
              score, offering extra credit that pushes a category above
              100%, or curving a category&apos;s scores after the fact. If
              your course drops a low score, leave that specific
              assignment out of your average for that category before
              entering it here; if a category includes extra credit,
              enter the resulting score even if it&apos;s above 100 — the
              calculator accepts any score up to 100, so extra credit
              needs to be folded into that number first. Letter-grade
              cutoffs are another common variation: some instructors set
              the A cutoff at 93 rather than 90, or add +/- letter grades,
              so check your syllabus rather than assuming this
              calculator&apos;s 90/80/70/60 scale is your instructor&apos;s
              exact scale.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to use your result
            </h3>
            <p>
              Use this calculator as a running checkpoint throughout the
              term, not just a final tally — entering only the
              categories you have grades for shows you exactly how much
              of your final grade is still undecided. It&apos;s also
              useful for “what-if” planning: if you know your current
              categories and their weights, you can test different
              scores for a category you haven&apos;t completed yet (like
              an upcoming final) to see what you&apos;d need to reach a
              target overall grade.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Course grade vs. GPA
            </h3>
            <p>
              This tool and GPA Calculator solve related but distinct
              problems. This one averages weighted categories within a
              single course to estimate that course&apos;s overall
              percentage and letter grade. GPA Calculator takes finished
              letter grades from multiple courses and averages them,
              weighted by credit hours, into one cumulative number. In
              practice they chain together: this calculator&apos;s letter
              grade for one course becomes a single input row in a GPA
              calculation once the term is over.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={GRADE_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
