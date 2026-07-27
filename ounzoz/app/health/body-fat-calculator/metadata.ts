import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/health/body-fat-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/health/body-fat-calculator.png';

export const metadata: Metadata = {
  title: 'Body Fat Calculator — US Navy Method | OUNZOZ',
  description:
    'Estimate your body fat percentage using the US Navy circumference method — free, instant, no calipers or scan required.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Body Fat Calculator — US Navy Method',
    description:
      'Estimate your body fat percentage using the US Navy circumference method — no calipers or scan required.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
