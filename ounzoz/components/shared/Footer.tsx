import Link from 'next/link';

interface FooterColumn {
  category: string;
  href: string;
  tools: { name: string; href: string }[];
}

// All three V1 category hubs and a cross-section of their tools are now
// live, so the footer links to real pages instead of Phase 1's "Coming
// soon" placeholder text. Each category heading links to its hub (which
// lists every tool in that category); the 4 tools below it are a
// cross-section, not the exhaustive list, mirroring the same
// "curated, not exhaustive" link pattern used for Related Tools
// (SEO.md Section 7) rather than repeating every tool in the footer.
const FOOTER_COLUMNS: FooterColumn[] = [
  {
    category: 'Health',
    href: '/health',
    tools: [
      { name: 'BMI Calculator', href: '/health/bmi-calculator' },
      { name: 'Calorie Calculator', href: '/health/calorie-calculator' },
      { name: 'TDEE Calculator', href: '/health/tdee-calculator' },
      { name: 'Macro Calculator', href: '/health/macro-calculator' },
    ],
  },
  {
    category: 'Finance',
    href: '/finance',
    tools: [
      { name: 'Loan Calculator', href: '/finance/loan-calculator' },
      { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Savings Calculator', href: '/finance/savings-calculator' },
      { name: 'Currency Converter', href: '/finance/currency-converter' },
    ],
  },
  {
    category: 'Student',
    href: '/student',
    tools: [
      { name: 'GPA Calculator', href: '/student/gpa-calculator' },
      { name: 'Grade Calculator', href: '/student/grade-calculator' },
      { name: 'Statistics Calculator', href: '/student/statistics-calculator' },
      { name: 'Unit Converter', href: '/student/unit-converter' },
    ],
  },
];

const FOOTER_LINK_CLASSES =
  'text-white/50 transition-colors duration-150 hover:text-white/90 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-cyan)]';

// Site footer — DESIGN.md Section 1 & 2: brand-defining surface, navy
// background.
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[var(--color-brand-navy)]">
      <div className="mx-auto max-w-[var(--content-max-width)] px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <span className="font-[family-name:var(--font-display)] text-lg font-extrabold text-white">
              OUNZO<span className="text-[var(--color-brand-cyan)]">Z</span>
            </span>
            <p className="mt-3 max-w-xs font-[family-name:var(--font-body)] text-sm text-white/60">
              Fast, practical, trustworthy tools — starting with calculators.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.category}>
              <h2 className="font-[family-name:var(--font-body)] text-sm font-semibold text-white">
                <Link
                  href={column.href}
                  className="transition-colors duration-150 hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-cyan)]"
                >
                  {column.category}
                </Link>
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {column.tools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className={`font-[family-name:var(--font-body)] text-sm ${FOOTER_LINK_CLASSES}`}
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-body)] text-xs text-white/40">
            © {year} OUNZOZ. All rights reserved.
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li>
                <Link href="/about" className={`text-xs ${FOOTER_LINK_CLASSES}`}>
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className={`text-xs ${FOOTER_LINK_CLASSES}`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`text-xs ${FOOTER_LINK_CLASSES}`}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    <div className="mt-4 flex justify-center"><a href="https://www.saashub.com/ounzoz?utm_source=badge&utm_campaign=badge&utm_content=ounzoz&badge_variant=color&badge_kind=approved" target="_blank" rel="noopener noreferrer"><img src="https://cdn-b.saashub.com/img/badges/approved-color.png?v=1" alt="OUNZOZ badge" style={{ maxWidth: "150px" }} /></a></div>
    </footer>
  );
}
