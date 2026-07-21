import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions —
// each answer teaches something the explanatory content block doesn't
// already say.
export const TDEE_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is TDEE, in plain terms?',
    answer:
      "TDEE is your total daily calorie burn — resting metabolism plus everything you do on top of it: walking, exercise, fidgeting, and digesting food. It's the number most people actually mean when they ask \"how many calories do I burn a day?\"",
  },
  {
    question: 'How do I choose the right activity level?',
    answer:
      "Be honest about your typical week, not your best week. Most people who sit most of the day and exercise occasionally fall under \"lightly active,\" not \"moderately active\" — overestimating activity level is the most common reason a TDEE estimate ends up too high.",
  },
  {
    question: 'Should I eat exactly my TDEE every day?',
    answer:
      'TDEE is your maintenance number — eating around it keeps your weight roughly stable. To lose weight, most people eat somewhat below TDEE; to gain weight, somewhat above it. A doctor or dietitian can help you pick a safe deficit or surplus for your situation.',
  },
  {
    question: 'Why does my TDEE change if I lose or gain weight?',
    answer:
      "TDEE is calculated from your current weight, height, age, sex, and activity level, so it shifts as those change — most notably as body weight changes. That's why TDEE is worth recalculating periodically, not treated as a fixed number.",
  },
  {
    question: 'Is this the same as \"calories burned\" on a fitness tracker?',
    answer:
      "They estimate the same underlying thing but rarely agree exactly. Fitness trackers use heart rate and movement sensors to estimate activity calories in real time, while this calculator uses a population-average formula — both are estimates, and neither is a lab-grade measurement.",
  },
];
