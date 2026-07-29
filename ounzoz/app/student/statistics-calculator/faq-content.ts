import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool.
export const STATISTICS_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What does "No mode" mean?',
    answer:
      "It means every number you entered appears exactly once — nothing repeats, so there's no single most-frequent value. If two or more values are tied for appearing most often, this tool lists all of them (a data set can have more than one mode).",
  },
  {
    question: 'Does this use population or sample standard deviation?',
    answer:
      "Population standard deviation — it divides by the total count (n) rather than n − 1. That's the right formula when you're treating the numbers you entered as the complete data set of interest, rather than as a smaller sample you're using to estimate a larger population. If your course specifically requires sample standard deviation, multiply this result by √(n / (n − 1)) to convert it.",
  },
  {
    question: 'How do I format my data?',
    answer:
      'Separate values with commas, put one number per line, or use spaces — this tool accepts all three, and you can even mix them (for example, a pasted spreadsheet column with one number per line works fine).',
  },
  {
    question: 'What if the median falls between two numbers?',
    answer:
      'When you enter an even count of numbers, the median is the average of the two middle values once everything is sorted — you don\'t need to sort your input yourself, the calculator handles that.',
  },
  {
    question: 'Is there a limit to how many numbers I can enter?',
    answer:
      "Yes, up to 200 values at once, which comfortably covers a full class roster of scores or a semester's worth of data points. You'll need at least 2 numbers for the statistics to be meaningful.",
  },
];
