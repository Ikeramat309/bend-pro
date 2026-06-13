import { GENERIC_HAND_BENDER } from './genericHandBender';
import {
  formatOffsetProfileContextLine,
  formatStub90DeductContextAction,
  formatStub90DeductContextLine,
  resolveStub90DeductContext,
  resolveStub90DeductSource,
} from './profileContext';

describe('resolveStub90DeductSource', () => {
  test('profile chart when size is listed', () => {
    expect(resolveStub90DeductSource(GENERIC_HAND_BENDER, '1/2')).toBe('profile-chart');
  });

  test('default fallback when size is not on the profile', () => {
    expect(resolveStub90DeductSource(GENERIC_HAND_BENDER, '1-1/4')).toBe('default-fallback');
  });

  test('override takes precedence', () => {
    expect(resolveStub90DeductSource(GENERIC_HAND_BENDER, '1-1/4', 6)).toBe('override');
  });
});

describe('formatStub90DeductContextLine', () => {
  test('describes chart deduct for a listed size', () => {
    const context = resolveStub90DeductContext(GENERIC_HAND_BENDER, '1/2', 5);
    expect(formatStub90DeductContextLine(context, 'imperial', '1/16')).toBe(
      'Generic Hand Bender: 5" deduct for 1/2" EMT',
    );
  });

  test('describes default fallback for an unlisted size', () => {
    const context = resolveStub90DeductContext(GENERIC_HAND_BENDER, '1-1/4', 5);
    expect(formatStub90DeductContextLine(context, 'imperial', '1/16')).toBe(
      'Generic Hand Bender has no chart for 1-1/4" EMT — using default 5" deduct',
    );
  });

  test('describes custom override with chart reference when available', () => {
    const context = resolveStub90DeductContext(GENERIC_HAND_BENDER, '1/2', 5.25, 5.25);
    expect(formatStub90DeductContextLine(context, 'imperial', '1/16')).toBe(
      'Custom deduct for 1/2" EMT: 5 1/4" — chart 5"',
    );
  });
});

describe('formatStub90DeductContextAction', () => {
  test('suggests override when falling back to default', () => {
    const context = resolveStub90DeductContext(GENERIC_HAND_BENDER, '2', 5);
    expect(formatStub90DeductContextAction(context)).toBe('Tap Deduct to set your bender value.');
  });

  test('returns undefined for chart values', () => {
    const context = resolveStub90DeductContext(GENERIC_HAND_BENDER, '1/2', 5);
    expect(formatStub90DeductContextAction(context)).toBeUndefined();
  });
});

describe('formatOffsetProfileContextLine', () => {
  test('names profile and clarifies angle tables', () => {
    expect(formatOffsetProfileContextLine('Generic Hand Bender', 30)).toBe(
      'Generic Hand Bender — offset uses standard 30° multiplier and shrink tables (not bender-specific charts).',
    );
  });
});
