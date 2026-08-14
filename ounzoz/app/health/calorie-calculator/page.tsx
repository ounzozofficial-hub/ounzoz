import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { CalorieCalculator } from './components/CalorieCalculator';
import { RelatedTools } from './components/RelatedTools';
import { CALORIE_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/health/calorie-calculator';

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
      name: 'Calorie Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Health', href: '/health' },
  { name: 'Calorie Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: CALORIE_FAQ_ITEMS.map((item) => ({
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
  name: 'Calorie Calculator',
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

export default function CalorieCalculatorPage() {
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

      <CalorieCalculator
        breadcrumbItems={breadcrumbItems}
        title="Calorie Calculator"
        description="Find your daily calorie target to lose, maintain, or gain weight, based on your TDEE."
        contentSlot={
          <ArticleLayout
            title="About the Calorie Calculator"
            sourceCitation="TDEE based on the Mifflin-St Jeor equation and standard activity multipliers; goal adjustment based on the standard ~3,500 kcal ≈ 1 lb energy-balance rule of thumb. Critique of that rule per Hall, K.D. et al. (2011), the research underlying the NIH Body Weight Planner."
          >
            <p>
              A calorie target tells you how much to eat in a day to move
              toward a specific goal — losing weight, maintaining it, or
              gaining it — rather than just showing your maintenance
              number the way TDEE Calculator does. This calculator takes
              your Total Daily Energy Expenditure and applies a flat,
              standard adjustment on top of it: subtract 500 calories a
              day to lose weight, add 500 to gain, or leave it unchanged
              to maintain.
            </p>
            <p>
              That ±500 kcal/day figure comes from the widely used
              &quot;3,500 kcal ≈ 1 lb of body fat&quot; rule of thumb:
              500 kcal/day × 7 days ≈ 3,500 kcal/week, which is
              approximately one pound of weight change per week. It&apos;s
              a population-average approximation rather than a guarantee
              for any one person — real weight change is influenced by
              water retention, sleep, hormones, and how consistently the
              target is actually followed — but it&apos;s the same
              convention used across most consumer calorie calculators.
            </p>
            <p>
              Very low calorie targets can fall below what&apos;s
              generally considered a safe daily minimum. If your result
              lands under roughly 1,200 calories/day (women) or 1,500
              calories/day (men), this tool flags it directly on the
              result — without changing the number itself — as a signal
              to check with a healthcare provider before following it.
              Recalculate periodically as your weight, activity, or goal
              changes, since the target is only as accurate as the stats
              behind it.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Take a 35-year-old, 80 kg, 180 cm man, moderately active,
              with a TDEE of 2,720 calories a day. To lose weight, this
              calculator subtracts the standard 500 kcal/day: 2,720 − 500
              = 2,220 calories a day. To gain weight, it would add 500
              instead: 2,720 + 500 = 3,220. To maintain, the target is
              simply the TDEE itself, unchanged at 2,720.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              The &quot;500 calories = 1 lb a week&quot; math looks
              precise, but it&apos;s a simplification the research behind
              the NIH Body Weight Planner has specifically pushed back
              on. A 2011 analysis by Kevin Hall and colleagues found that
              the flat 3,500-kcal-per-pound rule ignores how resting
              metabolism and activity-related energy expenditure both
              shift as the body loses weight, which is why the rule tends
              to overpredict real-world weight loss — a sustained 500
              kcal/day deficit rarely produces a clean, linear pound-a-week
              loss all the way to goal. The rule remains useful as a
              simple starting estimate, which is why this calculator and
              most others still use it, but it&apos;s a rule of thumb, not
              a physical law.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Where a flat adjustment falls short
            </h3>
            <p>
              The same metabolic adaptation covered on TDEE
              Calculator&apos;s page applies directly here: as you lose
              weight, your TDEE — and therefore the real deficit a fixed
              intake creates — shrinks along with it, which is part of
              why weight loss commonly stalls even when intake
              hasn&apos;t changed. A calorie target calculated once from
              your starting stats will drift out of date the more weight
              you lose or gain, and very aggressive deficits (especially
              combined with high activity levels) can push a target below
              what&apos;s considered a safe daily minimum, which this tool
              flags directly on the result.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to use your target
            </h3>
            <p>
              Use the number as a starting point, then adjust based on
              results rather than sticking to it indefinitely without
              checking in. If your weight isn&apos;t moving the way your
              goal predicts after 2–3 weeks of consistent eating near the
              target, that&apos;s a signal to recalculate — using your
              updated current weight — rather than a sign you&apos;re
              doing something wrong. Prioritize consistency over
              precision: a target followed loosely most days beats a
              precise number followed perfectly for a week and abandoned
              the next.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Flat-adjustment vs. dynamic models
            </h3>
            <p>
              This calculator&apos;s ±500 kcal/day approach is a static,
              one-time calculation — simple to compute and explain, which
              is why it&apos;s the convention nearly every consumer
              calorie calculator uses. More sophisticated tools, like the
              NIH-backed Body Weight Planner, use a dynamic model that
              continuously adjusts its prediction as your weight and
              metabolism change over the course of a diet, generally
              producing more realistic long-term projections. For a
              single starting estimate, the static approach here is a
              reasonable, well-established convention; for tracking a
              multi-month weight-change plan in detail, a dynamic model
              will track reality more closely.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={CALORIE_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
