import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/finance/mortgage-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/finance/mortgage-calculator.png';

export const metadata: Metadata = {
  title: 'Mortgage Calculator — Estimate Your Monthly Payment | OUNZOZ',
  description:
    'Calculate your estimated monthly mortgage payment including principal, interest, taxes, insurance, and HOA — free and instant.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Mortgage Calculator — Estimate Your Monthly Payment',
    description:
      'Calculate your estimated monthly mortgage payment including principal, interest, taxes, insurance, and HOA.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
