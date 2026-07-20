import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/health/bmr-calculator';

// OG image convention confirmed per DESIGN.md Section 20 (Logo System,
// file naming): og-image.png, marketing version, 1200×630px. Per-tool
// path pattern confirmed by the project owner: /og/{category}/{slug}.png.
// The actual image file doesn't exist yet — real OG images are a later
// pass — this is a placeholder path, same as BMI Calculator's.
const OG_IMAGE_PATH = '/og/health/bmr-calculator.png';

export const metadata: Metadata = {
  title: 'BMR Calculator — Find Your Basal Metabolic Rate | OUNZOZ',
  description:
    'Calculate your BMR (Basal Metabolic Rate) using the Mifflin-St Jeor formula — accurate, free, and instant.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'BMR Calculator — Find Your Basal Metabolic Rate',
    description:
      'Calculate your BMR using the Mifflin-St Jeor formula — accurate, free, and instant.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
