import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool.
export const GPA_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Why does adding more credit hours to a course change my GPA more?',
    answer:
      'Because GPA is a weighted average, not a plain average — each course pulls your GPA toward its own grade in proportion to its credit hours. A 4-credit A affects your GPA about twice as much as a 2-credit A, since it counts for twice the weight in both the numerator and the denominator of the formula.',
  },
  {
    question: 'Is this a weighted or unweighted GPA?',
    answer:
      'Unweighted — every course uses the same 4.0-point scale regardless of difficulty. Some high schools use a weighted scale that adds bonus points for honors, AP, or IB courses (so an A in an AP class might count as 5.0 instead of 4.0). This calculator doesn\'t apply that bonus; if your school weights grades, your official GPA may come out higher than what this tool shows.',
  },
  {
    question: 'What if my school uses a different grading scale?',
    answer:
      "Some institutions skip +/- grades entirely, use different point values for the same letter grade, or run a 5.0 or 100-point scale instead of 4.0. This calculator uses the standard +/- 4.0 scale used by most US colleges. Check your school's registrar or academic catalog for your institution's exact scale if you need an official figure.",
  },
  {
    question: 'Can I use this for a single semester and for my cumulative GPA?',
    answer:
      "Yes — the calculation works the same way either way. Enter just this semester's courses for a term GPA, or every course you've taken (across all semesters) for your cumulative GPA. The formula doesn't distinguish between the two; it's entirely about which courses you include.",
  },
  {
    question: 'What happens if I retook a course?',
    answer:
      "This calculator doesn't apply grade-replacement or grade-forgiveness policies — it simply averages every course row you enter. If your school replaces a retaken course's original grade in your official GPA, only enter the grade you want counted rather than both attempts, since including both would double-count the credit hours.",
  },
];
