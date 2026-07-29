export interface CategoryTool {
  name: string;
  description: string;
  href: string;
}

// Single source of truth for every live Health tool — CLAUDE.md Section 4:
// static config belongs in constants/, not duplicated wherever it's
// needed. Used by the /health hub page to render its tool grid AND by
// app/sitemap.ts to build the sitemap, so the two can never drift apart
// the way sitemap.ts's old hand-maintained slug list did.
export const HEALTH_TOOLS: CategoryTool[] = [
  {
    name: 'BMI Calculator',
    description: 'Check your Body Mass Index and WHO weight category.',
    href: '/health/bmi-calculator',
  },
  {
    name: 'BMR Calculator',
    description: 'Estimate your Basal Metabolic Rate.',
    href: '/health/bmr-calculator',
  },
  {
    name: 'TDEE Calculator',
    description: 'Find your Total Daily Energy Expenditure.',
    href: '/health/tdee-calculator',
  },
  {
    name: 'Body Fat Calculator',
    description: 'Estimate body fat percentage using the U.S. Navy method.',
    href: '/health/body-fat-calculator',
  },
  {
    name: 'Ideal Weight Calculator',
    description: 'See an estimated healthy weight range for your height.',
    href: '/health/ideal-weight-calculator',
  },
  {
    name: 'Calorie Calculator',
    description: 'Find your daily calorie target for your goal.',
    href: '/health/calorie-calculator',
  },
  {
    name: 'Water Intake Calculator',
    description: 'Estimate your daily water intake.',
    href: '/health/water-intake-calculator',
  },
  {
    name: 'Protein Intake Calculator',
    description: 'Estimate your daily protein target.',
    href: '/health/protein-intake-calculator',
  },
  {
    name: 'Macro Calculator',
    description: 'Get your daily protein, fat, and carb targets.',
    href: '/health/macro-calculator',
  },
  {
    name: 'Pregnancy Due Date Calculator',
    description: 'Estimate your due date from your last period.',
    href: '/health/pregnancy-due-date-calculator',
  },
];
