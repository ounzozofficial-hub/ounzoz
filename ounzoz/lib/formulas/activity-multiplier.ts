import type { ActivityLevel } from '@/types/shared';

// The standard activity multiplier scale commonly paired with the
// Harris-Benedict and Mifflin-St Jeor BMR equations to estimate Total
// Daily Energy Expenditure. Widely cited source: Harris JA, and
// Benedict FG (1919) established the original BMR-to-TDEE activity
// scaling approach; these specific multiplier values are the version
// most commonly published alongside Mifflin-St Jeor today (e.g. as used
// by the NIH Body Weight Planner and most clinical nutrition
// references).
//
// Neutral module, same pattern as lib/formulas/bmr-formula.ts: started
// inside lib/calculators/tdee.ts (TDEE-only), moved here once Calorie
// Calculator also needed activity-level multipliers — TDEE Calculator
// and Calorie Calculator both import from here, neither imports from
// the other's tool file (CLAUDE.md Section 5: Tool Independence).
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary — little or no exercise',
  light: 'Lightly active — light exercise 1–3 days/week',
  moderate: 'Moderately active — moderate exercise 3–5 days/week',
  active: 'Very active — hard exercise 6–7 days/week',
  very_active: 'Extra active — very hard exercise or a physical job',
};
