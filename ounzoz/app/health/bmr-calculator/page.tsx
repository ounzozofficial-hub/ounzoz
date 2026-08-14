import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { BMRCalculator } from './components/BMRCalculator';
import { RelatedTools } from './components/RelatedTools';
import { BMR_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/health/bmr-calculator';

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
      name: 'BMR Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Health', href: '/health' },
  { name: 'BMR Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: BMR_FAQ_ITEMS.map((item) => ({
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
  name: 'BMR Calculator',
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

export default function BMRCalculatorPage() {
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

      <BMRCalculator
        breadcrumbItems={breadcrumbItems}
        title="BMR Calculator"
        description="Calculate your Basal Metabolic Rate — the calories your body burns at complete rest."
        contentSlot={
          <ArticleLayout
            title="About the BMR Calculator"
            sourceCitation="Formula based on the Mifflin-St Jeor equation (Mifflin et al., 1990), recommended by the Academy of Nutrition and Dietetics over the older Harris-Benedict equation."
          >
            <p>
              Basal Metabolic Rate (BMR) is the number of calories your
              body needs each day just to keep itself running —
              breathing, circulating blood, repairing cells, and
              maintaining body temperature — with no movement or
              digestion included. It&apos;s the energy cost of simply
              being alive, measured at complete rest.
            </p>
            <p>
              This calculator uses the Mifflin-St Jeor equation,
              developed by Mifflin and St Jeor in 1990 and now the
              formula recommended by the Academy of Nutrition and
              Dietetics for most adults, having replaced the older
              Harris-Benedict equation from 1919. It calculates BMR
              from your weight, height, age, and sex, since sex affects
              the equation because men typically carry more lean muscle
              mass than women at the same weight and height, and muscle
              tissue burns more calories at rest than fat tissue does.
            </p>
            <p>
              Your BMR is a starting point, not your full calorie need.
              To find out how many calories you actually burn in a day,
              BMR gets multiplied by an activity factor that accounts
              for exercise, daily movement, and the energy your body
              spends digesting food — that total is called Total Daily
              Energy Expenditure (TDEE). Like any predictive formula,
              Mifflin-St Jeor gives a population-average estimate;
              individual factors like genetics, muscle mass, and
              hormone levels can shift your real BMR up or down from
              what&apos;s shown here.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Take a 30-year-old woman who weighs 65 kg and is 165 cm
              tall. The shared part of the formula first: 10 × 65 = 650,
              plus 6.25 × 165 = 1,031.25, minus 5 × 30 = 150. That&apos;s
              650 + 1,031.25 − 150 = 1,531.25. For women, the equation
              subtracts 161: 1,531.25 − 161 = 1,370.25, which rounds to a
              BMR of about 1,370 calories a day. For a man with the same
              weight, height, and age, the equation adds 5 instead:
              1,531.25 + 5 = 1,536.25, rounding to 1,536 — about 166
              calories higher, the entire size of the male/female
              difference in this formula.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Common mistakes when using your BMR
            </h3>
            <p>
              The biggest one is eating at or near your BMR number
              expecting fast weight loss. BMR only covers the energy your
              body needs lying still and unconscious — it doesn&apos;t
              include a single calorie for walking, working, digesting
              food, or exercising, so eating that little while living a
              normal day creates a much larger deficit than intended and
              isn&apos;t a sustainable target. BMR is also sometimes
              confused with RMR (Resting Metabolic Rate), a closely
              related but slightly higher number usually measured while
              awake that includes a small amount of digestion and arousal
              cost; the two get used interchangeably in everyday
              conversation, but they&apos;re measured under different
              conditions.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              When the equation is less reliable
            </h3>
            <p>
              Mifflin-St Jeor was built from a sample of 498 people
              spanning normal-weight and obese adults, and clinical
              comparisons against measured resting metabolic rate have
              found it predicts within ±10% for about 82% of subjects —
              noticeably better than the older Harris-Benedict
              equation&apos;s roughly 68% — which is why the Academy of
              Nutrition and Dietetics recommends it as the default choice
              absent direct measurement. Still, &quot;most people&quot;
              isn&apos;t &quot;everyone&quot;: prediction-equation studies
              consistently show lower accuracy in people with obesity than
              in people of average weight, and very muscular individuals
              can be underestimated too, since the formula only sees total
              weight and can&apos;t tell how much of it is lean muscle,
              which burns more at rest than fat tissue.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Turning BMR into a daily calorie plan
            </h3>
            <p>
              BMR by itself isn&apos;t a number to eat to — it&apos;s the
              foundation TDEE (Total Daily Energy Expenditure) is built
              on. TDEE multiplies BMR by an activity factor that accounts
              for movement, exercise, and digestion, and that larger
              number is what actually reflects how many calories you burn
              — and should generally aim to eat — across a full day. Use
              this BMR result as an input to a TDEE or calorie
              calculation, not as a daily target on its own.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Mifflin-St Jeor vs. Harris-Benedict
            </h3>
            <p>
              Harris-Benedict dates to 1919, built from calorimetry on 239
              subjects, and was revised once in 1984; it tends to run
              higher than modern equations for today&apos;s average body
              composition. Mifflin-St Jeor, published seven decades later
              in 1990 on a larger and more representative sample, replaced
              it as the preferred formula for healthy adults. Both
              estimate the same underlying quantity from similar inputs,
              but Mifflin-St Jeor&apos;s better fit to modern populations
              is why it&apos;s the formula this calculator — and most
              current clinical nutrition guidance — uses by default.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={BMR_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
