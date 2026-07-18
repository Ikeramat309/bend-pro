import {
  createMultipleBendsInputSnapshot,
  parseMultipleBendsInputSnapshotJson,
  restoreMultipleBendsFromLayout,
  sanitizeMultipleBendsInputSnapshot,
  serializeMultipleBendsInputSnapshot,
} from './multipleBendsInputSnapshot';
import { DEFAULT_CALCULATOR_SETUP } from '@/core/settings/calculatorSetup';
import type { RecentLayout } from '@/core/sessions';

describe('multiple bends input snapshot', () => {
  const snapshot = createMultipleBendsInputSnapshot(120, [
    { id: 'bend-1', positionInches: 24, kind: 'bend', angleDegrees: 30, direction: 'up', flip: true },
    { id: 'cut-1', positionInches: 110, kind: 'cut' },
  ]);

  it('round trips a persisted layout', () => {
    expect(parseMultipleBendsInputSnapshotJson(serializeMultipleBendsInputSnapshot(snapshot))).toEqual(snapshot);
  });

  it('rejects corrupt, duplicate-id, and unsafe snapshots', () => {
    expect(parseMultipleBendsInputSnapshotJson('{bad json')).toBeNull();
    expect(sanitizeMultipleBendsInputSnapshot({ ...snapshot, totalLengthInches: 0 })).toBeNull();
    expect(
      sanitizeMultipleBendsInputSnapshot({
        ...snapshot,
        marks: [snapshot.marks[0], snapshot.marks[0]],
      }),
    ).toBeNull();
    expect(
      sanitizeMultipleBendsInputSnapshot({
        ...snapshot,
        marks: [{ id: 'bad', positionInches: 12, kind: 'bend', angleDegrees: 999 }],
      }),
    ).toBeNull();
  });

  it('restores through the shared recent-layout shape', () => {
    const layout: RecentLayout = {
      id: 'layout-1',
      kind: 'recent',
      schemaVersion: 1,
      calculatorId: 'multipleBends',
      calculatorTitle: 'Multiple Bends',
      inputSnapshot: snapshot,
      setupSnapshot: {
        unitSystem: 'imperial',
        roundingPrecision: '1/16',
        conduitType: 'EMT',
        tradeSize: '1/2',
        benderProfileId: 'generic-hand-bender',
      },
      warnings: [],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };

    const restored = restoreMultipleBendsFromLayout(layout, DEFAULT_CALCULATOR_SETUP);
    expect(restored?.fields.marks).toEqual(snapshot.marks);
    expect(restored?.fields.lengthText).toContain('120');
    expect(restored?.setupPatch.unit).toBe('imperial');
  });
});
