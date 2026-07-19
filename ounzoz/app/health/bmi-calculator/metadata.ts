import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/health/bmi-calculator';

// NOTE: SEO.md Section 8 requires an Open Graph image "per DESIGN.md
// Section 21 file convention" — but DESIGN.md only has 20 sections; there
// is no Section 21. This is a gap in the source docs, not an assumption
// I'm making silently: I'm using a placeholder path below
// (/og/health/bmi-calculator.png) and flagging it for confirmation. The
// actual image file does not exist yet — generating OG images is outside
// this phase's scope (calculator + content + schema), and the naming/
// sizing convention needs to be defined before any tool page ships with
// a real one.
const OG_IMAGE_PATH = '/og/health/bmi-calculator.png';

export const metadata: Metadata = {
  title: 'BMI Calculator — Check Your Body Mass Index | OUNZOZ',
  description:
    'Calculate your BMI in seconds and see which WHO weight category you fall into — accurate, free, and no sign-up required.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'BMI Calculator — Check Your Body Mass Index',
    description:
      'Calculate your BMI in seconds and see which WHO weight category you fall into.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
