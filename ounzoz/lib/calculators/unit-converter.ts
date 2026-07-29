import type {
  LengthUnit,
  TemperatureUnit,
  UnitCategory,
  UnitConverterResult,
  UnitConverterUnit,
  UnitConverterValidationError,
  VolumeUnit,
  WeightUnit,
} from '@/types/unit-converter';

// Sanity bound for length/weight/volume — a physically enormous but not
// infinite quantity, wide enough for any realistic conversion while
// catching fat-fingered input (CLAUDE.md Section 8). These three
// categories are physical quantities and cannot be negative.
const MAX_VALUE = 1_000_000_000;
// Separate sanity bound for temperature, since its valid range is
// anchored by physics (absolute zero) rather than "cannot be negative."
const MAX_TEMPERATURE_MAGNITUDE = 1_000_000;
const ABSOLUTE_ZERO_CELSIUS = -273.15;

interface UnitDefinition {
  label: string;
  /** Short display symbol, e.g. "ft" — used in the result panel where the full label would be noisy. */
  symbol: string;
  /** Multiplier to convert one unit of this quantity into the category's base unit. */
  toBase: number;
}

// Length — base unit: meter. Conversion factors are the standard
// internationally-defined equivalents (1 in = 0.0254 m exactly, etc.).
export const LENGTH_UNITS: Record<LengthUnit, UnitDefinition> = {
  millimeter: { label: 'Millimeters (mm)', symbol: 'mm', toBase: 0.001 },
  centimeter: { label: 'Centimeters (cm)', symbol: 'cm', toBase: 0.01 },
  meter: { label: 'Meters (m)', symbol: 'm', toBase: 1 },
  kilometer: { label: 'Kilometers (km)', symbol: 'km', toBase: 1000 },
  inch: { label: 'Inches (in)', symbol: 'in', toBase: 0.0254 },
  foot: { label: 'Feet (ft)', symbol: 'ft', toBase: 0.3048 },
  yard: { label: 'Yards (yd)', symbol: 'yd', toBase: 0.9144 },
  mile: { label: 'Miles (mi)', symbol: 'mi', toBase: 1609.344 },
};

// Weight — base unit: kilogram. US customary units (avoirdupois ounce/
// pound, international stone) per their standard defined equivalents.
export const WEIGHT_UNITS: Record<WeightUnit, UnitDefinition> = {
  milligram: { label: 'Milligrams (mg)', symbol: 'mg', toBase: 0.000001 },
  gram: { label: 'Grams (g)', symbol: 'g', toBase: 0.001 },
  kilogram: { label: 'Kilograms (kg)', symbol: 'kg', toBase: 1 },
  ounce: { label: 'Ounces (oz)', symbol: 'oz', toBase: 0.028349523125 },
  pound: { label: 'Pounds (lb)', symbol: 'lb', toBase: 0.45359237 },
  stone: { label: 'Stone (st)', symbol: 'st', toBase: 6.35029318 },
};

// Volume — base unit: liter. US customary liquid measures (not UK/
// imperial — called out explicitly in the tool's content per CLAUDE.md
// Section 15's "no ambiguous unit" rule).
export const VOLUME_UNITS: Record<VolumeUnit, UnitDefinition> = {
  milliliter: { label: 'Milliliters (mL)', symbol: 'mL', toBase: 0.001 },
  liter: { label: 'Liters (L)', symbol: 'L', toBase: 1 },
  cubicMeter: { label: 'Cubic meters (m³)', symbol: 'm³', toBase: 1000 },
  usGallon: { label: 'US Gallons (gal)', symbol: 'gal', toBase: 3.785411784 },
  usQuart: { label: 'US Quarts (qt)', symbol: 'qt', toBase: 0.946352946 },
  usPint: { label: 'US Pints (pt)', symbol: 'pt', toBase: 0.473176473 },
  usCup: { label: 'US Cups (cup)', symbol: 'cup', toBase: 0.2365882365 },
  usFluidOunce: {
    label: 'US Fluid Ounces (fl oz)',
    symbol: 'fl oz',
    toBase: 0.0295735295625,
  },
};

