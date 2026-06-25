/**
 * Maps Offset engine output to the shared calculation result contract.
 * Pure adapter — no math changes.
 */
import {
  deriveCalculationStatus,
  snapshotSetupFromInput,
  type CalculationResult,
  type FieldStep,
  type SourceNote,
} from '@/core/calculations';

import { offsetCopy } from '../offset.copy';
import { formatMultiplier } from './offsetAngleData';
import type { OffsetDiagramData, OffsetEngineInput, OffsetEngineResult } from './offset.types';

export type OffsetCalculationSpecific = {
  bendAngle: OffsetEngineResult['bendAngle'];
  multiplier: number;
  isMultiplierOverridden: boolean;
  shrinkPerInch: number;
  isShrinkOverridden: boolean;
  diagramData?: OffsetDiagramData;
};

export function toOffsetCalculationResult(
  input: OffsetEngineInput,
  result: OffsetEngineResult,
): CalculationResult<'offset', OffsetCalculationSpecific> {
  const status = deriveCalculationStatus(result.isValid, result.warnings);

  const primaryResults = result.isValid
    ? [
        {
          key: 'distanceBetweenBends',
          label: offsetCopy.results.distanceBetweenBends,
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
            ? offsetCopy.results.shrinkCustom
            : offsetCopy.results.shrink,
          inches: result.shrink,
          display: result.shrinkFormatted,
          tone: result.isShrinkOverridden ? ('primary' as const) : undefined,
        },
        {
          key: 'multiplier',
          label: `${result.isMultiplierOverridden ? offsetCopy.results.multiplierCustom : offsetCopy.results.multiplier} (${result.bendAngle}°)`,
          display: formatMultiplier(result.multiplier),
          tone: result.isMultiplierOverridden ? ('primary' as const) : undefined,
        },
      ]
    : [];

  const fieldSteps: FieldStep[] = [];
  if (result.isValid && result.mark1 !== undefined && result.mark1Formatted) {
    fieldSteps.push({
      order: 1,
      key: 'mark1',
      title: offsetCopy.results.mark1,
      inches: result.mark1,
      display: result.mark1Formatted,
    });
  }
  if (result.isValid && result.mark2 !== undefined && result.mark2Formatted) {
    fieldSteps.push({
      order: 2,
      key: 'mark2',
      title: offsetCopy.results.mark2,
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
      key: 'multiplier',
      kind: result.isMultiplierOverridden ? 'override' : 'table',
      message: result.isMultiplierOverridden
        ? `Multiplier override ×${formatMultiplier(result.multiplier)} at ${result.bendAngle}°`
        : `Standard offset table multiplier ×${formatMultiplier(result.multiplier)} at ${result.bendAngle}°`,
    },
    {
      key: 'shrink',
      kind: result.isShrinkOverridden ? 'override' : 'table',
      message: result.isShrinkOverridden
        ? `Shrink override ${result.shrinkPerInch} in/in at ${result.bendAngle}°`
        : `Standard shrink rate ${result.shrinkPerInch} in/in at ${result.bendAngle}°`,
    },
  ];

  const assumptions: string[] = [];
  if (!result.isMultiplierOverridden) {
    assumptions.push('Distance between bends uses the standard offset angle multiplier table.');
  }
  if (!result.isShrinkOverridden) {
    assumptions.push('Shrink uses the standard offset shrink-per-inch table.');
  }

  return {
    calculatorId: 'offset',
    status,
    primaryResults,
    secondaryResults,
    warnings: result.warnings,
    assumptions,
    setupSnapshot: snapshotSetupFromInput(input),
    benderProfile: result.benderProfileUsed,
    rawValuesInches: {
      offsetHeight: result.offsetHeight,
      distanceBetweenBends: result.distanceBetweenBends,
      shrink: result.shrink,
      mark1: result.mark1,
      mark2: result.mark2,
    },
    displayValues: {
      offsetHeight: result.offsetHeightFormatted,
      distanceBetweenBends: result.distanceBetweenBendsFormatted,
      shrink: result.shrinkFormatted,
      mark1: result.mark1Formatted,
      mark2: result.mark2Formatted,
    },
    fieldSteps,
    sourceNotes,
    formulaValues: {
      bendAngle: result.bendAngle,
      multiplier: result.multiplier,
      shrinkPerInch: result.shrinkPerInch,
      isMultiplierOverridden: result.isMultiplierOverridden,
      isShrinkOverridden: result.isShrinkOverridden,
    },
    specific: {
      bendAngle: result.bendAngle,
      multiplier: result.multiplier,
      isMultiplierOverridden: result.isMultiplierOverridden,
      shrinkPerInch: result.shrinkPerInch,
      isShrinkOverridden: result.isShrinkOverridden,
      diagramData: result.diagramData,
    },
  };
}
