import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool (not reworded from BMI's or
// Body Fat's FAQ).
export const IDEAL_WEIGHT_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Why does this only ask for height and sex, not weight or age?',
    answer:
      "Ideal weight is what the formula is solving for, so your current weight isn't an input. The Devine formula also doesn't factor in age — it was built as a general adult reference weight, not an age-adjusted one, which is part of why it stays simple compared to tools like BMR or TDEE.",
  },
  {
    question: 'Why was the Devine formula chosen over Robinson, Miller, or Hamwi?',
    answer:
      "Devine's formula is the most widely cited and used in real clinical settings — originally developed for calculating drug dosages (like gentamicin) where an accurate weight estimate genuinely matters. Robinson, Miller, and Hamwi are older or less commonly referenced alternatives that tend to produce similar, but not identical, numbers.",
  },
  {
    question: "Is my ideal weight the same as my healthiest weight?",
    answer:
      "Not necessarily. This result is a population-level reference point based only on height and sex — it doesn't account for muscle mass, frame size, or body composition. Someone muscular and athletic will often weigh more than their \"ideal weight\" here while still being perfectly healthy. Treat it as a reference, not a target to force.",
  },
  {
    question: 'Why is there a minimum and maximum height this tool accepts?',
    answer:
      "The Devine formula is calibrated for adult heights. Applied to very short heights, the formula's linear math can produce a mathematically nonsensical result (an ideal weight at or below zero), so this tool only accepts heights within a realistic adult range where the formula's output stays meaningful.",
  },
  {
    question: "How is this different from BMI or Body Fat Calculator?",
    answer:
      "BMI compares your actual weight to your height. Body Fat Calculator estimates what portion of your current weight is fat. This tool works the other direction — it estimates a single reference weight from height and sex alone, without knowing your current weight or body composition at all.",
  },
];
