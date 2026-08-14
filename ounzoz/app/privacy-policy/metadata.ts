import type { Metadata } from 'next';

const PAGE_URL = 'https://ounzoz.com/privacy-policy';

export const metadata: Metadata = {
  title: 'Privacy Policy | OUNZOZ',
  description:
    "How OUNZOZ handles data: no accounts or server-side storage, what Google AdSense and Vercel Analytics collect, and your GDPR/CCPA rights.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Privacy Policy | OUNZOZ',
    description:
      "How OUNZOZ handles data: no accounts or server-side storage, what Google AdSense and Vercel Analytics collect, and your GDPR/CCPA rights.",
    url: PAGE_URL,
    siteName: 'OUNZOZ',
    type: 'website',
  },
};
