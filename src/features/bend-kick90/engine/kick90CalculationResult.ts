/**
 * Maps Kick 90 engine output to the shared calculation result contract.
 */
import {
  deriveCalculationStatus,
  snapshotSetupFromInput,
  type CalculationResult,
  type FieldStep,
  type SourceNote,
} from '@/core/calculations';

import { kick90Copy } from '../kick90.copy';
import { formatKick90Multiplier } from './kick90AngleData';
import type { Kick90DiagramData, Kick90EngineInput, Kick90EngineResult } from './kick90.types';

export type Kick90CalculationSpecific = {
  bendAngle: Kick90EngineResult['bendAngle'];
  multiplier: number;
  isMultiplierOverridden: boolean;
  shrinkPerInch: number;
  isShrinkOverridden: boolean;
  diagramData?: Kick90DiagramData;
};

export function toKick90CalculationResult(
  input: Kick90EngineInput,
  result: Kick90EngineResult,
): CalculationResult<'kick90', Kick90CalculationSpecific> {
  const status = deriveCalculationStatus(result.isValid, result.warnings);

  const primaryResults = result.isValid
    ? [
        {
          key: 'distanceBetweenBends',
          label: kick90Copy.results.distanceBetweenBends,
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
            ? kick90Copy.results.shrinkCustom
            : kick90Copy.results.shrink,
          inches: result.shrink,
          display: result.shrinkFormatted,
          tone: result.isShrinkOverridden ? ('primary' as const) : undefined,
        },
        {
          key: 'multiplier',
          label: `${result.isMultiplierOverridden ? kick90Copy.results.multiplierCustom : kick90Copy.results.multiplier} (${result.bendAngle}°)`,
          display: formatKick90Multiplier(result.multiplier),
          tone: result.isMultiplierOverridden ? ('primary' as const) : undefined,
        },
      ]
    : [];

  const fieldSteps: FieldStep[] = [];
  let stepOrder = 1;

  if (result.isValid) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'kickRise',
      title: kick90Copy.fields.kickRise.label,
      inches: result.kickRise,
      display: result.kickRiseFormatted,
    });
  }

  if (result.isValid && result.mark1 !== undefined && result.mark1Formatted) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'mark1',
      title: kick90Copy.results.mark1,
      inches: result.mark1,
      display: result.mark1Formatted,
    });
  }
  if (result.isValid && result.mark2 !== undefined && result.mark2Formatted) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'mark2',
      title: kick90Copy.results.mark2,
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
      key: 'kick90Tables',
      kind: 'table',
      message: `Kick 90 uses standard ${result.bendAngle}° multiplier and shrink tables.`,
    },
    {
      key: 'multiplier',
      kind: result.isMultiplierOverridden ? 'override' : 'table',
      message: result.isMultiplierOverridden
        ? `Multiplier override ×${formatKick90Multiplier(result.multiplier)}`
        : `Standard multiplier ×${formatKick90Multiplier(result.multiplier)}`,
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
    'Distance between bends = kick rise × multiplier.',
    'Shrink = kick rise × shrink per inch.',
  ];

  return {
    calculatorId: 'kick90',
    status,
    primaryResults,
    secondaryResults,
    warnings: result.warnings,
    assumptions,
    setupSnapshot: snapshotSetupFromInput(input),
    benderProfile: result.benderProfileUsed,
    rawValuesInches: {
      kickRise: result.kickRise,
      distanceBetweenBends: result.distanceBetweenBends,
      shrink: result.shrink,
      mark1: result.mark1,
      mark2: result.mark2,
    },
    displayValues: {
      kickRise: result.kickRiseFormatted,
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
