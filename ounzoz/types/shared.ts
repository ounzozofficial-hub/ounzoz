// Cross-tool shared types. Only add a type here once it's genuinely
// needed by 2+ tools (same threshold as components/shared/ and
// lib/formulas/ reuse, per CLAUDE.md Section 4/5).
//
// - BiologicalSex: started in types/bmr.ts (BMR-only), moved here once
//   TDEE Calculator needed it too.
// - ActivityLevel: started in types/tdee.ts (TDEE-only), moved here
//   once Calorie Calculator needed the same activity-level input.
// - CalorieGoal: started in types/calorie.ts (Calorie-only), moved here
//   once Macro Calculator needed the same goal input (and its
//   GoalSelector component).
export type BiologicalSex = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';

export type CalorieGoal = 'lose' | 'maintain' | 'gain';
