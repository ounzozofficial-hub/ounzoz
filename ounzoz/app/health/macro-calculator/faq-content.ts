import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool (not reworded from Calorie's
// or Protein Intake's FAQ).
export const MACRO_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Why does protein come from my weight, but fat and carbs come from my calorie target?',
    answer:
      "Protein needs scale with body weight and activity level directly — a heavier, more active person needs more grams regardless of their calorie goal, so it's calculated the same way Protein Intake Calculator does it. Fat and carbs, on the other hand, are about filling out the rest of a calorie target once protein is set: fat is calculated as a percentage of total calories, and carbs take whatever calories are left over.",
  },
  {
    question: 'Why is fat fixed at 30% of calories instead of a range?',
    answer:
      '30% is a practical midpoint within the 20–35% Acceptable Macronutrient Distribution Range (AMDR) set by the U.S./Canada Dietary Reference Intakes — the range itself is well established, but where any one person should actually fall within it varies by diet pattern and personal preference. This calculator uses the midpoint as a reasonable single default rather than asking you to pick a percentage.',
  },
  {
    question: "Why don't my protein, fat, and carb calories add up exactly to my total?",
    answer:
      'Each macro is rounded to the nearest gram independently, so the reconstructed total (protein × 4 + fat × 9 + carbs × 4) can land a few calories off from the exact target — never more than a handful. This is normal rounding behavior, not a calculation error.',
  },
  {
    question: 'How is this different from the Protein Intake Calculator?',
    answer:
      "Protein Intake Calculator estimates just one number: your daily protein target from weight and activity level alone. Macro Calculator uses that same protein logic but places it inside a full daily plan — it also factors in your calorie goal (lose, maintain, or gain) to work out fat and carbohydrate targets that fill out the rest of your calories.",
  },
  {
    question: 'Which number should I actually try to hit each day?',
    answer:
      "All three, but with different tightness: protein is worth tracking fairly closely, since it's the one most easily under-eaten and most tied to your activity level. Fat and carbs matter more as a general balance over the week than a number to hit exactly every single day — small day-to-day swings between the two rarely matter much on their own.",
  },
  {
    question: 'Do I need to recalculate this if my goal changes?',
    answer:
      "Yes — since fat and carb grams are both derived from your calorie target, and that target shifts whenever your goal (lose/maintain/gain), weight, or activity level changes. Protein grams shift too, since they depend on weight and activity level directly. Recalculate whenever any of these change to keep the split accurate.",
  },
];
