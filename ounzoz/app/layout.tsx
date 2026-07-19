import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import './globals.css';

// Display/brand face — DESIGN.md Section 3: Poppins ExtraBold only,
// used for the logo, page H1s, and the calculator result number.
// Self-hosted (next/font/local) rather than fetched from Google Fonts at
// build time — avoids a runtime dependency on fonts.googleapis.com while
// still shipping the same font, zero layout shift, and no external request
// from the visitor's browser (next/font optimizes and serves it locally
// either way).
const poppins = localFont({
  src: '../public/fonts/Poppins-ExtraBold.ttf',
  weight: '800',
  style: 'normal',
  variable: '--font-poppins',
  display: 'swap',
});

// Body face — DESIGN.md Section 3: Inter, used for all body text, form
// labels, FAQ content, and explanatory paragraphs. Inter's variable font
// covers the full weight range (Regular/Medium/Semibold used per Section 3
// weight usage rules) from a single file.
const inter = localFont({
  src: '../public/fonts/Inter-Variable.ttf',
  weight: '400 600',
  style: 'normal',
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ounzoz.com'),
  title: 'OUNZOZ — Fast, Practical Tools',
  description:
    'A global platform of fast, practical, trustworthy tools — starting with calculators.',
};

// Sets data-theme before first paint to avoid a flash of the wrong theme.
// Per DESIGN.md Section 14: respect the OS-level preference
// (prefers-color-scheme) on first visit, then remember the user's
// explicit toggle choice (localStorage) on every visit after that.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('ounzoz-theme');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
