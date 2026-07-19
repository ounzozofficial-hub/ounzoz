import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions —
// each answer teaches something the explanatory content block doesn't
// already say, not a rephrased repeat of it.
export const BMI_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What counts as a healthy BMI?',
    answer:
      'According to the WHO, a BMI between 18.5 and 24.9 falls in the normal weight range for most adults. Below 18.5 is classified as underweight, 25 to 29.9 as overweight, and 30 or above as obese.',
  },
  {
    question: 'Is BMI accurate for athletes or very muscular people?',
    answer:
      "Not always. Because BMI can't distinguish muscle from fat, someone with a lot of muscle mass can score in the \"overweight\" range despite having low body fat. In that case, body composition measurements are more informative than BMI alone.",
  },
  {
    question: 'Does BMI mean something different for men and women?',
    answer:
      "No — the WHO uses the same formula and category thresholds for adult men and women. Body fat percentage typically differs between sexes at the same BMI, but the BMI calculation itself doesn't adjust for sex.",
  },
  {
    question: 'Can I use this calculator for a child or teenager?',
    answer:
      "This calculator is built for adults. Children and teens are assessed using age- and sex-specific BMI-for-age percentile charts rather than the fixed adult categories shown here, so a pediatrician's growth chart is the right tool for that age group.",
  },
  {
    question: 'My BMI is outside the normal range — what should I do?',
    answer:
      "A single BMI reading is a starting point, not a diagnosis. If you're concerned, a doctor can assess your weight alongside other factors like body composition, waist circumference, and overall health history.",
  },
];
