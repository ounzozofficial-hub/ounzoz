import type { Metadata } from 'next';

const CATEGORY_URL = 'https://ounzoz.com/health';

export const metadata: Metadata = {
  title: 'Health Calculators — BMI, Calorie, Macro & More | OUNZOZ',
  description:
    'Free health calculators: BMI, BMR, TDEE, calorie, macro, body fat, ideal weight, water intake, protein intake, and pregnancy due date.',
  alternates: {
    canonical: CATEGORY_URL,
  },
  openGraph: {
    title: 'Health Calculators — BMI, Calorie, Macro & More',
    description:
      'Free health calculators: BMI, BMR, TDEE, calorie, macro, body fat, ideal weight, water intake, protein intake, and pregnancy due date.',
    url: CATEGORY_URL,
    siteName: 'OUNZOZ',
    type: 'website',
  },
};
