import Link from 'next/link';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const PAGE_URL = 'https://ounzoz.com/about';

// SEO.md Section 5: schema reflects actual page content only — a
// standalone informational page, not a tool or category hub.
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://ounzoz.com/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'About',
      item: PAGE_URL,
    },
  ],
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About' },
];

const BODY_CLASSES =
  'font-[family-name:var(--font-body)] text-[var(--font-size-base)] leading-relaxed text-[var(--color-text-secondary)]';
const LINK_CLASSES =
  'text-[var(--color-text-primary)] underline decoration-[var(--color-border)] underline-offset-2 hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-cyan)]';

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* DESIGN.md Section 1/2: the About page is a brand-defining
          surface, carrying the full Navy/Cyan identity (same navy
          background token as Header/Footer) rather than the light,
          tool-page-default theme. */}
      <div className="w-full bg-[var(--color-brand-navy)]">
        <div className="mx-auto flex max-w-[var(--content-max-width)] flex-col gap-[var(--space-2)] px-4 py-[var(--space-8)] md:px-6">
          <span className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-white">
            OUNZO<span className="text-[var(--color-brand-cyan)]">Z</span>
          </span>
          <p className="max-w-xl font-[family-name:var(--font-body)] text-[var(--font-size-lg)] text-white/70">
            Fast, practical, single-purpose calculators — no signup, no
            cost, no wasted time.
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-[var(--content-max-width)] flex-col gap-[var(--space-6)] px-4 py-[var(--space-7)] md:px-6">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex max-w-3xl flex-col gap-[var(--space-4)]">
          <h1 className="font-[family-name:var(--font-display)] text-[var(--font-size-2xl)] font-extrabold text-[var(--color-text-primary)]">
            About OUNZOZ
          </h1>

          <p className={BODY_CLASSES}>
            OUNZOZ is a free collection of fast, single-purpose web
            calculators — covering health, finance, and everyday student
            math — built around one idea: get the answer without friction.
            No account to create, no app to download, no paywall between
            you and a number you need right now.
          </p>

          <p className={BODY_CLASSES}>
            Every tool here runs entirely in your browser. When you
            calculate a BMI, a loan payment, or a GPA, the numbers you
            enter are used only to compute the result on your own device —
            nothing is sent to or stored on a server, because there&apos;s
            no server-side account system behind this site at all. What
            you see is what the site does.
          </p>

          <p className={BODY_CLASSES}>
            OUNZOZ is built and maintained by an independent developer,
            not a company with a marketing department — which is also why
            the tools stay narrowly focused rather than trying to be a
            do-everything platform. New calculators get added over time,
            existing ones get corrected when something&apos;s wrong, and
            there&apos;s no roadmap beyond making useful tools and keeping
            them accurate.
          </p>

          <p className={BODY_CLASSES}>
            The site is free to use and supported by advertising (Google
            AdSense), which covers hosting costs and lets every calculator
            stay free with no sign-up required. Full details on what that
            means for your privacy are on the{' '}
            <Link href="/privacy-policy" className={LINK_CLASSES}>
              Privacy Policy
            </Link>{' '}
            page.
          </p>

          <p className={BODY_CLASSES}>
            Found something wrong with a calculator, or have a tool you
            wish existed? Get in touch — the{' '}
            <Link href="/contact" className={LINK_CLASSES}>
              Contact
            </Link>{' '}
            page has the details.
          </p>
        </div>
      </div>
    </>
  );
}
