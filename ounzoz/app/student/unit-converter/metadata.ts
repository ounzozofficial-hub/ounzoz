import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/student/unit-converter';

// OG image convention per DESIGN.md Section 22: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/student/unit-converter.png';

export const metadata: Metadata = {
  title: 'Unit Converter — Length, Weight, Temp & Volume | OUNZOZ',
  description:
    'Convert length, weight, temperature, and volume units instantly — free, accurate, and works entirely in your browser.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Unit Converter — Length, Weight, Temp & Volume',
    description:
      'Convert length, weight, temperature, and volume units instantly.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
