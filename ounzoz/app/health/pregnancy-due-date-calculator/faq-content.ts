import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say. This tool is YMYL-adjacent health content (PROJECT.md Section 5),
// so every answer here is written to reinforce "estimate, not diagnosis"
// rather than overstate precision.
export const PREGNANCY_DUE_DATE_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How accurate is this due date estimate?',
    answer:
      "It's a starting estimate, not a precise prediction. Naegele's Rule assumes a textbook 28-day cycle with ovulation on day 14 — in reality, only a small percentage of babies are born on their exact calculated due date, and a full-term birth is considered anywhere from 37 to 42 weeks. Treat this date as a general planning window, not a fixed deadline.",
  },
  {
    question: "Why does this use my last period's start date instead of the conception date?",
    answer:
      "Most people know their last menstrual period (LMP) date with reasonable confidence but don't know the exact day conception occurred, since that isn't always the same day as intercourse and isn't directly observable. Naegele's Rule was designed around LMP for exactly this reason — it's the more reliably known reference point for most people.",
  },
  {
    question: 'What if my menstrual cycle is longer or shorter than 28 days?',
    answer:
      "This calculator, like the standard Naegele's Rule it's based on, assumes a 28-day cycle. If your cycles are consistently longer or shorter, your actual ovulation — and therefore due date — likely shifts earlier or later than this estimate. An early ultrasound (typically in the first trimester) is generally considered more accurate for irregular cycles than an LMP-based calculation.",
  },
  {
    question: 'Can an ultrasound give a more accurate due date than this calculator?',
    answer:
      "Yes, generally. A first-trimester ultrasound measures the fetus directly and is often considered more accurate than an LMP-based estimate, especially if your cycle is irregular or you're unsure of your last period's exact start date. If your doctor gives you a due date from an ultrasound that differs from this calculation, their estimate should take priority.",
  },
  {
    question: 'What does it mean if this shows a negative number of days remaining?',
    answer:
      "It means today's date is after the estimated due date calculated from your LMP — commonly described as being \"past due.\" This is quite common: due dates are estimates, and many pregnancies extend a week or more past the calculated date without complication. If you're past your due date, this is a conversation for your healthcare provider, not something to interpret from this tool alone.",
  },
  {
    question: 'Does the trimester shown here match what my doctor uses?',
    answer:
      "This tool uses the standard trimester boundaries most commonly cited (first trimester through week 13, second through week 27, third from week 28 onward), which is the same general convention used in most prenatal care contexts. Some sources use slightly different week cutoffs, so don't be surprised if your provider's chart is off by a few days from this calculator's boundary.",
  },
];
