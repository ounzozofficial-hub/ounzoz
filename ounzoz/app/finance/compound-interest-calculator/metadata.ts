import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/finance/compound-interest-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/finance/compound-interest-calculator.png';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator — See Your Money Grow | OUNZOZ',
  description:
    'Calculate how compound interest grows your money over time, with a choice of compounding frequency — free, instant, and easy to use.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Compound Interest Calculator — See Your Money Grow',
    description:
      'Calculate how compound interest grows your money over time, with a choice of compounding frequency.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
