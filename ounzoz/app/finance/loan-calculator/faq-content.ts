import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool. YMYL bar (PROJECT.md Section 5):
// answers stay factual and avoid anything that reads as personalized
// financial advice.
export const LOAN_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Does this include fees, insurance, or other charges?',
    answer:
      "No — this calculator estimates principal and interest only, based on the amount, rate, and term you enter. Real loans can include origination fees, closing costs, credit insurance, or other lender charges that this tool doesn't account for, so your actual monthly payment may be higher than shown here.",
  },
  {
    question: 'Why does a longer loan term lower my monthly payment but increase total interest?',
    answer:
      'Spreading the same principal over more payments lowers each individual payment, but you\'re also paying interest for a longer period of time — so the total interest paid over the life of the loan goes up even though the monthly amount goes down. A shorter term costs more per month but less overall.',
  },
  {
    question: 'What happens if I make extra payments toward the principal?',
    answer:
      "This calculator shows the standard fixed schedule assuming no extra payments. Paying extra toward the principal reduces the balance interest is calculated on for every remaining payment, which shortens the loan and lowers total interest paid — but whether your specific loan allows penalty-free extra payments depends on your lender's terms.",
  },
  {
    question: 'Is my actual rate the same as what I enter here?',
    answer:
      "Only if your loan has that exact fixed rate. This calculator assumes a fixed interest rate for the full term. Variable-rate loans can change your payment over time, and the rate a lender actually offers you depends on factors like credit score, income, and loan type — always confirm the real terms with your lender before borrowing.",
  },
  {
    question: 'Is this financial advice?',
    answer:
      "No. This tool provides a mathematical estimate based on the standard loan amortization formula and the numbers you enter — it isn't personalized financial advice and doesn't account for your full financial situation. For a decision as significant as taking out a loan, compare offers from multiple lenders and consider speaking with a qualified financial advisor.",
  },
];
