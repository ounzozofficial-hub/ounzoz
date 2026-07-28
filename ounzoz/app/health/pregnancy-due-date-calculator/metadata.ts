import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/health/pregnancy-due-date-calculator';

// OG image convention per DESIGN.md Section 20: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/health/pregnancy-due-date-calculator.png';

export const metadata: Metadata = {
  title: 'Pregnancy Due Date Calculator — Estimate Your Due Date | OUNZOZ',
  description:
    "Estimate your baby's due date from the first day of your last period, using Naegele's Rule. Free, instant, and clearly marked as an estimate.",
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Pregnancy Due Date Calculator — Estimate Your Due Date',
    description:
      "Estimate your baby's due date from the first day of your last period, using Naegele's Rule.",
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
