import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool. YMYL bar (PROJECT.md Section 5):
// answers stay factual and avoid anything that reads as personalized
// financial advice.
export const MORTGAGE_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What exactly is included in this estimated payment?',
    answer:
      'Principal and interest, plus whatever property tax, home insurance, and HOA dues you enter (all optional — they default to zero if left blank). It does not include private mortgage insurance (PMI), closing costs, or other lender fees.',
  },
  {
    question: "Why doesn't this calculator include PMI?",
    answer:
      "PMI rates vary significantly by lender, loan type, credit score, and down payment size — there's no single standard rate this tool could apply without fabricating a number that might not match your actual loan. If your down payment is under 20%, your lender will likely require PMI; ask them for the specific rate and add it to your monthly HOA field as a rough stand-in if you want to see its effect here.",
  },
  {
    question: 'How does a larger down payment change my monthly payment?',
    answer:
      'A larger down payment reduces the principal (home price minus down payment), which lowers both your monthly principal & interest payment and the total interest you pay over the life of the loan. It can also help you avoid PMI if it brings your down payment to 20% or more, though this tool doesn\'t calculate that threshold for you.',
  },
  {
    question: 'Are property tax and home insurance estimated automatically?',
    answer:
      "No — you enter your own annual property tax and home insurance figures. Both vary enormously by location, home value, and insurer, so this tool doesn't guess at them; leave them blank (they'll be treated as zero) if you don't have estimates yet, such as when comparing homes early in a search.",
  },
  {
    question: 'Does this assume a fixed-rate mortgage?',
    answer:
      'Yes — it calculates a fixed interest rate held constant for the full loan term, the standard structure for most conventional mortgages. An adjustable-rate mortgage (ARM) can change your payment after an initial fixed period, which this tool does not model.',
  },
  {
    question: 'Is this financial advice?',
    answer:
      "No. This tool provides a mathematical estimate based on the standard loan amortization formula and the numbers you enter — it isn't personalized financial or mortgage advice. Get a formal loan estimate from a lender before making a home-buying decision.",
  },
];