// Temperature has no base multiplier — Celsius/Fahrenheit/Kelvin aren't
// proportional to each other (Fahrenheit and Celsius don't share a zero
// point), so conversion routes through dedicated formulas instead.
export const TEMPERATURE_UNITS: Record<
  TemperatureUnit,
  { label: string; symbol: string }
> = {
  celsius: { label: 'Celsius (°C)', symbol: '°C' },
  fahrenheit: { label: 'Fahrenheit (°F)', symbol: '°F' },
  kelvin: { label: 'Kelvin (K)', symbol: 'K' },
};

/** Rounds to 6 decimal places and normalizes -0 to 0 — enough precision to keep tiny/huge cross-unit ratios (e.g. mm -> mile) accurate without carrying raw float noise into the UI. */
export function roundUnitValue(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000 + 0;
}

/** Converts a temperature value in `unit` to Celsius (temperature's reference point for range-checking against absolute zero). */
export function unitToCelsius(value: number, unit: TemperatureUnit): number {
  switch (unit) {
    case 'celsius':
      return value;
    case 'fahrenheit':
      return ((value - 32) * 5) / 9;
    case 'kelvin':
      return value - 273.15;
  }
}

/** Converts a Celsius value to `unit`. */
function celsiusToUnit(celsius: number, unit: TemperatureUnit): number {
  switch (unit) {
    case 'celsius':
      return celsius;
    case 'fahrenheit':
      return (celsius * 9) / 5 + 32;
    case 'kelvin':
      return celsius + 273.15;
  }
}

function convertLinear(
  value: number,
  units: Record<string, UnitDefinition>,
  fromUnit: string,
  toUnit: string,
): number {
  const fromDefinition = units[fromUnit];
  const toDefinition = units[toUnit];
  if (!fromDefinition || !toDefinition) {
    throw new RangeError('unknown unit for this category');
  }
  return roundUnitValue((value * fromDefinition.toBase) / toDefinition.toBase);
}

/**
 * Converts a temperature via Celsius as an intermediate step (routing
 * through a shared reference point is the standard approach, since
 * Fahrenheit/Celsius/Kelvin aren't related by a simple multiplier):
 * F = C×9/5+32, K = C+273.15, and their inverses.
 */
export function convertTemperature(
  value: number,
  fromUnit: TemperatureUnit,
  toUnit: TemperatureUnit,
): number {
  if (!Number.isFinite(value)) {
    throw new RangeError('value must be a finite number');
  }
  const celsius = unitToCelsius(value, fromUnit);
  return roundUnitValue(celsiusToUnit(celsius, toUnit));
}

export function convertLength(
  value: number,
  fromUnit: LengthUnit,
  toUnit: LengthUnit,
): number {
  if (!Number.isFinite(value)) {
    throw new RangeError('value must be a finite number');
  }
  return convertLinear(value, LENGTH_UNITS, fromUnit, toUnit);
}

export function convertWeight(
  value: number,
  fromUnit: WeightUnit,
  toUnit: WeightUnit,
): number {
  if (!Number.isFinite(value)) {
    throw new RangeError('value must be a finite number');
  }
  return convertLinear(value, WEIGHT_UNITS, fromUnit, toUnit);
}

export function convertVolume(
  value: number,
  fromUnit: VolumeUnit,
  toUnit: VolumeUnit,
): number {
  if (!Number.isFinite(value)) {
    throw new RangeError('value must be a finite number');
  }
  return convertLinear(value, VOLUME_UNITS, fromUnit, toUnit);
}

/**
 * Dispatches to the right category-specific conversion and returns the
 * full result. Pure function (CLAUDE.md Section 6): deterministic, no
 * I/O, no DOM/React state. Assumes inputs already passed validation.
 */
