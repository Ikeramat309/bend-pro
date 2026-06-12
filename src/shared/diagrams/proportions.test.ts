import { resolveProportionalSpans, type ProportionalSpan } from './proportions';

const H: Omit<ProportionalSpan, 'value'> = { minPx: 70, maxPx: 244 };
const V: Omit<ProportionalSpan, 'value'> = { minPx: 90, maxPx: 184 };

describe('resolveProportionalSpans', () => {
  it('renders equal values at equal pixel sizes', () => {
    const result = resolveProportionalSpans({ ...H, value: 10 }, { ...V, value: 10 });

    expect(result.horizontalPx).toBe(184);
    expect(result.verticalPx).toBe(184);
  });

  it('preserves a 2:1 ratio when both spans fit inside their bounds', () => {
    const result = resolveProportionalSpans({ ...H, value: 20 }, { ...V, value: 10 });

    expect(result.horizontalPx).toBe(244);
    expect(result.verticalPx).toBe(122);
    expect(result.horizontalPx / result.verticalPx).toBe(2);
  });

  it('always fills the binding axis to its max', () => {
    const tall = resolveProportionalSpans({ ...H, value: 8 }, { ...V, value: 30 });
    expect(tall.verticalPx).toBe(184);

    const wide = resolveProportionalSpans({ ...H, value: 36 }, { ...V, value: 12 });
    expect(wide.horizontalPx).toBe(244);
  });

  it('clamps an extreme wide ratio so the vertical stays readable', () => {
    const result = resolveProportionalSpans({ ...H, value: 30 }, { ...V, value: 2 });

    expect(result.horizontalPx).toBe(244);
    expect(result.verticalPx).toBe(90);
  });

  it('clamps an extreme tall ratio so the horizontal stays readable', () => {
    const result = resolveProportionalSpans({ ...H, value: 1 }, { ...V, value: 40 });

    expect(result.verticalPx).toBe(184);
    expect(result.horizontalPx).toBe(70);
  });

  it('falls back to max sizes when a value is zero or negative', () => {
    expect(resolveProportionalSpans({ ...H, value: 0 }, { ...V, value: 10 })).toEqual({
      horizontalPx: 244,
      verticalPx: 184,
    });
    expect(resolveProportionalSpans({ ...H, value: 10 }, { ...V, value: -3 })).toEqual({
      horizontalPx: 244,
      verticalPx: 184,
    });
  });
});
