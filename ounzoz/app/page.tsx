import Link from 'next/link';
import { Button } from '@/components/shared/Button';
import { RelatedToolCard } from '@/components/shared/RelatedToolCard';

// Cross-section of shipped tools, two per category (DESIGN.md Section 21:
// "one or two per category ... an immediate concrete sense of 'here's
// what you can actually do here'"). Descriptions match the copy already
// used for these tools on their category hub pages — reusing the same
// accurate one-line description isn't the "duplicate content" SEO.md
// warns against (that applies to the 150–300 word explanatory blocks).
const FEATURED_TOOLS = [
  {
    name: 'BMI Calculator',
    description: 'Check your Body Mass Index and WHO weight category.',
    href: '/health/bmi-calculator',
  },
  {
    name: 'Calorie Calculator',
    description: 'Find your daily calorie target for your goal.',
    href: '/health/calorie-calculator',
  },
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
    name: 'GPA Calculator',
    description:
      'Calculate your grade point average from your grades and credit hours.',
    href: '/student/gpa-calculator',
  },
  {
    name: 'Unit Converter',
    description: 'Convert length, weight, temperature, and volume units.',
    href: '/student/unit-converter',
  },
];

// Trust/value strip — DESIGN.md Section 21: the exact credibility signal
// a first-time visitor (and, later, an AdSense reviewer) looks for.
// Simple line icons per Section 7 (1.5px stroke, currentColor).
const VALUE_PROPS = [
  {
    label: 'Fast',
    description: 'Instant results, no signup required.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
      </svg>
    ),
  },
  {
    label: 'Accurate',
    description: 'Every formula sourced and cited.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3 4 6v5c0 4.5 3 8 8 10 5-2 8-5.5 8-10V6l-8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    label: 'Free',
    description: 'No account needed, ever.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3.24L4 3v5.59a2 2 0 0 0 .59 1.41l9.59 9.59a2 2 0 0 0 2.82 0l3.59-3.59a2 2 0 0 0 0-2.59Z" />
        <circle cx="8" cy="8" r="1.2" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-[var(--space-8)] pb-[var(--space-8)]">
      {/* Hero — H1 + tagline + category CTAs, with a subtle brand-accent
          background treatment behind it (DESIGN.md Section 21). */}
      <section className="hero-background">
        <div className="mx-auto flex max-w-[var(--content-max-width)] flex-col items-center px-4 py-20 text-center md:px-6 md:py-28">
          <h1 className="font-[family-name:var(--font-display)] text-[var(--font-size-2xl)] font-extrabold text-[var(--color-text-primary)]">
            OUNZOZ
          </h1>
          <p className="mt-[var(--space-4)] max-w-lg font-[family-name:var(--font-body)] text-[var(--font-size-lg)] text-[var(--color-text-secondary)]">
            Fast, practical, trustworthy tools — starting with calculators
            for health, finance, and school.
          </p>
          <div className="mt-[var(--space-6)] flex flex-wrap items-center justify-center gap-[var(--space-4)]">
            <Link href="/health">
              <Button variant="primary">Explore Health Calculators</Button>
            </Link>
            <Link href="/finance">
              <Button variant="secondary">Explore Finance Calculators</Button>
            </Link>
            <Link href="/student">
              <Button variant="secondary">Explore Student Calculators</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured tools strip — DESIGN.md Section 21: a concrete look at
          real tools, one/two per category, reusing the same tool-card
          component as the category hub pages (no one-off card style). */}
      <section
        aria-label="Featured tools"
        className="mx-auto w-full max-w-[var(--content-max-width)] px-4 md:px-6"
      >
        <h2 className="font-[family-name:var(--font-body)] text-[var(--font-size-xl)] font-semibold text-[var(--color-text-primary)]">
          Popular tools
        </h2>
        <div className="mt-[var(--space-5)] grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2 md:grid-cols-3">
          {FEATURED_TOOLS.map((tool) => (
            <RelatedToolCard key={tool.name} {...tool} />
          ))}
        </div>
      </section>
{/* Shop strip */}
      <section
        aria-label="Digital Products"
        className="mx-auto w-full max-w-[var(--content-max-width)] px-4 md:px-6"
      >
        <div className="flex items-center justify-between mb-[var(--space-5)]">
          <h2 className="font-[family-name:var(--font-body)] text-[var(--font-size-xl)] font-semibold text-[var(--color-text-primary)]">
            Digital Products
          </h2>
          <a
            href="/shop"
            className="text-[var(--color-brand-cyan)] text-sm font-semibold hover:underline"
          >
            View all →
          </a>
        </div>
        <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2 md:grid-cols-3">
          <a href="/shop" className="block rounded-xl border border-[var(--color-brand-cyan)]/20 bg-[var(--color-surface-card)] p-6 hover:border-[var(--color-brand-cyan)]/60 transition-colors">
            <div className="text-[var(--color-brand-cyan)] text-xs font-bold tracking-widest mb-2">PLANNERS</div>
            <div className="font-bold text-[var(--color-text-primary)] text-lg mb-1">Daily & Weekly Planners</div>
            <div className="text-[var(--color-text-secondary)] text-sm mb-4">Printable PDF planners — undated, minimal, instant download.</div>
            <div className="text-[var(--color-brand-yellow)] font-bold">From $4.99 →</div>
          </a>
          <a href="/shop" className="block rounded-xl border border-[var(--color-brand-cyan)]/20 bg-[var(--color-surface-card)] p-6 hover:border-[var(--color-brand-cyan)]/60 transition-colors">
            <div className="text-[var(--color-brand-cyan)] text-xs font-bold tracking-widest mb-2">KIDS</div>
            <div className="font-bold text-[var(--color-text-primary)] text-lg mb-1">Kids & Education</div>
            <div className="text-[var(--color-text-secondary)] text-sm mb-4">Printable worksheets, coloring books & activity packs for ages 3–8.</div>
            <div className="text-[var(--color-brand-yellow)] font-bold">From $3.99 →</div>
          </a>
          <a href="/shop" className="block rounded-xl border border-[var(--color-brand-cyan)]/20 bg-[var(--color-surface-card)] p-6 hover:border-[var(--color-brand-cyan)]/60 transition-colors">
            <div className="text-[var(--color-brand-cyan)] text-xs font-bold tracking-widest mb-2">AI TOOLS</div>
            <div className="font-bold text-[var(--color-text-primary)] text-lg mb-1">AI Prompts Master Pack</div>
            <div className="text-[var(--color-text-secondary)] text-sm mb-4">160 copy-paste ready prompts for ChatGPT, Claude & Gemini.</div>
            <div className="text-[var(--color-brand-yellow)] font-bold">$2.00 →</div>
          </a>
        </div>
      </section>
      {/* Trust/value strip — DESIGN.md Section 21. */}
      <section
        aria-label="Why OUNZOZ"
        className="mx-auto w-full max-w-[var(--content-max-width)] px-4 md:px-6"
      >
        <div className="grid grid-cols-1 gap-[var(--space-5)] sm:grid-cols-3">
          {VALUE_PROPS.map((prop) => (
            <div
              key={prop.label}
              className="flex flex-col items-center gap-[var(--space-3)] text-center sm:items-start sm:text-left"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-full)] bg-[color-mix(in_srgb,var(--color-brand-cyan)_12%,transparent)] text-[var(--color-brand-cyan)]">
                {prop.icon}
              </span>
              <div>
                <h3 className="font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
                  {prop.label}
                </h3>
                <p className="mt-[var(--space-1)] font-[family-name:var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
                  {prop.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
