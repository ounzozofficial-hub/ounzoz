import type { ActivityLevel } from '@/types/shared';

// Protein target per kg of body weight per day, by activity level.
//
// sedentary (0.8 g/kg) is the RDA (Recommended Dietary Allowance) for
// protein — a precise, well-established figure from the U.S./Canada
// Dietary Reference Intakes (National Academies of Medicine, 2005,
// "Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat,
// Fatty Acids, Cholesterol, Protein, and Amino Acids"). This is the
// single most solidly backed number in this table.
//
// light/moderate/active/very_active (1.2–2.0 g/kg) reflect the general,
// widely cited principle that protein needs rise with activity level —
// e.g. the International Society of Sports Nutrition's position stand
// (Jäger et al., 2017, Journal of the International Society of Sports
// Nutrition) cites roughly 1.4–2.0 g/kg/day for exercising individuals.
// Unlike the sedentary RDA, there is no single standardized figure per
// activity tier — these four values are practical increments across the
// commonly cited range, not each one an individually cited number.
//
// Neutral module, same pattern as lib/formulas/bmr-formula.ts and
// activity-multiplier.ts: started inside lib/calculators/protein-intake.ts
// (Protein Intake-only), moved here once Macro Calculator also needed the
// same table. Macro doesn't build on Protein Intake Calculator's computed
// result the way it builds on Calorie's (CLAUDE.md Section 5) — it needs
// the same underlying grams-per-kg table to independently derive its own
// protein split from weight + activity level, so both tools import from
// here and neither imports from the other's tool file.
export const PROTEIN_G_PER_KG: Record<ActivityLevel, number> = {
  sedentary: 0.8,
  light: 1.2,
  moderate: 1.4,
  active: 1.6,
  very_active: 2.0,
};
