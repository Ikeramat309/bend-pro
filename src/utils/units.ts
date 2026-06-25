/**
 * Small app-level unit helpers.
 */
import type { UnitSystem } from '@/core/types';

export function getLengthUnitLabel(unitSystem: UnitSystem): 'in' | 'mm' {
  return unitSystem === 'metric' ? 'mm' : 'in';
}

export function getUnitSystemLabel(unitSystem: UnitSystem): 'Imperial' | 'Metric' {
  return unitSystem === 'metric' ? 'Metric' : 'Imperial';
}

/** FieldInput length mode — imperial shows the trade fraction keypad. */
export function getLengthInputMode(unitSystem: UnitSystem): 'decimal' | 'imperial' {
  return unitSystem === 'imperial' ? 'imperial' : 'decimal';
}
