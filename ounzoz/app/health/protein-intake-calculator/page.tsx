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
            sourceCitation="Sedentary baseline (0.8 g/kg) is the RDA per the U.S./Canada Dietary Reference Intakes (National Academies of Medicine, 2005), corroborated by the WHO/FAO/UNU's 0.83 g/kg safe intake level (WHO Technical Report Series 935, 2007). Higher activity levels (1.2–2.0 g/kg) reflect the general range cited in sports nutrition literature, e.g. the International Society of Sports Nutrition's position stand (Jäger et al., 2017) — a practical range, not a single precise figure."
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
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Say you weigh 80 kg and select &quot;moderately active.&quot;
              This calculator&apos;s table sets 1.4 g of protein per kg of
              body weight at that tier, so 80 × 1.4 = 112 g of protein per
              day — the exact calculation the result panel runs on your
              own weight and activity selection. Change only the activity
              level to &quot;sedentary&quot; (0.8 g/kg) with the same 80 kg
              body weight, and the target drops to 80 × 0.8 = 64 g/day —
              the same body, a very different number, entirely because of
              activity level.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              More protein isn&apos;t automatically better once
              you&apos;re already above your target — protein needs have a
              practical ceiling tied to activity level and goals, not an
              &quot;always higher is better&quot; curve. It&apos;s also
              easy to conflate two different global figures: the
              U.S./Canada Dietary Reference Intakes set the RDA at 0.8
              g/kg, while a 2007 joint WHO/FAO/UNU expert report (WHO
              Technical Report Series 935) set a very similar &quot;safe
              intake&quot; of 0.83 g/kg for the same sedentary baseline —
              two independent expert bodies landing within 0.03 g/kg of
              each other. That closeness is a sign the sedentary figure is
              genuinely well-established, not that one of the two numbers
              is wrong.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Special cases the standard range doesn&apos;t fully cover
            </h3>
            <p>
              The 1.2–2.0 g/kg activity-tiered range on this calculator
              reflects general training; it doesn&apos;t account for
              active weight loss. The International Society of Sports
              Nutrition&apos;s position stand notes that during a calorie
              deficit, resistance-trained individuals may need
              substantially more — 2.3 to 3.1 g/kg — to help protect
              muscle mass while losing fat, meaningfully above what this
              calculator&apos;s &quot;active&quot; or &quot;very
              active&quot; tiers estimate. The same position stand also
              found that spreading protein across the day in doses of
              roughly 20–25 g every few hours supports muscle protein
              synthesis better than concentrating the same daily total
              into one or two large meals — so how your total is
              distributed across meals matters, not just the total
              itself.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to use your target
            </h3>
            <p>
              Treat the number as a daily total to build meals toward, not
              a threshold to hit exactly every single day — a day or two
              below target rarely matters if your weekly average lands
              near it. If you&apos;re actively trying to lose weight while
              preserving muscle, or you&apos;re a resistance-trained
              athlete in a calorie deficit, the special case above is
              worth discussing with a coach or dietitian, since this
              calculator&apos;s tiers are built for general activity
              levels, not deficit-specific needs.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Comparing the sources behind this number
            </h3>
            <p>
              The sedentary baseline (0.8 g/kg) is the most rigorously
              established figure here, set by the Institute of
              Medicine&apos;s Dietary Reference Intakes and independently
              corroborated by the WHO/FAO/UNU&apos;s 0.83 g/kg safe intake
              level. The higher, activity-scaled tiers (1.2–2.0 g/kg) rest
              on a different kind of evidence — sports nutrition research
              showing protein needs rise with training load, without one
              single number the field agrees is exactly correct. Both are
              legitimate, sourced figures; they just carry different
              degrees of precision, which is why this calculator presents
              the sedentary number as a firm RDA and the higher tiers as a
              practical range.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={PROTEIN_INTAKE_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
