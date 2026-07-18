import { calculateMultipleBends } from '../engine/multipleBends.engine';
import { buildMultipleBendsDiagramGeometry } from './multipleBendsDiagramGeometry';

describe('buildMultipleBendsDiagramGeometry', () => {
  it('returns an empty finite stick', () => {
    const data = calculateMultipleBends({ totalLengthInches: 120, marks: [] }).diagramData;
    const geometry = buildMultipleBendsDiagramGeometry(data);

    expect(geometry.marks).toEqual([]);
    expect(geometry.startX).toBeLessThan(geometry.endX);
  });

  it('keeps duplicates, negative, huge, and overflow marks inside the canvas', () => {
    const data = calculateMultipleBends({
      totalLengthInches: 1_000_000,
      marks: [
        { id: 'negative', positionInches: -100, kind: 'cut' },
        { id: 'same-a', positionInches: 500_000, kind: 'bend', angleDegrees: 30 },
        { id: 'same-b', positionInches: 500_000, kind: 'bend', angleDegrees: 45 },
        { id: 'overflow', positionInches: 9_000_000_000, kind: 'cut' },
      ],
    }).diagramData;
    const geometry = buildMultipleBendsDiagramGeometry(data);

    for (const mark of geometry.marks) {
      expect(Number.isFinite(mark.x)).toBe(true);
      expect(mark.x).toBeGreaterThanOrEqual(geometry.startX);
      expect(mark.x).toBeLessThanOrEqual(geometry.endX);
    }
    expect(geometry.marks[1].x).toBe(geometry.marks[2].x);
    expect(geometry.marks[0].isOverflow).toBe(true);
    expect(geometry.marks[3].isOverflow).toBe(true);
  });
});

