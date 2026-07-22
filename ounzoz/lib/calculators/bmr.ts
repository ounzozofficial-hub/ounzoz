import {
  calculateBMR,
  validateAgeInput,
  validateHeightInput,
  validateSexInput,
  validateWeightInput,
} from '@/lib/formulas/bmr-formula';
import type { BiologicalSex, BMRResult, BMRValidationError } from '@/types/bmr';

// BMR Calculator's tool-specific layer. The formula itself (calculateBMR),
// its per-field validators, input bounds, and error copy all live in
// lib/formulas/bmr-formula.ts — a neutral module shared with TDEE
// Calculator (CLAUDE.md Section 5: Tool Independence). Everything below
// is re-exported from there so existing imports of `@/lib/calculators/bmr`
// keep working unchanged; this file's own job is just the BMR-specific
// composition: running the formula end-to-end and combining per-field
// validation into one call.
export {
  BMR_INPUT_BOUNDS,
  BMR_VALIDATION_MESSAGES,
  calculateBMR,
  validateAgeInput,
  validateHeightInput,
  validateSexInput,
  validateWeightInput,
} from '@/lib/formulas/bmr-formula';

export function getBMRResult(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: BiologicalSex,
): BMRResult {
  return { bmr: calculateBMR(weightKg, heightCm, age, sex) };
}

export function validateBMRInputs(
  weightKgRaw: string,
  heightCmRaw: string,
  ageRaw: string,
  sex: BiologicalSex | null,
): {
  weightError: BMRValidationError | null;
  heightError: BMRValidationError | null;
  ageError: BMRValidationError | null;
  sexError: BMRValidationError | null;
} {
  return {
    weightError: validateWeightInput(weightKgRaw),
    heightError: validateHeightInput(heightCmRaw),
    ageError: validateAgeInput(ageRaw),
    sexError: validateSexInput(sex),
  };
}
