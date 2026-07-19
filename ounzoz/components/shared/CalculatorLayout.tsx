import type { ReactNode } from 'react';

export interface CalculatorLayoutProps {
  /** The tool name, matching search intent exactly — e.g. "BMI Calculator". Rendered as the page's one <h1>. */
  title: string;
  /** One-line plain-language description directly under the H1. */
  description: string;
  /** The input panel (a Card containing labeled Inputs + one primary Button). */
  inputSlot: ReactNode;
  /** The ResultCard (empty/error/success state). */
  resultSlot: ReactNode;
  /** The 150–300 word explanatory content block (ArticleLayout). */
  contentSlot: ReactNode;
  /** The FAQ accordion. */
  faqSlot: ReactNode;
  /** 2–4 related-tool links. */
  relatedToolsSlot: ReactNode;
}

// The signature page template — DESIGN.md Section 11 and SEO.md Section 2
// define the same fixed structural order for every tool page:
// H1 + description → tool (input + result) → explanatory content → FAQ →
// related tools. This component is composition-only: it owns layout and
// slot order, never calculation logic or specific tool content (that's
// Phase 3, one file per tool under app/{category}/{tool-slug}/).
//
// SEO.md Section 2 rule: the tool must be usable before any explanatory
// content is read — input/result slots sit directly under the H1, ahead
// of the content, FAQ, and related-tools slots.
export function CalculatorLayout({
  title,
  description,
  inputSlot,
  resultSlot,
  contentSlot,
  faqSlot,
  relatedToolsSlot,
}: CalculatorLayoutProps) {
  return (
    <div className="mx-auto flex max-w-[var(--content-max-width)] flex-col gap-[var(--space-7)] px-4 py-[var(--space-7)] md:px-6">
      <header className="flex flex-col gap-[var(--space-2)]">
        <h1 className="font-[var(--font-display)] text-[var(--font-size-2xl)] font-extrabold text-[var(--color-text-primary)]">
          {title}
        </h1>
        <p className="font-[var(--font-body)] text-[var(--font-size-lg)] text-[var(--color-text-secondary)]">
          {description}
        </p>
      </header>

      {/* Input + Result: stacked on mobile, side-by-side on desktop once
          a result exists (DESIGN.md Section 11). Individual tool pages
          decide when to reveal the two-column arrangement; this shell
          simply provides the grid. */}
      <section
        aria-label="Calculator"
        className="grid grid-cols-1 gap-[var(--space-5)] md:grid-cols-2"
      >
        <div>{inputSlot}</div>
        <div>{resultSlot}</div>
      </section>

      <section aria-label="About this tool">{contentSlot}</section>

      <section aria-label="Frequently asked questions">{faqSlot}</section>

      <section aria-label="Related tools">{relatedToolsSlot}</section>
    </div>
  );
}
