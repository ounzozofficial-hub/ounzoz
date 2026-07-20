import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { BMRCalculator } from './components/BMRCalculator';
import { RelatedTools } from './components/RelatedTools';
import { BMR_FAQ_ITEMS } from './faq-content';

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
        title="BMR Calculator"
        description="Calculate your Basal Metabolic Rate — the calories your body burns at complete rest."
        contentSlot={
          <ArticleLayout
            title="About the BMR Calculator"
            sourceCitation="Formula based on the Mifflin-St Jeor equation, recommended by the Academy of Nutrition and Dietetics."
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
          </ArticleLayout>
        }
        faqSlot={<FAQ items={BMR_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
