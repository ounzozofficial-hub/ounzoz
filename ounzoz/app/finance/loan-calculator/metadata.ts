import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/finance/loan-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/finance/loan-calculator.png';

export const metadata: Metadata = {
  title: 'Loan Calculator — Estimate Your Monthly Payment | OUNZOZ',
  description:
    'Calculate your estimated monthly loan payment, total interest, and total cost — free, instant, and easy to use.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Loan Calculator — Estimate Your Monthly Payment',
    description:
      'Calculate your estimated monthly loan payment, total interest, and total cost.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
