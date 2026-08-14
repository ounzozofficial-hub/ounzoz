import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { IdealWeightCalculator } from './components/IdealWeightCalculator';
import { RelatedTools } from './components/RelatedTools';
import { IDEAL_WEIGHT_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/health/ideal-weight-calculator';

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
      name: 'Ideal Weight Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Health', href: '/health' },
  { name: 'Ideal Weight Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: IDEAL_WEIGHT_FAQ_ITEMS.map((item) => ({
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
  name: 'Ideal Weight Calculator',
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

export default function IdealWeightCalculatorPage() {
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

      <IdealWeightCalculator
        breadcrumbItems={breadcrumbItems}
        title="Ideal Weight Calculator"
        description="Estimate your ideal body weight from your height and sex using the Devine formula."
        contentSlot={
          <ArticleLayout
            title="About the Ideal Weight Calculator"
            sourceCitation="Devine, B.J. (1974). 'Gentamicin therapy.' Drug Intelligence & Clinical Pharmacy, 8, 650–655. Frame-size comparison per Hamwi, G.J. (1964), 'Therapy: changing dietary concepts,' in Diabetes Mellitus: Diagnosis and Treatment, American Diabetes Association."
          >
            <p>
              Ideal body weight is a reference figure — a single estimate
              of what a person&apos;s weight would be, based purely on
              height and sex, without factoring in their actual current
              weight, muscle mass, or frame size. It&apos;s a starting
              point for comparison, not a target to force yourself toward.
            </p>
            <p>
              This calculator uses the Devine formula, originally
              developed in 1974 to help clinicians estimate a
              patient&apos;s weight for calculating accurate drug dosages
              (like the antibiotic gentamicin, where dosing by actual body
              weight can be misleading in people who carry a lot of extra
              fat or fluid). It has since become the most widely
              referenced reference-weight formula in clinical practice —
              more commonly cited than alternatives like the Robinson,
              Miller, or Hamwi formulas. It sets a base weight at 5 feet
              tall (50 kg for men, 45.5 kg for women) and adds 2.3 kg for
              every inch above that.
            </p>
            <p>
              Because the formula only uses height and sex, it doesn&apos;t
              know anything about your actual body composition — a
              muscular, athletic person will often weigh noticeably more
              than their &quot;ideal weight&quot; here while being
              perfectly healthy. For a fuller picture, use this alongside
              BMI or Body Fat Calculator rather than treating this number
              in isolation.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Take a man who is 170 cm tall. Convert to inches: 170 ÷ 2.54
              ≈ 66.93 in. The Devine formula starts at 50 kg for 5 feet
              (60 inches) and adds 2.3 kg per inch above that: 50 + 2.3 ×
              (66.93 − 60) = 50 + 2.3 × 6.93 ≈ 65.9 kg. For a woman at the
              same height, the base is 45.5 kg instead of 50: 45.5 + 2.3 ×
              6.93 ≈ 61.4 kg — a 4.5 kg difference from the male result,
              entirely from the formula&apos;s starting constant.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              The word &quot;ideal&quot; makes this sound like a target to
              hit, but the formula was never built for that purpose — it
              was created in 1974 specifically to help clinicians estimate
              drug dosages, like the antibiotic gentamicin, in situations
              where dosing by actual body weight could be misleading.
              Being above or below your &quot;ideal weight&quot; here says
              nothing on its own about your health; it&apos;s a
              population-level reference figure, not a personal goal.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              What the formula doesn&apos;t account for
            </h3>
            <p>
              Devine&apos;s formula only ever needs two inputs — height
              and sex — which means it has no way to know anything about
              your build. An earlier formula, developed by G.J. Hamwi in
              1964 and one of Devine&apos;s own starting points a decade
              later, addressed this partially by letting clinicians
              adjust the result up or down by about 10% for a small or
              large body frame — an adjustment Devine&apos;s version
              dropped entirely. Because of that, a naturally large-framed
              or heavily muscled person will often weigh well above this
              number while being perfectly healthy, and a small-framed
              person may sit comfortably below it.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to use this number
            </h3>
            <p>
              Use it as one reference point among several, not a number
              to chase. It&apos;s most useful as a rough sanity check — is
              your actual weight in the same general neighborhood as this
              estimate, or meaningfully different in a way worth
              understanding — rather than as a precise target. If your
              weight sits well outside this figure, body composition
              tools like Body Fat Calculator or BMI Calculator, alongside
              a conversation with a doctor, will tell you far more than
              this number alone.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Ideal weight vs. BMI&apos;s healthy range
            </h3>
            <p>
              BMI Calculator gives you a healthy weight range for your
              height — an entire band, since BMI&apos;s 18.5–24.9
              &quot;normal&quot; category spans a wide range of individual
              weights. Ideal Weight Calculator instead gives a single
              reference figure with no range at all. The two will usually
              overlap loosely, but they&apos;re built differently — BMI&apos;s
              range comes from population health-outcome data, while the
              Devine formula&apos;s single figure comes from a clinical
              dosing convention — so don&apos;t be surprised if they
              don&apos;t point to exactly the same number.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={IDEAL_WEIGHT_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
