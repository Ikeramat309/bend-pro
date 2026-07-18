import { MULTIPLE_BENDS_CONFIG } from '../multipleBends.config';
import type { CalculatorSetup } from '@/core/settings';
import {
  baseSetupPatchFromLayout,
  formatStoredLengthText,
} from '@/core/sessions/inputSnapshotUtils';
import { sanitizeSetupSnapshot } from '@/core/sessions/sessionSanitize';
import type { CalculatorInputSnapshot, RecentLayout } from '@/core/sessions/sessionTypes';
import type {
  MultipleBendsDirection,
  MultipleBendsMarkInput,
  MultipleBendsMarkKind,
} from './multipleBends.types';

export type MultipleBendsInputSnapshot = {
  schemaVersion: 1;
  totalLengthInches: number;
  marks: readonly MultipleBendsMarkInput[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isKind(value: unknown): value is MultipleBendsMarkKind {
  return value === 'bend' || value === 'cut';
}

function isDirection(value: unknown): value is MultipleBendsDirection {
  return value === 'up' || value === 'down';
}

export function createMultipleBendsInputSnapshot(
  totalLengthInches: number,
  marks: readonly MultipleBendsMarkInput[],
): MultipleBendsInputSnapshot {
  return {
    schemaVersion: MULTIPLE_BENDS_CONFIG.snapshotVersion,
    totalLengthInches,
    marks: marks.slice(0, MULTIPLE_BENDS_CONFIG.maxMarks).map((mark) => ({ ...mark })),
  };
}

export function sanitizeMultipleBendsInputSnapshot(
  raw: unknown,
): MultipleBendsInputSnapshot | null {
  if (
    !isRecord(raw) ||
    raw.schemaVersion !== MULTIPLE_BENDS_CONFIG.snapshotVersion ||
    typeof raw.totalLengthInches !== 'number' ||
    !Number.isFinite(raw.totalLengthInches) ||
    raw.totalLengthInches <= 0 ||
    !Array.isArray(raw.marks)
  ) {
    return null;
  }

  const ids = new Set<string>();
  const marks: MultipleBendsMarkInput[] = [];
  for (const candidate of raw.marks.slice(0, MULTIPLE_BENDS_CONFIG.maxMarks)) {
    if (
      !isRecord(candidate) ||
      typeof candidate.id !== 'string' ||
      candidate.id.trim() === '' ||
      ids.has(candidate.id) ||
      typeof candidate.positionInches !== 'number' ||
      !Number.isFinite(candidate.positionInches) ||
      !isKind(candidate.kind)
    ) {
      return null;
    }

    const mark: MultipleBendsMarkInput = {
      id: candidate.id,
      positionInches: candidate.positionInches,
      kind: candidate.kind,
    };
    if (candidate.kind === 'bend') {
      if (
        typeof candidate.angleDegrees !== 'number' ||
        !Number.isFinite(candidate.angleDegrees) ||
        candidate.angleDegrees <= 0 ||
        candidate.angleDegrees > 90 ||
        (candidate.direction !== undefined && !isDirection(candidate.direction)) ||
        (candidate.flip !== undefined && typeof candidate.flip !== 'boolean')
      ) {
        return null;
      }
      mark.angleDegrees = candidate.angleDegrees;
      mark.direction = candidate.direction ?? 'up';
      mark.flip = Boolean(candidate.flip);
    }
    ids.add(candidate.id);
    marks.push(mark);
  }

  return createMultipleBendsInputSnapshot(raw.totalLengthInches, marks);
}

export function serializeMultipleBendsInputSnapshot(
  snapshot: MultipleBendsInputSnapshot,
): string {
  return JSON.stringify(snapshot);
}

export function parseMultipleBendsInputSnapshotJson(
  stored: string | null,
): MultipleBendsInputSnapshot | null {
  if (!stored) return null;
  try {
    return sanitizeMultipleBendsInputSnapshot(JSON.parse(stored));
  } catch {
    return null;
  }
}

export function toStoredInputSnapshot(
  snapshot: MultipleBendsInputSnapshot,
): CalculatorInputSnapshot {
  return { ...snapshot, marks: snapshot.marks.map((mark) => ({ ...mark })) };
}

export type MultipleBendsRestoredFields = {
  lengthText: string;
  marks: MultipleBendsMarkInput[];
};

export function restoreMultipleBendsFromLayout(
  layout: RecentLayout,
  _currentSetup: CalculatorSetup,
): { setupPatch: Partial<CalculatorSetup>; fields: MultipleBendsRestoredFields } | null {
  const snapshot = sanitizeMultipleBendsInputSnapshot(layout.inputSnapshot);
  if (!snapshot) return null;
  const setupSnapshot = sanitizeSetupSnapshot(layout.setupSnapshot);

  return {
    setupPatch: baseSetupPatchFromLayout(layout),
    fields: {
      lengthText: formatStoredLengthText(
        snapshot.totalLengthInches,
        setupSnapshot.unitSystem,
        setupSnapshot.roundingPrecision,
      ),
      marks: snapshot.marks.map((mark) => ({ ...mark })),
    },
  };
}
