import Link from 'next/link';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import type { BreadcrumbItem } from '@/types/shared';

export { metadata } from './metadata';

const PAGE_URL = 'https://ounzoz.com/contact';
const CONTACT_EMAIL = 'ounzoz.official@gmail.com';

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
      name: 'Contact',
      item: PAGE_URL,
    },
  ],
};

const breadcrumbItems: BreadcrumbItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Contact' },
];

const BODY_CLASSES =
  'font-[family-name:var(--font-body)] text-[var(--font-size-base)] leading-relaxed text-[var(--color-text-secondary)]';
const LINK_CLASSES =
  'text-[var(--color-text-primary)] underline decoration-[var(--color-border)] underline-offset-2 hover:decoration-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-cyan)]';

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto flex max-w-[var(--content-max-width)] flex-col gap-[var(--space-6)] px-4 py-[var(--space-7)] md:px-6">
        <header className="flex flex-col gap-[var(--space-2)]">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="font-[family-name:var(--font-display)] text-[var(--font-size-2xl)] font-extrabold text-[var(--color-text-primary)]">
            Contact
          </h1>
          <p className={`max-w-2xl text-[var(--font-size-lg)] ${BODY_CLASSES}`}>
            Have a question, spotted an error in one of the calculators,
            or want to suggest a new tool? Reach out — every message gets
            read.
          </p>
        </header>

        <div className="flex max-w-3xl flex-col gap-[var(--space-4)]">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex h-11 w-fit items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-brand-cyan)] px-[var(--space-5)] font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-brand-navy)] transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--color-brand-cyan)_85%,black)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-navy)]"
          >
            Email {CONTACT_EMAIL}
          </a>

          <p className={BODY_CLASSES}>
            This is a small, independently run site, so there&apos;s no
            support ticket system or guaranteed response time — but
            genuine questions, bug reports, and correction requests do get
            read and acted on. Business or partnership inquiries are
            welcome at the same address.
          </p>

          <p className={BODY_CLASSES}>
            For questions about what information this site does — and
            mostly doesn&apos;t — collect, see the{' '}
            <Link href="/privacy-policy" className={LINK_CLASSES}>
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
