'use client';

import { useId, useState } from 'react';
import { Card } from './Card';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQProps {
  /** 3–6 genuinely useful question/answer pairs per SEO.md Section 6. */
  items: FAQItem[];
}

// FAQ accordion — SEO.md Section 6: 3–6 real questions per tool, concise
// plain-language answers, expand/collapse. Marked up with FAQPage schema
// at the page level once real content exists (SEO.md Section 5) — this
// component only owns the interactive presentation.
//
// Built with native <button aria-expanded> per item (no div-with-onClick,
// per CLAUDE.md Section 16 / DESIGN.md Section 16) so it's keyboard
// operable and screen-reader friendly out of the box.
export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  function toggle(index: number) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <div className="flex flex-col gap-[var(--space-3)]">
      <h2 className="font-[var(--font-body)] text-[var(--font-size-xl)] font-semibold text-[var(--color-text-primary)]">
        Frequently asked questions
      </h2>
      <div className="flex flex-col gap-[var(--space-3)]">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const buttonId = `${baseId}-button-${index}`;
          const panelId = `${baseId}-panel-${index}`;

          return (
            <Card key={item.question} className="p-0">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-4)] text-left font-[var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--color-brand-cyan)] md:px-[var(--space-5)]"
                >
                  <span>{item.question}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`shrink-0 text-[var(--color-text-secondary)] transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </h3>
              {isOpen ? (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="px-[var(--space-4)] pb-[var(--space-4)] font-[var(--font-body)] text-[var(--font-size-base)] text-[var(--color-text-secondary)] md:px-[var(--space-5)]"
                >
                  {item.answer}
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
