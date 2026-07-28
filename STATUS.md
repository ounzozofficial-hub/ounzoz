# STATUS.md — OUNZOZ Build Status

**Last updated:** 2026-07-28

---

## Built: V1 complete — all 20 tools across Health, Finance, and Student

All three category hubs (`/health`, `/finance`, `/student`) are live, cross-linked from the homepage and header nav, and every shipped tool is reachable within 2 clicks per SEO.md Section 7. PROJECT.md Section 7's full 20-tool V1 roadmap is now built.

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

### 💰 Finance (7/7 complete)
1. Loan Calculator
2. Mortgage Calculator
3. Compound Interest Calculator
4. Savings Calculator
5. Investment Calculator
6. Percentage Calculator
7. Currency Converter — the platform's first tool with a live external dependency (frankfurter.app, ECB reference rates, free/keyless, client-side fetch only — architecture stays fully static/no-backend). Was initially deferred (2026-07-28) pending an owner decision on the data-source approach; owner selected frankfurter.app with an explicit graceful-degradation requirement, then it shipped the same day. Degrades in three stages: live fetch → session-cached last-good rate for the same currency pair (sessionStorage, not localStorage — per-tab, not persisted across visits) → calm `ResultCard` error state ("temporarily unavailable") if neither is available. Never a blank page or unlabeled infinite spinner.

Every Finance tool carries explicit YMYL disclaimers (estimate only, not financial/investment advice, doesn't include fees/PMI/taxes where applicable; Currency Converter additionally discloses rates are ECB reference rates updated once per business day, not real-time, and won't match actual bank/exchange-service rates which include their own spread/fees) per PROJECT.md Section 5's strictest-bar requirement. Notable judgment calls (all logged in their commit messages): Mortgage excludes PMI modeling (no verifiable rate to cite without fabricating one); Compound Interest, Savings, and Investment Calculators are intentionally differentiated in scope (pure lump-sum with selectable compounding vs. fixed-monthly-contribution savings-APY framing vs. investment framing with no historical-return benchmark stated) rather than being the same calculator three times; Currency Converter's ~30-currency list is hardcoded from frankfurter's real, verified `/currencies` dataset rather than fetched at runtime, to avoid a second network dependency.

### 🎓 Student (3/3 complete)
1. GPA Calculator (unweighted US 4.0 scale)
2. Grade Calculator (weighted-category assignment average — distinct scope from GPA)
3. Study Time Calculator (time-allocation planner, not a "you should study X hours" recommendation engine — first Student-category use of `ResultCard`'s advisory slot)

### Every shipped tool has
Pure `lib/calculators/` function(s), hand-verified unit tests (normal/edge/invalid/boundary), full UI (form/result/related tools), unique SEO metadata + 150–300 word content block + FAQ + BreadcrumbList/FAQPage/SoftwareApplication schema, and 2+ internal links with no orphan pages (each category's related-tools clusters were updated tool-by-tool as siblings shipped). Currency Converter's `fetchExchangeRate` is the one exception to "fully synchronous" — its network and error-handling paths are covered by mocked-fetch tests so the suite stays deterministic without depending on real network access.

**Quality gate, session-wide:** `npm run lint` clean, `npm test` → 840/840 passing (20 test files), `npm run build` → all 26 routes compiled and statically generated. Currency Converter's live behavior was additionally smoke-tested against a running dev server.

Latest commit: `6afddb1` — "Add Currency Converter (Phase 23) - completes Finance category (7/7)" (pushed, working tree clean).

---

## Remaining V1 scope

None — PROJECT.md Section 7's 20-tool V1 roadmap is complete. Per PROJECT.md Section 8, the next phase trigger is organic traffic/indexing signals, not more tools by default; new scope should come from the owner, not be assumed.
