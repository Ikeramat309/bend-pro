/**
 * Maps Stub 90 engine output to the shared calculation result contract.
 * Pure adapter — no math changes.
 */
import {
  deriveCalculationStatus,
  snapshotSetupFromInput,
  type CalculationResult,
  type FieldStep,
  type SourceNote,
} from '@/core/calculations';

import { stub90Copy } from '../stub90.copy';
import type { Stub90DiagramData, Stub90EngineInput, Stub90EngineResult } from './stub90.types';

export type Stub90CalculationSpecific = {
  deductSource: Stub90EngineResult['deductSource'];
  isDeductOverridden: boolean;
  bendAngle: 90;
  diagramData?: Stub90DiagramData;
};

const DEDUCT_SOURCE_LABEL: Record<Stub90EngineResult['deductSource'], string> = {
  'profile-chart': 'bender profile chart',
  override: 'manual deduct override',
  'default-fallback': 'generic default deduct',
};

export function toStub90CalculationResult(
  input: Stub90EngineInput,
  result: Stub90EngineResult,
): CalculationResult<'stub90', Stub90CalculationSpecific> {
  const status = deriveCalculationStatus(result.isValidDeductMark, result.warnings);

  const primaryResults = result.isValidDeductMark && result.deductMarkFormatted
    ? [
        {
          key: 'deductMark',
          label: stub90Copy.results.deductMark,
          inches: result.deductMark,
          display: result.deductMarkFormatted,
        },
      ]
    : [];

  const secondaryResults =
    Number.isFinite(input.stubHeight) && input.stubHeight > 0
      ? [
          {
            key: 'deduct',
            label: result.isDeductOverridden
              ? stub90Copy.results.deductCustom
              : stub90Copy.results.deduct,
            inches: result.deduct,
            display: result.deductFormatted,
            tone: result.isDeductOverridden ? ('primary' as const) : undefined,
          },
        ]
      : [];

  const fieldSteps: FieldStep[] = [];
  if (result.isValidDeductMark && result.deductMark !== undefined && result.deductMarkFormatted) {
    fieldSteps.push({
      order: 1,
      key: 'deductMark',
      title: stub90Copy.results.deductMark,
      detail: 'Mark the pipe at this distance from the end before bending.',
      inches: result.deductMark,
      display: result.deductMarkFormatted,
    });
  }
  if (result.legLength !== undefined && result.legLengthFormatted) {
    fieldSteps.push({
      order: 2,
      key: 'leg',
      title: stub90Copy.results.leg,
      inches: result.legLength,
      display: result.legLengthFormatted,
    });
  }

  const sourceNotes: SourceNote[] = [
    {
      key: 'benderProfile',
      kind: 'bender',
      message: `Bender: ${result.benderProfileUsed.name}`,
    },
    {
      key: 'deduct',
      kind: result.isDeductOverridden ? 'override' : result.deductSource === 'profile-chart' ? 'table' : 'assumption',
      message: `Deduct from ${DEDUCT_SOURCE_LABEL[result.deductSource]} (${result.deductFormatted})`,
    },
  ];

  const assumptions: string[] = [];
  if (!result.isDeductOverridden && result.deductSource !== 'override') {
    assumptions.push('Deduct (take-up) comes from the active bender profile for the selected EMT size.');
  }

  return {
    calculatorId: 'stub90',
    status,
    primaryResults,
    secondaryResults,
    warnings: result.warnings,
    assumptions,
    setupSnapshot: snapshotSetupFromInput(input),
    benderProfile: result.benderProfileUsed,
    rawValuesInches: {
      stubHeight: result.stubHeight,
      deduct: result.deduct,
      deductMark: result.deductMark,
      legLength: result.legLength,
    },
    displayValues: {
      stubHeight: result.stubHeightFormatted,
      deduct: result.deductFormatted,
      deductMark: result.deductMarkFormatted,
      legLength: result.legLengthFormatted,
    },
    fieldSteps,
    sourceNotes,
    formulaValues: {
      bendAngle: result.bendAngle,
      deductSource: result.deductSource,
      isDeductOverridden: result.isDeductOverridden,
    },
    specific: {
      deductSource: result.deductSource,
      isDeductOverridden: result.isDeductOverridden,
      bendAngle: result.bendAngle,
      diagramData: result.diagramData,
    },
  };
}
