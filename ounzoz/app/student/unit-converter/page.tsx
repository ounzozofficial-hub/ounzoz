import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { UnitConverterCalculator } from './components/UnitConverterCalculator';
import { RelatedTools } from './components/RelatedTools';
import { UNIT_CONVERTER_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/student/unit-converter';

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
      name: 'Student',
      item: 'https://ounzoz.com/student',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Unit Converter',
      item: TOOL_URL,
    },
  ],
};

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Student', href: '/student' },
  { name: 'Unit Converter' },
];

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: UNIT_CONVERTER_FAQ_ITEMS.map((item) => ({
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
  name: 'Unit Converter',
  applicationCategory: 'EducationApplication',
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

export default function UnitConverterPage() {
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

      <UnitConverterCalculator
        breadcrumbItems={breadcrumbItems}
        title="Unit Converter"
        description="Convert length, weight, temperature, and volume units instantly — pick a category, choose your units, and convert."
        contentSlot={
          <ArticleLayout
            title="About the Unit Converter"
            sourceCitation="Length and weight equivalents (e.g. 1 inch = 0.0254 meters exactly) derive from the 1959 International Yard and Pound Agreement; US customary volume units (US gallon = 3.785411784 L exactly) are separately defined from the UK imperial gallon (4.54609 L exactly). Temperature uses the standard Celsius/Fahrenheit/Kelvin conversion formulas."
          >
            <p>
              Unit conversion shows up across almost every science and
              math class — converting a measurement in a physics
              problem, a recipe in a chemistry lab, or just checking
              whether a distance in miles matches one in kilometers. This
              tool covers four of the most common categories: length,
              weight, temperature, and volume, each with the units
              you&apos;re most likely to actually need.
            </p>
            <p>
              Length, weight, and volume all convert the same way —
              multiplying by a fixed factor between two units of the same
              physical quantity, so 12 inches always converts to exactly
              1 foot, no matter how many times you run it. Temperature is
              the one category that works differently: Celsius,
              Fahrenheit, and Kelvin don&apos;t share a common zero
              point, so converting between them uses dedicated formulas
              (for example, °F = °C × 9/5 + 32) rather than a simple
              multiplier.
            </p>
            <p>
              Volume and weight use US customary units (US gallons,
              quarts, and the standard avoirdupois pound and ounce) — if
              you need UK/imperial equivalents, note that those use
              different gallon and pint sizes and won&apos;t match these
              numbers. For temperature, this tool won&apos;t accept a
              value below absolute zero (−273.15°C), since that&apos;s
              not physically possible regardless of which unit you enter
              it in.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Converting 98.6°F (a familiar reference point for body
              temperature) to Celsius uses the dedicated formula rather
              than a multiplier: °C = (°F − 32) × 5/9 = (98.6 − 32) ×
              5/9 = 66.6 × 5/9 = 37.0°C exactly. Compare that to a linear
              conversion like length: 10 miles to kilometers simply
              multiplies by a fixed factor, 10 × 1.609344 = 16.09344 km
              — no offset or special-case formula needed, since length
              units share a common zero point.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              It&apos;s natural to assume every unit conversion works the
              same way — multiply by a factor and you&apos;re done — but
              that only holds for units of the same physical quantity
              that share a common zero point, like length, weight, or
              volume. Temperature breaks this pattern: 0°F is not the
              same physical state as 0°C, so there&apos;s no single
              multiplier that converts between them, which is exactly
              why this calculator routes every temperature conversion
              through a dedicated formula instead of the multiply-by-a-
              factor approach used for the other three categories.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Where unit systems disagree
            </h3>
            <p>
              “Gallon” doesn&apos;t mean the same volume worldwide: a US
              gallon is exactly 3.785411784 liters, while a UK imperial
              gallon is exactly 4.54609 liters — about 20% larger. The
              two systems were standardized separately, and both remain
              in everyday use in different countries, so a recipe or a
              fuel-economy figure using “gallons” can mean two genuinely
              different volumes depending on where it was written. This
              calculator uses US customary units throughout for volume
              and weight; length units (inches, feet, yards, miles),
              though, are identical between the US and UK, since both
              countries adopted the same international definition —
              exactly 0.9144 meters per yard — under a 1959 agreement
              signed by the US, UK, Canada, Australia, New Zealand, and
              South Africa.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to use your result
            </h3>
            <p>
              Match your precision to the context: a science lab result
              usually needs to preserve significant figures rather than
              a long decimal tail, while an everyday conversion (a
              recipe, a travel distance) is generally more useful
              rounded to something readable. This calculator shows up to
              6 decimal places so the exact figure is always available;
              round it further yourself when a shorter number better
              fits what you&apos;re using it for.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Metric vs. imperial systems
            </h3>
            <p>
              The metric system&apos;s biggest practical advantage is
              that every unit within a category relates by a power of
              ten — 1,000 millimeters to a meter, 1,000 meters to a
              kilometer — so converting between them is just shifting a
              decimal point. Imperial and US customary units use
              historical, non-decimal ratios instead (12 inches to a
              foot, 3 feet to a yard, 16 ounces to a pound), which is
              exactly why this tool&apos;s conversion factors look like
              precise, unround numbers such as 0.3048 or 0.45359237 —
              they&apos;re exact by international definition, just not
              round in decimal terms the way metric-to-metric
              conversions are.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={UNIT_CONVERTER_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
