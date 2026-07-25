# CLAUDE.md — OUNZOZ Tools Platform

**Version:** 1.0.0
**Status:** Approved
**Last Updated:** 2026-07-18

This file is the permanent operating manual for any AI assistant (Claude, Claude Code, or otherwise) working on this codebase. Every rule here is a deliberate decision, not a default. Do not deviate without explicit approval from the project owner.

---

## 1. Project Identity

**Product:** OUNZOZ — a global platform of fast, practical, single-purpose web tools (calculators, converters, and utilities), starting in the health/student/finance niches and expanding over time.

**Positioning:** Not "a tools website." A scalable digital asset. Every technical decision optimizes for a 2–5 year horizon, not just V1.

**V1 Scope:** 20–30 static tools. No login. No database. No subscriptions. No backend. Speed and SEO are the only priorities.

---

## 2. Tech Stack (Locked — Do Not Change Without Explicit Approval)

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Deployment | Vercel |
| Repository | GitHub |
| Rendering | Static-first (SSG wherever possible) |
| Backend | None (V1) |
| Database | None (V1) |
| Auth | None (V1) |

Do not introduce a different framework, CSS approach, state management library, or backend service without the owner explicitly requesting it. If a task seems to require one, stop and flag it instead of adding it silently.

---

## 3. URL & Routing Structure

Every tool gets its own dedicated, permanent URL. No tool lives inside a shared multi-tool page or a modal/tab system.

```
ounzoz.com/{category}/{tool-slug}
```

Examples:
```
/health/bmi-calculator
/health/calorie-calculator
/student/gpa-calculator
/finance/loan-calculator
```

Rules:
- Category slugs are lowercase, singular-or-plural consistently decided per category (decide once, keep forever — do not mix `/tool/` and `/tools/`).
- Tool slugs are lowercase, hyphenated, keyword-descriptive (`bmi-calculator`, not `bmi` or `calc1`).
- Once a tool URL is published and indexed by Google, it must NEVER change. If a tool must be renamed or moved, a 301 redirect is mandatory — this is a hard rule, not a suggestion.

---

## 4. Folder Structure (Feature-Based Architecture)

Organize by feature/domain, not by file type. This is mandatory as the project scales past a handful of tools.

```
app/
└── {category}/
    └── {tool-slug}/
        ├── page.tsx              // Route entry — composition only, no logic
        ├── metadata.ts           // SEO metadata for this specific tool
        └── components/
            ├── {Tool}Calculator.tsx   // Top-level UI composition for this tool
            ├── {Tool}Form.tsx         // Input UI
            └── {Tool}Result.tsx       // Output UI

lib/
└── calculators/
    └── {tool-slug}.ts            // Pure calculation functions — zero UI code

types/
└── {tool-slug}.ts                // TypeScript types/interfaces for this tool's data

constants/
└── {tool-slug}.ts                // Static config: limits, units, labels, default values

components/
└── shared/                       // Cross-tool reusable UI only (buttons, layout shells, etc.)
```

**Golden Rule:** Business logic must never live inside UI components.
- Calculations, formulas, conversions → `lib/calculators/`
- Presentation and user interaction → `components/`
- Routing and page composition → `page.tsx`

Example — WRONG:
```tsx
// Inside page.tsx or a component
const bmi = weight / ((height / 100) ** 2);
```

Example — CORRECT:
```tsx
// lib/calculators/bmi.ts
export function calculateBMI(weightKg: number, heightCm: number): number {
  return weightKg / ((heightCm / 100) ** 2);
}

// component
import { calculateBMI } from '@/lib/calculators/bmi';
const bmi = calculateBMI(weight, height);
```

**Why this matters:** if a mobile app or API is ever built later, the same `lib/calculators/` functions are reused as-is. No rewriting.

---

## 5. Tool Independence

Every tool must be fully self-contained.

- No tool imports logic or components from another tool's folder.
- Deleting any single tool folder must never break another tool or the build.
- Shared code only lives in `lib/`, `components/shared/`, `types/`, or `constants/` — and only if genuinely reused across 2+ tools, not "might be reused someday."
- Do not create cross-tool dependencies for the sake of avoiding duplication. A small amount of duplication between independent tools is acceptable and preferred over coupling.

---

## 6. Coding Standards

