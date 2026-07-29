import { describe, expect, it } from 'vitest';
import {
  DEFAULT_UNITS_BY_CATEGORY,
  LENGTH_UNITS,
  UNIT_CONVERTER_BOUNDS,
  VOLUME_UNITS,
  WEIGHT_UNITS,
  convertLength,
  convertTemperature,
  convertUnits,
  convertVolume,
  convertWeight,
  roundUnitValue,
  unitToCelsius,
  validateValueInput,
} from './unit-converter';

describe('convertLength', () => {
  it('converts kilometers to meters', () => {
    expect(convertLength(1, 'kilometer', 'meter')).toBe(1000);
  });

  it('converts centimeters to meters', () => {
    expect(convertLength(100, 'centimeter', 'meter')).toBe(1);
  });

  it('converts miles to kilometers', () => {
    // 1 mile = 1609.344 m = 1.609344 km exactly, by the defined constant
    expect(convertLength(1, 'mile', 'kilometer')).toBe(1.609344);
  });

  it('converts 12 inches to exactly 1 foot', () => {
    expect(convertLength(12, 'inch', 'foot')).toBe(1);
  });

  it('returns the same value when converting a unit to itself', () => {
    expect(convertLength(42, 'meter', 'meter')).toBe(42);
  });

  it('throws for a non-finite value', () => {
    expect(() => convertLength(NaN, 'meter', 'foot')).toThrow(RangeError);
  });
});

describe('convertWeight', () => {
  it('converts grams to kilograms', () => {
    expect(convertWeight(1000, 'gram', 'kilogram')).toBe(1);
  });

  it('converts 16 ounces to exactly 1 pound', () => {
    expect(convertWeight(16, 'ounce', 'pound')).toBe(1);
  });

  it('converts kilograms to pounds', () => {
    // 1 kg / 0.45359237 = 2.204622622... -> rounds to 2.204623
    expect(convertWeight(1, 'kilogram', 'pound')).toBeCloseTo(2.204623, 6);
  });

  it('throws for a non-finite value', () => {
    expect(() => convertWeight(Infinity, 'gram', 'kilogram')).toThrow(
      RangeError,
    );
  });
});

describe('convertVolume', () => {
  it('converts milliliters to liters', () => {
    expect(convertVolume(1000, 'milliliter', 'liter')).toBe(1);
  });

  it('converts 4 US quarts to exactly 1 US gallon', () => {
    expect(convertVolume(4, 'usQuart', 'usGallon')).toBe(1);
  });

  it('converts liters to US gallons', () => {
    // 1 L / 3.785411784 = 0.2641720524... -> rounds to 0.264172
    expect(convertVolume(1, 'liter', 'usGallon')).toBeCloseTo(0.264172, 6);
  });
});

describe('convertTemperature', () => {
  it('converts freezing point: 0°C -> 32°F', () => {
    expect(convertTemperature(0, 'celsius', 'fahrenheit')).toBe(32);
  });

  it('converts boiling point: 100°C -> 212°F', () => {
    expect(convertTemperature(100, 'celsius', 'fahrenheit')).toBe(212);
  });

  it('converts the crossover point: -40°C -> -40°F', () => {
    expect(convertTemperature(-40, 'celsius', 'fahrenheit')).toBe(-40);
  });

  it('converts 32°F back to 0°C', () => {
    expect(convertTemperature(32, 'fahrenheit', 'celsius')).toBe(0);
  });

  it('converts 0°C to 273.15 K', () => {
    expect(convertTemperature(0, 'celsius', 'kelvin')).toBe(273.15);
  });

  it('converts 0 K to absolute zero in Celsius', () => {
    expect(convertTemperature(0, 'kelvin', 'celsius')).toBe(-273.15);
  });

  it('returns the same value when converting a unit to itself', () => {
    expect(convertTemperature(37, 'celsius', 'celsius')).toBe(37);
  });

  it('throws for a non-finite value', () => {
    expect(() => convertTemperature(NaN, 'celsius', 'kelvin')).toThrow(
      RangeError,
    );
  });
});

describe('unitToCelsius', () => {
  it('passes Celsius through unchanged', () => {
    expect(unitToCelsius(20, 'celsius')).toBe(20);
  });

  it('converts Fahrenheit to Celsius', () => {
    expect(unitToCelsius(212, 'fahrenheit')).toBe(100);
  });

  it('converts Kelvin to Celsius', () => {
    expect(unitToCelsius(373.15, 'kelvin')).toBe(100);
  });
});

