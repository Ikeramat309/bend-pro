import { GENERIC_HAND_BENDER } from './genericHandBender';
import { resolveEffectiveStub90DeductInches } from './benderResolution';

describe('resolveEffectiveStub90DeductInches', () => {
  test('uses profile chart for listed sizes', () => {
    const result = resolveEffectiveStub90DeductInches(GENERIC_HAND_BENDER, '1/2');
    expect(result.deductInches).toBe(5);
    expect(result.source).toBe('profile-chart');
    expect(result.chartDeductInches).toBe(5);
  });

  test('returns missing chart for unsupported trade sizes without inventing a deduct', () => {
    const result = resolveEffectiveStub90DeductInches(GENERIC_HAND_BENDER, '1-1/4');
    expect(result.deductInches).toBeUndefined();
    expect(result.source).toBe('missing-chart');
    expect(result.chartDeductInches).toBeUndefined();
  });

  test('manual override wins over chart and missing chart', () => {
    const result = resolveEffectiveStub90DeductInches(GENERIC_HAND_BENDER, '1/2', 5.75);
    expect(result.deductInches).toBe(5.75);
    expect(result.source).toBe('override');
    expect(result.chartDeductInches).toBe(5);
  });

  test('override wins even when size is unsupported on profile', () => {
    const result = resolveEffectiveStub90DeductInches(GENERIC_HAND_BENDER, '2', 6.25);
    expect(result.deductInches).toBe(6.25);
    expect(result.source).toBe('override');
  });

  test('ignores non-finite overrides', () => {
    const result = resolveEffectiveStub90DeductInches(GENERIC_HAND_BENDER, '1/2', Number.NaN);
    expect(result.deductInches).toBe(5);
    expect(result.source).toBe('profile-chart');
  });
});
