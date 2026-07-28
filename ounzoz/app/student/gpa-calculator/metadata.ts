import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/student/gpa-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/student/gpa-calculator.png';

export const metadata: Metadata = {
  title: 'GPA Calculator — Calculate Your Grade Point Average | OUNZOZ',
  description:
    'Calculate your GPA from your course grades and credit hours on the standard 4.0 scale — free, instant, and easy to use.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'GPA Calculator — Calculate Your Grade Point Average',
    description:
      'Calculate your GPA from your course grades and credit hours on the standard 4.0 scale.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
