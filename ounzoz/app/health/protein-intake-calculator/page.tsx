import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { ProteinIntakeCalculator } from './components/ProteinIntakeCalculator';
import { RelatedTools } from './components/RelatedTools';
import { PROTEIN_INTAKE_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/health/protein-intake-calculator';

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
      name: 'Protein Intake Calculator',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Health', href: '/health' },
  { name: 'Protein Intake Calculator' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: PROTEIN_INTAKE_FAQ_ITEMS.map((item) => ({
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
  name: 'Protein Intake Calculator',
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

export default function ProteinIntakeCalculatorPage() {
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

      <ProteinIntakeCalculator
        breadcrumbItems={breadcrumbItems}
        title="Protein Intake Calculator"
        description="Estimate your daily protein target based on your weight and activity level."
        contentSlot={
          <ArticleLayout
            title="About the Protein Intake Calculator"
            sourceCitation="Sedentary baseline (0.8 g/kg) is the RDA per the U.S./Canada Dietary Reference Intakes (National Academies of Medicine, 2005). Higher activity levels (1.2–2.0 g/kg) reflect the general range cited in sports nutrition literature, e.g. the International Society of Sports Nutrition's position stand (Jäger et al., 2017) — a practical range, not a single precise figure."
          >
            <p>
              Protein needs aren&apos;t the same for everyone — how much
              your body actually needs depends heavily on body weight and
              how physically active you are. This calculator estimates a
              daily protein target by combining your weight with your
              activity level, scaling up from the standard baseline as
              activity increases.
            </p>
            <p>
              The sedentary figure — 0.8 grams of protein per kilogram of
              body weight — is the RDA (Recommended Dietary Allowance)
              set by the U.S./Canada Dietary Reference Intakes. It&apos;s
              a precisely established number designed to meet the needs of
              nearly all healthy, largely inactive adults, and it&apos;s
              the most solidly backed figure this calculator uses.
            </p>
            <p>
              For anyone more active, protein needs rise — exercise,
              especially strength training, creates muscle damage that
              the body repairs using protein. Sports nutrition research
              generally supports higher intakes for active individuals,
              commonly citing a range of roughly 1.2 to 2.0 grams per
              kilogram depending on training intensity and goals. Unlike
              the RDA, there&apos;s no single universally agreed number
              within that range — this calculator uses a practical,
              gradually increasing scale across activity levels rather
              than one precisely cited figure per tier, and the FAQ below
              explains that distinction in more detail.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={PROTEIN_INTAKE_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
