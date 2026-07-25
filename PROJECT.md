# PROJECT.md — OUNZOZ Tools Platform

**Version:** 1.0.0
**Status:** Approved
**Last Updated:** 2026-07-18

This file defines the vision, goals, monetization strategy, target audience, and V1 roadmap for OUNZOZ. It works alongside `CLAUDE.md` (technical rules), `DESIGN.md` (visual system), and `SEO.md` (search strategy). See `DECISIONS.md` for the history of how these decisions were reached.

---

## 1. Executive Summary

OUNZOZ is a global platform of fast, practical, single-purpose web tools — starting with calculators in Health, Finance, and Student categories, and expanding over time to any category where a tool can help someone accomplish a task in seconds.

This is not "a tools website." It is a digital asset built to compound in value over years: every early decision (URL structure, content depth, code architecture) is made to support growth to hundreds of tools without requiring a rebuild.

---

## 2. Product Vision

**Long-term vision:** Become one of the best global platforms for fast, practical utility tools — starting with calculators and expanding, without ever needing to change the brand name or identity, into adjacent categories (PDF tools, AI-assisted tools, image tools, developer tools) as the platform matures.

**What OUNZOZ is:**
- A single destination for high-quality, accurate, ad-supported utility tools
- Fast, mobile-first, genuinely useful — not cluttered with ads or fake urgency
- Built on trust: every calculation is sourced, tested, and explained clearly

**What OUNZOZ is not (at least not yet):**
- Not a SaaS product (no accounts, no subscriptions in V1)
- Not a content/blog site (tools are the product; content supports the tools, not the other way around)
- Not trying to be the biggest calculator site on day one — trying to be the most trustworthy and well-executed one in its chosen niches

---

## 3. Goals

### V1 Goal (first ~2 months)
Launch a professional, fast, genuinely useful platform with 20 excellent tools that begins receiving organic traffic from Google.

**Success is measured by:**
- Tools are indexed by Google
- Organic search traffic begins appearing (even modest numbers — the signal matters more than the volume at this stage)
- Each tool meets the full Tool Quality Standard (see `CLAUDE.md`, Section 13) before being counted as "shipped"

**Explicitly NOT V1 goals:**
- Revenue targets (traffic and indexing come first — revenue is a lagging signal, not a launch requirement)
- User accounts, saved history, or premium features
- Hundreds of tools

### Why this goal, and not a bigger one
Building 100+ tools or a full SaaS platform before validating that the first 20 tools attract any search traffic is exactly the kind of premature scaling this project is designed to avoid. If V1 doesn't gain traction, the loss is two months — not a year of wasted infrastructure work.

---

## 4. Target Audience

**Primary audience:** English-speaking, global, mobile-and-desktop users searching Google for a specific quick answer ("bmi calculator", "loan calculator", "gpa calculator") — not people browsing for entertainment or in-depth reading.

**User intent is transactional/utility, not exploratory.** This shapes every design and content decision: users want the answer fast, with just enough trustworthy context to feel confident in the result — not a long article to read before reaching the tool.

**Not the audience (at least not in V1):**
- Arabic-speaking audience (per `CLAUDE.md` internationalization readiness — the architecture supports this later, but V1 content and SEO targeting is English-only)
- Enterprise/business users needing API access or bulk tools (deferred to a future phase)

---

## 5. Monetization Strategy

### Phase 1 — V1 (Launch)
**Primary revenue source:** Google AdSense.

**Secondary revenue source (optional, contextual only):** Affiliate links — but only where directly and genuinely relevant to the specific tool. Examples:
- BMI Calculator → smart scales, body fat measurement devices
- Calorie Calculator → nutrition tracking apps
- GPA Calculator → study tools or educational platforms
- Loan Calculator → no random offers; only reputable, relevant lenders/comparison services if and when a genuinely appropriate option exists

**Hard rule:** No affiliate link is added if it degrades user experience or reads as a disguised advertisement. When in doubt, leave it out. A tool with zero affiliate links is always acceptable; a tool with a manipulative one is not.

**Important quality note for Finance tools specifically:** Finance calculators (loans, mortgages, compound interest, investment) fall under Google's YMYL (Your Money or Your Life) content standards, which are reviewed more strictly than most other categories — both for AdSense approval and for organic ranking. Every Finance tool must have unusually strong adherence to the Formula Sources and content-depth rules in `CLAUDE.md` before publishing. This project has already lost time once to an AdSense rejection over thin content (Dazzle With Flair blog) — Finance tools are the highest-risk category for repeating that mistake, so they get the highest content-quality bar.

### Phase 2 — After traffic is proven
Once the platform is receiving consistent, meaningful organic traffic:
- Comparison pages (e.g., "Best Budgeting Apps 2027")
- Buying guides related to specific tools
- Deeper articles connected to tool categories
- Higher-quality, better-negotiated affiliate placements

