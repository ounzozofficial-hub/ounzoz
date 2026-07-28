# DESIGN.md — OUNZOZ Design System

**Version:** 1.0.0
**Status:** Approved
**Last Updated:** 2026-07-18

This file is the single source of truth for every visual and interaction decision on OUNZOZ. It works alongside `CLAUDE.md` (Section 12: Design Consistency — no tool may introduce a one-off style outside this system) and `PROJECT.md` (product vision).

**Core principle:** OUNZOZ is Light-first Interface + OUNZOZ Brand Identity. Tool pages prioritize clarity and ease of use (light theme by default); brand-defining surfaces (logo, header, footer, primary buttons, illustrations, About page, 404 page) carry the full Navy/Cyan/Yellow identity. Dark Mode is available platform-wide as a toggle, using the same brand palette.

---

## 1. Brand Identity

**What OUNZOZ should feel like:** precise, fast, quietly confident — like a well-made instrument, not a decorated toy. The personality comes from restraint and clarity, not from heavy branding on every screen. A user solving a loan calculation should feel like they're using something built by people who care about getting the number right, not people trying to sell them something.

**Signature element:** the tool result itself. Every calculator's output — the number, the answer — is the one moment on each page allowed to be visually confident (larger scale, brand accent color, clear emphasis). Everything else on a tool page stays quiet and disciplined so that the result is what the user's eye lands on.

**Avoid:** generic SaaS-template look (rounded gradient blobs, oversized emoji, stock illustration people). OUNZOZ's doodle-style brand illustration (established in existing YouTube/social assets) is the platform's visual voice where illustration is used — not generic flat-icon-pack art.

---

## 2. Color System (Design Tokens)

All colors are defined as CSS custom properties (design tokens), never hardcoded inside components. This is mandatory — see `CLAUDE.md` Section 12.

### Token definitions

```css
:root {
  /* Light theme (default) */
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-border: #E2E8F0;

  /* Brand (constant across themes) */
  --color-brand-navy: #0B1120;
  --color-brand-cyan: #22D3EE;
  --color-brand-yellow: #FFD600;

  /* Semantic */
  --color-success: #16A34A;
  --color-error: #DC2626;
  --color-warning: #D97706;
}

[data-theme="dark"] {
  --color-background: #0B1120;
  --color-surface: #111827;
  --color-text-primary: #F8FAFC;
  --color-text-secondary: #94A3B8;
  --color-border: #1E293B;
}
```

### Usage rules

| Token | Where it's used |
|---|---|
| `--color-background` | Page background on tool/content pages |
| `--color-surface` | Cards, input containers, panels |
| `--color-text-primary` | Headings, primary body text, calculator results |
| `--color-text-secondary` | Helper text, captions, FAQ text, metadata |
| `--color-border` | Input borders, card borders, dividers |
| `--color-brand-navy` | Logo, header background, footer background, About/404 pages |
| `--color-brand-cyan` | Primary buttons, active states, result highlights, links |
| `--color-brand-yellow` | Secondary accents, icons, checkmarks, small highlight moments — used sparingly, never as a large fill |
| `--color-success` / `--color-error` / `--color-warning` | Form validation states, **and** non-validation advisory/safety notices where a result is technically valid but the user should see a caution (e.g., a calculated value falling below a recommended safe minimum). Reserved for genuinely important information the user must not miss — not decorative emphasis. |

**Rule:** Cyan and yellow are accent colors, not backgrounds. Never fill a large surface area with either — they exist to draw the eye to one thing at a time (a button, a result, a highlight), not to decorate.

---

## 3. Typography

**Display/Brand face:** Poppins ExtraBold — used for the logo, page H1s, and the calculator result number specifically (the signature moment defined in Section 1).

**Body face:** Inter — used for all body text, form labels, FAQ content, and explanatory paragraphs. Inter is chosen over Poppins for body text because its numeral legibility and neutral, highly-readable letterforms are better suited to long-form reading and data-dense content than a geometric display face.

**Type scale:**

```css
--font-size-xs: 0.75rem;    /* 12px — captions, fine print */
--font-size-sm: 0.875rem;   /* 14px — helper text, labels */
--font-size-base: 1rem;     /* 16px — body text */
--font-size-lg: 1.125rem;   /* 18px — lead paragraphs */
--font-size-xl: 1.5rem;     /* 24px — card headings, H2 */
--font-size-2xl: 2rem;      /* 32px — page H1 */
--font-size-result: 3rem;   /* 48px — the calculator result number (signature element) */
```

**Weight usage:**
- Poppins ExtraBold (800) — logo, H1, calculator result only
- Inter Semibold (600) — H2, H3, button labels
- Inter Regular (400) — body text, form input text
- Inter Medium (500) — form labels, navigation

