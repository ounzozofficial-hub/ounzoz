import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/student/fraction-calculator';

// OG image convention per DESIGN.md Section 22: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/student/fraction-calculator.png';

export const metadata: Metadata = {
  title: 'Fraction Calculator — Simplify Instantly | OUNZOZ',
  description:
    'Add, subtract, multiply, or divide two fractions and get the simplified result instantly, with decimal and mixed-number forms.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Fraction Calculator — Add, Subtract, Multiply, Divide',
    description:
      'Add, subtract, multiply, or divide two fractions and get the simplified result instantly.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
