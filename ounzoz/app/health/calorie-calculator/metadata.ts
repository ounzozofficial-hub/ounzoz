import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/health/calorie-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as BMI, BMR, TDEE.
const OG_IMAGE_PATH = '/og/health/calorie-calculator.png';

export const metadata: Metadata = {
  title: 'Calorie Calculator — Daily Calorie Target for Your Goal | OUNZOZ',
  description:
    'Calculate your daily calorie target to lose, maintain, or gain weight, based on your TDEE — free, instant, and includes a safety check.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Calorie Calculator — Daily Calorie Target for Your Goal',
    description:
      'Calculate your daily calorie target to lose, maintain, or gain weight, based on your TDEE.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