**Rule:** never introduce a third typeface. Never use Poppins for body paragraphs — it reduces readability at small sizes and reads as decorative rather than functional there.

---

## 4. Grid & Spacing System

**Grid:** 12-column responsive grid, max content width `1280px`, centered, with `24px` gutters on desktop and `16px` on mobile.

**Spacing scale** (used for all margin/padding — no arbitrary spacing values allowed):

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;
```

**Rule:** every spacing decision in every component must use one of these tokens. If a layout seems to need a value outside this scale, that is a signal to reconsider the layout — not to add a one-off pixel value.

---

## 5. Border Radius

```css
--radius-sm: 6px;   /* inputs, small buttons, badges */
--radius-md: 10px;  /* cards, containers */
--radius-lg: 16px;  /* hero sections, large panels */
--radius-full: 999px; /* pills, toggle switches */
```

**Rule:** no sharp (0px) corners anywhere — this is a deliberate, consistent softness across the platform, distinct from the "zero-radius broadsheet" look. No radius value outside this scale.

---

## 6. Shadow System

```css
--shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06);
--shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08);
--shadow-lg: 0 12px 32px rgba(15, 23, 42, 0.12);
```

- `--shadow-sm` — default card resting state
- `--shadow-md` — hover state on interactive cards, active dropdowns
- `--shadow-lg` — modals, the result panel when a calculation completes

**Rule:** shadows are always this soft, neutral, dark-based tint — never colored shadows (no cyan-glow or yellow-glow effects). Keep shadows subtle; this is a utility product, not a marketing hero page.

---

## 7. Icons

- Icon style: simple, consistent line-icon set (1.5px stroke weight), matching the restrained, precise brand personality — not filled/glyph icons, not multi-color icon packs.
- Icon color follows text color by default (`--color-text-secondary`); only use brand cyan/yellow for an icon when it is functioning as an accent (e.g., a success checkmark, an active tab indicator).
- Standard sizes: `16px` (inline with text), `20px` (buttons, form fields), `24px` (section headers, empty states).

---

## 8. Buttons

**Primary button** (main calculator action — "Calculate", "Convert"):
- Background: `--color-brand-cyan`
- Text: `--color-brand-navy` (dark text on cyan for contrast, not white)
- Border radius: `--radius-sm`
- Height: `44px` desktop / `48px` mobile (larger touch target)
- Hover: slightly darkened cyan, `--shadow-sm`
- Focus: visible `2px` outline in `--color-brand-navy`, offset `2px` — never remove focus outlines

**Secondary button** (e.g., "Reset", "Clear"):
- Background: transparent
- Border: `1px solid --color-border`
- Text: `--color-text-primary`

**Rule:** every tool page has exactly one primary button. Never two competing primary actions on the same screen.

---

## 9. Forms

- Input height: `44px` desktop / `48px` mobile.
- Input border: `1px solid --color-border`, `--radius-sm`.
- Input focus state: border changes to `--color-brand-cyan`, `2px`.
- Label position: always above the input (never placeholder-as-label — placeholders disappear on input, which harms usability, especially on mobile).
- Helper text: `--font-size-sm`, `--color-text-secondary`, positioned directly below the input.
- Error state: border becomes `--color-error`, helper text switches to the specific validation message (per `CLAUDE.md` Section 8 — Error Handling Standard), text color `--color-error`.

---

## 10. Cards

- Background: `--color-surface`
- Border: `1px solid --color-border`
- Border radius: `--radius-md`
- Padding: `--space-5` (24px) desktop / `--space-4` (16px) mobile
- Shadow: `--shadow-sm` at rest, `--shadow-md` on hover if interactive (e.g., a related-tool card)

Used for: the calculator input panel, the result panel, related-tool links, FAQ items (as an accordion within a card container).

---

## 11. Calculator Layout (Signature Page Template)

Every tool page follows this consistent structure, top to bottom:

```
┌─────────────────────────────┐
│ H1 + one-line description    │
├─────────────────────────────┤
│                               │
│   INPUT CARD                 │
│   (labeled fields + Primary  │
│    button, per Section 9)    │
│                               │
├─────────────────────────────┤
│                               │
│   RESULT PANEL                │
│   (appears after calculation, │
│    uses --font-size-result,   │
│    the signature moment)      │
│                               │
├─────────────────────────────┤
│  Explanatory content          │
│  (150–300 words, formula      │
│   source citation)            │
├─────────────────────────────┤
│  FAQ (accordion cards)        │
├─────────────────────────────┤
│  Related Tools (2–4 cards)    │
└─────────────────────────────┘
```

- On desktop, the Input Card and Result Panel may sit side-by-side once a result exists (two-column), collapsing to stacked on mobile.
- The Result Panel is visually the most prominent element on the page after a calculation runs — this is the signature moment from Section 1.

### 11.1 Advisory Slot (Result Panel)

Some tools produce a result that is technically valid but warrants a caution — most commonly health/safety tools where a calculated value falls outside a recommended safe range (e.g., a calorie target below a safe minimum, a BMI in an extreme range). The Result Panel (`ResultCard`) supports an optional **advisory slot**:

- Rendered as a distinct line/block directly below the main result value, inside the Result Panel — not as a separate floating element outside it.
- Uses `--color-warning` text/icon treatment per Section 2's extended usage rule — never `--color-error` (the result is not invalid, just worth a second look) and never plain `--color-text-secondary` (this under-communicates genuinely important information).
- Never blocks, clamps, or alters the displayed result — it only adds context. The user always sees their real calculated number.
- Optional by design: most tools never trigger this slot. It exists specifically for cases where showing a number without context could be misread as an unqualified recommendation.

This is a shared `ResultCard` capability, available to any current or future tool — not something reimplemented per tool.

### 11.2 Breakdown Grid (Result Panel)

Some tools don't produce one headline number — their result is a small set of co-equal named values (e.g., a macro split: protein / fat / carbohydrates). Forcing a single number to be "the" signature value would misrepresent the result, and cramming multiple numbers into the description line (Section 11.1's plain text) reads as clutter, not the confident, quiet-everything-else signature moment defined in Section 1. The Result Panel (`ResultCard`) supports an optional **breakdown grid** for exactly this case:

- Mutually exclusive with the standard single `value` — a tool's result uses one or the other, never both.
- Renders as an equal-weight row of stat tiles (one per value), each with its own small label above a number, at a smaller scale than the standard `--font-size-result` (this is a set of results, not the one signature number) — `--font-size-xl` is the right scale, matching card-heading weight.
- A smaller context line (using the existing `description` slot) sits above the grid when there's a natural "total" the breakdown sums to (e.g., total daily calories above a protein/fat/carb grid) — optional, since not every breakdown has a natural total.
- Still lives inside the same Result Panel card, with the same `shadow-lg` treatment and fade/slide-in entrance as every other success state (Section 6, Section 15) — this is a variant of the signature moment, not a different component.
- Tiles stack to a single column on narrow mobile widths if 3+ values don't comfortably fit side by side, per Section 12's mobile-first rule.

This is a shared `ResultCard` capability, available to any current or future tool whose result is genuinely multi-valued — not something reimplemented per tool, and not used just to show two numbers side by side when one is clearly primary (that's still a single `value` + `description`, per Section 11.1's existing pattern).

---

## 12. Mobile Design

- Mobile-first: every component is designed at `375px` width first, then scaled up.
- Touch targets minimum `44×44px` (buttons, inputs, tab controls).
- No hover-dependent functionality — anything triggered by `:hover` on desktop must have a tap/click equivalent on mobile.
- Sticky primary button on long tool pages (calculators with several inputs) so the action is always reachable without scrolling back up.
- Single-column layout below `768px` breakpoint.

---

## 13. Desktop Design

- Breakpoints: `768px` (tablet), `1024px` (small desktop), `1280px` (max content width).
- Two-column layout allowed once a result exists (Section 11).
- Sidebar (category navigation / related tools) may appear on wide desktop viewports (`1280px`+) but is never required for core functionality — it's a discovery aid, not a dependency.

---

## 14. Dark Theme

- Toggled via a visible, accessible control in the header (not hidden in a settings menu).
- Uses the `[data-theme="dark"]` token overrides defined in Section 2 — no component-level dark-mode logic; theming is entirely token-driven.
- Brand accent colors (cyan, yellow) remain the same hex values in both themes — only background/surface/text tokens shift. This keeps brand recognition consistent across themes.
- Respect the user's OS-level preference (`prefers-color-scheme`) as the initial state on first visit, then remember their explicit toggle choice afterward.

---

## 15. Motion Guidelines

Motion is used to clarify state changes, never to decorate.

- **Allowed:** subtle fade/slide-in (150–200ms) when a Result Panel appears after calculation; smooth accordion expand/collapse on FAQ items; gentle color transition (150ms) on button hover/focus states.
- **Not allowed:** page-load animation sequences, scroll-triggered reveals, bouncing/elastic easing, animated gradients, decorative background motion. This is a utility product used repeatedly — motion that's charming once becomes annoying on the 50th visit.
- Respect `prefers-reduced-motion`: all transitions must be disabled or reduced to near-instant for users with this preference set.
- Standard easing: `ease-out` for entrances, `ease-in` for exits, `150–200ms` duration for micro-interactions.

---

## 16. Accessibility Rules

(Extends `CLAUDE.md` Section 16 — this section defines the visual/design side specifically.)

- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text (18px+) and UI components, per WCAG AA.
- Focus states are always visible or use only the defined focus tokens (Section 8) — never `outline: none` without a replacement.
- Color is never the only signal for state (error, success, active) — always paired with text, an icon, or a shape change.
- All interactive elements reachable and operable via keyboard alone, in a logical top-to-bottom, left-to-right tab order matching the visual layout (typically: Input 1 → Input 2 → ... → Primary Button → Result → FAQ).

---

## 17. Empty States

Shown before the user has entered any input.

- Never a blank white space where the result will appear.
- Show a quiet placeholder inside the Result Panel area: a muted icon + one short line of guidance (e.g., "Enter your weight and height to see your BMI"), styled with `--color-text-secondary` — not styled like an error.
- Tone: inviting, not apologetic. This is an invitation to act, not a gap to explain.

---

## 18. Loading States

Even though calculations are near-instant client-side, a consistent loading pattern is still required for calculators that involve any async step (e.g., currency conversion needing a live exchange rate).

- Button shows a brief inline spinner (replacing the label text temporarily) rather than disabling silently — the user should always see the system acknowledged their action.
- If a result depends on external data (like a live exchange rate), show a skeleton-loading version of the Result Panel rather than a blank space.
- No loading state should ever exceed roughly 2–3 seconds without a visible progress indicator; if it might, show a clear "still working" message.

---

## 19. Error States

(Extends `CLAUDE.md` Section 8 — Error Handling Standard — this defines the visual treatment specifically.)

- Field-level errors: red border (`--color-error`) + specific helper text directly below the field. Never a generic toast for a fixable input error — the error lives next to the thing that caused it.
- Page-level/unexpected errors (e.g., a calculation genuinely fails): a calm message inside the Result Panel area, in the interface's voice, explaining what happened and what to do next — never a raw error message, stack trace, or blank crash.
- Error text is direct and specific ("Enter a number between 1 and 120 for age") — never vague ("Something went wrong") unless the failure is genuinely unexpected and unclassifiable, in which case: "We couldn't calculate that — please check your inputs and try again."

---

## 20. Logo System

### Official versions

1. **Full Logo** — Symbol + "OUNZOZ" + "Smart Tools" tagline. Used where there's room to establish full brand context (hero sections, About page header, promotional materials).
2. **Horizontal Logo** — Symbol + "OUNZOZ" (no tagline). Used in constrained horizontal spaces (header bar, footer).
3. **Symbol Only** — the OZ icon alone. Used where space is minimal (mobile header on small viewports, app icon, social media avatar).
4. **Monochrome** — pure black and pure white versions, for contexts where the brand colors can't be used (e.g., printed materials, single-color contexts, watermarks).
5. **UI Flat Version** — no glow, no blur, clean SVG. This is the only version used in-product: Header, Footer, Favicon, PWA icon, Apple Touch icon, and any future in-app usage. Matches the flat, glow-free visual language defined in Section 6 (Shadow System).
6. **Marketing Version** — the original soft-glow version. Used only for promotional/external materials: homepage hero, About page, ad creatives, social media, pitch materials. Never used in functional UI chrome (headers, favicons, small-scale contexts) where the glow degrades at small sizes.

### Sizing & spacing rules

```
Minimum clear space = 0.5x logo height (on all sides, no other element may enter this space)

