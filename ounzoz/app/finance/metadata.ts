import type { Metadata } from 'next';

const CATEGORY_URL = 'https://ounzoz.com/finance';

export const metadata: Metadata = {
  title: 'Finance Calculators — Loan, Mortgage & More | OUNZOZ',
  description:
    'Free finance calculators: loan payments, mortgage payments, compound interest, savings, investment growth, and percentages.',
  alternates: {
    canonical: CATEGORY_URL,
  },
  openGraph: {
    title: 'Finance Calculators — Loan, Mortgage & More',
    description:
      'Free finance calculators: loan payments, mortgage payments, compound interest, savings, investment growth, and percentages.',
    url: CATEGORY_URL,
    siteName: 'OUNZOZ',
    type: 'website',
  },
};