### Phase 3 — After a stable user base exists
Only after traffic and demand are proven, consider:
- Premium tool features (PDF export, save results, usage history, comparisons)
- API access for developers
- Paid subscription tier

**This phase requires reintroducing backend, database, and authentication — a deliberate architectural shift, not an accidental one. It will be documented as a major decision in `DECISIONS.md` when it happens.**

---

## 6. V1 Tool Selection Criteria

Tools are not chosen because they are "popular." Every tool considered for V1 is evaluated against this formula:

```
High Search Intent + Easy to Build + Evergreen + Easy to Expand
```

- **High Search Intent** — real, consistent search volume for people wanting a fast answer
- **Easy to Build** — a client-side calculation, no backend or complex data dependency required
- **Evergreen** — the tool's relevance doesn't expire or require constant updating (unlike, say, a tax bracket calculator tied to one specific year's rules, which needs more maintenance)
- **Easy to Expand** — naturally links to and supports other tools in the same category (e.g., BMI → Calories → BMR → Body Fat forms a natural internal-linking cluster)

A tool that scores well on most of these criteria is a stronger V1 candidate than a "popular" tool that scores poorly on them.

---

## 7. V1 Category & Tool Roadmap (20 Tools)

### Distribution rationale
- **Health (10 tools, 50%)** — consistently high global search volume, straightforward to build accurately, tools naturally cluster and cross-link (BMI → Calories → BMR → Body Fat), strong SEO opportunity.
- **Finance (7 tools, 35%)** — typically higher-value ad category, consistent demand for loan/interest/savings tools, builds a strong foundation for future expansion. Requires the strictest content-quality bar (see Section 5).
- **Student (3 tools, 15%)** — valuable but more seasonal (exam periods, semester starts). Starting small and expanding based on observed demand rather than assuming volume upfront.

### 🩺 Health (10)
1. BMI Calculator
2. BMR Calculator
3. TDEE Calculator
4. Body Fat Calculator
5. Ideal Weight Calculator
6. Calorie Calculator
7. Water Intake Calculator
8. Protein Intake Calculator
9. Macro Calculator
10. Pregnancy Due Date Calculator

### 💰 Finance (7)
1. Loan Calculator
2. Mortgage Calculator
3. Compound Interest Calculator
4. Savings Calculator
5. Investment Calculator
6. Currency Converter
7. Percentage Calculator

### 🎓 Student (3)
1. GPA Calculator
2. Grade Calculator
3. Study Time Calculator

### Build order note
Category weighting reflects overall V1 composition, not a rigid build sequence. If keyword/opportunity research (see `SEO.md`) shows a Finance or Student tool has a stronger near-term opportunity than the "next" Health tool on the list, build order can adapt — the category ratios above are the target for the finished V1, not a strict queue.

---

## 8. Development Roadmap (Phased)

| Phase | Scope | Trigger to move to next phase |
|---|---|---|
| **V1** | 20 tools, no backend, static-first, AdSense + optional contextual affiliate | Site is live, indexed, receiving organic traffic |
| **V2** | Grow to 50 tools, dedicated SEO optimization pass, site speed optimization | V1 tools show consistent organic traffic growth |
| **V3** | Grow to 100 tools, AdSense fully optimized | V2 tools maintain/grow traffic; content quality bar holds at scale |
| **V4** | Grow to 200 tools, evaluate demand for accounts/saved results | Clear, repeated user requests or usage signals indicate demand — not assumption |
| **V5** | Consider accounts, subscriptions, API, companion app | Traffic reaches a meaningful sustained scale (site analytics will define the actual threshold at the time, based on real conversion/engagement data — not a number fixed in advance) |

**Working principle across all phases: 80% execution, 20% planning.** New ideas at any phase are logged in `DECISIONS.md` or a future `BACKLOG.md` — they do not pause active development unless they represent a genuine blocking issue.

---

## 9. Brand Positioning Statement

*"OUNZOZ is building the best global platform for fast, practical, trustworthy tools — starting with calculators, and growing wherever people need a fast, accurate answer."*

This framing intentionally avoids locking the brand into "a calculator site" — it is scoped narrowly for V1 execution but positioned broadly enough to expand into PDF tools, AI-assisted tools, image tools, or developer tools in future phases without a rebrand.

---

## 10. Source of Truth

This file works alongside:
- `CLAUDE.md` — technical rules and coding standards
- `DESIGN.md` — brand identity, visual system, page layouts
- `SEO.md` — page structure, keyword strategy, schema, internal linking
- `DECISIONS.md` — historical log of why each major decision was made

If any instruction in a conversation conflicts with this file, this file wins unless the project owner explicitly overrides it for that specific task.

---

*Version 1.0.0 — Approved. Revisit only when a phase transition (per Section 8) or a major strategic shift is proven necessary — not speculative.*
