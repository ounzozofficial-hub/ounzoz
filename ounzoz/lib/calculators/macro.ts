import {
  CALORIE_INPUT_BOUNDS,
  getCalorieResult,
  validateCalorieInputs,
} from '@/lib/calculators/calorie';
import { PROTEIN_G_PER_KG } from '@/lib/formulas/protein-formula';
import type { ActivityLevel, BiologicalSex } from '@/types/shared';
import type { CalorieGoal } from '@/types/calorie';
import type { MacroResult, MacroValidationError } from '@/types/macro';

// Re-exported so a consumer only needs to import from this one file for
// everything Macro Calculator needs, same convention as calorie.ts/
// water-intake.ts. PROTEIN_G_PER_KG is imported from the neutral
// lib/formulas/protein-formula.ts — Macro needs the same grams-per-kg
// table Protein Intake Calculator uses, but doesn't depend on Protein
// Intake Calculator's tool file to get it (CLAUDE.md Section 5): unlike
// Macro's genuine tiered dependency on Calorie's *computed result*, this
// is a shared formula table two independent tools each apply themselves,
// the same relationship ACTIVITY_MULTIPLIERS has with TDEE and Calorie.
export { PROTEIN_G_PER_KG };

export const MACRO_INPUT_BOUNDS = CALORIE_INPUT_BOUNDS;

// Atwater factors — the standard, universally used calories-per-gram
// conversion for each macronutrient (Atwater, W.O., 1900s; still the
// basis of every nutrition label's calorie math today). These are exact,
// not estimates.
const PROTEIN_KCAL_PER_GRAM = 4;
const FAT_KCAL_PER_GRAM = 9;
const CARB_KCAL_PER_GRAM = 4;

// Fat target as a percentage of total daily calories. 20–35% is the
// Acceptable Macronutrient Distribution Range (AMDR) for fat set by the
// U.S./Canada Dietary Reference Intakes (National Academies of Medicine,
// 2005) — the range itself is solidly backed. The specific value used
// here, 30%, is a practical midpoint within that range, not itself a
// uniquely prescribed number — where an individual's fat intake actually
// falls within 20–35% varies by diet pattern and goals. This distinction
// is called out directly in this tool's FAQ.
export const FAT_PERCENTAGE_OF_CALORIES = 0.3;

/**
 * Splits a daily calorie target into a protein/fat/carbohydrate macro
 * breakdown.
 *
 * Formula:
 *   1. Total calories come from Calorie Calculator's own result (TDEE ±
 *      goal adjustment) — Macro Calculator sits one tier above Calorie,
 *      the same relationship Calorie has with TDEE.
 *   2. Protein grams = weight (kg) × grams-per-kg for the selected
 *      activity level (see lib/formulas/protein-formula.ts for sourcing).
 *   3. Fat calories = total calories × FAT_PERCENTAGE_OF_CALORIES (see
 *      above for sourcing); fat grams = fat calories ÷ 9.
 *   4. Carb calories = whatever remains after protein and fat; carb
 *      grams = carb calories ÷ 4.
 *
 * Pure function (CLAUDE.md Section 6). Throws RangeError for invalid
 * inputs, and specifically if protein + fat targets would exceed the
 * total calorie target (which would make the carbohydrate target
 * negative) rather than ever producing a broken result (CLAUDE.md
 * Section 8).
 */
export function getMacroResult(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: BiologicalSex,
  activityLevel: ActivityLevel,
  goal: CalorieGoal,
): MacroResult {
  const { calories } = getCalorieResult(
    weightKg,
    heightCm,
    age,
    sex,
    activityLevel,
    goal,
  );

  const gramsPerKg = PROTEIN_G_PER_KG[activityLevel];
  if (!Number.isFinite(gramsPerKg)) {
    throw new RangeError('activityLevel must be a recognized ActivityLevel');
  }

  const proteinGrams = Math.round(weightKg * gramsPerKg);
  const proteinCalories = proteinGrams * PROTEIN_KCAL_PER_GRAM;

  const fatGrams = Math.round(
    (calories * FAT_PERCENTAGE_OF_CALORIES) / FAT_KCAL_PER_GRAM,
  );
  const fatCalories = fatGrams * FAT_KCAL_PER_GRAM;

  const carbCalories = calories - proteinCalories - fatCalories;
  if (carbCalories <= 0) {
    throw new RangeError(
      'Protein and fat targets exceed the total calorie target for these inputs',
    );
  }

  const carbGrams = Math.round(carbCalories / CARB_KCAL_PER_GRAM);

  return { calories, proteinGrams, fatGrams, carbGrams };
}

// --- Validation ---

/**
 * Macro introduces no new fields beyond what Calorie already validates
 * (MacroValidationError is CalorieValidationError directly), so this
 * delegates entirely rather than reimplementing (CLAUDE.md Section 5).
 */
export function validateMacroInputs(
  weightKgRaw: string,
  heightCmRaw: string,
  ageRaw: string,
  sex: BiologicalSex | null,
  activityLevel: ActivityLevel | null,
  goal: CalorieGoal | null,
): {
  weightError: MacroValidationError | null;
  heightError: MacroValidationError | null;
  ageError: MacroValidationError | null;
  sexError: MacroValidationError | null;
  activityError: MacroValidationError | null;
  goalError: MacroValidationError | null;
} {
  return validateCalorieInputs(
    weightKgRaw,
    heightCmRaw,
    ageRaw,
    sex,
    activityLevel,
    goal,
  );
}

// Macro-specific copy for every field — not a spread of Calorie's
// messages, same lesson applied on every tiered tool so far (CLAUDE.md
// Section 8 / DESIGN.md Section 19: error copy must be specific and
// correct for the tool the person is actually using).
export const MACRO_VALIDATION_MESSAGES: Record<MacroValidationError, string> = {
  WEIGHT_REQUIRED: 'Enter your weight to calculate your macros.',
  HEIGHT_REQUIRED: 'Enter your height to calculate your macros.',
  AGE_REQUIRED: 'Enter your age to calculate your macros.',
  SEX_REQUIRED: 'Select your sex to calculate your macros.',
  WEIGHT_NOT_A_NUMBER: 'Weight must be a number.',
  HEIGHT_NOT_A_NUMBER: 'Height must be a number.',
  AGE_NOT_A_NUMBER: 'Age must be a number.',
  WEIGHT_NOT_POSITIVE: 'Weight must be greater than zero.',
  HEIGHT_NOT_POSITIVE: 'Height must be greater than zero.',
  AGE_NOT_POSITIVE: 'Age must be greater than zero.',
  WEIGHT_OUT_OF_RANGE: `Enter a weight between ${MACRO_INPUT_BOUNDS.MIN_WEIGHT_KG} and ${MACRO_INPUT_BOUNDS.MAX_WEIGHT_KG} kg.`,
  HEIGHT_OUT_OF_RANGE: `Enter a height between ${MACRO_INPUT_BOUNDS.MIN_HEIGHT_CM} and ${MACRO_INPUT_BOUNDS.MAX_HEIGHT_CM} cm.`,
  AGE_OUT_OF_RANGE: `Enter a number between ${MACRO_INPUT_BOUNDS.MIN_AGE_YEARS} and ${MACRO_INPUT_BOUNDS.MAX_AGE_YEARS} for age.`,
  AGE_NOT_WHOLE_NUMBER: 'Age must be a whole number of years.',
  ACTIVITY_LEVEL_REQUIRED: 'Select your activity level to calculate your macros.',
  GOAL_REQUIRED: 'Select your goal to calculate your macros.',
};
