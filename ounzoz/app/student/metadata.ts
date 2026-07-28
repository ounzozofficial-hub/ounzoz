import type { Metadata } from 'next';

const CATEGORY_URL = 'https://ounzoz.com/student';

export const metadata: Metadata = {
  title: 'Student Calculators — Free Academic Tools | OUNZOZ',
  description:
    'Free, instant calculators for students — GPA, grades, and study planning. No signup, no data stored.',
  alternates: {
    canonical: CATEGORY_URL,
  },
  openGraph: {
    title: 'Student Calculators — Free Academic Tools',
    description:
      'Free, instant calculators for students — GPA, grades, and study planning.',
    url: CATEGORY_URL,
    siteName: 'OUNZOZ',
    type: 'website',
  },
};
