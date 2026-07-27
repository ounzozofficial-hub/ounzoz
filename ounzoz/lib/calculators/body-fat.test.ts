import { describe, expect, it } from 'vitest';
import {
  BODY_FAT_INPUT_BOUNDS,
  calculateBodyFatPercentage,
  getBodyFatCategory,
  getBodyFatResult,
  validateBodyFatInputs,
  validateHeightInput,
  validateHipInput,
  validateMeasurementConsistency,
  validateNeckInput,
  validateSexInput,
  validateWaistInput,
} from './body-fat';

describe('calculateBodyFatPercentage', () => {
  // --- Normal / expected cases ---
  // Reference values computed directly from the published Navy formula
  // (495 / (1.0324 − 0.19077×log10(waist−neck) + 0.15456×log10(height)) − 450
  // for men; 495 / (1.29579 − 0.35004×log10(waist+hip−neck) + 0.221×log10(height)) − 450
  // for women), same verification approach as calculateBMR's hand-checked
  // test cases.
  it('calculates body fat for a typical adult male (180cm, 38cm neck, 85cm waist)', () => {
    expect(calculateBodyFatPercentage(180, 38, 85, 'male')).toBe(16.1);
  });

  it('calculates body fat for a second typical adult male (175cm, 40cm neck, 90cm waist)', () => {
    expect(calculateBodyFatPercentage(175, 40, 90, 'male')).toBe(19.2);
  });

  it('calculates body fat for a typical adult female (165cm, 33cm neck, 70cm waist, 95cm hip)', () => {
    expect(calculateBodyFatPercentage(165, 33, 70, 'female', 95)).toBe(24.3);
  });

  it('calculates body fat for a second typical adult female (160cm, 30cm neck, 65cm waist, 90cm hip)', () => {
    expect(calculateBodyFatPercentage(160, 30, 65, 'female', 90)).toBe(21.9);
  });

  it('produces a higher body fat estimate for a larger waist, all else equal (male)', () => {
    const smaller = calculateBodyFatPercentage(180, 38, 80, 'male');
    const larger = calculateBodyFatPercentage(180, 38, 95, 'male');
    expect(larger).toBeGreaterThan(smaller);
  });

  it('produces a lower body fat estimate for a larger neck, all else equal (male)', () => {
    const smallerNeck = calculateBodyFatPercentage(180, 36, 85, 'male');
    const largerNeck = calculateBodyFatPercentage(180, 42, 85, 'male');
    expect(largerNeck).toBeLessThan(smallerNeck);
  });

  it('rounds to 1 decimal place', () => {
    const result = calculateBodyFatPercentage(180, 38, 85, 'male');
    expect(result).toBe(Math.round(result * 10) / 10);
  });

  // --- Edge cases: bounds of the input ranges ---
  it('handles the minimum allowed bounds for men', () => {
    expect(
      calculateBodyFatPercentage(
        BODY_FAT_INPUT_BOUNDS.MIN_HEIGHT_CM,
        BODY_FAT_INPUT_BOUNDS.MIN_NECK_CM,
        BODY_FAT_INPUT_BOUNDS.MIN_WAIST_CM,
        'male',
      ),
    ).toBe(48);
  });

  it('handles the maximum allowed bounds for men', () => {
    expect(
      calculateBodyFatPercentage(
        BODY_FAT_INPUT_BOUNDS.MAX_HEIGHT_CM,
        BODY_FAT_INPUT_BOUNDS.MAX_NECK_CM,
        BODY_FAT_INPUT_BOUNDS.MAX_WAIST_CM,
        'male',
      ),
    ).toBe(42.1);
  });

  it('handles the minimum allowed bounds for women', () => {
    expect(
      calculateBodyFatPercentage(
        BODY_FAT_INPUT_BOUNDS.MIN_HEIGHT_CM,
        BODY_FAT_INPUT_BOUNDS.MIN_NECK_CM,
        BODY_FAT_INPUT_BOUNDS.MIN_WAIST_CM,
        'female',
        BODY_FAT_INPUT_BOUNDS.MIN_HIP_CM,
      ),
    ).toBe(51.2);
  });

  it('handles the maximum allowed bounds for women', () => {
    expect(
      calculateBodyFatPercentage(
        BODY_FAT_INPUT_BOUNDS.MAX_HEIGHT_CM,
        BODY_FAT_INPUT_BOUNDS.MAX_NECK_CM,
        BODY_FAT_INPUT_BOUNDS.MAX_WAIST_CM,
        'female',
        BODY_FAT_INPUT_BOUNDS.MAX_HIP_CM,
      ),
    ).toBe(67.2);
  });

  // --- Invalid inputs ---
  it('throws for zero height', () => {
    expect(() => calculateBodyFatPercentage(0, 38, 85, 'male')).toThrow(
      RangeError,
    );
  });

  it('throws for negative neck', () => {
    expect(() => calculateBodyFatPercentage(180, -38, 85, 'male')).toThrow(
      RangeError,
    );
  });

  it('throws for non-numeric waist (NaN)', () => {
    expect(() => calculateBodyFatPercentage(180, 38, NaN, 'male')).toThrow(
      RangeError,
    );
  });

  it('throws for Infinity height', () => {
    expect(() =>
      calculateBodyFatPercentage(Infinity, 38, 85, 'male'),
    ).toThrow(RangeError);
  });

  it('throws when waist does not exceed neck (male formula)', () => {
    expect(() => calculateBodyFatPercentage(180, 40, 40, 'male')).toThrow(
      RangeError,
    );
    expect(() => calculateBodyFatPercentage(180, 40, 35, 'male')).toThrow(
      RangeError,
    );
  });

  it('throws when waist + hip does not exceed neck (female formula)', () => {
    expect(() =>
      calculateBodyFatPercentage(165, 60, 40, 'female', 15),
    ).toThrow(RangeError);
  });

  it('throws for the female formula when hip is missing', () => {
    expect(() => calculateBodyFatPercentage(165, 33, 70, 'female')).toThrow(
      RangeError,
    );
  });

  it('throws for the female formula when hip is zero or negative', () => {
    expect(() =>
      calculateBodyFatPercentage(165, 33, 70, 'female', 0),
    ).toThrow(RangeError);
    expect(() =>
      calculateBodyFatPercentage(165, 33, 70, 'female', -10),
    ).toThrow(RangeError);
  });

  it('never returns NaN or Infinity for any successful call', () => {
    expect(
      Number.isFinite(calculateBodyFatPercentage(180, 38, 85, 'male')),
    ).toBe(true);
    expect(
      Number.isFinite(
        calculateBodyFatPercentage(165, 33, 70, 'female', 95),
      ),
    ).toBe(true);
  });
});

