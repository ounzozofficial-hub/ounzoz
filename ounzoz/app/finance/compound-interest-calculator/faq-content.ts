import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool. YMYL bar (PROJECT.md Section 5):
// answers stay factual and avoid anything that reads as personalized
// financial advice.
export const COMPOUND_INTEREST_FAQ_ITEMS: FAQItem[] = [
  {
    question: "What's the difference between simple and compound interest?",
    answer:
      "Simple interest is calculated only on your original principal, so it grows by the same dollar amount every period. Compound interest is calculated on your principal plus all interest already earned, so each period's interest is a little larger than the last — that snowballing effect is what this calculator models.",
  },
  {
    question: 'Does compounding more frequently always make a big difference?',
    answer:
      'It always helps, but with diminishing returns. Going from annual to monthly compounding on a typical rate makes a meaningful difference over many years; going from monthly to daily makes a much smaller one, since the formula approaches a mathematical limit (continuous compounding) as the number of periods per year increases. The interest rate and time horizon usually matter far more than compounding frequency alone.',
  },
  {
    question: 'What is the Rule of 72?',
    answer:
      'It\'s a quick mental-math shortcut for estimating how long money takes to double: divide 72 by the annual interest rate. At 6%, that\'s roughly 12 years. It\'s a rough approximation most accurate in the 6–10% range — for an exact figure at your specific rate and compounding frequency, use the calculator above instead.',
  },
  {
    question: 'Can I use this to model regular contributions, like a monthly deposit?',
    answer:
      "No — this calculator models a single lump-sum principal growing on its own, which is the clearest way to see how the compounding math itself works. If you're adding money regularly, a savings- or investment-focused calculator that accounts for recurring contributions will give you a more accurate picture.",
  },
  {
    question: 'Is the final balance guaranteed?',
    answer:
      "No. This is a mathematical projection based on a fixed interest rate you enter — it isn't a promised return. Real savings and investment returns vary over time (and investment returns in particular can go down as well as up), so treat this as an illustration of how compounding works, not a guarantee.",
  },
];
