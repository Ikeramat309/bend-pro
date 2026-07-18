import { DEFAULT_BENDER_PROFILE_ID } from '@/data/benders';

import { calculateCompound90 } from './compound90.engine';
import { toCompound90CalculationResult } from './compound90CalculationResult';
import type { Compound90EngineInput } from './compound90.types';

const input: Compound90EngineInput = {
  shape: 'circle',
  primaryDimension: 7,
  firstMark: 20,
  benderProfileId: DEFAULT_BENDER_PROFILE_ID,
  conduitType: 'EMT',
  tradeSize: '1/2',
  unitSystem: 'imperial',
  roundingPrecision: '1/16',
};

describe('toCompound90CalculationResult', () => {
  test('maps the spacing hero and ordered marks', () => {
    const engine = calculateCompound90(input);
    const result = toCompound90CalculationResult(input, engine);
    expect(result.status).toBe('valid');
    expect(result.primaryResults[0]?.key).toBe('distanceBetweenBends');
    expect(result.secondaryResults[0]?.key).toBe('secondMark');
    expect(result.fieldSteps.map((step) => step.key)).toEqual([
      'firstMark',
      'distanceBetweenBends',
      'secondMark',
    ]);
    expect(result.sourceNotes.some((note) => note.kind === 'table')).toBe(true);
  });
});
