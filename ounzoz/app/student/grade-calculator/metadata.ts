import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/student/grade-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/student/grade-calculator.png';

export const metadata: Metadata = {
  title: 'Grade Calculator — Weighted Course Grade | OUNZOZ',
  description:
    'Calculate your overall course grade from weighted categories like homework, quizzes, and exams — free, instant, and easy to use.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Grade Calculator — Weighted Course Grade',
    description:
      'Calculate your overall course grade from weighted categories like homework, quizzes, and exams.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
