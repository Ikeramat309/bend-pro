/** Shared helpers for JSON-safe calculator input snapshots. */

import { toCanonicalInches } from '@/core/measurements';
import type { CalculatorSetup } from '@/core/settings/calculatorSetup';
import type { BendAngle, RoundingOption, UnitSystem } from '@/core/types';
import { formatLength } from '@/utils/formatLength';

import { sanitizeSetupSnapshot } from './sessionSanitize';
import type { RecentLayout } from './sessionTypes';

export function isJsonLeaf(value: unknown): boolean {
  if (value === null) {
    return false;
  }
  const kind = typeof value;
  if (kind === 'string' || kind === 'boolean') {
    return true;
  }
  if (kind === 'number') {
    return Number.isFinite(value);
  }
  return false;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function pickJsonLeaves(
  raw: unknown,
  allowedKeys: readonly string[],
): Record<string, unknown> {
  if (!isRecord(raw)) {
    return {};
  }

  const picked: Record<string, unknown> = {};
  for (const key of allowedKeys) {
    const value = raw[key];
    if (isJsonLeaf(value)) {
      picked[key] = value;
    }
  }
  return picked;
}

export function optionalFiniteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

export function requiredFiniteNumber(value: unknown): number | undefined {
  const parsed = optionalFiniteNumber(value);
  return parsed !== undefined && parsed > 0 ? parsed : undefined;
}

export function optionalNonNegativeNumber(value: unknown): number | undefined {
  const parsed = optionalFiniteNumber(value);
  return parsed !== undefined && parsed >= 0 ? parsed : undefined;
}

/** Formats a stored display-unit length back into an input-strip string. */
export function formatStoredLengthText(
  value: number | undefined,
  unitSystem: UnitSystem,
  rounding: RoundingOption,
): string {
  if (value === undefined) {
    return '';
  }
  return formatLength(toCanonicalInches(value, unitSystem), unitSystem, rounding);
}

export function baseSetupPatchFromLayout(layout: RecentLayout): Partial<CalculatorSetup> {
  const setupSnapshot = sanitizeSetupSnapshot(layout.setupSnapshot);
  return {
    unit: setupSnapshot.unitSystem,
    rounding: setupSnapshot.roundingPrecision,
    conduitType: setupSnapshot.conduitType,
    conduitSize: setupSnapshot.tradeSize,
    benderProfileId: setupSnapshot.benderProfileId,
  };
}

export function mergeOffsetAngleOverrides(
  current: CalculatorSetup,
  bendAngle: BendAngle,
  multiplierOverride: number | undefined,
  shrinkPerInchOverride: number | undefined,
): Partial<CalculatorSetup> {
  const offsetMultiplierOverrides = { ...current.offsetMultiplierOverrides };
  const offsetShrinkPerInchOverrides = { ...current.offsetShrinkPerInchOverrides };

  if (multiplierOverride !== undefined) {
    offsetMultiplierOverrides[bendAngle] = multiplierOverride;
  } else {
    delete offsetMultiplierOverrides[bendAngle];
  }

  if (shrinkPerInchOverride !== undefined) {
    offsetShrinkPerInchOverrides[bendAngle] = shrinkPerInchOverride;
  } else {
    delete offsetShrinkPerInchOverrides[bendAngle];
  }

  return { offsetMultiplierOverrides, offsetShrinkPerInchOverrides };
}
