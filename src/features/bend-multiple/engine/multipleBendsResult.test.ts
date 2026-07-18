import { calculateMultipleBends } from './multipleBends.engine';
import {
  seedMultipleBendsSnapshotFromFieldSteps,
  toMultipleBendsCalculationResult,
} from './multipleBendsResult';

const context = {
  unitSystem: 'imperial' as const,
  roundingPrecision: '1/16' as const,
  conduitType: 'EMT' as const,
  tradeSize: '1/2' as const,
  benderProfileId: 'generic-hand-bender',
  benderProfile: {
    id: 'generic-hand-bender',
    name: 'Generic Hand Bender',
    category: 'hand' as const,
  },
};

describe('multiple bends result adapter', () => {
  it('emits ordered field steps with orientation metadata', () => {
    const engine = calculateMultipleBends({
      totalLengthInches: 120,
      marks: [{ id: 'b', positionInches: 24, kind: 'bend', angleDegrees: 30, direction: 'down', flip: true }],
    });
    const result = toMultipleBendsCalculationResult(engine, context);

    expect(result.fieldSteps[0]).toMatchObject({ order: 1, key: 'b', inches: 24 });
    expect(result.fieldSteps[0].detail).toContain('flip');
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });

  it('seeds from field steps only when the caller supplies metadata', () => {
    const snapshot = seedMultipleBendsSnapshotFromFieldSteps(
      120,
      [
        { order: 2, key: 'second', title: 'Second mark', inches: 48 },
        { order: 1, key: 'first', title: 'First mark', inches: 24 },
        { order: 3, key: 'words-only', title: 'Finish' },
      ],
      (step) => (step.key === 'second' ? { kind: 'cut' } : step.key === 'first' ? { kind: 'bend', angleDegrees: 30, direction: 'up' } : null),
    );

    expect(snapshot.marks.map((mark) => mark.id)).toEqual(['first', 'second']);
    expect(snapshot.marks[0]).toMatchObject({ kind: 'bend', angleDegrees: 30 });
  });
});
