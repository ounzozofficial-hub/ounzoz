import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool. YMYL bar (PROJECT.md Section 5):
// answers stay factual and avoid anything that reads as personalized
// financial advice.
export const SAVINGS_FAQ_ITEMS: FAQItem[] = [
  {
    question: "What's the difference between APY and a simple interest rate?",
    answer:
      "APY (Annual Percentage Yield) already accounts for compounding, so it reflects what you'll actually earn over a year, including interest on interest. This calculator treats the rate you enter as an APY and compounds it monthly — if your bank quotes a plain interest rate instead of an APY, the two can differ slightly.",
  },
  {
    question: 'How much does starting earlier actually matter?',
    answer:
      "More than most people expect. Because interest compounds on your balance, money deposited earlier has more time to earn interest on its own interest — a contribution made in year one keeps growing for the entire time horizon, while the same contribution made in year nine only grows for one year. Try shortening the years field with the same contribution to see the difference for yourself.",
  },
  {
    question: 'How is this different from the Compound Interest Calculator?',
    answer:
      "Compound Interest Calculator models a single lump sum growing on its own, with a choice of compounding frequency. This tool adds a fixed monthly contribution on top of an optional starting deposit — closer to how an actual savings account works — and always compounds monthly to keep the contribution math unambiguous.",
  },
  {
    question: 'Does this account for taxes or inflation?',
    answer:
      "No. The final balance shown is the raw projected growth before taxes on interest earned and before adjusting for inflation — both of which reduce the real, spendable value of your savings over time. Treat this as a before-tax, before-inflation projection, not a take-home figure.",
  },
  {
    question: 'Is the projected balance guaranteed?',
    answer:
      "No. This is a mathematical projection based on a fixed rate you enter — real savings account APYs change over time (often multiple times a year), so actual results will differ from a constant-rate projection like this one. Use it to compare scenarios and build intuition, not as a promised outcome.",
  },
];
