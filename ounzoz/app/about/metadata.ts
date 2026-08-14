import type { Metadata } from 'next';

const PAGE_URL = 'https://ounzoz.com/about';

export const metadata: Metadata = {
  title: 'About | OUNZOZ',
  description:
    'What OUNZOZ is, how the free browser-based calculators work, and who builds them.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'About | OUNZOZ',
    description:
      'What OUNZOZ is, how the free browser-based calculators work, and who builds them.',
    url: PAGE_URL,
    siteName: 'OUNZOZ',
    type: 'website',
  },
};
