import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { MacroCalculator } from './components/MacroCalculator';
import { RelatedTools } from './components/RelatedTools';
import { MACRO_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/health/macro-calculator';

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
      name: 'Macro Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Health', href: '/health' },
  { name: 'Macro Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: MACRO_FAQ_ITEMS.map((item) => ({
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
  name: 'Macro Calculator',
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

export default function MacroCalculatorPage() {
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

      <MacroCalculator
        breadcrumbItems={breadcrumbItems}
        title="Macro Calculator"
        description="Find your daily protein, fat, and carbohydrate targets based on your calorie goal and activity level."
        contentSlot={
          <ArticleLayout
            title="About the Macro Calculator"
            sourceCitation="Protein target based on the U.S./Canada Dietary Reference Intakes and sports-nutrition activity guidance; fat target based on the Institute of Medicine's 20–35% Acceptable Macronutrient Distribution Range (AMDR); calorie split uses standard Atwater factors (4/9/4 kcal per gram)."
          >
            <p>
              A calorie target alone doesn&apos;t say what to actually eat —
              it just says how much energy to take in. Macro Calculator
              takes your daily calorie target and splits it into the three
              macronutrients that make it up: protein, fat, and
              carbohydrates, each measured in grams per day rather than
              calories, since that&apos;s how most nutrition labels and
              food tracking apps report them.
            </p>
            <p>
              Protein is calculated first, directly from your body weight
              and activity level — the same approach Protein Intake
              Calculator uses, since protein needs are driven by weight and
              training load rather than by how many calories you&apos;re
              eating. Fat is then set at 30% of your total calories, a
              practical midpoint within the commonly cited 20–35% range for
              dietary fat. Whatever calories remain after protein and fat
              are accounted for become your carbohydrate target.
            </p>
            <p>
              Because protein and fat are set first, an unusually low
              calorie target combined with a high activity level can leave
              little or no room for carbohydrates — this calculator flags
              that case rather than ever showing a negative or broken carb
              number. Recalculate whenever your weight, activity level, or
              calorie goal changes, since every macro here is derived from
              those inputs.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Say your calorie target works out to 2,400 calories a day,
              you weigh 80 kg, and you&apos;re in the &quot;moderately
              active&quot; tier (1.4 g of protein per kg). Protein comes
              first: 80 × 1.4 = 112 g of protein, which is 112 × 4 = 448
              calories. Fat is next, at 30% of the total: 2,400 × 0.30 =
              720 calories, or 720 ÷ 9 = 80 g of fat. Whatever&apos;s left
              becomes carbohydrate: 2,400 − 448 − 720 = 1,232 calories
              remaining, or 1,232 ÷ 4 = 308 g of carbs. Those three
              totals — 112 g protein, 80 g fat, 308 g carbs — are what the
              result panel would show for these inputs.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              People often assume macro splits are fixed universal
              ratios — &quot;everyone should eat 40/30/30&quot; or
              similar — but the Institute of Medicine&apos;s Acceptable
              Macronutrient Distribution Range (AMDR) sets wide bands on
              purpose: 10–35% of calories from protein, 20–35% from fat,
              and 45–65% from carbohydrate for adults, because no single
              ratio is correct for every person and goal. This calculator
              doesn&apos;t split by three fixed percentages at all —
              protein is set from your weight and activity level first
              (the same way Protein Intake Calculator computes it), fat is
              set as a percentage of calories, and carbs absorb whatever
              is left, which produces a different gram breakdown for a 60
              kg sedentary person than a 90 kg athlete even at the same
              calorie target.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              When the standard split doesn&apos;t apply
            </h3>
            <p>
              Very low-carbohydrate or ketogenic approaches deliberately
              sit outside the AMDR&apos;s carbohydrate range, restricting
              carbs well below 45% of calories on purpose — a legitimate
              dietary pattern some people choose, but a different goal
              than what this calculator&apos;s default fat-then-carb logic
              targets. On the other end, a low calorie target paired with
              a high activity level (and therefore a high protein
              requirement) can leave little or no calorie room for
              carbohydrates once protein and fat are both accounted for —
              this calculator flags that combination rather than showing a
              broken or negative number, and it&apos;s a sign the calorie
              target may be too aggressive for that activity level rather
              than a bug in the math.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Using your macros day to day
            </h3>
            <p>
              Grams per day are a target to aim for across the whole day,
              not a quota to hit in a single sitting. Protein is worth
              tracking most closely since it&apos;s the macro most often
              under-eaten and most tied to your activity level; fat and
              carbs matter more as a rough weekly balance than an exact
              daily number, since the two are somewhat interchangeable as
              energy sources day to day.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              AMDR ranges vs. this calculator&apos;s approach
            </h3>
            <p>
              The AMDR itself doesn&apos;t prescribe grams — it&apos;s a
              percentage-of-calories range designed to apply across a
              population with very different body sizes. This calculator
              translates that population-level guidance into a personal
              number by anchoring protein to body weight (a more
              individualized starting point than a flat percentage) and
              letting fat and carbs fill out the calorie total. Both
              approaches are valid; this one is simply built to hand you
              specific grams to track rather than percentages to convert
              yourself.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={MACRO_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
