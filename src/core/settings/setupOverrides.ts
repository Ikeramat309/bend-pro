import type { BendAngle, TradeSize } from '@/core/types';

import type { CalculatorSetup } from './calculatorSetup';

export type SetupOverrideEntry =
  | {
      key: string;
      kind: 'stub90-deduct';
      tradeSize: TradeSize;
      valueInches: number;
      label: string;
      editHint: string;
    }
  | {
      key: string;
      kind: 'offset-multiplier';
      bendAngle: BendAngle;
      value: number;
      label: string;
      editHint: string;
    }
  | {
      key: string;
      kind: 'offset-shrink';
      bendAngle: BendAngle;
      valueInches: number;
      label: string;
      editHint: string;
    };

const OFFSET_ANGLES: BendAngle[] = [10, 22.5, 30, 45, 60];

function formatMultiplier(value: number): string {
  return String(Math.round(value * 1000) / 1000);
}

function formatShrinkInches(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  return `${rounded}"`;
}

/** All manual chart overrides stored in setup, for the bender hub and settings. */
export function listSetupOverrides(setup: CalculatorSetup): SetupOverrideEntry[] {
  const entries: SetupOverrideEntry[] = [];

  for (const [size, value] of Object.entries(setup.stub90DeductOverridesInches)) {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) continue;
    const tradeSize = size as TradeSize;
    entries.push({
      key: `stub90-${tradeSize}`,
      kind: 'stub90-deduct',
      tradeSize,
      valueInches: value,
      label: `${tradeSize}" EMT stub 90 deduct: ${formatShrinkInches(value)}`,
      editHint: 'Open Stub 90 and tap Deduct to edit or clear.',
    });
  }

  for (const angle of OFFSET_ANGLES) {
    const multiplier = setup.offsetMultiplierOverrides[angle];
    if (typeof multiplier === 'number' && Number.isFinite(multiplier) && multiplier > 0) {
      entries.push({
        key: `multiplier-${angle}`,
        kind: 'offset-multiplier',
        bendAngle: angle,
        value: multiplier,
        label: `${angle}° offset multiplier: ${formatMultiplier(multiplier)}`,
        editHint: 'Open Offset or Rolling Offset and tap Multiplier to edit or clear.',
      });
    }

    const shrink = setup.offsetShrinkPerInchOverrides[angle];
    if (typeof shrink === 'number' && Number.isFinite(shrink) && shrink > 0) {
      entries.push({
        key: `shrink-${angle}`,
        kind: 'offset-shrink',
        bendAngle: angle,
        valueInches: shrink,
        label: `${angle}° shrink per inch: ${formatShrinkInches(shrink)}`,
        editHint: 'Open Offset or Rolling Offset and tap Shrink to edit or clear.',
      });
    }
  }

  return entries;
}

/** Patch that removes one override entry from setup. */
export function patchClearSetupOverride(
  setup: CalculatorSetup,
  entry: SetupOverrideEntry,
): Partial<CalculatorSetup> {
  switch (entry.kind) {
    case 'stub90-deduct': {
      const overrides = { ...setup.stub90DeductOverridesInches };
      delete overrides[entry.tradeSize];
      return { stub90DeductOverridesInches: overrides };
    }
    case 'offset-multiplier': {
      const overrides = { ...setup.offsetMultiplierOverrides };
      delete overrides[entry.bendAngle];
      return { offsetMultiplierOverrides: overrides };
    }
    case 'offset-shrink': {
      const overrides = { ...setup.offsetShrinkPerInchOverrides };
      delete overrides[entry.bendAngle];
      return { offsetShrinkPerInchOverrides: overrides };
    }
  }
}

/** Clears every manual override in setup. */
export function patchClearAllSetupOverrides(): Partial<CalculatorSetup> {
  return {
    stub90DeductOverridesInches: {},
    offsetMultiplierOverrides: {},
    offsetShrinkPerInchOverrides: {},
  };
}
