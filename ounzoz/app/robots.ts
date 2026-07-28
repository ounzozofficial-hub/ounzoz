import type { MetadataRoute } from 'next';

// SEO.md Section 9: robots.txt must explicitly allow crawling of every
// tool/category page — "no accidental blocking of content that should
// be indexed," a direct, deliberate lesson from a prior project. Next's
// metadata-route convention (this file → /robots.txt at build time)
// keeps it in one place alongside sitemap.ts rather than a hand-edited
// static file that can drift out of sync.
const BASE_URL = 'https://ounzoz.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
