import { calculateMultipleBends, sortMultipleBendsMarks } from './multipleBends.engine';
import type { MultipleBendsMarkInput } from './multipleBends.types';

const bend = (
  id: string,
  positionInches: number,
  angleDegrees = 30,
): MultipleBendsMarkInput => ({
  id,
  positionInches,
  kind: 'bend',
  angleDegrees,
  direction: 'up',
  flip: false,
});

describe('calculateMultipleBends', () => {
  it('returns a valid empty stick plan', () => {
    const result = calculateMultipleBends({ totalLengthInches: 120, marks: [] });

    expect(result.isValid).toBe(true);
    expect(result.layout.marks).toEqual([]);
    expect(result.layout.tailAfterLastMarkInches).toBe(120);
    expect(result.layout.totalBendDegrees).toBe(0);
    expect(JSON.parse(JSON.stringify(result.diagramData))).toEqual(result.diagramData);
  });

  it('sorts marks, calculates gaps, and preserves input order metadata', () => {
    const result = calculateMultipleBends({
      totalLengthInches: 120,
      marks: [bend('late', 60), bend('early', 12), { id: 'cut', positionInches: 96, kind: 'cut' }],
    });

    expect(result.layout.marks.map((mark) => mark.id)).toEqual(['early', 'late', 'cut']);
    expect(result.layout.marks.map((mark) => mark.gapFromPreviousInches)).toEqual([12, 48, 36]);
    expect(result.layout.tailAfterLastMarkInches).toBe(24);
    expect(result.layout.isInputOrderSorted).toBe(false);
    expect(result.warnings[0]).toContain('out of order');
  });

  it('detects duplicate marks without losing stable order', () => {
    const marks = [bend('first', 24), bend('second', 24), bend('third', 24)];
    const result = calculateMultipleBends({ totalLengthInches: 120, marks });

    expect(result.layout.marks.map((mark) => mark.id)).toEqual(['first', 'second', 'third']);
    expect(result.layout.marks.map((mark) => mark.state)).toEqual(['ok', 'collision', 'collision']);
    expect(result.layout.hasCollisions).toBe(true);
    expect(result.isValid).toBe(false);
  });

  it('flags marks beyond a huge but finite stick and stays JSON safe', () => {
    const result = calculateMultipleBends({
      totalLengthInches: 1_000_000_000,
      marks: [bend('inside', 999_999_999), bend('outside', 1_000_000_001)],
    });

    expect(result.layout.marks[0].state).toBe('ok');
    expect(result.layout.marks[1].state).toBe('after-stick');
    expect(result.layout.hasOverflow).toBe(true);
    expect(JSON.stringify(result)).not.toContain('NaN');
  });

  it('warns when total bend exceeds 360 degrees', () => {
    const result = calculateMultipleBends({
      totalLengthInches: 120,
      marks: [
        bend('a', 12, 90),
        bend('b', 30, 90),
        bend('c', 48, 90),
        bend('d', 66, 90),
        bend('e', 84, 1),
      ],
    });

    expect(result.layout.totalBendDegrees).toBe(361);
    expect(result.warnings).toContain(
      'Total bend adds up to more than 360°. Review pull difficulty and layout intent.',
    );
  });

  it('rejects a single bend above the supported 90-degree hand-bender range', () => {
    const result = calculateMultipleBends({
      totalLengthInches: 120,
      marks: [bend('too-far', 24, 120)],
    });

    expect(result.isValid).toBe(false);
    expect(result.layout.marks[0].issues).toContain(
      'Bend angle must be greater than 0° and no more than 90°.',
    );
  });

  it('uses a stable sort for equal and invalid positions', () => {
    const marks = [bend('z', Number.NaN), bend('b', 20), bend('a', 20), bend('y', Number.NaN)];
    expect(sortMultipleBendsMarks(marks).map(({ mark }) => mark.id)).toEqual(['b', 'a', 'z', 'y']);
  });

  it('keeps invalid numeric data out of the JSON model', () => {
    const result = calculateMultipleBends({
      totalLengthInches: Number.POSITIVE_INFINITY,
      marks: [bend('bad-position', Number.NaN), bend('bad-angle', 12, Number.NaN)],
    });

    expect(result.layout.totalLengthInches).toBeNull();
    expect(result.layout.marks[0].positionInches).toBe(12);
    expect(result.layout.marks[0].angleDegrees).toBeNull();
    expect(result.layout.marks[1].positionInches).toBeNull();
    expect(JSON.stringify(result)).not.toMatch(/NaN|Infinity/);
  });
});
