import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/student/statistics-calculator';

// OG image convention per DESIGN.md Section 22: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/student/statistics-calculator.png';

export const metadata: Metadata = {
  title: 'Statistics Calculator — Mean, Median, Mode | OUNZOZ',
  description:
    'Find the mean, median, mode, and standard deviation of any data set instantly — paste your numbers, get every result at once.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Statistics Calculator — Mean, Median, Mode, Std Dev',
    description:
      'Find the mean, median, mode, and standard deviation of any data set instantly.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
