import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { TDEECalculator } from './components/TDEECalculator';
import { RelatedTools } from './components/RelatedTools';
import { TDEE_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/health/tdee-calculator';

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
      name: 'TDEE Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Health', href: '/health' },
  { name: 'TDEE Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: TDEE_FAQ_ITEMS.map((item) => ({
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
  name: 'TDEE Calculator',
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

export default function TDEECalculatorPage() {
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

      <TDEECalculator
        breadcrumbItems={breadcrumbItems}
        title="TDEE Calculator"
        description="Calculate your Total Daily Energy Expenditure — the calories you burn in a day including activity."
        contentSlot={
          <ArticleLayout
            title="About the TDEE Calculator"
            sourceCitation="BMR based on the Mifflin-St Jeor equation; activity multipliers from the standard scale commonly paired with it. Metabolic adaptation figures per Fothergill et al., 'Persistent metabolic adaptation 6 years after The Biggest Loser competition,' Obesity, 2016."
          >
            <p>
              Total Daily Energy Expenditure (TDEE) is the total number
              of calories your body burns in a day — your resting
              metabolism (BMR) plus everything on top of it: walking,
              exercise, digesting food, and even fidgeting. It&apos;s
              the number that actually determines whether you gain,
              lose, or maintain weight at a given calorie intake.
            </p>
            <p>
              This calculator first estimates your BMR using the
              Mifflin-St Jeor equation, then multiplies it by an
              activity multiplier based on how active you typically
              are — a scale commonly used alongside both the
              Mifflin-St Jeor and the older Harris-Benedict equations.
              Someone who&apos;s sedentary multiplies their BMR by 1.2,
              while someone doing hard exercise most days multiplies by
              as much as 1.9 — a difference that can mean several
              hundred extra calories burned per day.
            </p>
            <p>
              TDEE is your maintenance level: eating close to it keeps
              your weight roughly stable over time. Eating consistently
              below it tends to produce weight loss; eating above it
              tends to produce weight gain. Like BMR, TDEE is a
              population-average estimate, not a precise measurement of
              your individual metabolism — real day-to-day energy burn
              varies with sleep, stress, illness, and how accurately
              you&apos;ve judged your own activity level. Recalculate
              it periodically as your weight or routine changes, and
              treat it as a starting point for adjustment rather than a
              fixed target.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Take a 35-year-old man who weighs 80 kg, stands 180 cm tall,
              and is &quot;moderately active.&quot; His BMR works out to
              10 × 80 + 6.25 × 180 − 5 × 35 + 5 = 800 + 1,125 − 175 + 5 =
              1,755 calories a day. Multiply that by the &quot;moderately
              active&quot; multiplier of 1.55: 1,755 × 1.55 = 2,720.25,
              which rounds to a TDEE of about 2,720 calories a day. If the
              same person were sedentary instead, the multiplier drops to
              1.2: 1,755 × 1.2 = 2,106 — over 600 calories a day less,
              entirely from activity level, with body weight, height, and
              age unchanged.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              People often treat TDEE as a fixed number rather than a
              moving target. It&apos;s calculated from your current
              weight, so as you lose or gain weight, your TDEE shifts
              too — a person who&apos;s lost 10 kg burns meaningfully less
              at the same activity level than they did before, which is
              part of why weight loss tends to slow down even when the
              plan hasn&apos;t changed. It&apos;s also easy to overestimate
              your own activity tier: most people who exercise a few
              times a week but otherwise sit most of the day fall under
              &quot;lightly active,&quot; not &quot;moderately&quot; or
              &quot;very active,&quot; and picking too high a tier is the
              most common reason a TDEE estimate runs high.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Where the estimate breaks down
            </h3>
            <p>
              TDEE formulas assume metabolism responds in a simple, static
              way to weight change, but the body adapts. A widely cited
              2016 follow-up study of &quot;The Biggest Loser&quot;
              contestants, published in the journal Obesity, found that
              resting metabolic rate dropped by an average of 610
              calories a day by the end of the competition — and was
              still roughly 700 calories a day below the contestants&apos;
              original baseline six years later, even after most of the
              weight had been regained. This &quot;metabolic
              adaptation&quot; means a TDEE estimate calculated from your
              current stats can overstate how many calories you actually
              burn after a sustained diet, which is one reason long-term
              calorie targets often need real-world adjustment, not just
              formula math.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Using your TDEE
            </h3>
            <p>
              Treat TDEE as a starting estimate for your maintenance
              calories, then adjust based on what actually happens to
              your weight over 2–3 weeks of eating near that number. If
              your weight is drifting up or down at that intake, your
              real TDEE is different from the estimate — trust the trend
              on the scale over the formula. Recalculate periodically,
              especially after a meaningful weight change or a shift in
              your routine.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              TDEE vs. BMR
            </h3>
            <p>
              BMR is the calorie floor — what your body burns doing
              absolutely nothing. TDEE is the full picture, adding
              activity, exercise, and digestion on top of that floor. The
              gap between the two can be large: in the example above,
              activity alone accounts for nearly 1,000 of the 2,720 total
              calories. Use BMR to understand your baseline; use TDEE for
              anything related to actually planning what to eat.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={TDEE_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
