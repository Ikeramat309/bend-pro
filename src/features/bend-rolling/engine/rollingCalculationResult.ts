/**
 * Maps Rolling Offset engine output to the shared calculation result contract.
 */
import {
  deriveCalculationStatus,
  snapshotSetupFromInput,
  type CalculationResult,
  type FieldStep,
  type SourceNote,
} from '@/core/calculations';

import { rollingCopy } from '../rolling.copy';
import { formatRollingMultiplier } from './rollingAngleData';
import type { RollingDiagramData, RollingEngineInput, RollingEngineResult } from './rolling.types';

export type RollingCalculationSpecific = {
  bendAngle: RollingEngineResult['bendAngle'];
  trueOffset: number;
  multiplier: number;
  isMultiplierOverridden: boolean;
  shrinkPerInch: number;
  isShrinkOverridden: boolean;
  diagramData?: RollingDiagramData;
};

export function toRollingCalculationResult(
  input: RollingEngineInput,
  result: RollingEngineResult,
): CalculationResult<'rolling', RollingCalculationSpecific> {
  const status = deriveCalculationStatus(result.isValid, result.warnings);

  const primaryResults = result.isValid
    ? [
        {
          key: 'distanceBetweenBends',
          label: rollingCopy.results.distanceBetweenBends,
          inches: result.distanceBetweenBends,
          display: result.distanceBetweenBendsFormatted,
        },
      ]
    : [];

  const secondaryResults = result.isValid
    ? [
        {
          key: 'shrink',
          label: result.isShrinkOverridden
            ? rollingCopy.results.shrinkCustom
            : rollingCopy.results.shrink,
          inches: result.shrink,
          display: result.shrinkFormatted,
          tone: result.isShrinkOverridden ? ('primary' as const) : undefined,
        },
        {
          key: 'multiplier',
          label: `${result.isMultiplierOverridden ? rollingCopy.results.multiplierCustom : rollingCopy.results.multiplier} (${result.bendAngle}°)`,
          display: formatRollingMultiplier(result.multiplier),
          tone: result.isMultiplierOverridden ? ('primary' as const) : undefined,
        },
      ]
    : [];

  const fieldSteps: FieldStep[] = [];
  let stepOrder = 1;

  if (result.isValid) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'trueOffset',
      title: 'True Offset',
      detail: 'Combined offset (height and roll).',
      inches: result.trueOffset,
      display: result.trueOffsetFormatted,
    });
    fieldSteps.push({
      order: stepOrder++,
      key: 'offsetHeight',
      title: rollingCopy.results.offsetHeight,
      inches: result.offsetHeight,
      display: result.offsetHeightFormatted,
    });
    fieldSteps.push({
      order: stepOrder++,
      key: 'offsetRoll',
      title: rollingCopy.results.offsetRoll,
      inches: result.advance,
      display: result.advanceFormatted,
    });
  }

  if (result.isValid && result.mark1 !== undefined && result.mark1Formatted) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'mark1',
      title: rollingCopy.results.mark1,
      inches: result.mark1,
      display: result.mark1Formatted,
    });
  }
  if (result.isValid && result.mark2 !== undefined && result.mark2Formatted) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'mark2',
      title: rollingCopy.results.mark2,
      inches: result.mark2,
      display: result.mark2Formatted,
    });
  }

  const sourceNotes: SourceNote[] = [
    {
      key: 'benderProfile',
      kind: 'bender',
      message: `Bender: ${result.benderProfileUsed.name}`,
    },
    {
      key: 'rollingTables',
      kind: 'table',
      message: `Rolling offset uses standard ${result.bendAngle}° multiplier and shrink tables.`,
    },
    {
      key: 'multiplier',
      kind: result.isMultiplierOverridden ? 'override' : 'table',
      message: result.isMultiplierOverridden
        ? `Multiplier override ×${formatRollingMultiplier(result.multiplier)}`
        : `Standard multiplier ×${formatRollingMultiplier(result.multiplier)}`,
    },
  ];

  if (!result.isValid || result.mark1 === undefined) {
    sourceNotes.push({
      key: 'markWorkflow',
      kind: 'info',
      message: 'Mark 1/Mark 2 field steps appear when Mark 1 is entered.',
    });
  }

  const assumptions = [
    'True offset = √(offset height² + offset roll²).',
    'Distance between bends = true offset × multiplier.',
  ];

  return {
    calculatorId: 'rolling',
    status,
    primaryResults,
    secondaryResults,
    warnings: result.warnings,
    assumptions,
    setupSnapshot: snapshotSetupFromInput(input),
    benderProfile: result.benderProfileUsed,
    rawValuesInches: {
      offsetHeight: result.offsetHeight,
      advance: result.advance,
      trueOffset: result.trueOffset,
      distanceBetweenBends: result.distanceBetweenBends,
      shrink: result.shrink,
      mark1: result.mark1,
      mark2: result.mark2,
    },
    displayValues: {
      offsetHeight: result.offsetHeightFormatted,
      advance: result.advanceFormatted,
      trueOffset: result.trueOffsetFormatted,
      distanceBetweenBends: result.distanceBetweenBendsFormatted,
      shrink: result.shrinkFormatted,
      mark1: result.mark1Formatted,
      mark2: result.mark2Formatted,
    },
    fieldSteps,
    sourceNotes,
    formulaValues: {
      bendAngle: result.bendAngle,
      trueOffset: result.trueOffset,
      multiplier: result.multiplier,
      shrinkPerInch: result.shrinkPerInch,
    },
    specific: {
      bendAngle: result.bendAngle,
      trueOffset: result.trueOffset,
      multiplier: result.multiplier,
      isMultiplierOverridden: result.isMultiplierOverridden,
      shrinkPerInch: result.shrinkPerInch,
      isShrinkOverridden: result.isShrinkOverridden,
      diagramData: result.diagramData,
    },
  };
}
