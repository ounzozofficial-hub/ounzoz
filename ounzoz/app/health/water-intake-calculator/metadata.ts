import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/health/water-intake-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/health/water-intake-calculator.png';

export const metadata: Metadata = {
  title: 'Water Intake Calculator — Daily Hydration Needs | OUNZOZ',
  description:
    'Estimate how much water to drink daily based on your weight and activity level — free, instant, and easy to use.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Water Intake Calculator — Daily Hydration Needs',
    description:
      'Estimate how much water to drink daily based on your weight and activity level.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
