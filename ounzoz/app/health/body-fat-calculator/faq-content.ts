import type { FAQItem } from '@/components/shared/FAQ';

// SEO.md Section 6: 3–6 genuinely useful, tool-specific questions — each
// answer teaches something the explanatory content block doesn't already
// say, written specifically for this tool's measurement-based method.
export const BODY_FAT_FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Where exactly do I measure my neck, waist, and hip?',
    answer:
      "Neck: just below the larynx (Adam's apple), tape level. Waist: at the navel for men, or at the narrowest point above the belly button for women. Hip (women only): at the widest point around the hips and buttocks. Keep the tape snug but not compressing the skin, and measure standing up.",
  },
  {
    question: 'Why does the formula need different measurements for men and women?',
    answer:
      'The US Navy method uses two separate equations because body fat distribution differs by sex — the female formula adds a hip measurement because women tend to carry more fat around the hips, which the male formula (waist and neck only) does not account for.',
  },
  {
    question: 'How accurate is this compared to a DEXA scan or calipers?',
    answer:
      "The Navy circumference method is generally within a few percentage points of DEXA (the clinical gold standard) for most people, which is why it's the standard the US Navy itself uses for body composition assessment. It can be less accurate for people with atypical fat distribution or highly muscular builds, where skinfold calipers or a DEXA scan will be more precise.",
  },
  {
    question: "What do the categories (Essential Fat, Athletic, Fitness, Average, Obese) mean?",
    answer:
      'These are the American Council on Exercise (ACE) body fat classification bands. "Essential fat" is the minimum needed for basic physiological health; "Athletic" and "Fitness" describe visibly lean, trained physiques; "Average" covers the typical healthy adult range; "Obese" flags a level associated with higher health risk. They\'re descriptive categories, not a medical diagnosis.',
  },
  {
    question: "Why do I need to remeasure instead of just recalculating BMI?",
    answer:
      "BMI can't distinguish muscle from fat — a muscular person and an out-of-shape person at the same height and weight can have very different BMI-implied body compositions but the same BMI. Because this method uses actual circumference measurements, it responds to real changes in body composition (like gaining muscle while losing fat) that weight and BMI alone would miss.",
  },
];
