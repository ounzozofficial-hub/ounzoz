import Link from 'next/link';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const PAGE_URL = 'https://ounzoz.com/privacy-policy';

// SEO.md Section 5: schema reflects actual page content only — this is a
// standalone legal/informational page, not a tool or category hub, so
// only BreadcrumbList applies here. No FAQPage/SoftwareApplication.
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
      name: 'Privacy Policy',
      item: PAGE_URL,
    },
  ],
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Privacy Policy' },
];

// Shared typography for this page's section headings/body — same tokens
// ArticleLayout uses for its h2/body pattern (DESIGN.md Section 12: reuse
// the shared design system, no one-off styles), inlined here the same
// way every tool page already inlines its own h3 className string.
const SECTION_HEADING_CLASSES =
  'font-[family-name:var(--font-body)] text-[var(--font-size-xl)] font-semibold text-[var(--color-text-primary)]';
const BODY_CLASSES =
  'font-[family-name:var(--font-body)] text-[var(--font-size-base)] leading-relaxed text-[var(--color-text-secondary)]';
const LINK_CLASSES =
  'text-[var(--color-text-primary)] underline decoration-[var(--color-border)] underline-offset-2 hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-cyan)]';

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto flex max-w-[var(--content-max-width)] flex-col gap-[var(--space-7)] px-4 py-[var(--space-7)] md:px-6">
        <header className="flex flex-col gap-[var(--space-2)]">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="font-[family-name:var(--font-display)] text-[var(--font-size-2xl)] font-extrabold text-[var(--color-text-primary)]">
            Privacy Policy
          </h1>
          <p className={`max-w-2xl text-[var(--font-size-lg)] ${BODY_CLASSES}`}>
            Last updated: August 14, 2026. OUNZOZ (&quot;we,&quot;
            &quot;us,&quot; or &quot;our&quot;) operates ounzoz.com, a
            collection of free, browser-based calculators. This policy
            explains what information is — and mostly isn&apos;t —
            collected when you use this site, how it&apos;s used, and the
            choices available to you.
          </p>
        </header>

        <div className="flex max-w-3xl flex-col gap-[var(--space-6)]">
          <section className="flex flex-col gap-[var(--space-3)]">
            <h2 className={SECTION_HEADING_CLASSES}>
              How the calculators work: no accounts, no server-side storage
            </h2>
            <p className={BODY_CLASSES}>
              Every calculator on this site — from the BMI Calculator to
              the Loan Calculator — runs entirely in your own browser. The
              numbers you type in (your weight, your income, your grades,
              or anything else) are used only to compute a result on your
              device; they are never sent to, or stored on, any OUNZOZ
              server. There are no user accounts, no sign-up, and no
              database behind this site — it&apos;s built as a static,
              client-side application by design, not as a privacy feature
              added afterward.
            </p>
          </section>

          <section className="flex flex-col gap-[var(--space-3)]">
            <h2 className={SECTION_HEADING_CLASSES}>
              Cookies and local storage
            </h2>
            <p className={BODY_CLASSES}>
              OUNZOZ itself sets one piece of data on your device: your
              light/dark theme preference, saved in your browser&apos;s
              local storage so the site remembers your choice on your next
              visit. That preference stays on your device and is never
              transmitted anywhere. Beyond that, this site doesn&apos;t use
              its own tracking or advertising cookies — the cookies
              described below belong to the third-party services listed
              next.
            </p>
          </section>

          <section className="flex flex-col gap-[var(--space-3)]">
            <h2 className={SECTION_HEADING_CLASSES}>
              Advertising (Google AdSense)
            </h2>
            <p className={BODY_CLASSES}>
              This site displays ads served by Google AdSense. Google and
              its advertising partners use cookies and similar
              technologies to serve ads based on your prior visits to this
              and other websites, and — where legally required — to obtain
              your consent before doing so. If you&apos;re visiting from
              the European Economic Area, the UK, or Switzerland, you may
              be shown a consent message before any personalized
              advertising cookies are set, in line with Google&apos;s EU
              User Consent Policy.
            </p>
            <p className={BODY_CLASSES}>
              You can learn more about how Google uses information from
              sites that use its services at{' '}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                className={LINK_CLASSES}
                target="_blank"
                rel="noopener noreferrer"
              >
                policies.google.com/technologies/partner-sites
              </a>
              , and see Google&apos;s advertising privacy practices at{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                className={LINK_CLASSES}
                target="_blank"
                rel="noopener noreferrer"
              >
                policies.google.com/technologies/ads
              </a>
              . You can opt out of personalized advertising from Google at
              any time via{' '}
              <a
                href="https://adssettings.google.com/"
                className={LINK_CLASSES}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Ad Settings
              </a>
              , or opt out more broadly across participating companies via
              the industry choice tools at{' '}
              <a
                href="https://optout.aboutads.info/"
                className={LINK_CLASSES}
                target="_blank"
                rel="noopener noreferrer"
              >
                optout.aboutads.info
              </a>{' '}
              (US) or{' '}
              <a
                href="https://www.youronlinechoices.eu/"
                className={LINK_CLASSES}
                target="_blank"
                rel="noopener noreferrer"
              >
                youronlinechoices.eu
              </a>{' '}
              (EU). Opting out doesn&apos;t stop ads from showing — it
              means the ads you see are no longer based on your browsing
              activity.
            </p>
          </section>

          <section className="flex flex-col gap-[var(--space-3)]">
            <h2 className={SECTION_HEADING_CLASSES}>
              Analytics (Vercel Web Analytics)
            </h2>
            <p className={BODY_CLASSES}>
              OUNZOZ uses Vercel Web Analytics to understand overall
              traffic patterns — which pages are visited and how often —
              so the site can be improved. This analytics tool
              doesn&apos;t use cookies; it identifies visits with a
              short-lived hash generated from the incoming request rather
              than tracking individuals, and it doesn&apos;t collect
              information that could identify you personally or follow you
              across other websites. Session data is automatically
              discarded after 24 hours. You can read Vercel&apos;s own
              documentation on this at{' '}
              <a
                href="https://vercel.com/docs/analytics/privacy-policy"
                className={LINK_CLASSES}
                target="_blank"
                rel="noopener noreferrer"
              >
                vercel.com/docs/analytics/privacy-policy
              </a>
              .
            </p>
          </section>

          <section className="flex flex-col gap-[var(--space-3)]">
            <h2 className={SECTION_HEADING_CLASSES}>
              Your privacy rights (GDPR &amp; CCPA)
            </h2>
            <p className={BODY_CLASSES}>
              If you&apos;re located in the European Economic Area, the
              UK, or Switzerland, the GDPR gives you the right to access,
              correct, delete, or restrict the personal data processed
              about you, to object to that processing, to receive your
              data in a portable format, and to lodge a complaint with
              your local data protection authority. Because OUNZOZ itself
              doesn&apos;t collect or store personal data, these rights
              are primarily exercised directly with Google for any data
              processed through AdSense — the opt-out and information
              links above are the fastest way to do that, or you can reach
              us using the contact details below and we&apos;ll help
              however we can.
            </p>
            <p className={BODY_CLASSES}>
              If you&apos;re a California resident, the CCPA and CPRA give
              you the right to know what personal information is
              collected about you, to request its deletion, and to opt out
              of the &quot;sale&quot; or &quot;sharing&quot; of personal
              information — which can include the kind of ad-personalization
              data AdSense uses. OUNZOZ doesn&apos;t sell any personal
              information. To opt out of ad personalization specifically,
              use the Google and industry opt-out links in the Advertising
              section above, or contact us directly.
            </p>
          </section>

          <section className="flex flex-col gap-[var(--space-3)]">
            <h2 className={SECTION_HEADING_CLASSES}>
              Children&apos;s privacy
            </h2>
            <p className={BODY_CLASSES}>
              OUNZOZ is not directed at children under 13, and we
              don&apos;t knowingly collect personal information from
              anyone in that age group. If you believe a child has
              provided personal information through this site, contact us
              using the details below and we&apos;ll address it.
            </p>
          </section>

          <section className="flex flex-col gap-[var(--space-3)]">
            <h2 className={SECTION_HEADING_CLASSES}>
              Changes to this policy
            </h2>
            <p className={BODY_CLASSES}>
              We may update this policy as the site or its
              advertising/analytics providers change. The &quot;last
              updated&quot; date at the top reflects the most recent
              revision — check back periodically if you have ongoing
              concerns.
            </p>
          </section>

          <section className="flex flex-col gap-[var(--space-3)]">
            <h2 className={SECTION_HEADING_CLASSES}>Contact us</h2>
            <p className={BODY_CLASSES}>
              Questions about this policy or how your information is
              handled? Email{' '}
              <a
                href="mailto:ounzoz.official@gmail.com"
                className={LINK_CLASSES}
              >
                ounzoz.official@gmail.com
              </a>{' '}
              or visit the{' '}
              <Link href="/contact" className={LINK_CLASSES}>
                Contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
