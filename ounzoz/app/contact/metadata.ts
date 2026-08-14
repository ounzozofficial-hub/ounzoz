import type { Metadata } from 'next';

const PAGE_URL = 'https://ounzoz.com/contact';

export const metadata: Metadata = {
  title: 'Contact | OUNZOZ',
  description:
    'Reach the OUNZOZ team with questions, corrections, or tool suggestions.',
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: 'Contact | OUNZOZ',
    description:
      'Reach the OUNZOZ team with questions, corrections, or tool suggestions.',
    url: PAGE_URL,
    siteName: 'OUNZOZ',
    type: 'website',
  },
};