- **TypeScript strict mode** — no `any` unless truly unavoidable, and if used, comment why.
- **Functional components only.** No class components.
- **Named exports** for components and functions, not default exports, except for `page.tsx` (Next.js requires default export there).
- **No inline styles.** Tailwind utility classes only, unless a genuinely dynamic value requires inline style (e.g., a calculated width percentage).
- **Pure functions in `lib/`** — no side effects, no DOM access, no `useState`/`useEffect` inside `lib/calculators/`. These functions must be independently testable by passing inputs and checking outputs.
- **Consistent naming:** `camelCase` for functions/variables, `PascalCase` for components/types, `kebab-case` for file and folder slugs, `SCREAMING_SNAKE_CASE` for true constants.
- Keep components small and single-purpose. If a component exceeds ~150 lines, consider splitting it.

---

## 7. Testing Standards

Calculators exist to produce correct numbers. A beautiful UI with a wrong formula is a failed tool.

- Every calculation function in `lib/calculators/` must have unit tests before the tool is considered complete.
- Tests must cover:
  - Normal/expected cases
  - Edge cases (minimum and maximum realistic values)
  - Invalid inputs (empty, negative where not allowed, non-numeric)
  - Boundary values (zero, exact threshold values relevant to the formula)
- Business logic is not "done" until its tests pass. A tool cannot ship without this.

---

## 8. Security (Even Without a Backend)

Client-only does not mean risk-free. Every tool must:

- Validate every input before using it in a calculation.
- Never trust raw browser input — always parse, type-check, and range-check.
- Prevent `NaN` results from propagating to the UI (catch invalid math before rendering).
- Prevent `Infinity` / division-by-zero cases explicitly — show a helpful error, not a broken output.
- Sanitize and validate any URL parameters (e.g., pre-filled query strings) before using them as input values.

---

## 9. Internationalization Readiness

V1 ships in English only, but the architecture must not block future localization.

- Never hardcode user-facing text directly inside JSX/components.
- Isolate all user-facing strings (labels, error messages, button text, explanatory content) so they can be extracted into a translation system later without a rewrite.
- This does not mean building a full i18n system now — it means not writing code that actively prevents adding one later.

---

## 10. Analytics Readiness

No analytics tool is wired up in V1, but the code must be structured to make adding one trivial later.

- Structure interactive components so key user actions are easy to hook into an event tracker later, e.g.:
  - Calculator Used
  - Result Generated
  - Copy Result
  - Share Tool
- Do not build tightly-coupled logic that would require rewriting components just to add a tracking call later.

---

## 11. Code Documentation

- Any non-trivial function (especially calculation logic with a non-obvious formula) must include a comment.
- The comment must explain **why**, not just what — e.g., not "adds tax" but "adds regional tax rate per {source/standard}, see {reference} for the formula basis."
- Simple, self-explanatory code does not need comments for the sake of it. Document intent and reasoning, not the obvious.

---

## 12. Design Consistency

- Every tool page must reuse the same design tokens: spacing scale, typography scale, border radius, color palette, and shadow system — all defined once in `DESIGN.md` and the shared Tailwind config.
- No tool is allowed to introduce a one-off style, spacing value, or color not already part of the design system.
- If a new tool seems to need a new visual pattern, that pattern must be added to the shared design system first — not created locally inside one tool's folder.

---

## 13. Tool Quality Standard

A tool is not considered complete or ready to ship until it meets every item below:

- [ ] Accurate calculations (verified by tests, Section 7)
- [ ] Fast rendering (SSG, minimal client JS, Section 14)
- [ ] Mobile-friendly and fully responsive
- [ ] SEO-optimized (unique metadata, content block, schema — Section 15)
- [ ] Accessible (Section 16)
- [ ] Proper error handling (invalid/edge-case inputs handled gracefully, Section 8)
- [ ] Helpful explanatory content (what it does, how to use it — not a bare input/output box)
- [ ] FAQ section addressing common questions about the tool's topic
- [ ] Internal links to 2–4 related tools
- [ ] Consistent with the shared design system (Section 12)

This checklist is the final gate before any tool is marked done. Partial completion is not shippable.

---

## 14. Performance Standards

- Every tool page must be statically generated (SSG) unless there is a specific, explicit reason it cannot be.
- No unnecessary client-side JavaScript. Use Server Components by default; mark a component `'use client'` only when it genuinely needs interactivity (form inputs, state, event handlers).
- No heavy external libraries for simple math. Write calculation logic natively in `lib/calculators/` rather than importing a library for something a few lines of TypeScript can do.
- Images (if any) must use `next/image` with proper sizing — never raw `<img>` tags.
- Target: each tool page should be lightweight enough to score 90+ on Core Web Vitals / Lighthouse performance out of the box.

