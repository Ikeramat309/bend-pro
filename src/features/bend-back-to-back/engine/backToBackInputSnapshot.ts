import type { CalculatorSetup } from '@/core/settings/calculatorSetup';
import {
  baseSetupPatchFromLayout,
  formatStoredLengthText,
  isRecord,
  optionalFiniteNumber,
  pickJsonLeaves,
  requiredFiniteNumber,
} from '@/core/sessions/inputSnapshotUtils';
import { sanitizeSetupSnapshot } from '@/core/sessions/sessionSanitize';
import type { CalculatorInputSnapshot, RecentLayout } from '@/core/sessions/sessionTypes';

import type { BackToBackEngineInput } from './backToBack.types';

export type BackToBackInputSnapshot = {
  calculatorId: 'backToBack';
  backToBackDistance: number;
  firstStubLength?: number;
  deductOverrideInches?: number;
};

const ALLOWED_KEYS = [
  'calculatorId',
  'backToBackDistance',
  'firstStubLength',
  'deductOverrideInches',
] as const;

export function createBackToBackInputSnapshot(
  input: BackToBackEngineInput,
): BackToBackInputSnapshot {
  const snapshot: BackToBackInputSnapshot = {
    calculatorId: 'backToBack',
    backToBackDistance: input.backToBackDistance,
  };

  if (input.firstStubLength !== undefined && Number.isFinite(input.firstStubLength)) {
    snapshot.firstStubLength = input.firstStubLength;
  }
  if (input.deductOverrideInches !== undefined && Number.isFinite(input.deductOverrideInches)) {
    snapshot.deductOverrideInches = input.deductOverrideInches;
  }

  return snapshot;
}

export function toStoredInputSnapshot(
  snapshot: BackToBackInputSnapshot,
): CalculatorInputSnapshot {
  return { ...snapshot };
}

export function sanitizeBackToBackInputSnapshot(raw: unknown): BackToBackInputSnapshot | null {
  if (!isRecord(raw) || raw.calculatorId !== 'backToBack') {
    return null;
  }

  const backToBackDistance = requiredFiniteNumber(raw.backToBackDistance);
  if (backToBackDistance === undefined) {
    return null;
  }

  pickJsonLeaves(raw, ALLOWED_KEYS);
  return {
    calculatorId: 'backToBack',
    backToBackDistance,
    firstStubLength: optionalFiniteNumber(raw.firstStubLength),
    deductOverrideInches: optionalFiniteNumber(raw.deductOverrideInches),
  };
}

export type BackToBackRestoredFields = {
  distanceText: string;
  firstStubLengthText: string;
  showFirstStubInput: boolean;
};

export function restoreBackToBackFromLayout(
  layout: RecentLayout,
  currentSetup: CalculatorSetup,
): { setupPatch: Partial<CalculatorSetup>; fields: BackToBackRestoredFields } | null {
  const snap = sanitizeBackToBackInputSnapshot(layout.inputSnapshot);
  if (!snap) {
    return null;
  }

  const setupSnapshot = sanitizeSetupSnapshot(layout.setupSnapshot);
  const stub90DeductOverridesInches = { ...currentSetup.stub90DeductOverridesInches };
  if (snap.deductOverrideInches !== undefined) {
    stub90DeductOverridesInches[setupSnapshot.tradeSize] = snap.deductOverrideInches;
  } else {
    delete stub90DeductOverridesInches[setupSnapshot.tradeSize];
  }

  return {
    setupPatch: { ...baseSetupPatchFromLayout(layout), stub90DeductOverridesInches },
    fields: {
      distanceText: formatStoredLengthText(
        snap.backToBackDistance,
        setupSnapshot.unitSystem,
        setupSnapshot.roundingPrecision,
      ),
      firstStubLengthText: formatStoredLengthText(
        snap.firstStubLength,
        setupSnapshot.unitSystem,
        setupSnapshot.roundingPrecision,
      ),
      showFirstStubInput: snap.firstStubLength !== undefined,
    },
  };
}
