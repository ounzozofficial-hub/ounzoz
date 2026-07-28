import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool.
export const STUDY_TIME_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How do I decide how many "topics" to enter?',
    answer:
      "Use whatever chunking makes sense for your exam — chapters, units, lecture weeks, or even sets of practice questions. The calculator just divides your available time evenly across however many chunks you tell it about, so pick a breakdown that matches how you actually plan to study.",
  },
  {
    question: 'What should I do if I see the advisory warning?',
    answer:
      "It shows up when you'd have under an hour per topic, which usually isn't much time to actually learn something. Consider starting your review sooner, narrowing which topics you focus on most, or freeing up more study time each day if that's realistic for you.",
  },
  {
    question: 'Does this account for some topics being harder than others?',
    answer:
      "No — it splits your time evenly across every topic you enter. If some topics are noticeably harder or more heavily tested, a simple manual adjustment works well: enter fewer, larger topic groupings for the easy material and treat the hard material as its own separate topic so it gets its own full share of time.",
  },
  {
    question: 'How is this different from the Grade or GPA Calculator?',
    answer:
      'Grade and GPA Calculator are both about the math of scores — combining category scores into a course grade, or combining course grades into a GPA. This tool is purely about time planning: given a deadline and your available hours, how should you split your study time across what you need to cover.',
  },
  {
    question: 'Does this tell me how many total hours I should study?',
    answer:
      "No — that depends heavily on the subject, the course, and you personally, so there's no single number that would be accurate advice for everyone. This tool only divides up the time you've already decided you can commit; the total-hours decision is still yours to make.",
  },
];
