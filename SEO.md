# SEO.md — OUNZOZ SEO Master Strategy

**Version:** 1.0.0
**Status:** Approved
**Last Updated:** 2026-07-18

This file defines how every OUNZOZ page is structured, written, and marked up for search engines. It works alongside `CLAUDE.md` (Section 15: SEO Standards — the technical baseline every tool must meet) and `PROJECT.md` (tool selection strategy, Section 6).

---

## 0. Guiding Principle (Read This First)

**Write for humans first. Structure for search engines second. Never write for search engines only.**

Every rule in this document exists to make genuinely useful pages easier for Google to understand — not to trick, pad, or game a ranking signal. If a rule here is ever applied in a way that produces content optimized for a crawler at the expense of the actual person using the tool, that application is wrong, not the person catching it.

This principle exists because this project has already lost real time to the opposite mistake once — a prior project (Dazzle With Flair blog) was rejected from Google AdSense repeatedly for thin, low-value content, tangled internal linking issues, and structural problems that stemmed from building pages around SEO mechanics instead of genuine reader value. OUNZOZ does not repeat that mistake.

---

## 1. URL Structure (Reference)

Already locked in `CLAUDE.md` Section 3. Restated here because it is foundational to every SEO decision below:

```
ounzoz.com/{category}/{tool-slug}
```

Example: `ounzoz.com/health/bmi-calculator`

Once published and indexed, a tool's URL never changes without a mandatory 301 redirect. This rule is non-negotiable and exists specifically to avoid repeating past indexing/404 problems.

---

## 2. Page Structure Rules (Every Tool Page)

Every tool page follows this exact structural order — this also matches the visual layout defined in `DESIGN.md` Section 11:

1. **One `<h1>`** — matches search intent exactly (e.g., "BMI Calculator", not a branded tagline like "OUNZOZ's Amazing BMI Tool")
2. **One-line description** directly under the H1 — plain language, states what the tool does
3. **The interactive tool itself** (input + result) — this appears early; users should not have to scroll past a wall of text to reach the calculator
4. **Explanatory content block** — 150–300 words minimum, genuinely unique per tool (see Section 4)
5. **FAQ section** — standard on every tool (see Section 6)
6. **Related tools** — 2–4 internal links to genuinely relevant tools (see Section 7)

**Rule:** the tool must be usable before any explanatory content is read. SEO content supports the tool; it does not gate access to it.

---

## 3. Keyword & Tool Selection Strategy

Tool selection itself is defined in `PROJECT.md` Section 6 (High Search Intent + Easy to Build + Evergreen + Easy to Expand). This section covers how keyword research informs each tool's on-page content once a tool is chosen.

For every tool, before writing content, identify:
- **Primary keyword** — the exact phrase most people search (e.g., "bmi calculator")
- **Secondary variations** — related phrases to naturally cover, not stuff (e.g., "body mass index calculator", "calculate my bmi")
- **Search intent type** — informational (wants to understand) vs. transactional (wants the immediate answer) — most tool pages serve transactional intent first, informational intent second (in the explanatory content/FAQ)

**Rule:** the primary keyword appears naturally in the H1, the meta title, the meta description, and once in the explanatory content's opening sentence. It is never repeated mechanically throughout the page ("keyword stuffing") — natural language always wins over exact-match repetition.

---

## 4. Content Depth & Quality Rules

(Extends `CLAUDE.md` Section 15.)

- Every tool page requires 150–300 words of genuine explanatory content: what the tool calculates, why it matters, and how to interpret the result.
- Content must cite its formula source per `CLAUDE.md` Section 10 (Formula Sources) — this doubles as an E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signal for Google and a genuine trust signal for the reader.
- No content is duplicated or lightly reworded across tools. Each tool's explanatory paragraph must be written specifically for that tool's context — even calculators in the same cluster (e.g., BMI and Body Fat) must not read like copy-pasted templates with swapped nouns.
- Finance-category tools (YMYL content, per `PROJECT.md` Section 5) require the highest content-quality bar on the platform — these pages get extra scrutiny before publishing, not the same baseline as a simple unit converter.

---

## 5. Structured Data Policy (Schema.org)

**Core rule: schema reflects actual page content. No schema type is added to a page unless the page genuinely contains that kind of content.** Google penalizes mismatched or manipulative structured data — this is not a "more is better" area.

### Schema type mapping

| Schema Type | Where it's used |
|---|---|
| `WebSite` | Homepage only — once per site |
| `Organization` | Site-wide, once — defines OUNZOZ as the publishing entity |
| `BreadcrumbList` | Every tool page — reflects the category → tool path |
| `FAQPage` | Every tool page (FAQ is a standard requirement per Section 6 below — so this applies platform-wide by design, not as an exception) |
| `SoftwareApplication` | Every interactive tool page (BMI Calculator, Loan Calculator, Age Calculator, etc.) |
| `HowTo` | **Only** on pages that contain genuine, real step-by-step instructions (e.g., a future "How to Calculate BMI Manually" article) — never added to a tool page by default just because it's a calculator |
| `Article` | Future blog/guide content only — not used on tool pages |

### Structured Data Rules

