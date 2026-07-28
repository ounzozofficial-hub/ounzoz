import type { MetadataRoute } from 'next';

// SEO.md Section 9: sitemap.xml, generated and kept in sync whenever a
// tool is added. Uses Next's built-in metadata-route convention
// (this file → /sitemap.xml at build time) rather than a hand-maintained
// static XML file or an external dependency, consistent with CLAUDE.md
// Section 14's "no heavy library for something a few lines can do."
//
// BASE_URL matches the canonical/OG domain every page's own metadata.ts
// already uses (CLAUDE.md Section 3 — published URLs never change) —
// this is the platform's permanent domain, not the current Vercel
// preview/production hostname the site happens to be deployed under.
const BASE_URL = 'https://ounzoz.com';

// Every category hub — SEO.md Section 7: hub-and-spoke structure.
const CATEGORY_ROUTES = ['/health', '/finance', '/student'];

// Every tool, grouped by category, in the same order as each category's
// own hub page (PROJECT.md Section 7 roadmap order).
const HEALTH_TOOL_SLUGS = [
  'bmi-calculator',
  'bmr-calculator',
  'tdee-calculator',
  'body-fat-calculator',
  'ideal-weight-calculator',
  'calorie-calculator',
  'water-intake-calculator',
  'protein-intake-calculator',
  'macro-calculator',
  'pregnancy-due-date-calculator',
];

const FINANCE_TOOL_SLUGS = [
  'loan-calculator',
  'mortgage-calculator',
  'compound-interest-calculator',
  'savings-calculator',
  'investment-calculator',
  'percentage-calculator',
  'currency-converter',
];

const STUDENT_TOOL_SLUGS = [
  'gpa-calculator',
  'grade-calculator',
  'study-time-calculator',
];

const TOOL_ROUTES = [
  ...HEALTH_TOOL_SLUGS.map((slug) => `/health/${slug}`),
  ...FINANCE_TOOL_SLUGS.map((slug) => `/finance/${slug}`),
  ...STUDENT_TOOL_SLUGS.map((slug) => `/student/${slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...CATEGORY_ROUTES.map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...TOOL_ROUTES.map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
