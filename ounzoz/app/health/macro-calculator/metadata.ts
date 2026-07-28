import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/health/macro-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/health/macro-calculator.png';

export const metadata: Metadata = {
  title: 'Macro Calculator — Protein, Fat & Carb Targets | OUNZOZ',
  description:
    'Calculate your daily protein, fat, and carbohydrate targets based on your calorie goal and activity level — free and instant.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Macro Calculator — Protein, Fat & Carb Targets',
    description:
      'Calculate your daily protein, fat, and carbohydrate targets based on your calorie goal and activity level.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
