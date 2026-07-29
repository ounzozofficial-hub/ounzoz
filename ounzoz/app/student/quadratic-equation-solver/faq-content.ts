import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool.
export const QUADRATIC_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is the discriminant and why does it matter?',
    answer:
      "The discriminant is the part of the quadratic formula under the square root: b² − 4ac. Its sign tells you what kind of solutions to expect before you even finish solving — positive means two distinct real roots, zero means one repeated real root, and negative means the equation has no real solutions at all.",
  },
  {
    question: "What does it mean when there's no real solution?",
    answer:
      "It means the parabola described by y = ax² + bx + c never crosses the x-axis — it stays entirely above or entirely below it. The equation still has solutions mathematically, but they're complex numbers (involving i, the imaginary unit), not real numbers, so this tool reports that clearly instead of showing a real number that isn't actually a valid answer.",
  },
  {
    question: 'Can a, b, or c be negative or zero?',
    answer:
      'b and c can be any number, including zero or negative — that\'s completely normal. a is the one exception: it cannot be zero, because with a = 0 the x² term disappears and the equation becomes linear (bx + c = 0) rather than quadratic, which this tool doesn\'t solve.',
  },
  {
    question: 'Are the two roots always different values?',
    answer:
      'Not always. When the discriminant is exactly zero, the ± in the quadratic formula adds and subtracts zero, so both roots land on the same value — that\'s the "one repeated root" case, and this tool reports it as a single root rather than listing the same number twice.',
  },
  {
    question: 'How accurate are the results for equations with large coefficients?',
    answer:
      'Very accurate for any realistic coursework equation — results are computed with standard floating-point arithmetic and rounded to 4 decimal places to strip out tiny floating-point noise. For extremely large or extremely close-together coefficients, floating-point math can lose a small amount of precision, the same limitation any calculator or spreadsheet has.',
  },
];
