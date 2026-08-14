import type { MetadataRoute } from 'next';
import { HEALTH_TOOLS } from '@/constants/health-tools';
import { FINANCE_TOOLS } from '@/constants/finance-tools';
import { STUDENT_TOOLS } from '@/constants/student-tools';

// SEO.md Section 9: sitemap.xml, generated and kept in sync whenever a
// tool is added. Uses Next's built-in metadata-route convention
// (this file → /sitemap.xml at build time) rather than a hand-maintained
// static XML file or an external dependency, consistent with CLAUDE.md
// Section 14's "no heavy library for something a few lines can do."
//
// Tool routes are derived from the same constants/{category}-tools.ts
// lists each hub page renders its tool grid from, rather than a
// separately hand-maintained slug array — this file's old STUDENT
// slug list silently fell out of sync when 4 Student tools shipped
// (caught via a live sitemap.xml audit), which this structurally
// prevents from happening again: there's only one list per category to
// update, and both the hub page and the sitemap read from it.
//
// BASE_URL matches the canonical/OG domain every page's own metadata.ts
// already uses (CLAUDE.md Section 3 — published URLs never change) —
// this is the platform's permanent domain, not the current Vercel
// preview/production hostname the site happens to be deployed under.
const BASE_URL = 'https://ounzoz.com';

// Every category hub — SEO.md Section 7: hub-and-spoke structure.
const CATEGORY_ROUTES = ['/health', '/finance', '/student'];

// Standalone informational/legal pages — not tools or category hubs, but
// still real, indexable pages every crawler (including AdSense's
// reviewer) should be able to find via the sitemap.
const STATIC_ROUTES = ['/about', '/privacy-policy', '/contact'];

const TOOL_ROUTES = [
  ...HEALTH_TOOLS.map((tool) => tool.href),
  ...FINANCE_TOOLS.map((tool) => tool.href),
  ...STUDENT_TOOLS.map((tool) => tool.href),
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
    ...STATIC_ROUTES.map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
    ...TOOL_ROUTES.map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
