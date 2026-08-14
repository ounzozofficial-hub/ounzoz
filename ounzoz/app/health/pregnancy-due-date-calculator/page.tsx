import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { PregnancyDueDateCalculator } from './components/PregnancyDueDateCalculator';
import { RelatedTools } from './components/RelatedTools';
import { PREGNANCY_DUE_DATE_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

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

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Health', href: '/health' },
  { name: 'Pregnancy Due Date Calculator' },
];

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
        breadcrumbItems={breadcrumbItems}
        title="Pregnancy Due Date Calculator"
        description="Estimate your due date from the first day of your last menstrual period, using Naegele's Rule."
        contentSlot={
          <ArticleLayout
            title="About the Pregnancy Due Date Calculator"
            sourceCitation="Estimate based on Naegele's Rule (LMP + 280 days / 40 weeks), per ACOG Committee Opinion No. 700, 'Methods for Estimating the Due Date' (2017). Twin gestational-length guidance per the same ACOG source; due-date framing per Mayo Clinic."
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
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Say the first day of your last menstrual period was March 1.
              Naegele&apos;s Rule adds 280 days (40 weeks) to that date:
              March 1 plus 280 days lands on December 6 — the estimated
              due date this calculator would show. If today&apos;s date
              is May 10, that&apos;s 70 days after March 1 — exactly 10
              completed weeks and 0 extra days of gestational age, placing
              you in the first trimester (weeks 1–13), with 210 days (30
              weeks) remaining until the December 6 estimate.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              A due date reads like a deadline, but it isn&apos;t one.
              Mayo Clinic describes it plainly: the due date is simply the
              date on which you&apos;ll be 40 weeks pregnant, not a
              prediction of the exact day labor will start — few
              pregnancies end precisely on that day, and a birth anywhere
              within a few weeks of it is entirely normal. It&apos;s also
              worth knowing that ACOG&apos;s own guidance on this topic is
              titled &quot;Methods for Estimating the Due Date&quot; —
              plural — because Naegele&apos;s Rule (LMP-based) is one of
              several accepted methods, alongside first-trimester
              ultrasound dating and, for pregnancies conceived via
              assisted reproductive technology, the known transfer date;
              ACOG recommends using whichever is most accurate for a given
              pregnancy, not always defaulting to LMP.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              When Naegele&apos;s Rule doesn&apos;t apply well
            </h3>
            <p>
              This calculator, like Naegele&apos;s Rule itself, is built
              for a single typical pregnancy with a regular 28-day
              cycle — it doesn&apos;t apply well to twin or multiple
              pregnancies, which reliably run shorter than a
              singleton&apos;s 40 weeks. ACOG guidance points to delivery
              around 38 weeks for uncomplicated dichorionic twin
              pregnancies, and around 36–37 weeks for monochorionic twin
              pregnancies — well before this calculator&apos;s 280-day
              estimate. A due date calculated this way for a twin
              pregnancy should be understood as a singleton-style
              reference point, not the expected delivery timing, which a
              doctor manages separately based on the specific pregnancy.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              What to actually do with this date
            </h3>
            <p>
              Use this estimate to orient early planning — roughly which
              trimester you&apos;re in, when to schedule early prenatal
              visits, when parental leave or travel plans might need to
              work around. Per ACOG&apos;s own committee opinion on due
              date methods, a first-trimester ultrasound is considered the
              most accurate way to confirm or revise gestational age,
              accurate to within about 6 days; once your provider gives
              you a confirmed due date, that figure should take priority
              over this calculator&apos;s LMP-based estimate.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              LMP dating vs. ultrasound dating
            </h3>
            <p>
              LMP-based dating — what this calculator does — only needs a
              date you likely already know, which makes it useful before
              any clinical visit has happened, but it assumes a textbook
              cycle and is only as accurate as your memory of when your
              last period actually started. Ultrasound dating measures the
              embryo or fetus directly and doesn&apos;t depend on cycle
              regularity or recall at all, which is why ACOG considers a
              first-trimester ultrasound the more accurate method whenever
              the two disagree. Use this calculator as a starting estimate
              before that appointment, not as a substitute for it.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={PREGNANCY_DUE_DATE_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
