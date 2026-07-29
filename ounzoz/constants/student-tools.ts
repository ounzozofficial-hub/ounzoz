import type { CategoryTool } from './health-tools';

// Single source of truth for every live Student tool — see
// constants/health-tools.ts for why this lives here rather than being
// duplicated in the hub page and the sitemap separately. This is the
// exact gap that let app/sitemap.ts silently miss the 4 tools added in
// the pre-launch category expansion (PROJECT.md Section 7): its own
// hand-maintained slug list didn't get updated alongside this one.
export const STUDENT_TOOLS: CategoryTool[] = [
  {
    name: 'GPA Calculator',
    description: 'Calculate your grade point average from your grades and credit hours.',
    href: '/student/gpa-calculator',
  },
  {
    name: 'Grade Calculator',
    description: 'Calculate your overall course grade from weighted categories.',
    href: '/student/grade-calculator',
  },
  {
    name: 'Study Time Calculator',
    description: 'Plan how much time to spend studying before an exam.',
    href: '/student/study-time-calculator',
  },
  {
    name: 'Quadratic Equation Solver',
    description: 'Solve ax² + bx + c = 0 for x.',
    href: '/student/quadratic-equation-solver',
  },
  {
    name: 'Fraction Calculator',
    description: 'Add, subtract, multiply, or divide two fractions.',
    href: '/student/fraction-calculator',
  },
  {
    name: 'Statistics Calculator',
    description: 'Get the mean, median, mode, and standard deviation of a data set.',
    href: '/student/statistics-calculator',
  },
  {
    name: 'Unit Converter',
    description: 'Convert length, weight, temperature, and volume units.',
    href: '/student/unit-converter',
  },
];
