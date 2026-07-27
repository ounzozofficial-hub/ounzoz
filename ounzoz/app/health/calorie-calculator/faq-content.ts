import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, and is written specifically for this tool (not reworded from
// BMR's or TDEE's FAQ).
export const CALORIE_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Why is the adjustment a flat ±500 calories instead of a percentage?',
    answer:
      "A flat 500 kcal/day deficit or surplus is the long-standing, easy-to-apply rule of thumb behind the classic \"3,500 kcal ≈ 1 lb\" energy-balance estimate: 500 kcal/day × 7 days ≈ 3,500 kcal/week, or roughly 1 lb of body fat change per week. It's an approximation, not a guarantee — actual weight change varies by individual — but it's the convention most calorie calculators use because it's simple and reasonably reliable for most people.",
  },
  {
    question: 'What does it mean if my result shows a caution?',
    answer:
      'If your calculated target falls below the commonly recommended minimum (1,200 cal/day for women, 1,500 cal/day for men), the result panel flags it. The number shown is still your real calculated target — it is never hidden or changed — but very low calorie intakes are more likely to be nutritionally inadequate or unsustainable, so it is worth checking with a healthcare provider before following it.',
  },
  {
    question: "How is this different from the TDEE Calculator?",
    answer:
      'TDEE Calculator shows your maintenance number — the calories you burn in a day. Calorie Calculator takes that same number and adjusts it for a specific goal: eat below TDEE to lose weight, at TDEE to maintain, or above TDEE to gain. If you just want your maintenance number with no goal applied, use TDEE Calculator directly.',
  },
  {
    question: 'Should I eat the exact number every single day?',
    answer:
      "Treat it as a target to average over a week rather than a number to hit precisely every day — normal day-to-day eating naturally varies, and that's fine. What matters more is the trend over several weeks: if your weight isn't moving the way your goal expects after 2–3 weeks, that's a signal to recalculate rather than to chase daily precision.",
  },
  {
    question: 'Why would I need to recalculate this later?',
    answer:
      "Your calorie target is built from your BMR and TDEE, both of which shift as your weight, age, or activity level change. As you lose or gain weight toward your goal, your maintenance calories change too, so periodically recalculating keeps the target accurate instead of using a number based on your starting stats indefinitely.",
  },
  {
    question: 'Is losing or gaining exactly 1 lb/week realistic for everyone?',
    answer:
      "Not exactly — the 3,500 kcal/lb estimate is a population-average approximation. Individual results vary with metabolism, water retention, sleep, and how consistently the target is actually followed, so real week-to-week change is often less linear than the math suggests. It remains a reasonable starting point, not a precise prediction.",
  },
];
