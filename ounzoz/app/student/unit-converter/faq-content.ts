import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool.
export const UNIT_CONVERTER_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Why can temperature be negative but length and weight can\'t?',
    answer:
      "Length, weight, and volume are physical quantities that can't be less than zero — there's no such thing as −5 meters of length. Temperature is different: negative values are completely normal (water freezes at 0°C, and it gets colder from there). The only hard limit for temperature is absolute zero, the coldest anything can physically be.",
  },
  {
    question: 'What happens if I enter a temperature below absolute zero?',
    answer:
      "You'll see a validation message instead of a result. Absolute zero is −273.15°C (also −459.67°F or 0 K) — nothing can be colder than that, so this tool blocks any input that would convert to a value below it, regardless of which unit you entered it in.",
  },
  {
    question: 'Are these US or UK/imperial units?',
    answer:
      'US customary units throughout — US gallons, quarts, pints, and fluid ounces for volume, and the standard avoirdupois ounce and pound for weight. If you\'re working with UK imperial measurements (which use different gallon/pint sizes), the numbers won\'t match, since the two systems aren\'t interchangeable.',
  },
  {
    question: 'How precise are the conversions?',
    answer:
      'Conversions use the standard internationally-defined equivalents for each unit (for example, exactly 0.0254 meters per inch) and are rounded to 6 decimal places, which comfortably covers any homework or everyday use — including cases where converting between a very small and very large unit (like millimeters to miles) would otherwise produce a long string of digits.',
  },
  {
    question: 'Can I convert between categories, like length to weight?',
    answer:
      "No — length, weight, temperature, and volume are physically different kinds of quantities, so converting between categories doesn't have a valid mathematical answer (there's no way to turn a distance into a weight). Pick the category that matches what you're converting, then choose your From and To units within it.",
  },
];
