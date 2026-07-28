import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { PregnancyDueDateCalculator } from './components/PregnancyDueDateCalculator';
import { RelatedTools } from './components/RelatedTools';
import { PREGNANCY_DUE_DATE_FAQ_ITEMS } from './faq-content';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/health/pregnancy-due-date-calculator';

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
      name: 'Pregnancy Due Date Calculator',
      item: TOOL_URL,
    },
  ],
};

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: PREGNANCY_DUE_DATE_FAQ_ITEMS.map((item) => ({
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
  name: 'Pregnancy Due Date Calculator',
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
// adding HowTo to a tool page just because it's a calculator. No
// MedicalWebPage/MedicalRiskCalculator schema either — this is a
// planning estimate for a healthy pregnancy timeline, not medical
// diagnostic content, and Section 5's core rule is that schema reflects
// actual content only.

export default function PregnancyDueDateCalculatorPage() {
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

      <PregnancyDueDateCalculator
        title="Pregnancy Due Date Calculator"
        description="Estimate your due date from the first day of your last menstrual period, using Naegele's Rule."
        contentSlot={
          <ArticleLayout
            title="About the Pregnancy Due Date Calculator"
            sourceCitation="Estimate based on Naegele's Rule (LMP + 280 days / 40 weeks), the standard method cited by ACOG (American College of Obstetricians and Gynecologists) and the NHS. Trimester boundaries per the same ACOG guidance."
          >
            <p>
              This calculator estimates your due date using Naegele&apos;s
              Rule: the first day of your last menstrual period (LMP),
              plus 280 days, or 40 weeks. It&apos;s the same standard
              method used by most healthcare providers as a first
              estimate, based on the assumption of a typical 28-day
              menstrual cycle with ovulation occurring around day 14.
            </p>
            <p>
              Alongside your estimated due date, the result also shows
              how far along you currently are — in completed weeks and
              days — and which trimester that falls in, using the
              standard boundaries of weeks 1–13 (first trimester), 14–27
              (second trimester), and 28 onward (third trimester).
            </p>
            <p>
              This is important to understand:{' '}
              <strong>this tool provides an estimate, not a medical
              diagnosis or a guaranteed birth date.</strong> Naegele&apos;s
              Rule assumes a regular 28-day cycle, so if your cycle is
              longer, shorter, or irregular, your actual due date may
              differ from this calculation by more than a few days. A
              first-trimester ultrasound, performed by a healthcare
              provider, is generally considered more accurate than an
              LMP-based estimate and should take priority if the two
              disagree. Use this calculator as a general planning
              reference, and confirm your due date with a doctor or
              midwife.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={PREGNANCY_DUE_DATE_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
