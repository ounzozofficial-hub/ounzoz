import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/finance/savings-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/finance/savings-calculator.png';

export const metadata: Metadata = {
  title: 'Savings Calculator — Project Your Savings Growth | OUNZOZ',
  description:
    'See how your initial deposit and monthly contributions can grow over time at a given interest rate — free, instant, and easy to use.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Savings Calculator — Project Your Savings Growth',
    description:
      'See how your initial deposit and monthly contributions can grow over time at a given interest rate.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
