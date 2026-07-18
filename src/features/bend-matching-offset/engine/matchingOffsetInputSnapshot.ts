import type { CalculatorSetup } from '@/core/settings/calculatorSetup';
import {
  baseSetupPatchFromLayout,
  formatStoredLengthText,
  isRecord,
  requiredFiniteNumber,
} from '@/core/sessions/inputSnapshotUtils';
import { sanitizeSetupSnapshot } from '@/core/sessions/sessionSanitize';
import type { CalculatorInputSnapshot, RecentLayout } from '@/core/sessions/sessionTypes';

import type {
  MatchingOffsetEngineInput,
  MatchingOffsetMode,
} from './matchingOffset.types';

export type MatchingOffsetInputSnapshot =
  | {
      calculatorId: 'matchingOffset';
      mode: 'centers';
      offsetHeight: number;
      adjacent: number;
    }
  | {
      calculatorId: 'matchingOffset';
      mode: 'bends';
      offsetHeight: number;
      referenceDistanceBetweenBends: number;
    };

function isMatchingOffsetMode(value: unknown): value is MatchingOffsetMode {
  return value === 'centers' || value === 'bends';
}

export function createMatchingOffsetInputSnapshot(
  input: MatchingOffsetEngineInput,
): MatchingOffsetInputSnapshot {
  if (input.mode === 'centers') {
    return {
      calculatorId: 'matchingOffset',
      mode: input.mode,
      offsetHeight: input.offsetHeight,
      adjacent: input.adjacent,
    };
  }
  return {
    calculatorId: 'matchingOffset',
    mode: input.mode,
    offsetHeight: input.offsetHeight,
    referenceDistanceBetweenBends: input.referenceDistanceBetweenBends,
  };
}

export function toStoredInputSnapshot(
  snapshot: MatchingOffsetInputSnapshot,
): CalculatorInputSnapshot {
  return { ...snapshot };
}

export function sanitizeMatchingOffsetInputSnapshot(
  raw: unknown,
): MatchingOffsetInputSnapshot | null {
  if (
    !isRecord(raw) ||
    raw.calculatorId !== 'matchingOffset' ||
    !isMatchingOffsetMode(raw.mode)
  ) {
    return null;
  }

  const offsetHeight = requiredFiniteNumber(raw.offsetHeight);
  if (offsetHeight === undefined) {
    return null;
  }

  if (raw.mode === 'centers') {
    const adjacent = requiredFiniteNumber(raw.adjacent);
    return adjacent === undefined
      ? null
      : { calculatorId: 'matchingOffset', mode: raw.mode, offsetHeight, adjacent };
  }

  const referenceDistanceBetweenBends = requiredFiniteNumber(
    raw.referenceDistanceBetweenBends,
  );
  return referenceDistanceBetweenBends === undefined
    ? null
    : {
        calculatorId: 'matchingOffset',
        mode: raw.mode,
        offsetHeight,
        referenceDistanceBetweenBends,
      };
}

export type MatchingOffsetRestoredFields = {
  mode: MatchingOffsetMode;
  offsetHeightText: string;
  referenceText: string;
};

export function restoreMatchingOffsetFromLayout(
  layout: RecentLayout,
  _currentSetup: CalculatorSetup,
): { setupPatch: Partial<CalculatorSetup>; fields: MatchingOffsetRestoredFields } | null {
  const snapshot = sanitizeMatchingOffsetInputSnapshot(layout.inputSnapshot);
  if (!snapshot) {
    return null;
  }

  const setupSnapshot = sanitizeSetupSnapshot(layout.setupSnapshot);
  const referenceValue =
    snapshot.mode === 'centers'
      ? snapshot.adjacent
      : snapshot.referenceDistanceBetweenBends;

  return {
    setupPatch: baseSetupPatchFromLayout(layout),
    fields: {
      mode: snapshot.mode,
      offsetHeightText: formatStoredLengthText(
        snapshot.offsetHeight,
        setupSnapshot.unitSystem,
        setupSnapshot.roundingPrecision,
      ),
      referenceText: formatStoredLengthText(
        referenceValue,
        setupSnapshot.unitSystem,
        setupSnapshot.roundingPrecision,
      ),
    },
  };
}
