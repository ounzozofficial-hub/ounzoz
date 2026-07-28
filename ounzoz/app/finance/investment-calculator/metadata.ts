import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/finance/investment-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/finance/investment-calculator.png';

export const metadata: Metadata = {
  title: 'Investment Calculator — Project Your Investment Growth | OUNZOZ',
  description:
    'Project how an initial investment and monthly contributions could grow over time at a return you choose — free, instant, and easy to use.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Investment Calculator — Project Your Investment Growth',
    description:
      'Project how an initial investment and monthly contributions could grow over time at a return you choose.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