describe('getBodyFatCategory', () => {
  // --- Boundary values: exact band edges for men ---
  it('classifies men at each exact boundary correctly', () => {
    expect(getBodyFatCategory(5, 'male').category).toBe('essential-fat');
    expect(getBodyFatCategory(5.1, 'male').category).toBe('athletes');
    expect(getBodyFatCategory(13, 'male').category).toBe('athletes');
    expect(getBodyFatCategory(13.1, 'male').category).toBe('fitness');
    expect(getBodyFatCategory(17, 'male').category).toBe('fitness');
    expect(getBodyFatCategory(17.1, 'male').category).toBe('average');
    expect(getBodyFatCategory(24, 'male').category).toBe('average');
    expect(getBodyFatCategory(24.1, 'male').category).toBe('obese');
  });

  // --- Boundary values: exact band edges for women ---
  it('classifies women at each exact boundary correctly', () => {
    expect(getBodyFatCategory(13, 'female').category).toBe('essential-fat');
    expect(getBodyFatCategory(13.1, 'female').category).toBe('athletes');
    expect(getBodyFatCategory(20, 'female').category).toBe('athletes');
    expect(getBodyFatCategory(20.1, 'female').category).toBe('fitness');
    expect(getBodyFatCategory(24, 'female').category).toBe('fitness');
    expect(getBodyFatCategory(24.1, 'female').category).toBe('average');
    expect(getBodyFatCategory(31, 'female').category).toBe('average');
    expect(getBodyFatCategory(31.1, 'female').category).toBe('obese');
  });

  it('returns a human-readable label alongside the category', () => {
    expect(getBodyFatCategory(10, 'male')).toEqual({
      category: 'athletes',
      label: 'Athletic',
    });
  });

  it('throws for a non-finite body fat percentage', () => {
    expect(() => getBodyFatCategory(NaN, 'male')).toThrow(RangeError);
    expect(() => getBodyFatCategory(Infinity, 'male')).toThrow(RangeError);
  });
});

