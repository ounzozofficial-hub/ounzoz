import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { CalorieCalculator } from './components/CalorieCalculator';
import { RelatedTools } from './components/RelatedTools';
import { CALORIE_FAQ_ITEMS } from './faq-content';

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
        title="Calorie Calculator"
        description="Find your daily calorie target to lose, maintain, or gain weight, based on your TDEE."
        contentSlot={
          <ArticleLayout
            title="About the Calorie Calculator"
            sourceCitation="TDEE based on the Mifflin-St Jeor equation and standard activity multipliers; goal adjustment based on the standard ~3,500 kcal ≈ 1 lb energy-balance rule of thumb."
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
          </ArticleLayout>
        }
        faqSlot={<FAQ items={CALORIE_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
