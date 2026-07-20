import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions —
// each answer teaches something the explanatory content block doesn't
// already say.
export const BMR_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What exactly does BMR measure?',
    answer:
      'BMR is the number of calories your body burns in 24 hours doing nothing but staying alive — breathing, circulating blood, maintaining body temperature, and basic cell repair. It excludes digestion, movement, and exercise entirely.',
  },
  {
    question: 'Why does this calculator ask for my sex?',
    answer:
      'The Mifflin-St Jeor equation uses different constants for men and women because, on average, men carry more lean muscle mass at the same weight and height, and muscle burns more calories at rest than fat does.',
  },
  {
    question: 'Is BMR the same as the calories I should eat per day?',
    answer:
      "No — BMR only covers resting energy use. Your actual daily calorie needs (TDEE) add activity, exercise, and digestion on top of BMR, and are typically 1.2 to 1.9 times higher depending on how active you are.",
  },
  {
    question: 'Why might my real BMR differ from this estimate?',
    answer:
      'Mifflin-St Jeor is a population-average formula. Genetics, muscle mass, hormone levels (especially thyroid function), and body composition can all shift an individual\'s real BMR above or below the predicted number by a meaningful margin.',
  },
  {
    question: 'How is Mifflin-St Jeor different from the Harris-Benedict equation?',
    answer:
      'Harris-Benedict dates to 1919 (revised in 1984) and tends to overestimate BMR for modern populations. Mifflin-St Jeor (1990) is newer, was validated against a more contemporary sample, and is now the equation the Academy of Nutrition and Dietetics recommends for most adults.',
  },
];