describe('getBodyFatResult', () => {
  it('combines percentage and category for a male result', () => {
    const result = getBodyFatResult(180, 38, 85, 'male');
    expect(result.bodyFatPercentage).toBe(16.1);
    expect(result.category.category).toBe('fitness');
  });

  it('combines percentage and category for a female result', () => {
    const result = getBodyFatResult(165, 33, 70, 'female', 95);
    expect(result.bodyFatPercentage).toBe(24.3);
    expect(result.category.category).toBe('average');
  });

  it('propagates validation errors from an invalid measurement combination', () => {
    expect(() => getBodyFatResult(180, 40, 40, 'male')).toThrow(RangeError);
  });
});

describe('validateHeightInput', () => {
  it('returns null for a valid height', () => {
    expect(validateHeightInput('180')).toBeNull();
  });

  it('flags an empty height field', () => {
    expect(validateHeightInput('')).toBe('HEIGHT_REQUIRED');
  });

  it('flags non-numeric height', () => {
    expect(validateHeightInput('abc')).toBe('HEIGHT_NOT_A_NUMBER');
  });

  it('flags zero height', () => {
    expect(validateHeightInput('0')).toBe('HEIGHT_NOT_POSITIVE');
  });

  it('flags height just above the maximum bound', () => {
    expect(validateHeightInput('300.1')).toBe('HEIGHT_OUT_OF_RANGE');
  });
});

describe('validateSexInput', () => {
  it('returns null when male or female is selected', () => {
    expect(validateSexInput('male')).toBeNull();
    expect(validateSexInput('female')).toBeNull();
  });

  it('flags when nothing is selected', () => {
    expect(validateSexInput(null)).toBe('SEX_REQUIRED');
  });
});

describe('validateNeckInput', () => {
  it('returns null for a valid neck circumference', () => {
    expect(validateNeckInput('38')).toBeNull();
  });

  it('flags an empty neck field', () => {
    expect(validateNeckInput('')).toBe('NECK_REQUIRED');
  });

  it('flags non-numeric neck circumference', () => {
    expect(validateNeckInput('abc')).toBe('NECK_NOT_A_NUMBER');
  });

  it('flags negative neck circumference', () => {
    expect(validateNeckInput('-5')).toBe('NECK_NOT_POSITIVE');
  });

  it('accepts the exact minimum and maximum neck bounds', () => {
    expect(validateNeckInput(String(BODY_FAT_INPUT_BOUNDS.MIN_NECK_CM))).toBeNull();
    expect(validateNeckInput(String(BODY_FAT_INPUT_BOUNDS.MAX_NECK_CM))).toBeNull();
  });

  it('flags neck circumference just above the maximum bound', () => {
    expect(validateNeckInput('60.1')).toBe('NECK_OUT_OF_RANGE');
  });
});

describe('validateWaistInput', () => {
  it('returns null for a valid waist circumference', () => {
    expect(validateWaistInput('85')).toBeNull();
  });

  it('flags an empty waist field', () => {
    expect(validateWaistInput('')).toBe('WAIST_REQUIRED');
  });

  it('flags non-numeric waist circumference', () => {
    expect(validateWaistInput('abc')).toBe('WAIST_NOT_A_NUMBER');
  });

  it('flags negative waist circumference', () => {
    expect(validateWaistInput('-5')).toBe('WAIST_NOT_POSITIVE');
  });

  it('flags waist circumference just above the maximum bound', () => {
    expect(validateWaistInput('200.1')).toBe('WAIST_OUT_OF_RANGE');
  });
});

