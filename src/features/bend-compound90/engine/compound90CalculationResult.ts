import {
  deriveCalculationStatus,
  snapshotSetupFromInput,
  type CalculationResult,
  type FieldStep,
  type SourceNote,
} from '@/core/calculations';

import { compound90Copy } from '../compound90.copy';
import { COMPOUND90_SHAPE_DATA } from './compound90.engine';
import type {
  Compound90DiagramData,
  Compound90EngineInput,
  Compound90EngineResult,
  Compound90Shape,
} from './compound90.types';

export type Compound90CalculationSpecific = {
  shape: Compound90Shape;
  bendAngle: 45;
  distanceMultiplier: number;
  diagramData?: Compound90DiagramData;
};

export function toCompound90CalculationResult(
  input: Compound90EngineInput,
  result: Compound90EngineResult,
): CalculationResult<'compound90', Compound90CalculationSpecific> {
  const status = deriveCalculationStatus(result.isValid, result.warnings);
  const fieldSteps: FieldStep[] = [];

  if (result.isValid && result.firstMark !== undefined && result.firstMarkFormatted) {
    fieldSteps.push({
      order: 1,
      key: 'firstMark',
      title: compound90Copy.results.firstMark,
      inches: result.firstMark,
      display: result.firstMarkFormatted,
    });
  }
  if (result.isValid) {
    fieldSteps.push({
      order: fieldSteps.length + 1,
      key: 'distanceBetweenBends',
      title: compound90Copy.results.distanceBetweenBends,
      inches: result.distanceBetweenBends,
      display: result.distanceBetweenBendsFormatted,
    });
  }
  if (result.isValid && result.secondMark !== undefined && result.secondMarkFormatted) {
    fieldSteps.push({
      order: fieldSteps.length + 1,
      key: 'secondMark',
      title: compound90Copy.results.secondMark,
      inches: result.secondMark,
      display: result.secondMarkFormatted,
    });
  }

  const shapeData = COMPOUND90_SHAPE_DATA[result.shape];
  const sourceNotes: SourceNote[] = [
    {
      key: 'fieldMethod',
      kind: 'table',
      message: `Standard two-45 field method: ${shapeData.formulaLabel}.`,
    },
    {
      key: 'benderProfile',
      kind: 'bender',
      message: `Bender shown for setup only: ${result.benderProfileUsed.name}.`,
    },
  ];

  return {
    calculatorId: 'compound90',
    status,
    primaryResults: result.isValid
      ? [
          {
            key: 'distanceBetweenBends',
            label: compound90Copy.results.distanceBetweenBends,
            inches: result.distanceBetweenBends,
            display: result.distanceBetweenBendsFormatted,
          },
        ]
      : [],
    secondaryResults:
      result.isValid && result.secondMarkFormatted
        ? [
            {
              key: 'secondMark',
              label: compound90Copy.results.secondMark,
              inches: result.secondMark,
              display: result.secondMarkFormatted,
            },
          ]
        : [],
    warnings: result.warnings,
    assumptions: [
      'Two 45° bends measured center to center.',
      `Obstruction shape: ${shapeData.label}.`,
      `Requested clearance per side: ${result.clearanceFormatted}.`,
      `Nominal EMT outside diameter: ${result.conduitOutsideDiameterFormatted}.`,
    ],
    setupSnapshot: snapshotSetupFromInput(input),
    benderProfile: result.benderProfileUsed,
    rawValuesInches: {
      primaryDimension: result.primaryDimension,
      secondaryDimension: result.secondaryDimension,
      clearance: result.clearance,
      backOfConduitDistance: result.backOfConduitDistance,
      conduitOutsideDiameter: result.conduitOutsideDiameter,
      distanceBetweenBends: result.distanceBetweenBends,
      firstMark: result.firstMark,
      secondMark: result.secondMark,
    },
    displayValues: {
      primaryDimension: result.primaryDimensionFormatted,
      secondaryDimension: result.secondaryDimensionFormatted,
      clearance: result.clearanceFormatted,
      backOfConduitDistance: result.backOfConduitDistanceFormatted,
      conduitOutsideDiameter: result.conduitOutsideDiameterFormatted,
      distanceBetweenBends: result.distanceBetweenBendsFormatted,
      firstMark: result.firstMarkFormatted,
      secondMark: result.secondMarkFormatted,
    },
    fieldSteps,
    sourceNotes,
    formulaValues: {
      shape: result.shape,
      bendAngle: result.bendAngle,
      distanceMultiplier: result.distanceMultiplier,
      conduitOutsideDiameter: result.conduitOutsideDiameter,
    },
    specific: {
      shape: result.shape,
      bendAngle: result.bendAngle,
      distanceMultiplier: result.distanceMultiplier,
      diagramData: result.diagramData,
    },
  };
}
