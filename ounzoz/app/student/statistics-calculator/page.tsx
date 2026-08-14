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
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Take seven exam scores: 72, 85, 90, 78, 85, 91, 68. The
              mean is the sum (569) divided by the count (7): 569 ÷ 7 =
              81.29. Sorted, the list reads 68, 72, 78, 85, 85, 90, 91;
              the middle value (4th of 7) is the median, 85. The value
              85 also appears twice while every other value appears
              once, making 85 the mode. For the standard deviation,
              average the squared distance of every value from the mean
              (81.29), then take the square root of that average — which
              works out to about 8.21 for this data set.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              Mean and median often get treated as interchangeable, but
              they respond very differently to outliers. Replace the
              lowest score above (68) with a single very low outlier,
              like 10, and the mean drops noticeably — down to 73.0
              — while the median barely moves, since it only cares
              about which value sits in the middle, not how far away the
              extreme values are. When a data set has extreme outliers or
              a skewed shape, the median usually describes the
              “typical” value better than the mean does.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Population vs. sample standard deviation
            </h3>
            <p>
              This calculator computes population standard deviation —
              dividing the summed squared deviations by n, the full
              count — which is the correct choice when your numbers are
              the entire data set you care about, like every quiz score
              in a specific class. If your numbers are instead a sample
              meant to estimate a larger population (say, 30 surveyed
              students standing in for an entire school), the standard
              convention divides by n − 1 instead of n — a small
              correction, known as Bessel&apos;s correction, that
              compensates for a sample&apos;s tendency to slightly
              underestimate the true population spread. The two formulas
              converge as the data set gets larger, but for small
              samples the difference is meaningful, so it&apos;s worth
              knowing which one your course expects.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to read your result
            </h3>
            <p>
              Look at mean and standard deviation together, not the mean
              alone — two data sets can share the same mean while looking
              completely different, one tightly clustered and one
              widely scattered, and the standard deviation is what
              distinguishes them. A small standard deviation relative to
              the mean means your values sit close together; a large one
              means they&apos;re spread out, which is worth knowing before
              you treat the mean as representative of the whole set.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Standard deviation vs. range
            </h3>
            <p>
              Range — the highest value minus the lowest — is the
              simplest possible measure of spread, but it only looks at
              two data points and ignores everything in between; a
              single unusually high or low value can make the range
              look large even if most of the data is tightly clustered.
              Standard deviation uses every value in the data set, so it
              gives a more complete picture of how spread out the
              numbers typically are, at the cost of being more work to
              compute by hand — exactly the tradeoff this calculator is
              built to remove.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={STATISTICS_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
