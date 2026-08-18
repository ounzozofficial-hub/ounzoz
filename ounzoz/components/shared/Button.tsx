import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

// DESIGN.md Section 8:
// - Primary: navy bg, cyan text, cyan border, radius-sm,
//   44px desktop / 48px mobile height, darker-cyan hover + shadow-sm,
//   2px navy focus outline offset 2px.
// - Secondary: navy bg, cyan text, cyan border.
// - Rule: every tool page has exactly one primary button — enforced by
//   usage discipline in tool pages, not by this component.
const variantClasses: Record<ButtonVariant, string> = {
    primary:
    'bg-[var(--color-brand-navy)] text-[var(--color-brand-cyan)] border border-[var(--color-brand-cyan)] hover:bg-[color-mix(in_srgb,var(--color-brand-navy)_85%,var(--color-brand-cyan))] hover:shadow-[var(--shadow-sm)]',
    secondary:
    'bg-[var(--color-brand-navy)] text-[var(--color-brand-cyan)] border border-[var(--color-brand-cyan)] hover:bg-[color-mix(in_srgb,var(--color-brand-navy)_85%,var(--color-brand-cyan))]',
};

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex h-11 md:h-11 items-center justify-center rounded-[var(--radius-sm)] px-[var(--space-5)] font-[family-name:var(--font-body)] text-[var(--font-size-base)] font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-navy)] disabled:cursor-not-allowed disabled:opacity-50 max-md:h-12 ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
