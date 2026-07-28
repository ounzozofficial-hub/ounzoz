import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool. YMYL bar (PROJECT.md Section
// 5) is at its strictest here: no answer implies a specific expected
// return, a recommendation to invest, or any personalized financial
// advice.
export const INVESTMENT_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Why doesn’t this calculator suggest an expected return?',
    answer:
      "Market returns vary enormously depending on what you invest in and over what period, and any single figure this tool suggested would be an unverifiable guess presented as advice. Instead, you supply the expected annual return yourself — based on your own research, the specific investments you're considering, or guidance from a financial advisor.",
  },
  {
    question: 'Is the projected balance a guarantee of what I’ll have?',
    answer:
      "No. This is a hypothetical projection that assumes a constant annual return for the entire time horizon, which real investments never actually deliver — returns vary year to year, sometimes sharply. Two investments with the same average annual return can end up worth very different amounts depending on when the gains and losses happened (this is often called sequence-of-returns risk). Treat the result as an illustration for comparing scenarios, not a promised outcome.",
  },
  {
    question: 'What does dollar-cost averaging have to do with the monthly contribution field?',
    answer:
      'Investing a fixed amount on a regular schedule — what this calculator’s monthly contribution models — is often called dollar-cost averaging. It means you buy at whatever the price happens to be each month, which smooths out the effect of short-term price swings compared to investing a lump sum all at once, though it doesn’t change the underlying return your investments actually earn.',
  },
  {
    question: 'What does this calculator not account for?',
    answer:
      'It doesn’t subtract fees (fund expense ratios, brokerage fees, advisor fees), taxes on gains or dividends, or inflation eroding the real value of your balance over time. All of these typically reduce your actual take-home growth below the raw projected figure shown here.',
  },
  {
    question: 'How is this different from the Savings Calculator?',
    answer:
      'Savings Calculator models a bank-savings-account-style APY, bounded to a realistic savings-rate range. This tool is framed around investing — brokerage or retirement accounts — and allows a wider expected-return range, since equity and fund returns realistically span a much broader range than a savings APY. The underlying growth formula is the same shape, but each tool is built and validated independently.',
  },
];
