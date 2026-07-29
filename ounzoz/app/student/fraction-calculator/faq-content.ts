import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool.
export const FRACTION_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Why is my answer already simplified?',
    answer:
      "This calculator automatically reduces every result to lowest terms using the greatest common divisor (GCD) of the numerator and denominator — the same simplification step you'd do by hand, just automatic. If you need the unsimplified version for a specific homework step, you can always reduce it back up by multiplying both parts by the same number.",
  },
  {
    question: 'What does the second number under the result mean?',
    answer:
      "That's the decimal equivalent of the simplified fraction, useful for double-checking your answer or when a decimal form is more convenient. If the result is an improper fraction (the numerator is larger than the denominator), you'll also see it written as a mixed number — a whole number plus a proper fraction.",
  },
  {
    question: 'Can I enter negative fractions?',
    answer:
      'Yes — enter a negative sign on either the numerator or the denominator (or both) and it works correctly. The result always simplifies with the sign on the numerator and a positive denominator, which is the standard convention.',
  },
  {
    question: 'Why can\'t I divide by a fraction with a numerator of 0?',
    answer:
      "A fraction with a numerator of 0 (like 0/5) has a value of 0, and dividing by zero is mathematically undefined — the same reason you can't divide any number by 0 directly. This only applies to the Divide operation; a zero numerator is perfectly fine for Add, Subtract, and Multiply.",
  },
  {
    question: 'Do the numerator and denominator have to be whole numbers?',
    answer:
      "Yes — this tool works with standard fractions, where both the numerator and denominator are integers. If you're working with a decimal, convert it to a fraction first (for example, 0.75 is the same as 3/4) before entering it here.",
  },
];
