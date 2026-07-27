import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/health/ideal-weight-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/health/ideal-weight-calculator.png';

export const metadata: Metadata = {
  title: 'Ideal Weight Calculator — Devine Formula | OUNZOZ',
  description:
    'Estimate your ideal body weight using the Devine formula, the most widely used reference weight formula in clinical practice.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Ideal Weight Calculator — Devine Formula',
    description:
      'Estimate your ideal body weight using the Devine formula, the most widely used reference weight formula in clinical practice.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