---

## 15. SEO Standards (applies to every tool page)

- Every tool page requires a unique `metadata.ts` with:
  - Unique `title` (keyword-first, under 60 characters)
  - Unique `description` (under 160 characters, includes primary keyword and a clear value statement)
  - Canonical URL
  - Open Graph tags (title, description, image)
- Every tool page must include:
  - One `<h1>` only, matching search intent (e.g., "BMI Calculator", not a generic brand tagline)
  - At least 150–300 words of genuine explanatory content around the tool (what it does, how to use it, who it's for) — never a bare input/output box with no context. Thin content hurts indexing (this lesson comes directly from a prior project's AdSense rejection history — do not repeat it).
  - Internal links to 2–4 related tools in the same or adjacent category
- Structured data (Schema.org) should be added per tool type where applicable (e.g., `SoftwareApplication` or `HowTo` schema for calculators) — to be detailed further in `SEO.md`.
- Never duplicate content templates verbatim across tools. Each tool's explanatory text must be genuinely unique, not a find-and-replace of the same paragraph.

---

## 16. Accessibility Standards

- All interactive elements (inputs, buttons, selects) must be keyboard-navigable and have proper `label` associations.
- Sufficient color contrast per WCAG AA at minimum.
- Form inputs must have clear error states and helper text, not color-only indicators.
- Semantic HTML first (`<button>`, `<label>`, `<main>`, `<nav>`) — do not build interactive elements out of `<div>`s with click handlers when a native element exists.

---

## 17. When Building a New Tool — Standard Checklist

When asked to add a new tool, follow this exact sequence:

1. Confirm category and slug (check URL structure rules above).
2. Create the folder structure exactly as defined in Section 4.
3. Write the pure calculation function(s) first, in `lib/calculators/{slug}.ts`, with clear TypeScript types.
4. Write unit tests for the calculation function(s) per Section 7 — normal, edge, invalid, and boundary cases.
5. Build the UI components (`Form`, `Result`, top-level composer) that consume the `lib` function — never recalculate inline. Apply input validation and error handling per Section 8.
6. Write `metadata.ts` with unique SEO content per Section 15.
7. Add the explanatory content block (150–300 words) and an FAQ section for the tool.
8. Add 2–4 internal links to related tools.
9. Confirm the tool matches the shared design system per Section 12 — no one-off styles.
10. Verify: does deleting this tool's folder break anything else? It must not.
11. Verify: is any logic duplicated that should live in `components/shared/` or `lib/`? Only extract if truly shared by 2+ tools already — not preemptively.
12. Run the full Tool Quality Standard checklist (Section 13) before marking the tool complete.

---

## 18. What Claude Must NOT Do

- Do not add a database, authentication, or backend API "just in case" — V1 explicitly excludes these. Flag it and wait for approval if a future task seems to need one.
- Do not introduce a new npm dependency for something achievable in a few lines of native TypeScript/CSS, especially for math/calculation logic.
- Do not restructure the folder architecture without explicit approval — Section 4 is locked for V1.
- Do not put calculation logic inside components or page files.
- Do not create cross-tool dependencies.
- Do not change a published tool's URL without setting up a 301 redirect in the same change.
- Do not write generic/duplicated SEO content across multiple tool pages.
- Do not skip the explanatory content block or FAQ on a tool page, even if the owner only asks for "the calculator" — thin pages block SEO and this project has already lost time to that mistake once (Dazzle With Flair blog history).
- Do not ship a calculation function without unit tests.
- Do not hardcode user-facing strings in a way that blocks future translation.
- Do not introduce a new spacing value, color, or style locally inside one tool instead of using the shared design system.
- Do not mark a tool "complete" without running the full Tool Quality Standard checklist (Section 13).

---

## 19. Source of Truth

This file works alongside:
- `PROJECT.md` — vision, goals, monetization strategy, roadmap
- `DESIGN.md` — brand identity, visual system, page layouts, UI components
- `SEO.md` — page structure rules, keyword strategy, schema, internal linking in depth

If any instruction in a conversation conflicts with this file, this file wins unless the project owner explicitly overrides it for that specific task.

---

*Version 1.0 — Locked for V1 development. Revisit only when the project reaches V2 scope (50+ tools) or a structural need is proven, not assumed.*
