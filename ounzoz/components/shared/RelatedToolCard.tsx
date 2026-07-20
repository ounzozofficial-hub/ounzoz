import Link from 'next/link';
import { Card } from './Card';

export interface RelatedToolCardProps {
  name: string;
  description: string;
  /** Omit for a tool that hasn't shipped yet — renders a non-interactive "Coming soon" card instead of a dead link. */
  href?: string;
}

// Related-tool card — DESIGN.md Section 10: shadow-sm at rest, shadow-md
// on hover since this is an interactive card (when it links somewhere).
// Extracted to components/shared/ once genuinely needed by 2+ tools
// (CLAUDE.md Section 4 golden rule) — BMI Calculator was the first tool
// to need it, BMR Calculator is the second, and BMI's own related-tools
// list also needed to start linking to BMR at this point.
export function RelatedToolCard({
  name,
  description,
  href,
}: RelatedToolCardProps) {
  if (!href) {
    return (
      <Card className="flex flex-col gap-[var(--space-1)] opacity-70">
        <span className="inline-block w-fit rounded-[var(--radius-full)] bg-[var(--color-background)] px-[var(--space-3)] py-[var(--space-1)] font-[var(--font-body)] text-[var(--font-size-xs)] font-semibold text-[var(--color-text-secondary)]">
          Coming soon
        </span>
        <span className="font-[var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
          {name}
        </span>
        <span className="font-[var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
          {description}
        </span>
      </Card>
    );
  }

  return (
    <Link href={href} className="block">
      <Card className="flex flex-col gap-[var(--space-1)] transition-shadow duration-150 hover:shadow-[var(--shadow-md)]">
        <span className="font-[var(--font-body)] text-[var(--font-size-base)] font-semibold text-[var(--color-text-primary)]">
          {name}
        </span>
        <span className="font-[var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
          {description}
        </span>
      </Card>
    </Link>
  );
}
