import type { CategoryTool } from './health-tools';

// Single source of truth for every live Finance tool — see
// constants/health-tools.ts for why this lives here rather than being
// duplicated in the hub page and the sitemap separately.
export const FINANCE_TOOLS: CategoryTool[] = [
  {
    name: 'Loan Calculator',
    description: 'Estimate your monthly loan payment and total interest.',
    href: '/finance/loan-calculator',
  },
  {
    name: 'Mortgage Calculator',
    description: 'Estimate your monthly mortgage payment.',
    href: '/finance/mortgage-calculator',
  },
  {
    name: 'Compound Interest Calculator',
    description: 'See how a lump sum grows over time with compounding.',
    href: '/finance/compound-interest-calculator',
  },
  {
    name: 'Savings Calculator',
    description: 'See how your deposits and monthly savings can grow.',
    href: '/finance/savings-calculator',
  },
  {
    name: 'Investment Calculator',
    description: 'Project how your investments could grow over time.',
    href: '/finance/investment-calculator',
  },
  {
    name: 'Percentage Calculator',
    description: 'Find a percentage, a percent share, or a percent change.',
    href: '/finance/percentage-calculator',
  },
  {
    name: 'Currency Converter',
    description: 'Convert between major currencies using live ECB reference rates.',
    href: '/finance/currency-converter',
  },
];
