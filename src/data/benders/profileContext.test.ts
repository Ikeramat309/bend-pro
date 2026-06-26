import { GENERIC_HAND_BENDER } from './genericHandBender';
import {
  formatSegmentTrustTitle,
  formatSetupOnlyBenderMeta,
  formatStandardOffsetTableTrustTitle,
  formatStandardSaddleTableTrustTitle,
  formatStub90DeductContextAction,
  formatStub90DeductContextLine,
  resolveStub90DeductContext,
  resolveStub90DeductSource,
} from './profileContext';

describe('resolveStub90DeductSource', () => {
  test('profile chart when size is listed', () => {
    expect(resolveStub90DeductSource(GENERIC_HAND_BENDER, '1/2')).toBe('profile-chart');
  });

  test('missing chart when size is not on the profile', () => {
    expect(resolveStub90DeductSource(GENERIC_HAND_BENDER, '1-1/2')).toBe('missing-chart');
  });

  test('override takes precedence', () => {
    expect(resolveStub90DeductSource(GENERIC_HAND_BENDER, '1-1/2', 6)).toBe('override');
  });
});

describe('formatStub90DeductContextLine', () => {
  test('describes chart deduct for a listed size', () => {
    const context = resolveStub90DeductContext(GENERIC_HAND_BENDER, '1/2', 5);
    expect(formatStub90DeductContextLine(context, 'imperial', '1/16')).toBe(
      'Generic Hand Bender: 5" deduct for 1/2" EMT',
    );
  });

  test('describes missing chart without inventing a deduct value', () => {
    const context = resolveStub90DeductContext(GENERIC_HAND_BENDER, '1-1/2', undefined);
    expect(formatStub90DeductContextLine(context, 'imperial', '1/16')).toBe(
      'Generic Hand Bender has no stub 90 deduct chart for 1-1/2" EMT — set a custom deduct to calculate the mark.',
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
  test('suggests override when chart is missing', () => {
    const context = resolveStub90DeductContext(GENERIC_HAND_BENDER, '2', undefined);
    expect(formatStub90DeductContextAction(context)).toBe('Tap Deduct to set your bender value.');
  });

  test('returns undefined for chart values', () => {
    const context = resolveStub90DeductContext(GENERIC_HAND_BENDER, '1/2', 5);
    expect(formatStub90DeductContextAction(context)).toBeUndefined();
  });
});

describe('trust strip helpers', () => {
  test('standard offset table title', () => {
    expect(formatStandardOffsetTableTrustTitle(30)).toBe('Standard 30° offset table');
  });

  test('standard saddle table title', () => {
    expect(formatStandardSaddleTableTrustTitle('22.5° / 45°')).toBe('Standard 22.5° / 45° table');
  });

  test('segment trust title', () => {
    expect(formatSegmentTrustTitle()).toBe('Geometric model');
  });

  test('setup-only bender meta', () => {
    expect(formatSetupOnlyBenderMeta('Generic Hand Bender')).toBe(
      'Generic Hand Bender (setup only)',
    );
  });
});
