import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/student/study-time-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/student/study-time-calculator.png';

export const metadata: Metadata = {
  title: 'Study Time Calculator — Plan Your Exam Prep | OUNZOZ',
  description:
    'Split your available study time evenly across your exam topics based on your deadline and daily schedule — free, instant, and easy to use.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Study Time Calculator — Plan Your Exam Prep',
    description:
      'Split your available study time evenly across your exam topics based on your deadline and daily schedule.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
