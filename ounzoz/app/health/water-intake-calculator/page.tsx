import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { WaterIntakeCalculator } from './components/WaterIntakeCalculator';
import { RelatedTools } from './components/RelatedTools';
import { WATER_INTAKE_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/health/water-intake-calculator';

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
      name: 'Water Intake Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Health', href: '/health' },
  { name: 'Water Intake Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: WATER_INTAKE_FAQ_ITEMS.map((item) => ({
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
  name: 'Water Intake Calculator',
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

export default function WaterIntakeCalculatorPage() {
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

      <WaterIntakeCalculator
        breadcrumbItems={breadcrumbItems}
        title="Water Intake Calculator"
        description="Estimate how much water to drink daily based on your weight and activity level."
        contentSlot={
          <ArticleLayout
            title="About the Water Intake Calculator"
            sourceCitation="Baseline of 35 mL per kg of body weight per day is a widely used practical hydration guideline for healthy adults, broadly consistent with the U.S. National Academies of Medicine's 2004 Dietary Reference Intakes for total water. Activity-level adjustment reflects general fluid-replacement guidance (e.g. American College of Sports Medicine) rather than a single standardized figure. Thirst-as-guide and hyponatremia-risk framing per established sports-medicine hydration guidance."
          >
            <p>
              Staying properly hydrated supports nearly everything your
              body does — regulating temperature, cushioning joints,
              transporting nutrients, and keeping concentration and energy
              levels steady. But &quot;drink eight glasses a day&quot; is a
              one-size-fits-all rule that ignores the fact that a
              50&nbsp;kg person and a 100&nbsp;kg person don&apos;t need the
              same amount of water.
            </p>
            <p>
              This calculator uses a simple, weight-based baseline — about
              35&nbsp;mL of fluid per kilogram of body weight per day — a
              practical guideline commonly used for estimating healthy
              adult fluid needs, then adds an activity-level adjustment on
              top, since exercise increases fluid loss through sweat.
              Unlike calorie-burn formulas, there&apos;s no single
              universally standardized number for exactly how much extra
              fluid each activity level requires, so this adjustment is a
              practical estimate rather than a precise physiological
              calculation.
            </p>
            <p>
              The result shown is fluid/beverage intake specifically —
              it doesn&apos;t include the roughly 20% of daily water most
              people get from food. Treat this as a helpful daily target
              rather than a strict requirement: individual needs shift with
              climate, health conditions, and how your body responds, so
              adjust based on thirst, urine color, and how you feel rather
              than chasing the exact number.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Take someone who weighs 80 kg and is &quot;moderately
              active.&quot; The baseline is 35 mL per kg: 80 × 35 = 2,800
              mL, already a round number at this weight. The
              &quot;moderately active&quot; tier adds a flat 500 mL on
              top: 2,800 + 500 = 3,300 mL a day total. For the same person
              at &quot;sedentary,&quot; the bonus drops to 0, so the total
              is just the 2,800 mL baseline — a 500 mL/day difference
              driven entirely by activity level.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              More water isn&apos;t always better. It&apos;s true that
              chronic under-hydration is associated with worse health
              outcomes over time, but it&apos;s also possible to drink
              more than your kidneys can process, diluting sodium levels
              in the blood — a condition called hyponatremia. It&apos;s
              rare in normal daily life but well documented in endurance
              athletes who drink well beyond what their body is losing
              through sweat, which is why sports-medicine guidance
              generally recommends drinking to thirst during exercise
              rather than forcing down a fixed large volume.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              When the standard guideline needs adjusting
            </h3>
            <p>
              For most healthy adults, thirst is a genuinely reliable
              guide to hydration — the body&apos;s thirst mechanism is
              well-tuned to trigger fluid replacement as needed. That
              reliability breaks down in a few specific situations: older
              adults have a naturally blunted thirst sensation and can
              under-drink without feeling thirsty, people who are
              pregnant or breastfeeding have higher fluid needs than this
              general calculator accounts for, and hot or humid climates
              and intense or prolonged exercise can push real fluid
              losses well above what a flat activity-level bonus
              estimates. Anyone managing a kidney, heart, or liver
              condition that affects fluid balance should follow their
              doctor&apos;s specific guidance rather than this
              general-purpose estimate.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to use your result
            </h3>
            <p>
              Treat this number as a daily target to spread across the
              day rather than a volume to drink in a few large sittings —
              gradual intake is used more effectively by the body than
              the same total consumed all at once, which mostly just
              increases how often you urinate rather than improving
              hydration. Let thirst and urine color (pale yellow is the
              general target) guide day-to-day adjustments around this
              baseline instead of chasing the exact milliliter figure.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Fluid intake vs. total water intake
            </h3>
            <p>
              This calculator estimates fluid/beverage intake only.
              Total water intake — the figure used in formal nutrition
              guidelines like the National Academies&apos; Dietary
              Reference Intakes — also counts water from food, which
              typically supplies around 20% of the total for most people.
              That&apos;s why this tool&apos;s target is a beverage
              number, not a full daily water budget: comparing it
              directly to a &quot;total water&quot; figure from another
              source will make this one look lower than it should.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={WATER_INTAKE_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
