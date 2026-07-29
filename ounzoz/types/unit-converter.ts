export type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume';

export type LengthUnit =
  | 'millimeter'
  | 'centimeter'
  | 'meter'
  | 'kilometer'
  | 'inch'
  | 'foot'
  | 'yard'
  | 'mile';

export type WeightUnit =
  | 'milligram'
  | 'gram'
  | 'kilogram'
  | 'ounce'
  | 'pound'
  | 'stone';

export type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin';

export type VolumeUnit =
  | 'milliliter'
  | 'liter'
  | 'cubicMeter'
  | 'usGallon'
  | 'usQuart'
  | 'usPint'
  | 'usCup'
  | 'usFluidOunce';

export type UnitConverterUnit =
  | LengthUnit
  | WeightUnit
  | TemperatureUnit
  | VolumeUnit;

export interface UnitConverterResult {
  value: number;
  convertedValue: number;
  fromUnit: UnitConverterUnit;
  toUnit: UnitConverterUnit;
  category: UnitCategory;
}

export type UnitConverterValidationError =
  | 'VALUE_REQUIRED'
  | 'VALUE_NOT_A_NUMBER'
  | 'VALUE_OUT_OF_RANGE'
  | 'VALUE_BELOW_ABSOLUTE_ZERO';
