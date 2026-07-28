import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool's three modes.
export const PERCENTAGE_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How do I calculate a discount, like "20% off $50"?',
    answer:
      'Use the "% of a number" mode with 20 as the percentage and 50 as the number — that gives you $10, the amount taken off. To get the final price, subtract that from the original: $50 − $10 = $40.',
  },
  {
    question: 'What\'s the difference between "% of a number" and "Is what %"?',
    answer:
      '"% of a number" answers questions like "what is 20% of 50?" (you know the percentage, want the amount). "Is what %" answers the reverse: "25 is what percent of 200?" (you know two amounts, want the percentage between them).',
  },
  {
    question: "Why can't the second number be zero in \"Is what %\" or the first number in \"% change\"?",
    answer:
      "Both of those modes divide by that number to get a percentage, and dividing by zero is mathematically undefined — there's no meaningful answer to \"25 is what percent of 0\" or \"the percentage change from 0.\"",
  },
  {
    question: 'How is percentage change different from percentage points?',
    answer:
      'This tool calculates percentage change (a relative change, e.g. going from 80 to 100 is a 25% increase). Percentage points measure an absolute difference between two percentages (e.g. going from 20% to 25% is "5 percentage points," which is also a 25% relative increase) — the two aren\'t interchangeable, and mixing them up is a common source of confusion in statistics.',
  },
  {
    question: 'Can I enter negative numbers?',
    answer:
      'Yes, all three modes accept negative numbers and decimals. Keep in mind that percentage change from a negative starting value follows the same division-based formula, which can produce results that read unintuitively if you\'re not expecting it — the calculator always shows exactly what the formula produces.',
  },
];
