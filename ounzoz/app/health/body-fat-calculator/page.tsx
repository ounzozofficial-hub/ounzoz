import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { BodyFatCalculator } from './components/BodyFatCalculator';
import { RelatedTools } from './components/RelatedTools';
import { BODY_FAT_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/health/body-fat-calculator';

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
      name: 'Health',
      item: 'https://ounzoz.com/health',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Body Fat Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Health', href: '/health' },
  { name: 'Body Fat Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: BODY_FAT_FAQ_ITEMS.map((item) => ({
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
  name: 'Body Fat Calculator',
  applicationCategory: 'HealthApplication',
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

export default function BodyFatCalculatorPage() {
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

      <BodyFatCalculator
        breadcrumbItems={breadcrumbItems}
        title="Body Fat Calculator"
        description="Estimate your body fat percentage using the US Navy circumference method — just a tape measure needed."
        contentSlot={
          <ArticleLayout
            title="About the Body Fat Calculator"
            sourceCitation="US Navy circumference method (Hodgdon & Beckett, 1984, Naval Health Research Center); body fat categories per the American Council on Exercise (ACE). Accuracy/limitation figures per published comparisons against DEXA scanning."
          >
            <p>
              Body fat percentage tells you what portion of your body
              weight is fat versus everything else — muscle, bone, water,
              and organs. Unlike BMI, which only looks at weight relative
              to height, this measure directly reflects body composition,
              so two people with the same BMI can have very different
              body fat percentages depending on how much muscle they
              carry.
            </p>
            <p>
              This calculator uses the US Navy circumference method: a
              formula built from your height plus a few tape-measure
              readings (neck and waist for men; neck, waist, and hip for
              women). It was developed for the US Navy&apos;s own body
              composition standards specifically because it&apos;s
              accurate enough for practical use without calipers or a
              DEXA scan — just a flexible tape measure and a few
              centimeters of precision.
            </p>
            <p>
              Your result includes a category — Essential Fat, Athletic,
              Fitness, Average, or Obese — based on the American Council
              on Exercise&apos;s sex-specific classification bands. These
              are descriptive ranges, not a diagnosis: body fat naturally
              varies with age, training history, and genetics. For the
              most reliable trend over time, measure at the same time of
              day, in the same conditions, and track changes over weeks
              rather than reacting to any single reading.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Take a man who is 180 cm tall with a 38 cm neck and an 85 cm
              waist. The male formula uses waist minus neck: 85 − 38 = 47
              cm. Take the base-10 logarithm of that (log₁₀47 ≈ 1.6721)
              and of the height (log₁₀180 ≈ 2.2553), then plug both into
              the denominator: 1.0324 − 0.19077 × 1.6721 + 0.15456 ×
              2.2553 ≈ 1.0620. Divide 495 by that and subtract 450: 495 ÷
              1.0620 − 450 ≈ 16.1% body fat — landing in the
              &quot;Fitness&quot; category on the ACE scale (13.1–17% for
              men).
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              A single body fat percentage often gets read as more
              precise than it actually is. The Navy circumference method
              is generally within about 3–4% of a DEXA scan for people in
              the roughly 15–30% body fat range it was originally
              validated on — a real but imperfect level of agreement, not
              lab-grade precision. It&apos;s also easy to compare your
              number directly to someone else&apos;s without accounting
              for how differently fat is distributed between individuals —
              two people at the same body fat percentage can look quite
              different depending on where that fat sits.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Where the standard method is less reliable
            </h3>
            <p>
              The Navy method was developed and validated on a population
              resembling active-duty military personnel — generally fit,
              within a normal weight range, and mostly under 50 — so its
              accuracy drops for people well outside that profile. It
              tends to underestimate body fat in people with obesity, and
              can be thrown off by atypical fat distribution or unusually
              high muscle mass, since it infers body fat purely from a few
              circumference measurements rather than measuring tissue
              directly. DEXA scanning, by contrast, images bone, fat, and
              lean tissue separately and is accurate to within about
              1–2%, which is why it — not a tape-measure formula — is
              considered the clinical gold standard when precision
              genuinely matters.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to use your result
            </h3>
            <p>
              A single reading is less useful than a trend. Because the
              Navy method depends on precise circumference measurements,
              small differences in where or how snugly you place the tape
              can shift the result by a percentage point or two —
              measuring at the same time of day, in the same way, and
              tracking the number over weeks smooths out that noise and
              shows real change far more reliably than any one
              measurement.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Body fat vs. BMI
            </h3>
            <p>
              BMI and body fat percentage answer different questions from
              the same starting point. BMI only needs weight and height
              and says nothing about what that weight is made of; body
              fat percentage, estimated here from actual circumference
              measurements, describes body composition directly. Two
              people can share an identical BMI and land in very
              different body fat categories — which is exactly the gap
              this calculator is built to fill, particularly for anyone
              whose BMI reading doesn&apos;t match how they actually look
              or feel.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={BODY_FAT_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
