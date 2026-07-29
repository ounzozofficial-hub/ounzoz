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
            sourceCitation="Length, weight, and volume use standard internationally-defined unit equivalents (e.g. 1 inch = 0.0254 meters exactly); temperature uses the standard Celsius/Fahrenheit/Kelvin conversion formulas."
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
          </ArticleLayout>
        }
        faqSlot={<FAQ items={UNIT_CONVERTER_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
