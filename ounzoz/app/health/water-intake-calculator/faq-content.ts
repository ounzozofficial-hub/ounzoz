import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool.
export const WATER_INTAKE_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Does this include water from food and other drinks?',
    answer:
      "No — this estimate is for plain water/fluid intake specifically, based on the 35 mL per kg guideline. Roughly 20% of most people's total water intake normally comes from food (fruits, vegetables, soups), so your true total water intake is typically a bit higher than the number shown here.",
  },
  {
    question: 'Why does the activity level change the result by a flat amount instead of a percentage?',
    answer:
      "Unlike calorie burn, there isn't a single standardized multiplier for activity-related fluid loss the way there is for BMR. Sweat rate varies enormously by person, climate, and exercise intensity, so this tool uses simple flat additions per activity tier as a practical estimate — not a precise physiological formula.",
  },
  {
    question: 'Is 35 mL per kg a hard medical requirement?',
    answer:
      "No — it's a widely used practical guideline for estimating daily fluid needs in healthy adults, not a strict clinical minimum or maximum. Actual needs vary with climate, health conditions, pregnancy/breastfeeding, and individual physiology. If you have a kidney, heart, or liver condition that affects fluid balance, follow your doctor's specific guidance instead of this general estimate.",
  },
  {
    question: 'Should I drink this all at once, or spread it through the day?',
    answer:
      'Spread it throughout the day rather than drinking it in a few large sittings — your body absorbs and uses fluid more effectively when intake is gradual, and drinking a very large amount at once mostly just increases urination rather than improving hydration.',
  },
  {
    question: "Why isn't sex or age part of this calculation?",
    answer:
      "The 35 mL/kg guideline this tool uses is a body-weight-based estimate that applies the same way regardless of sex or age for healthy adults. Some other hydration guidelines (like total water Adequate Intake figures) do differ slightly by sex, but the weight-based approach used here folds that difference into your actual body weight instead of a separate adjustment.",
  },
];