Minimum size:
- Desktop: 180px (horizontal logo width)
- Mobile: 140px (horizontal logo width)
- Favicon: Symbol only, no text
```

### File naming & format convention

```
logo.svg              — UI flat version, full color
logo-dark.svg          — UI flat version, for dark theme surfaces
logo-light.svg         — UI flat version, for light theme surfaces
icon.svg               — Symbol only, UI flat version
favicon.ico            — Symbol only
apple-touch-icon.png   — Symbol only, 180×180px
og-image.png           — Marketing version, for social/link previews (1200×630px)
```

**Rule:** Claude Code must always use the UI Flat Version (`logo.svg` family) for any in-product placement (header, footer, favicon, app icons). The Marketing Version is never wired into functional UI — only used as a static asset on marketing-purpose pages (Hero, About) where explicitly called for.

---

## 21. Source of Truth

This file works alongside:
- `CLAUDE.md` — technical rules, including Section 12 (Design Consistency enforcement) and Section 16 (Accessibility)
- `PROJECT.md` — product vision and brand positioning
- `SEO.md` — page structure requirements that intersect with layout (Section 11 above)

If any instruction in a conversation conflicts with this file, this file wins unless the project owner explicitly overrides it for that specific task.

---

*Version 1.0.0 — Approved. No further design decisions are added until a genuine, proven need arises during or after V1 build — not speculative additions.*
