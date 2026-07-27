import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/health/protein-intake-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/health/protein-intake-calculator.png';

export const metadata: Metadata = {
  title: 'Protein Intake Calculator — Daily Protein Target | OUNZOZ',
  description:
    'Estimate your daily protein target based on your weight and activity level, from the RDA baseline up to active/athletic ranges.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Protein Intake Calculator — Daily Protein Target',
    description:
      'Estimate your daily protein target based on your weight and activity level, from the RDA baseline up to active/athletic ranges.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