- No schema type is added unless the page's actual content matches that type's requirements.
- Every schema block must have all required fields fully and accurately completed — no placeholder or incomplete markup shipped to production.
- Every page's structured data must pass Google's Rich Results Test before that page is considered launch-ready.
- Never use fabricated data in schema — no fake ratings, fake review counts, fake "last updated" dates, or invented statistics. This connects directly to `CLAUDE.md` Section 10 (AI Safety Rules): if a data point can't be verified, it doesn't go in the schema.
- Schema is reviewed and updated any time a page's actual content changes — stale or mismatched schema is treated as a bug, not a minor issue.

---

## 6. FAQ Standard

Every tool page includes an FAQ section. This is not optional per tool — it's a platform-wide standard (per `CLAUDE.md` Section 13, Tool Quality Standard).

- 3–6 genuinely useful questions per tool — real questions a user of that specific tool would ask, not generic filler ("What is a calculator?").
- Answers are concise (2–4 sentences), written in plain language, and add information not already stated in the main explanatory content — the FAQ should teach something new, not repeat the intro paragraph in Q&A format.
- FAQ content is marked up with `FAQPage` schema per Section 5.

---

## 7. Internal Linking Strategy

- Every tool page links to 2–4 related tools, chosen for genuine topical relevance — not generic "explore more" filler links.
- Related links are determined by natural clusters (e.g., BMI Calculator → BMR Calculator → TDEE Calculator → Calorie Calculator forms one health cluster; Loan Calculator → Mortgage Calculator → Compound Interest Calculator forms one finance cluster).
- Category pages (e.g., `/health`) link to every tool within that category, giving Google and users a clear hub-and-spoke structure.
- No orphan pages: every published tool must be reachable within 2 clicks from the homepage (Homepage → Category → Tool).

---

## 8. Metadata Standard (Per Tool)

(Restates and extends `CLAUDE.md` Section 15 with exact copywriting guidance.)

- **Title tag:** primary keyword first, under 60 characters, human-readable — not keyword-stuffed. Example: `BMI Calculator — Check Your Body Mass Index | OUNZOZ`
- **Meta description:** under 160 characters, states what the tool does and the value of using it, includes the primary keyword naturally. Example: `Calculate your BMI instantly and see what it means for your health. Free, accurate, and based on WHO standards.`
- **Canonical URL:** set explicitly on every page, even where duplication risk seems low — this prevents the `www`/non-`www` and trailing-slash issues encountered in a prior project.
- **Open Graph tags:** title, description, and `og-image.png` (per `DESIGN.md` Section 20 file convention) for clean social/link-preview sharing.

---

## 9. Technical SEO Baseline

- **Sitemap.xml** — auto-generated and updated whenever a tool is added, submitted to Google Search Console and Bing Webmaster Tools at launch.
- **robots.txt** — explicitly allows crawling of all tool and category pages; no accidental blocking of content that should be indexed (a direct, deliberate lesson from a prior project's robots.txt misconfiguration).
- **Canonical consistency** — one definitive version of every URL (`https://ounzoz.com/...`, no `www` variant, no trailing slash inconsistency) enforced at the hosting/redirect level from day one — this is set up before any tool is published, not fixed retroactively.
- **No orphaned or duplicate content**: every page has one clear purpose and one clear URL; content is never republished verbatim under multiple paths.
- **Core Web Vitals**: every tool page targets 90+ Lighthouse performance per `CLAUDE.md` Section 14 — page speed is itself a ranking factor, not just a UX nicety.

---

## 10. Pre-Launch SEO Checklist (Per Tool)

A tool is not considered SEO-complete until:

- [ ] Primary keyword identified and naturally present in H1, title, and meta description
- [ ] 150–300 words of unique explanatory content, with formula source cited
- [ ] FAQ section with 3–6 genuine questions
- [ ] 2–4 internal links to genuinely related tools
- [ ] `BreadcrumbList`, `FAQPage`, and `SoftwareApplication` schema present and validated
- [ ] `HowTo` or `Article` schema added only if page content genuinely warrants it
- [ ] Canonical URL set
- [ ] Passes Google Rich Results Test with zero errors
- [ ] Meets the full Tool Quality Standard in `CLAUDE.md` Section 13

This checklist runs alongside — not instead of — the Tool Quality Standard checklist already defined in `CLAUDE.md`.

---

## 11. Growth Phase Reference

SEO strategy scales with the phases defined in `PROJECT.md` Section 8:

- **V1:** get the foundational 20 tools correctly indexed, technically clean, and genuinely useful — this document's rules apply at full strength from tool #1.
- **V2:** dedicated SEO optimization pass across the (by then) 50-tool library — auditing what's working, refining underperforming pages, expanding internal linking as the tool graph grows.
- **V3+:** as comparison pages, buying guides, and `Article`-schema content are introduced (per `PROJECT.md` Section 5, Phase 2 monetization), this document is extended — not rewritten — to cover those new content types.

---

## 12. Source of Truth

This file works alongside:
- `CLAUDE.md` — technical SEO baseline (Section 15) and AI Safety Rules (Section 10) that govern what can and cannot be claimed in content
- `PROJECT.md` — tool selection criteria and monetization phases that shape what gets built and when
- `DESIGN.md` — page layout (Section 11) that this document's structural rules are built on top of

If any instruction in a conversation conflicts with this file, this file wins unless the project owner explicitly overrides it for that specific task.

---

*Version 1.0.0 — Approved. This is the final foundation document before development begins. Further additions go to `DECISIONS.md` or a future `BACKLOG.md` — not into a reopened SEO.md, unless a genuine structural need is proven during build or post-launch.*
