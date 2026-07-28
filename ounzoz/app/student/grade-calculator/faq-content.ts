import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool.
export const GRADE_FAQ_ITEMS: FAQItem[] = [
  {
    question: "What happens if my category weights don't add up to 100%?",
    answer:
      "Nothing breaks — the calculator normalizes by the total weight you've entered rather than requiring an exact 100%. This is useful mid-semester when you don't have every category's grade yet: enter what you have, and the \"Weights total\" line under the form shows how much of your final grade that reflects so far.",
  },
  {
    question: 'How is this different from the GPA Calculator?',
    answer:
      'This tool averages the categories *within* one course (homework, quizzes, exams) to estimate that course\'s overall grade. The GPA Calculator averages your final letter grades *across* multiple courses, weighted by credit hours, to estimate your GPA. Use this one first if you want to know your grade in a specific class.',
  },
  {
    question: "What letter grade scale does this use, and what if my school's is different?",
    answer:
      'This uses the common 90/80/70/60 cutoffs for A/B/C/D, with anything below 60 as F. Some schools set the A cutoff higher (like 93) or use +/- letter grades — check your syllabus or school\'s grading policy for the exact scale your instructor uses.',
  },
  {
    question: 'I have several assignments in one category — how do I enter them?',
    answer:
      "Average them first, then enter that average as the category's score. For example, if \"Homework\" is one grading category worth 20% and you have four homework scores, average those four scores into one number and enter it as the Homework row's score.",
  },
  {
    question: 'Can I use this to check my grade partway through the term?',
    answer:
      "Yes — just enter the categories you already have grades for. The result reflects only what you've entered, and the running weight total tells you how much of your final grade that covers, so you know how much is still undetermined.",
  },
];
