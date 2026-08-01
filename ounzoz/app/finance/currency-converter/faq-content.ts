import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool's live-data behavior.
export const CURRENCY_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How often do the exchange rates update?',
    answer:
      'Rates are refreshed daily, blended from the reference rates published by dozens of central banks worldwide (including the European Central Bank). Most contributing banks publish once per business day, so this is an indicative, recently-updated figure rather than a live, second-by-second market quote — treat it as such rather than a real-time price.',
  },
  {
    question: "Why might the amount I get here differ from what my bank or a money-transfer service charges me?",
    answer:
      "Banks, card networks, and exchange services add their own margin (a spread) on top of the reference rate, plus sometimes a flat fee — that's how they make money on the transaction. This calculator shows the underlying blended reference rate with no markup, which is useful for understanding the 'real' exchange rate but isn't what you'll actually receive or pay.",
  },
  {
    question: 'What happens if the rate service is down or slow when I try to convert?',
    answer:
      "If the live rate can't be fetched, this tool automatically falls back to the last rate it successfully retrieved for that same currency pair earlier in your browsing session (clearly labeled as such) if one exists. If there's no recent rate to fall back on, you'll see a plain message that rates are temporarily unavailable — never a broken page or an endless spinner.",
  },
  {
    question: 'Which currencies are supported, and is my local currency included?',
    answer:
      "This tool covers 59 currencies, including every major world currency plus every actively-traded Arabic-region currency — Saudi riyal, UAE dirham, Egyptian pound, Qatari riyal, Kuwaiti dinar, Bahraini dinar, Omani rial, Jordanian dinar, Iraqi dinar, Lebanese pound, Moroccan dirham, Tunisian dinar, Algerian dinar, Libyan dinar, Syrian pound, Yemeni rial, and Sudanese pound. If a currency isn't in the From/To lists, the underlying rate provider doesn't currently publish it.",
  },
  {
    question: 'Can I use this for sending money abroad or planning a large transaction?',
    answer:
      "Use it to get a general sense of the exchange rate, not as the final number for a real transaction. Real transfers involve provider-specific rates, fees, and timing that this tool doesn't account for — check your actual bank or transfer service for the rate and total cost you'll really get.",
  },
];
