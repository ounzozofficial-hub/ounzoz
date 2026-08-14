import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { BMICalculator } from './components/BMICalculator';
import { RelatedTools } from './components/RelatedTools';
import { BMI_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/health/bmi-calculator';

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema below
// (same Home / Health / BMI Calculator path) but as on-screen UI.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Health', href: '/health' },
  { name: 'BMI Calculator' },
];

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
      name: 'BMI Calculator',
      item: TOOL_URL,
    },
  ],
};

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below
// (schema must match visible content, never diverge from it).
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: BMI_FAQ_ITEMS.map((item) => ({
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
  name: 'BMI Calculator',
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

export default function BMICalculatorPage() {
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

      <BMICalculator
        breadcrumbItems={breadcrumbItems}
        title="BMI Calculator"
        description="Calculate your Body Mass Index and see which WHO weight category you fall into."
        contentSlot={
          <ArticleLayout
            title="About the BMI Calculator"
            sourceCitation="Formula and category thresholds based on the World Health Organization's BMI standard. Limitations noted per the CDC's guidance on BMI as a screening tool, and per the WHO Expert Consultation on BMI in Asian populations (The Lancet, 2004)."
          >
            <p>
              Body Mass Index (BMI) is a simple screening measurement
              that relates your weight to your height, giving a quick
              indication of whether you fall into an underweight,
              healthy weight, overweight, or obese range. It doesn&apos;t
              measure body fat directly, but for most adults it
              correlates closely enough with body fat to be useful as a
              fast first check.
            </p>
            <p>
              This calculator uses the World Health Organization&apos;s
              standard BMI formula: weight in kilograms divided by
              height in meters squared (kg/m²). The WHO&apos;s
              classification is also what sets the category thresholds
              shown with your result — under 18.5 is underweight, 18.5
              to 24.9 is a normal weight, 25 to 29.9 is overweight, and
              30 and above is obese.
            </p>
            <p>
              BMI is a population-level screening tool, not a
              diagnosis. It doesn&apos;t distinguish between muscle and
              fat, so a very muscular person can register as
              &quot;overweight&quot; despite having low body fat, and
              an older adult with reduced muscle mass can register as
              &quot;normal&quot; despite having a higher proportion of
              fat. It also doesn&apos;t account for where fat is
              distributed on the body, which matters for health risk.
              If your BMI falls outside the normal range, or you have
              concerns about your weight more broadly, talk to a
              doctor — they can look at the full picture, not just one
              number.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Say you weigh 70 kg and stand 175 cm tall. Convert height to
              meters: 175 cm = 1.75 m. Square it: 1.75 × 1.75 = 3.0625.
              Divide weight by that: 70 ÷ 3.0625 = 22.86, which rounds to a
              BMI of 22.9 — inside the WHO&apos;s 18.5–24.9 &quot;normal
              weight&quot; band. That&apos;s the same three-step
              calculation — convert, square, divide — this calculator runs
              on your own numbers.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Common mistakes when reading your result
            </h3>
            <p>
              The most common misreading is treating BMI as a diagnosis
              rather than a screening number — the CDC is explicit that
              BMI is a screening tool, not a direct measure of body fat or
              a determination of individual health. A &quot;normal&quot;
              BMI doesn&apos;t guarantee good metabolic health, and an
              &quot;overweight&quot; BMI doesn&apos;t automatically mean
              poor health; both are starting points for a fuller
              conversation, not conclusions on their own. It&apos;s also
              easy to over-read small movements: because the formula only
              uses weight and height, day-to-day fluctuations from water
              retention or food volume can nudge the number without
              reflecting any real change in body composition.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              When the standard formula doesn&apos;t fit well
            </h3>
            <p>
              BMI can&apos;t tell fat and muscle apart — a pound of muscle
              and a pound of fat weigh the same, so the formula treats
              them identically even though muscle is denser and takes up
              less space. This is why very muscular people and trained
              athletes often land in the &quot;overweight&quot; or
              &quot;obese&quot; range despite having low body fat; the CDC
              lists this directly as one of BMI&apos;s known limitations.
              The reverse also happens: older adults who have lost muscle
              mass with age can score &quot;normal&quot; while carrying a
              higher proportion of body fat than a younger person at the
              same BMI. Population matters too — a 2004 WHO expert
              consultation, published in The Lancet, found that Asian
              populations tend to face higher health risks at lower BMI
              values than the standard cutoffs suggest, and WHO added
              supplementary reference points (23.0, 27.5, 32.5, and 37.5
              kg/m²) for public health use in those populations alongside
              the general classification.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              What to do with your number
            </h3>
            <p>
              Use a single BMI reading as one input, not the whole
              picture. It&apos;s most useful tracked as a trend over
              months — alongside how your clothes fit and how you feel —
              rather than treated as a single precise figure. If your BMI
              is outside the normal range, or you have questions about
              what it means for you personally, that&apos;s a conversation
              for a doctor, who can weigh it against your muscle mass,
              waist circumference, family history, and overall health
              rather than the number in isolation.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              BMI vs. body fat percentage
            </h3>
            <p>
              BMI and body fat percentage measure different things. BMI is
              a ratio of weight to height that&apos;s fast to calculate
              from two numbers anyone can measure at home; body fat
              percentage measures what portion of your weight is actually
              fat, typically via skinfold calipers, bioelectrical
              impedance scales, or a DEXA scan. BMI is a reasonable
              population-level screening tool precisely because it&apos;s
              so easy to obtain, but body fat percentage is the more
              direct measurement when muscle mass is unusually high or
              low — exactly the situation where BMI is least reliable, per
              the special cases above.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={BMI_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
