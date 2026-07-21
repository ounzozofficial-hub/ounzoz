import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/health/tdee-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as BMI and BMR.
const OG_IMAGE_PATH = '/og/health/tdee-calculator.png';

export const metadata: Metadata = {
  title: 'TDEE Calculator — Find Your Daily Calorie Burn | OUNZOZ',
  description:
    'Calculate your Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor formula and your activity level — free and instant.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'TDEE Calculator — Find Your Daily Calorie Burn',
    description:
      'Calculate your Total Daily Energy Expenditure using the Mifflin-St Jeor formula and your activity level.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
