/**
 * Maps 3-Point Saddle engine output to the shared calculation result contract.
 */
import {
  deriveCalculationStatus,
  snapshotSetupFromInput,
  type CalculationResult,
  type FieldStep,
  type SourceNote,
} from '@/core/calculations';

import { saddle3Copy } from '../saddle3.copy';
import { getSaddle3AngleData } from './saddle3AngleData';
import type { Saddle3DiagramData, Saddle3EngineInput, Saddle3EngineResult } from './saddle3.types';

export type Saddle3CalculationSpecific = {
  anglePreset: Saddle3EngineResult['anglePreset'];
  sideAngle: number;
  centerAngle: number;
  diagramData?: Saddle3DiagramData;
};

function hasDistanceToCenter(input: Saddle3EngineInput): boolean {
  return input.distanceToCenter !== undefined && Number.isFinite(input.distanceToCenter);
}

export function toSaddle3CalculationResult(
  input: Saddle3EngineInput,
  result: Saddle3EngineResult,
): CalculationResult<'saddle3', Saddle3CalculationSpecific> {
  const status = deriveCalculationStatus(result.isValid, result.warnings);
  const showCenterAsHero = result.isValid && hasDistanceToCenter(input);
  const angleLabel = getSaddle3AngleData(result.anglePreset).label;

  const primaryResults = result.isValid
    ? [
        showCenterAsHero && result.centerMarkFormatted
          ? {
              key: 'centerMark',
              label: saddle3Copy.results.centerMark,
              inches: result.centerMark,
              display: result.centerMarkFormatted,
            }
          : {
              key: 'centerToSide',
              label: saddle3Copy.results.betweenBends,
              inches: result.centerToSide,
              display: result.centerToSideFormatted,
            },
      ]
    : [];

  const secondaryResults = result.isValid
    ? showCenterAsHero
      ? [
          {
            key: 'centerToSide',
            label: saddle3Copy.results.betweenBends,
            inches: result.centerToSide,
            display: result.centerToSideFormatted,
          },
          {
            key: 'shrink',
            label: saddle3Copy.results.shrink,
            inches: result.shrink,
            display: result.shrinkFormatted,
          },
        ]
      : [
          {
            key: 'shrink',
            label: saddle3Copy.results.shrink,
            inches: result.shrink,
            display: result.shrinkFormatted,
          },
        ]
    : [];

  const fieldSteps: FieldStep[] = [];
  let stepOrder = 1;

  if (result.isValid && result.centerMark !== undefined && result.centerMarkFormatted) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'centerMark',
      title: saddle3Copy.results.centerMark,
      inches: result.centerMark,
      display: result.centerMarkFormatted,
    });
  }

  if (result.isValid) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'centerToSide',
      title: saddle3Copy.results.betweenBends,
      inches: result.centerToSide,
      display: result.centerToSideFormatted,
    });
  }

  if (result.isValid && result.sideMark1 !== undefined && result.sideMark1Formatted) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'sideMark1',
      title: saddle3Copy.diagram.sideMark1,
      inches: result.sideMark1,
      display: result.sideMark1Formatted,
    });
  }

  if (result.isValid && result.sideMark2 !== undefined && result.sideMark2Formatted) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'sideMark2',
      title: saddle3Copy.diagram.sideMark2,
      inches: result.sideMark2,
      display: result.sideMark2Formatted,
    });
  }

  if (result.isValid) {
    fieldSteps.push({
      order: stepOrder++,
      key: 'shrink',
      title: saddle3Copy.results.shrink,
      inches: result.shrink,
      display: result.shrinkFormatted,
    });
  }

  const sourceNotes: SourceNote[] = [
    {
      key: 'benderProfile',
      kind: 'bender',
      message: `Bender: ${result.benderProfileUsed.name}`,
    },
    {
      key: 'angleTable',
      kind: 'table',
      message: `Standard ${angleLabel} saddle table — not bender-specific.`,
    },
  ];

  if (result.isValid && !hasDistanceToCenter(input)) {
    sourceNotes.push({
      key: 'markWorkflow',
      kind: 'info',
      message:
        'Center and side mark field steps require Distance to Center — engine only exposes spacing/shrink without it.',
    });
  }

  return {
    calculatorId: 'saddle3',
    status,
    primaryResults,
    secondaryResults,
    warnings: result.warnings,
    assumptions: [
      `Side bends at ${result.sideAngle}°, center at ${result.centerAngle}°.`,
      'Spacing and shrink from the standard 3-point saddle table.',
    ],
    setupSnapshot: snapshotSetupFromInput(input),
    benderProfile: result.benderProfileUsed,
    rawValuesInches: {
      obstructionHeight: result.obstructionHeight,
      centerToSide: result.centerToSide,
      shrink: result.shrink,
      centerMark: result.centerMark,
      sideMark1: result.sideMark1,
      sideMark2: result.sideMark2,
    },
    displayValues: {
      obstructionHeight: result.obstructionHeightFormatted,
      centerToSide: result.centerToSideFormatted,
      shrink: result.shrinkFormatted,
      centerMark: result.centerMarkFormatted,
      sideMark1: result.sideMark1Formatted,
      sideMark2: result.sideMark2Formatted,
    },
    fieldSteps,
    sourceNotes,
    formulaValues: {
      anglePreset: result.anglePreset,
      sideAngle: result.sideAngle,
      centerAngle: result.centerAngle,
    },
    specific: {
      anglePreset: result.anglePreset,
      sideAngle: result.sideAngle,
      centerAngle: result.centerAngle,
      diagramData: result.diagramData,
    },
  };
}
