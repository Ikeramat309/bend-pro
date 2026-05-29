/**
 * Small app-level unit helpers.
 */
import type { Unit } from '@/calculators/offset/offsetTypes';

export function getLengthUnitLabel(unitSystem: Unit): 'in' | 'mm' {
  return unitSystem === 'metric' ? 'mm' : 'in';
}

export function getUnitSystemLabel(unitSystem: Unit): 'Imperial' | 'Metric' {
  return unitSystem === 'metric' ? 'Metric' : 'Imperial';
}
