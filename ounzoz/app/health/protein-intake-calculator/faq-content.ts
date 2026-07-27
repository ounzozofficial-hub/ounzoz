import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool.
export const PROTEIN_INTAKE_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Is 0.8g per kg (the sedentary number) a hard minimum?',
    answer:
      "It's the RDA (Recommended Dietary Allowance) — a precise, well-established figure from the U.S./Canada Dietary Reference Intakes, representing the amount that meets the needs of nearly all healthy, sedentary adults. It's a solid baseline, not a target to stay as close to as possible — it's the floor for sedentary adults, not the ideal for everyone.",
  },
  {
    question: 'How solid is the 1.2–2.0g/kg range for active people?',
    answer:
      "Less precise than the 0.8g/kg RDA. Sports nutrition research (e.g. the International Society of Sports Nutrition's position stand) generally supports higher protein needs for active individuals and athletes, roughly in the 1.4–2.0g/kg range, but the exact optimal number varies by source, training type, and goal (muscle gain vs. general fitness vs. endurance). Treat the higher end of this tool's range as a reasonable estimate, not a precise prescription.",
  },
  {
    question: 'Why does more activity mean more protein?',
    answer:
      'Exercise — especially resistance training — creates small amounts of muscle damage that the body repairs and adapts to using protein. More frequent or intense training generally means more repair-and-rebuild work, which is the general reasoning behind higher protein recommendations for active individuals.',
  },
  {
    question: 'Should I eat this much protein in one meal?',
    answer:
      "No — spreading protein intake across 3-4 meals throughout the day is generally considered more effective for muscle protein synthesis than eating it all at once, since the body can only make efficient use of a limited amount of protein per sitting.",
  },
  {
    question: 'Does this account for a specific goal like weight loss or muscle gain?',
    answer:
      "Not directly — this estimate is based on body weight and general activity level only. People specifically trying to build muscle while in a calorie deficit (losing weight) sometimes target the higher end of the range, or above it, to help preserve muscle mass — that's a more individual, goal-specific decision beyond what this general calculator estimates.",
  },
];