export function convertUnits(
  value: number,
  category: UnitCategory,
  fromUnit: UnitConverterUnit,
  toUnit: UnitConverterUnit,
): UnitConverterResult {
  let convertedValue: number;
  switch (category) {
    case 'length':
      convertedValue = convertLength(value, fromUnit as LengthUnit, toUnit as LengthUnit);
      break;
    case 'weight':
      convertedValue = convertWeight(value, fromUnit as WeightUnit, toUnit as WeightUnit);
      break;
    case 'volume':
      convertedValue = convertVolume(value, fromUnit as VolumeUnit, toUnit as VolumeUnit);
      break;
    case 'temperature':
      convertedValue = convertTemperature(
        value,
        fromUnit as TemperatureUnit,
        toUnit as TemperatureUnit,
      );
      break;
  }
  return { value, convertedValue, fromUnit, toUnit, category };
}

// --- Validation ---

/**
 * Validates the numeric value field. Temperature is range-checked
 * against absolute zero *in the unit the user actually selected* (e.g.
 * -500°F is invalid because it's below absolute zero once converted to
 * Celsius, even though -500 alone looks like an ordinary number) —
 * length/weight/volume are physical quantities and simply can't be
 * negative.
 */
export function validateValueInput(
  raw: string,
  category: UnitCategory,
  fromUnit: UnitConverterUnit,
): UnitConverterValidationError | null {
  const trimmed = raw.trim();
  if (trimmed === '') return 'VALUE_REQUIRED';

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return 'VALUE_NOT_A_NUMBER';

  if (category === 'temperature') {
    if (Math.abs(value) > MAX_TEMPERATURE_MAGNITUDE) return 'VALUE_OUT_OF_RANGE';
    const celsius = unitToCelsius(value, fromUnit as TemperatureUnit);
    if (celsius < ABSOLUTE_ZERO_CELSIUS) return 'VALUE_BELOW_ABSOLUTE_ZERO';
    return null;
  }

  if (value < 0 || value > MAX_VALUE) return 'VALUE_OUT_OF_RANGE';
  return null;
}

/** Looks up the right unit table for a category — shared by the From/To
 * selects and the result panel so both read unit labels/symbols from a
 * single source rather than duplicating this mapping. */
export const UNIT_TABLES_BY_CATEGORY: Record<
  UnitCategory,
  Record<string, { label: string; symbol: string }>
> = {
  length: LENGTH_UNITS,
  weight: WEIGHT_UNITS,
  temperature: TEMPERATURE_UNITS,
  volume: VOLUME_UNITS,
};

export const UNIT_CONVERTER_BOUNDS = {
  MAX_VALUE,
  MAX_TEMPERATURE_MAGNITUDE,
  ABSOLUTE_ZERO_CELSIUS,
} as const;

/** Default from/to unit pair shown when a category is first selected. */
export const DEFAULT_UNITS_BY_CATEGORY: Record<
  UnitCategory,
  { fromUnit: UnitConverterUnit; toUnit: UnitConverterUnit }
> = {
  length: { fromUnit: 'meter', toUnit: 'foot' },
  weight: { fromUnit: 'kilogram', toUnit: 'pound' },
  temperature: { fromUnit: 'celsius', toUnit: 'fahrenheit' },
  volume: { fromUnit: 'liter', toUnit: 'usGallon' },
};

/** User-facing copy for each validation error — plain language, actionable, per CLAUDE.md Section 8 / DESIGN.md Section 19. */
export const UNIT_CONVERTER_VALIDATION_MESSAGES: Record<
  UnitConverterValidationError,
  string
> = {
  VALUE_REQUIRED: 'Enter a value to convert.',
  VALUE_NOT_A_NUMBER: 'Value must be a number.',
  VALUE_OUT_OF_RANGE: 'Enter a realistic, non-negative value.',
  VALUE_BELOW_ABSOLUTE_ZERO:
    'That temperature is below absolute zero (−273.15°C / −459.67°F / 0 K), which is not physically possible.',
};
