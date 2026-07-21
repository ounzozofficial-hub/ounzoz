// Cross-tool shared types. Only add a type here once it's genuinely
// needed by 2+ tools (same threshold as components/shared/ and
// lib/calculators/ reuse, per CLAUDE.md Section 4/5) — BiologicalSex
// started in types/bmr.ts (BMR-only) and moved here once TDEE Calculator
// needed it too.
export type BiologicalSex = 'male' | 'female';
