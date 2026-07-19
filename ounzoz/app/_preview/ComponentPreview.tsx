'use client';

import { useState } from 'react';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Card } from '@/components/shared/Card';
import { ResultCard } from '@/components/shared/ResultCard';
import { CalculatorLayout } from '@/components/shared/CalculatorLayout';
import { FAQ } from '@/components/shared/FAQ';
import { ArticleLayout } from '@/components/shared/ArticleLayout';

const SAMPLE_FAQ_ITEMS = [
  {
    question: 'Is this preview section part of the real component library?',
    answer:
      'No — the components above it are the real, reusable library. This section only exists to visually verify them before Phase 3 and will be removed once a real calculator exists to test against.',
  },
  {
    question: 'Why does the FAQ open the first item by default?',
    answer:
      'Just for this preview, so the collapsed vs. expanded states are both visible at a glance without clicking.',
  },
  {
    question: 'Can this accordion be operated with a keyboard?',
    answer:
      'Yes — each question is a native button with aria-expanded/aria-controls, so Tab and Enter/Space work without any extra handling.',
  },
];

// TEMPORARY — Phase 2 visual verification only.
// Demonstrates every component built in this phase so they can be
// reviewed with no real calculator to test them against yet. Remove this
// entire section (and its import in page.tsx) once Phase 3 ships a real
// tool page to verify against instead.
//
// Note: the CalculatorLayout demo below renders its own <h1>, which
// means this preview page temporarily has two <h1> elements — a
// violation of the one-H1 rule that applies to real pages (CLAUDE.md
// Section 15 / SEO.md Section 2). That's acceptable here only because
// this whole section is scaffolding, not a real page, and gets deleted
// before Phase 3.
export function ComponentPreview() {
  const [demoValue, setDemoValue] = useState('');

  return (
    <div className="flex flex-col gap-[var(--space-8)] border-t-4 border-dashed border-[var(--color-brand-yellow)] bg-[var(--color-background)] py-[var(--space-8)]">
      <div className="mx-auto w-full max-w-[var(--content-max-width)] px-4 md:px-6">
        <p className="inline-block rounded-[var(--radius-full)] bg-[var(--color-brand-yellow)] px-[var(--space-4)] py-[var(--space-1)] font-[var(--font-body)] text-[var(--font-size-sm)] font-semibold text-[var(--color-brand-navy)]">
          Component Preview — Phase 2 (temporary, remove before Phase 3)
        </p>
      </div>

      {/* Button */}
      <PreviewBlock title="Button">
        <div className="flex flex-wrap items-center gap-[var(--space-4)]">
          <Button variant="primary">Calculate</Button>
          <Button variant="secondary">Reset</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </PreviewBlock>

      {/* Input */}
      <PreviewBlock title="Input">
        <div className="grid grid-cols-1 gap-[var(--space-5)] md:grid-cols-3">
          <Input
            label="Weight (kg)"
            placeholder="e.g. 70"
            helperText="Enter your weight in kilograms"
            value={demoValue}
            onChange={(e) => setDemoValue(e.target.value)}
          />
          <Input label="Height (cm)" placeholder="e.g. 175" />
          <Input
            label="Age"
            placeholder="e.g. 30"
            defaultValue="-5"
            errorText="Age must be a positive number"
          />
        </div>
      </PreviewBlock>

      {/* Card */}
      <PreviewBlock title="Card">
        <Card>
          <p className="font-[var(--font-body)] text-[var(--font-size-base)] text-[var(--color-text-primary)]">
            Base container — surface background, border, radius-md,
            shadow-sm at rest. Every other panel on a tool page is built
            on top of this.
          </p>
        </Card>
      </PreviewBlock>

      {/* ResultCard — all three states */}
      <PreviewBlock title="ResultCard">
        <div className="grid grid-cols-1 gap-[var(--space-5)] md:grid-cols-3">
          <div className="flex flex-col gap-[var(--space-2)]">
            <span className="font-[var(--font-body)] text-[var(--font-size-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              Empty state
            </span>
            <ResultCard
              state="empty"
              message="Enter your weight and height to see your BMI"
            />
          </div>
          <div className="flex flex-col gap-[var(--space-2)]">
            <span className="font-[var(--font-body)] text-[var(--font-size-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              Error state
            </span>
            <ResultCard
              state="error"
              message="Height must be greater than zero"
            />
          </div>
          <div className="flex flex-col gap-[var(--space-2)]">
            <span className="font-[var(--font-body)] text-[var(--font-size-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
              Success state
            </span>
            <ResultCard
              state="success"
              label="Your BMI"
              value="22.4"
              unit="kg/m²"
              description="Normal weight"
            />
          </div>
        </div>
      </PreviewBlock>

      {/* ArticleLayout */}
      <PreviewBlock title="ArticleLayout">
        <ArticleLayout
          title="About the BMI Calculator"
          sourceCitation="Formula based on WHO BMI standards."
        >
          <p>
            This is placeholder explanatory copy standing in for the real
            150–300 word content block a tool page will provide in Phase
            3. It demonstrates heading hierarchy (H2 here, since the page
            H1 belongs to CalculatorLayout) and paragraph spacing using
            the same typography tokens as the rest of the design system.
          </p>
        </ArticleLayout>
      </PreviewBlock>

      {/* FAQ */}
      <PreviewBlock title="FAQ">
        <FAQ items={SAMPLE_FAQ_ITEMS} />
      </PreviewBlock>

      {/* CalculatorLayout — full page-template shell */}
      <PreviewBlock title="CalculatorLayout (full shell)">
        <div className="overflow-hidden rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)]">
          <CalculatorLayout
            title="Sample Calculator"
            description="A placeholder tool page assembled entirely from the slots above — no real calculation logic, Phase 3 territory."
            inputSlot={
              <Card>
                <div className="flex flex-col gap-[var(--space-4)]">
                  <Input label="Sample input" placeholder="e.g. 42" />
                  <Button variant="primary">Calculate</Button>
                </div>
              </Card>
            }
            resultSlot={
              <ResultCard
                state="empty"
                message="Enter a value to see a result"
              />
            }
            contentSlot={
              <ArticleLayout title="About this sample tool">
                <p>
                  Placeholder explanatory content demonstrating where a
                  real tool&apos;s 150–300 word content block will live.
                </p>
              </ArticleLayout>
            }
            faqSlot={<FAQ items={SAMPLE_FAQ_ITEMS.slice(0, 2)} />}
            relatedToolsSlot={
              <div className="flex flex-col gap-[var(--space-3)]">
                <h2 className="font-[var(--font-body)] text-[var(--font-size-xl)] font-semibold text-[var(--color-text-primary)]">
                  Related tools
                </h2>
                <div className="grid grid-cols-1 gap-[var(--space-3)] md:grid-cols-2">
                  <Card>Related tool placeholder A</Card>
                  <Card>Related tool placeholder B</Card>
                </div>
              </div>
            }
          />
        </div>
      </PreviewBlock>
    </div>
  );
}

function PreviewBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[var(--content-max-width)] flex-col gap-[var(--space-4)] px-4 md:px-6">
      <h2 className="font-[var(--font-body)] text-[var(--font-size-sm)] font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">
        {title}
      </h2>
      {children}
    </div>
  );
}
