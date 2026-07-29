import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { StatisticsCalculator } from './components/StatisticsCalculator';
import { RelatedTools } from './components/RelatedTools';
import { STATISTICS_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/student/statistics-calculator';

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
      name: 'Statistics Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Student', href: '/student' },
  { name: 'Statistics Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: STATISTICS_FAQ_ITEMS.map((item) => ({
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
  name: 'Statistics Calculator',
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

export default function StatisticsCalculatorPage() {
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

      <StatisticsCalculator
        breadcrumbItems={breadcrumbItems}
        title="Statistics Calculator"
        description="Get the mean, median, mode, and standard deviation of a list of numbers — paste your data, see every result at once."
        contentSlot={
          <ArticleLayout
            title="About the Statistics Calculator"
            sourceCitation="Standard deviation is calculated as population standard deviation: σ = √(Σ(x − mean)² / n)."
          >
            <p>
              Whether you&apos;re working through a statistics homework
              set, summarizing a lab data set, or just trying to make
              sense of a list of numbers, the same four values usually
              come up first: the mean (average), the median (middle
              value), the mode (most common value), and the standard
              deviation (how spread out the values are). Calculating all
              four by hand for anything more than a handful of numbers is
              tedious and easy to get wrong — this tool does it instantly
              from a pasted list.
            </p>
            <p>
              Enter your numbers separated by commas, one per line, or
              with spaces — however you have them already. The mean and
              median are straightforward; the mode shows every value tied
              for most-frequent (or &quot;No mode&quot; if nothing
              repeats), rather than guessing at one. Standard deviation
              is calculated as the <em>population</em> standard
              deviation, dividing by the full count (n) rather than n − 1
              — the right choice when you&apos;re treating your entered
              numbers as the complete data set, not a sample used to
              estimate a larger population.
            </p>
            <p>
              This tool works with whatever numbers you give it — it
              doesn&apos;t know or assume anything about what they
              represent, so double-check that you&apos;ve entered the
              right data set before trusting the result for anything
              graded.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={STATISTICS_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
