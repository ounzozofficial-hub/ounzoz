# STATUS.md — OUNZOZ Build Status

**Last updated:** 2026-07-28

---

## Built: Health category complete (10/10 tools)

All 10 tools from PROJECT.md Section 7's Health roadmap are live, tested, and pushed to `main`:

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

Each tool has a pure `lib/calculators/` function, hand-verified unit tests, full UI (form/result/related tools), unique SEO metadata + FAQ + schema, and 2+ internal links (verified zero orphan pages).

Also built this phase: `app/health/page.tsx` — a real category hub linking all 10 tools — with the homepage and header nav wired to it, giving every tool 2-click reachability from the homepage per SEO.md Section 7.

Latest commit: `984bb3e` (pushed, working tree clean).

---

## Next: Finance category (7 tools, per PROJECT.md Section 7)

1. Loan Calculator
2. Mortgage Calculator
3. Compound Interest Calculator
4. Savings Calculator
5. Investment Calculator
6. Currency Converter
7. Percentage Calculator

**Note:** Finance is YMYL content (PROJECT.md Section 5) — highest content-quality bar on the platform, stricter than Health. No Finance-specific shared formula/component work exists yet; expect a `/finance` category hub (same pattern as `/health`) once the first tool ships.

Student category (3 tools) remains after Finance, per PROJECT.md's build-order note (ratios are a V1 target, not a rigid queue).
