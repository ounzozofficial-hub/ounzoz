import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

// DESIGN.md Section 8:
// - Primary: cyan bg, navy text (not white — contrast rule), radius-sm,
//   44px desktop / 48px mobile height, darker-cyan hover + shadow-sm,
//   2px navy focus outline offset 2px.
// - Secondary: transparent bg, 1px border-color, primary text color.
// - Rule: every tool page has exactly one primary button — enforced by
//   usage discipline in tool pages, not by this component.
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-brand-cyan)] text-[var(--color-brand-navy)] hover:bg-[color-mix(in_srgb,var(--color-brand-cyan)_85%,black)] hover:shadow-[var(--shadow-sm)]',
  secondary:
    'bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-surface)]',
};

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex h-11 md:h-11 items-center justify-center rounded-[var(--radius-sm)] px-[var(--space-5)] font-[var(--font-body)] text-[var(--font-size-base)] font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-navy)] disabled:cursor-not-allowed disabled:opacity-50 max-md:h-12 ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