describe('validateHipInput', () => {
  it('is not required and returns null when sex is male', () => {
    expect(validateHipInput('', 'male')).toBeNull();
    expect(validateHipInput('abc', 'male')).toBeNull();
  });

  it('is not required and returns null when sex is not yet selected', () => {
    expect(validateHipInput('', null)).toBeNull();
  });

  it('returns null for a valid hip circumference when sex is female', () => {
    expect(validateHipInput('95', 'female')).toBeNull();
  });

  it('flags an empty hip field when sex is female', () => {
    expect(validateHipInput('', 'female')).toBe('HIP_REQUIRED');
  });

  it('flags non-numeric hip circumference when sex is female', () => {
    expect(validateHipInput('abc', 'female')).toBe('HIP_NOT_A_NUMBER');
  });

  it('flags negative hip circumference when sex is female', () => {
    expect(validateHipInput('-5', 'female')).toBe('HIP_NOT_POSITIVE');
  });

  it('flags hip circumference just above the maximum bound when sex is female', () => {
    expect(validateHipInput('200.1', 'female')).toBe('HIP_OUT_OF_RANGE');
  });
});

describe('validateMeasurementConsistency', () => {
  it('returns null for a consistent male measurement set', () => {
    expect(validateMeasurementConsistency('38', '85', '', 'male')).toBeNull();
  });

  it('flags an inconsistent male measurement set (waist not greater than neck)', () => {
    expect(validateMeasurementConsistency('40', '40', '', 'male')).toBe(
      'WAIST_NECK_DIFFERENCE_INVALID',
    );
  });

  it('returns null for a consistent female measurement set', () => {
    expect(
      validateMeasurementConsistency('33', '70', '95', 'female'),
    ).toBeNull();
  });

  it('flags an inconsistent female measurement set (waist + hip not greater than neck)', () => {
    expect(
      validateMeasurementConsistency('60', '40', '15', 'female'),
    ).toBe('WAIST_HIP_NECK_DIFFERENCE_INVALID');
  });

  it('returns null when sex is not yet selected', () => {
    expect(validateMeasurementConsistency('40', '40', '', null)).toBeNull();
  });

  it('returns null when neck or waist is not yet a valid number (defers to field-level errors)', () => {
    expect(validateMeasurementConsistency('', '85', '', 'male')).toBeNull();
    expect(validateMeasurementConsistency('38', 'abc', '', 'male')).toBeNull();
  });
});

describe('validateBodyFatInputs', () => {
  it('returns null for all fields for a valid male input set', () => {
    expect(
      validateBodyFatInputs('180', '38', '85', '', 'male'),
    ).toEqual({
      heightError: null,
      neckError: null,
      waistError: null,
      hipError: null,
      sexError: null,
    });
  });

  it('returns null for all fields for a valid female input set', () => {
    expect(
      validateBodyFatInputs('165', '33', '70', '95', 'female'),
    ).toEqual({
      heightError: null,
      neckError: null,
      waistError: null,
      hipError: null,
      sexError: null,
    });
  });

  it('reports height, neck, waist, hip, and sex errors independently', () => {
    expect(validateBodyFatInputs('', 'abc', '-5', '', null)).toEqual({
      heightError: 'HEIGHT_REQUIRED',
      neckError: 'NECK_NOT_A_NUMBER',
      waistError: 'WAIST_NOT_POSITIVE',
      hipError: null,
      sexError: 'SEX_REQUIRED',
    });
  });

  it('requires hip only once sex is female', () => {
    expect(
      validateBodyFatInputs('180', '38', '85', '', 'male'),
    ).toMatchObject({ hipError: null });
    expect(
      validateBodyFatInputs('165', '33', '70', '', 'female'),
    ).toMatchObject({ hipError: 'HIP_REQUIRED' });
  });

  it('surfaces the cross-field consistency error on waist once every field is otherwise valid', () => {
    expect(
      validateBodyFatInputs('180', '40', '40', '', 'male'),
    ).toEqual({
      heightError: null,
      neckError: null,
      waistError: 'WAIST_NECK_DIFFERENCE_INVALID',
      hipError: null,
      sexError: null,
    });
  });

  it('does not run the consistency check while another field is still invalid', () => {
    // Waist is out of range here, so the consistency check must not
    // overwrite it with a different error.
    expect(
      validateBodyFatInputs('180', '38', '', '', 'male'),
    ).toMatchObject({ waistError: 'WAIST_REQUIRED' });
  });
});
