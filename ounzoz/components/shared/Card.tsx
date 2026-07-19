import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// DESIGN.md Section 10: surface background, 1px border, radius-md,
// space-5 (24px) padding desktop / space-4 (16px) mobile, shadow-sm at
// rest. Used as the base for the input panel, result panel, related-tool
// links, and FAQ item containers.
export function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-4)] shadow-[var(--shadow-sm)] md:p-[var(--space-5)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
