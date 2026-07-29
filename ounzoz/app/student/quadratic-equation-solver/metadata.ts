import type { Metadata } from 'next';

const TOOL_URL = 'https://ounzoz.com/student/quadratic-equation-solver';

// OG image convention per DESIGN.md Section 22: og-image.png, marketing
// version, 1200×630px, per-tool path /og/{category}/{slug}.png. File
// doesn't exist yet — same placeholder-path approach as every prior tool.
const OG_IMAGE_PATH = '/og/student/quadratic-equation-solver.png';

export const metadata: Metadata = {
  title: 'Quadratic Equation Solver — Solve for x | OUNZOZ',
  description:
    'Solve ax² + bx + c = 0 instantly — get real or complex roots with the discriminant shown, free and step-free.',
  alternates: {
    canonical: TOOL_URL,
  },
  openGraph: {
    title: 'Quadratic Equation Solver — Solve for x',
    description:
      'Solve ax² + bx + c = 0 instantly — get real or complex roots with the discriminant shown.',
    url: TOOL_URL,
    siteName: 'OUNZOZ',
    images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630 }],
    type: 'website',
  },
};