describe('convertUnits', () => {
  it('dispatches to length conversion', () => {
    const result = convertUnits(1, 'length', 'kilometer', 'meter');
    expect(result).toEqual({
      value: 1,
      convertedValue: 1000,
      fromUnit: 'kilometer',
      toUnit: 'meter',
      category: 'length',
    });
  });

  it('dispatches to temperature conversion', () => {
    const result = convertUnits(100, 'temperature', 'celsius', 'fahrenheit');
    expect(result.convertedValue).toBe(212);
  });

  it('dispatches to weight conversion', () => {
    const result = convertUnits(16, 'weight', 'ounce', 'pound');
    expect(result.convertedValue).toBe(1);
  });

  it('dispatches to volume conversion', () => {
    const result = convertUnits(4, 'volume', 'usQuart', 'usGallon');
    expect(result.convertedValue).toBe(1);
  });
});

describe('roundUnitValue', () => {
  it('rounds to 6 decimal places', () => {
    expect(roundUnitValue(1 / 3)).toBe(0.333333);
  });

  it('normalizes -0 to 0', () => {
    expect(Object.is(roundUnitValue(-0.0000001), -0)).toBe(false);
  });
});

describe('validateValueInput', () => {
  it('returns null for a valid positive length value', () => {
    expect(validateValueInput('10', 'length', 'meter')).toBeNull();
  });

  it('flags an empty field', () => {
    expect(validateValueInput('', 'length', 'meter')).toBe('VALUE_REQUIRED');
  });

  it('flags non-numeric input', () => {
    expect(validateValueInput('abc', 'length', 'meter')).toBe(
      'VALUE_NOT_A_NUMBER',
    );
  });

  it('flags a negative length value', () => {
    expect(validateValueInput('-5', 'length', 'meter')).toBe(
      'VALUE_OUT_OF_RANGE',
    );
  });

  it('flags a negative weight value', () => {
    expect(validateValueInput('-1', 'weight', 'kilogram')).toBe(
      'VALUE_OUT_OF_RANGE',
    );
  });

  it('flags a negative volume value', () => {
    expect(validateValueInput('-1', 'volume', 'liter')).toBe(
      'VALUE_OUT_OF_RANGE',
    );
  });

  it('accepts zero for length/weight/volume', () => {
    expect(validateValueInput('0', 'length', 'meter')).toBeNull();
  });

  it('flags a length value above the maximum bound', () => {
    expect(
      validateValueInput(
        String(UNIT_CONVERTER_BOUNDS.MAX_VALUE + 1),
        'length',
        'meter',
      ),
    ).toBe('VALUE_OUT_OF_RANGE');
  });

  // --- Temperature: negative values are normal, but bounded by physics ---
  it('accepts a negative Celsius value above absolute zero', () => {
    expect(validateValueInput('-40', 'temperature', 'celsius')).toBeNull();
  });

  it('accepts exactly absolute zero in Celsius', () => {
    expect(
      validateValueInput(
        String(UNIT_CONVERTER_BOUNDS.ABSOLUTE_ZERO_CELSIUS),
        'temperature',
        'celsius',
      ),
    ).toBeNull();
  });

  it('flags a Celsius value below absolute zero', () => {
    expect(validateValueInput('-300', 'temperature', 'celsius')).toBe(
      'VALUE_BELOW_ABSOLUTE_ZERO',
    );
  });

  it('flags a Fahrenheit value that is below absolute zero once converted', () => {
    // -500°F -> Celsius = (-500-32)*5/9 = -295.5556°C, below -273.15
    expect(validateValueInput('-500', 'temperature', 'fahrenheit')).toBe(
      'VALUE_BELOW_ABSOLUTE_ZERO',
    );
  });

  it('accepts a Fahrenheit value that looks very negative but is still above absolute zero', () => {
    // -450°F -> Celsius = (-450-32)*5/9 = -267.7778°C, above -273.15
    expect(
      validateValueInput('-450', 'temperature', 'fahrenheit'),
    ).toBeNull();
  });

  it('accepts 0 Kelvin (absolute zero) but not negative Kelvin', () => {
    expect(validateValueInput('0', 'temperature', 'kelvin')).toBeNull();
    expect(validateValueInput('-1', 'temperature', 'kelvin')).toBe(
      'VALUE_BELOW_ABSOLUTE_ZERO',
    );
  });
});

describe('unit definitions and defaults are internally consistent', () => {
  it('every default from/to unit exists in its category\'s unit table', () => {
    const tables: Record<string, Record<string, unknown>> = {
      length: LENGTH_UNITS,
      weight: WEIGHT_UNITS,
      volume: VOLUME_UNITS,
    };
    for (const [category, defaults] of Object.entries(
      DEFAULT_UNITS_BY_CATEGORY,
    )) {
      if (category === 'temperature') continue;
      const table = tables[category];
      expect(table[defaults.fromUnit]).toBeDefined();
      expect(table[defaults.toUnit]).toBeDefined();
    }
  });
});
