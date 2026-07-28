# STATUS.md — OUNZOZ Build Status

**Last updated:** 2026-07-28

---

## Built: Health, Finance, and Student categories (19/20 V1 tools)

All three category hubs (`/health`, `/finance`, `/student`) are live, cross-linked from the homepage and header nav, and every shipped tool is reachable within 2 clicks per SEO.md Section 7.

### 🩺 Health (10/10 complete)
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

### 💰 Finance (6/7 — Currency Converter deferred)
1. Loan Calculator
2. Mortgage Calculator
3. Compound Interest Calculator
4. Savings Calculator
5. Investment Calculator
6. Percentage Calculator
7. ~~Currency Converter~~ — **deferred by explicit owner decision (2026-07-28)**: a real converter needs a live exchange-rate data source, which is a business decision (which provider, cost/reliability tradeoffs), not a technical one. Not built, not linked as "coming soon" on the `/finance` hub. Revisit only if the owner brings it back up — see PROJECT.md Section 5 for the YMYL content-quality bar this tool would need to clear once a data-source decision is made.

Every Finance tool carries explicit YMYL disclaimers (estimate only, not financial/investment advice, doesn't include fees/PMI/taxes where applicable) per PROJECT.md Section 5's strictest-bar requirement. Notable judgment calls (all logged in their commit messages): Mortgage excludes PMI modeling (no verifiable rate to cite without fabricating one); Compound Interest, Savings, and Investment Calculators are intentionally differentiated in scope (pure lump-sum with selectable compounding vs. fixed-monthly-contribution savings-APY framing vs. investment framing with no historical-return benchmark stated) rather than being the same calculator three times.

### 🎓 Student (3/3 complete)
1. GPA Calculator (unweighted US 4.0 scale)
2. Grade Calculator (weighted-category assignment average — distinct scope from GPA)
3. Study Time Calculator (time-allocation planner, not a "you should study X hours" recommendation engine — first Student-category use of `ResultCard`'s advisory slot)

### Every shipped tool has
Pure `lib/calculators/` function(s), hand-verified unit tests (normal/edge/invalid/boundary), full UI (form/result/related tools), unique SEO metadata + 150–300 word content block + FAQ + BreadcrumbList/FAQPage/SoftwareApplication schema, and 2+ internal links with no orphan pages (each category's related-tools clusters were updated tool-by-tool as siblings shipped).

**Quality gate, session-wide:** `npm run lint` clean, `npm test` → 806/806 passing (19 test files), `npm run build` → all 25 routes compiled and statically generated.

Latest commit: `af384af` — "Add Study Time Calculator (Phase 22) - completes Student category" (pushed, working tree clean).

---

## Remaining V1 scope (per PROJECT.md Section 7)

- **Currency Converter** — blocked on the data-source decision above. Not scheduled; pick back up when the owner decides on an approach (client-side fetch to a free no-key API was the recommended option when this was raised).

With Currency Converter's exclusion, V1's 20-tool roadmap is functionally complete at 19 tools. No further tools are queued unless the owner reopens Currency Converter or adds new scope.
