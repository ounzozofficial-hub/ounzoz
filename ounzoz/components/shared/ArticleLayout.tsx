import type { ReactNode } from 'react';

export interface ArticleLayoutProps {
  /** Section heading — rendered as H2 (the page's H1 is the tool title, owned by CalculatorLayout). e.g. "About the BMI Calculator" */
  title: string;
  /** 150–300 words of genuinely unique explanatory content (CLAUDE.md Section 15, SEO.md Section 4). Pass paragraphs as children. */
  children: ReactNode;
  /** Formula/standard citation line, e.g. "Formula based on WHO BMI standards." — SEO.md Section 4 requires every tool to cite its source. */
  sourceCitation?: string;
}

// Explanatory content block — CLAUDE.md Section 15 and SEO.md Section 4:
// every tool page needs 150–300 words of genuinely unique content (what
// the tool calculates, why it matters, how to interpret the result),
// with a cited formula source. This component only owns typography and
// structure — the actual per-tool copy is supplied by each tool page in
// Phase 3+, never duplicated or templated across tools.
export function ArticleLayout({
  title,
  children,
  sourceCitation,
}: ArticleLayoutProps) {
  return (
    <article className="flex flex-col gap-[var(--space-4)]">
      <h2 className="font-[var(--font-body)] text-[var(--font-size-xl)] font-semibold text-[var(--color-text-primary)]">
        {title}
      </h2>
      <div className="flex flex-col gap-[var(--space-4)] font-[var(--font-body)] text-[var(--font-size-base)] leading-relaxed text-[var(--color-text-secondary)]">
        {children}
      </div>
      {sourceCitation ? (
        <p className="font-[var(--font-body)] text-[var(--font-size-xs)] text-[var(--color-text-secondary)]">
          {sourceCitation}
        </p>
      ) : null}
    </article>
  );
}
