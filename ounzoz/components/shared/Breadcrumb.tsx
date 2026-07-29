import Link from 'next/link';
import type { BreadcrumbItem } from '@/types/shared';

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

// Visible breadcrumb navigation — DESIGN.md Section 20. Distinct from the
// BreadcrumbList JSON-LD already present on every tool/category page
// (invisible metadata for search engines only): this renders the same
// Home / Category / Tool path as real on-screen UI, so a visitor always
// has a path back, not just Google.
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-[var(--space-2)] font-[family-name:var(--font-body)] text-[var(--font-size-sm)] text-[var(--color-text-secondary)]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={item.name}
              className="flex items-center gap-[var(--space-2)]"
            >
              {isLast || !item.href ? (
                <span
                  className="text-[var(--color-text-primary)]"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-cyan)]"
                >
                  {item.name}
                </Link>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
