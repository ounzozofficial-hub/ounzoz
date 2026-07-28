import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { CurrencyCalculator } from './components/CurrencyCalculator';
import { RelatedTools } from './components/RelatedTools';
import { CURRENCY_FAQ_ITEMS } from './faq-content';

export { metadata } from './metadata';

const TOOL_URL = 'https://ounzoz.com/finance/currency-converter';

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
      name: 'Finance',
      item: 'https://ounzoz.com/finance',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Currency Converter',
      item: TOOL_URL,
    },
  ],
};

// FAQPage — standard on every tool page per SEO.md Section 6, built
// directly from the same content rendered in the FAQ accordion below.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: CURRENCY_FAQ_ITEMS.map((item) => ({
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
  name: 'Currency Converter',
  applicationCategory: 'FinanceApplication',
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

export default function CurrencyConverterPage() {
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

      <CurrencyCalculator
        title="Currency Converter"
        description="Convert between major world currencies using European Central Bank reference rates."
        contentSlot={
          <ArticleLayout
            title="About the Currency Converter"
            sourceCitation="Exchange rates are sourced from the European Central Bank's daily reference rates, delivered via the free frankfurter.app API. Rates update once per business day and are not real-time market or retail rates."
          >
            <p>
              This tool converts an amount from one currency to another
              using the European Central Bank&apos;s official daily
              reference rates — the same benchmark rates used across much
              of the financial industry as a neutral point of comparison.
              Enter an amount, choose your two currencies, and the
              converted amount updates using the latest published rate.
            </p>
            <p>
              It&apos;s important to understand what these rates are, and
              aren&apos;t. The ECB publishes its reference rates once per
              business day, so this is an indicative, recently-updated
              figure rather than a live, second-by-second market quote.
              It also doesn&apos;t include the spread or fees that banks,
              card networks, and money-transfer services add on top when
              you actually exchange currency — the amount you&apos;re
              quoted or charged for a real transaction will typically
              differ from the number shown here.
            </p>
            <p>
              Because this tool depends on a live rate service, it&apos;s
              built to fail gracefully: if the rate service is temporarily
              unreachable, it automatically falls back to the last
              successful rate it fetched for that currency pair earlier in
              your session (clearly labeled), and only shows an
              unavailable message if no recent rate exists to fall back
              on. Use this tool to get a clear, honest sense of the
              exchange rate — not as the final word for a real financial
              transaction; check your bank or provider for that.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={CURRENCY_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
