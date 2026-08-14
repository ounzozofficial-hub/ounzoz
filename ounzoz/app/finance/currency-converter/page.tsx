import { ArticleLayout } from '@/components/shared/ArticleLayout';
import { FAQ } from '@/components/shared/FAQ';
import { CurrencyCalculator } from './components/CurrencyCalculator';
import { RelatedTools } from './components/RelatedTools';
import { CURRENCY_FAQ_ITEMS } from './faq-content';
import type { BreadcrumbItem } from '@/types/shared';

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

// DESIGN.md Section 20: visible breadcrumb, mirrors breadcrumbSchema above.
const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Finance', href: '/finance' },
  { name: 'Currency Converter' },
];

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
        breadcrumbItems={breadcrumbItems}
        title="Currency Converter"
        description="Convert between 59 world currencies, including every major Arabic currency, using daily blended central-bank reference rates."
        contentSlot={
          <ArticleLayout
            title="About the Currency Converter"
            sourceCitation="Exchange rates are sourced from frankfurter.dev's free v2 API, which blends daily reference rates published by dozens of central banks worldwide (including the European Central Bank). Rates update once per business day and are not real-time market or retail rates. Purchasing power parity, a related but distinct measure, is defined per the IMF and World Bank."
          >
            <p>
              This tool converts an amount from one currency to another
              using daily reference rates blended from dozens of central
              banks worldwide — the same kind of benchmark rates used
              across much of the financial industry as a neutral point of
              comparison. Enter an amount, choose your two currencies, and
              the converted amount updates using the latest published
              rate.
            </p>
            <p>
              It&apos;s important to understand what these rates are, and
              aren&apos;t. Most contributing central banks publish their
              reference rates once per business day, so this is an
              indicative, recently-updated figure rather than a live,
              second-by-second market quote. It also doesn&apos;t include
              the spread or fees that banks, card networks, and
              money-transfer services add on top when you actually
              exchange currency — the amount you&apos;re quoted or charged
              for a real transaction will typically differ from the number
              shown here.
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
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A worked example
            </h3>
            <p>
              Say you&apos;re converting $500 USD to EUR, and the tool
              shows a rate of 0.92 EUR per 1 USD (an illustrative rate
              for this example — the real one updates daily and will
              likely be different by the time you read this). The
              conversion is a single multiplication: 500 × 0.92 = 460.00
              EUR, rounded to the nearest cent. Converting the other
              direction — 500 EUR to USD — uses the inverse relationship
              rather than a separately published rate: 500 ÷ 0.92 ≈
              543.48 USD.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              A common misconception
            </h3>
            <p>
              People often expect the rate shown by a converter like this
              one to match what they&apos;ll actually receive at a bank
              counter or through a money-transfer app, but those are
              different numbers by design. This tool shows the underlying
              reference rate with no markup; real providers add their own
              margin (a spread) on top, plus sometimes a flat fee, which
              is how they cover their costs and make money on the
              transaction — the amount you&apos;re quoted for an actual
              exchange will typically be worse than the reference rate
              shown here, not identical to it.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Where a reference rate doesn&apos;t tell the whole story
            </h3>
            <p>
              A market exchange rate — the kind this tool shows —
              reflects short-term supply and demand in the foreign
              exchange market, and can move quickly on economic news,
              interest-rate decisions, or shifts in trade flows.
              It&apos;s a different concept from purchasing power parity
              (PPP), a measure economists at the IMF and World Bank use
              for cross-country comparisons, which instead estimates the
              rate needed to buy an equivalent basket of goods and
              services in each country. The two rates for the same
              currency pair can differ substantially, since PPP is built
              to strip out the short-term market volatility that a live
              reference rate deliberately reflects — useful context if a
              currency&apos;s market rate looks surprisingly high or low
              relative to what things actually cost on the ground.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              How to use this conversion
            </h3>
            <p>
              Use the converted amount to get an accurate general sense
              of value across currencies — comparing prices, budgeting
              for travel, or understanding a foreign salary or
              invoice — rather than as the exact number you&apos;ll
              receive or pay in a real transaction. Because the
              underlying rates update once per business day for most
              contributing central banks rather than tick-by-tick, this
              is best treated as a same-day reference point, not a live
              trading price if you need one down to the minute.
            </p>
            <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
              Reference rate vs. what you&apos;ll actually pay
            </h3>
            <p>
              The reference rate is a neutral midpoint; what you actually
              pay or receive depends on which provider you use and how
              they price their spread. Bank transfers, currency cards,
              cash exchange counters, and money-transfer apps can all
              quote noticeably different effective rates for the exact
              same currency pair at the exact same moment, purely based
              on their own margin and fee structure — for any transaction
              that matters, compare the total amount a provider will
              actually give you, not just the rate they advertise,
              against this tool&apos;s reference figure before choosing
              where to exchange.
            </p>
          </ArticleLayout>
        }
        faqSlot={<FAQ items={CURRENCY_FAQ_ITEMS} />}
        relatedToolsSlot={<RelatedTools />}
      />
    </>
  );
}
