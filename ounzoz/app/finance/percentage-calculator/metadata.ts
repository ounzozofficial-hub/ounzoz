import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/finance/percentage-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/finance/percentage-calculator.png';

export const metadata: Metadata = {
  title: 'Percentage Calculator — Find Any Percentage | OUNZOZ',
  description:
    'Calculate what a percentage of a number is, what percent one number is of another, or percentage increase/decrease — free and instant.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Percentage Calculator — Find Any Percentage',
    description:
      'Calculate what a percentage of a number is, what percent one number is of another, or percentage increase/decrease.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
