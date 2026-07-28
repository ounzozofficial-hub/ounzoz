import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool's live-data behavior.
export const CURRENCY_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How often do the exchange rates update?',
    answer:
      'Rates come from the European Central Bank, which publishes reference rates once per business day (around 16:00 CET) — not continuously, and not on weekends or ECB holidays. This tool always shows the most recent published rate, but that can be up to a day old, so treat it as indicative rather than a live market quote.',
  },
  {
    question: "Why might the amount I get here differ from what my bank or a money-transfer service charges me?",
    answer:
      "Banks, card networks, and exchange services add their own margin (a spread) on top of the reference rate, plus sometimes a flat fee — that's how they make money on the transaction. This calculator shows the underlying ECB reference rate with no markup, which is useful for understanding the 'real' exchange rate but isn't what you'll actually receive or pay.",
  },
  {
    question: 'What happens if the rate service is down or slow when I try to convert?',
    answer:
      "If the live rate can't be fetched, this tool automatically falls back to the last rate it successfully retrieved for that same currency pair earlier in your browsing session (clearly labeled as such) if one exists. If there's no recent rate to fall back on, you'll see a plain message that rates are temporarily unavailable — never a broken page or an endless spinner.",
  },
  {
    question: 'Why are only about 30 currencies supported?',
    answer:
      "This tool uses the European Central Bank's daily reference rates, and the ECB only publishes rates for a specific set of major and regional currencies — it doesn't cover every currency in the world. The list here matches exactly what the ECB publishes.",
  },
  {
    question: 'Can I use this for sending money abroad or planning a large transaction?',
    answer:
      "Use it to get a general sense of the exchange rate, not as the final number for a real transaction. Real transfers involve provider-specific rates, fees, and timing that this tool doesn't account for — check your actual bank or transfer service for the rate and total cost you'll really get.",
  },
];
