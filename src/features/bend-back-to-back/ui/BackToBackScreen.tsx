import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { snapshotSetupFromInput } from '@/core/calculations';
import { getCalculatorById } from '@/core/calculators';
import { parseLengthInput } from '@/core/measurements';
import { getSetupOverrideHint, patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import { usePersistRecentLayout, useRestoreRecentLayout } from '@/core/sessions';
import { getBenderProfile, getEmtStub90TakeUpInches } from '@/data/benders';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { Routes, guideRoute } from '@/navigation';
import {
  BendCalculatorLayout,
  EditSetupSheet,
  type SetupValues,
} from '@/shared/workspace';
import { formatLength } from '@/utils/formatLength';
import { getRoundingLabel } from '@/utils/rounding';
import { getLengthInputMode, getLengthUnitLabel, getUnitSystemLabel } from '@/utils/units';

import { calculateBackToBack } from '../engine/backToBack.engine';
import { toBackToBackCalculationResult } from '../engine/backToBackCalculationResult';
import {
  createBackToBackInputSnapshot,
  restoreBackToBackFromLayout,
  toStoredInputSnapshot,
} from '../engine/backToBackInputSnapshot';
import { BACK_TO_BACK_CONFIG } from '../backToBack.config';
import { backToBackCopy } from '../backToBack.copy';
import { BackToBackDeductOverrideSheet } from './BackToBackDeductOverrideSheet';
import { BackToBackDiagram } from './BackToBackDiagram';

export default function BackToBackScreen() {
  const router = useRouter();
  const [distanceText, setDistanceText] = useState('');
  const [firstStubLengthText, setFirstStubLengthText] = useState('');
  const [showFirstStubInput, setShowFirstStubInput] = useState(false);
  const [firstStubSheetVisible, setFirstStubSheetVisible] = useState(false);
  const [setupVisible, setSetupVisible] = useState(false);
  const [deductSheetVisible, setDeductSheetVisible] = useState(false);

  useRestoreRecentLayout('backToBack', restoreBackToBackFromLayout, (fields) => {
    setDistanceText(fields.distanceText);
    setFirstStubLengthText(fields.firstStubLengthText);
    setShowFirstStubInput(fields.showFirstStubInput);
  });

  const { setup, setSetup } = useCalculatorSetup();
  const { unit, rounding, conduitType, conduitSize, benderProfileId, customBenderProfiles } = setup;
  const deductOverrideInches = setup.stub90DeductOverridesInches[conduitSize];
  const benderProfile = getBenderProfile(benderProfileId, customBenderProfiles);
  const chartDeductInches = getEmtStub90TakeUpInches(benderProfile, conduitSize);
  const distance = parseLengthInput(distanceText);
  const firstStubLength = parseLengthInput(firstStubLengthText);
  const hasValidDistance = distance !== undefined && distance > 0;
  const hasFirstStubText = firstStubLengthText.trim() !== '';
  const hasValidFirstStub = firstStubLength !== undefined && firstStubLength > 0;
  const unitLabel = getLengthUnitLabel(unit);
  const showFieldUnit = unit === 'metric';
  const lengthInput = getLengthInputMode(unit);
  const setupSummary = `${conduitType} ${conduitSize}"`;
  const overrideHint = getSetupOverrideHint(setup, { calculator: 'stub90' });
  const setupMeta = [
    backToBackCopy.trust.deductScope,
    setupSummary,
    `${getUnitSystemLabel(unit)} \u2022 ${getRoundingLabel(rounding)}`,
    overrideHint,
  ]
    .filter(Boolean)
    .join(' \u2022 ');

  const engineInput = useMemo(
    () => ({
      backToBackDistance: distance ?? Number.NaN,
      firstStubLength: showFirstStubInput
        ? hasFirstStubText
          ? firstStubLength ?? Number.NaN
          : undefined
        : undefined,
      benderProfileId,
      conduitType,
      tradeSize: conduitSize,
      unitSystem: unit,
      roundingPrecision: rounding,
      deductOverrideInches,
      customBenderProfiles,
    }),
    [
      benderProfileId,
      conduitSize,
      conduitType,
      customBenderProfiles,
      deductOverrideInches,
      distance,
      firstStubLength,
      hasFirstStubText,
      rounding,
      showFirstStubInput,
      unit,
    ],
  );
  const result = useMemo(() => calculateBackToBack(engineInput), [engineInput]);
  const calculationResult = useMemo(
    () => toBackToBackCalculationResult(engineInput, result),
    [engineInput, result],
  );

  usePersistRecentLayout({
    calculatorId: 'backToBack',
    calculatorTitle: getCalculatorById('backToBack')?.title ?? 'Back-to-Back 90',
    inputSnapshot: toStoredInputSnapshot(createBackToBackInputSnapshot(engineInput)),
    setupSnapshot: snapshotSetupFromInput(engineInput),
    calculationResult,
    enabled: distanceText.trim() !== '',
  });

  const invalidDistance = distanceText.trim() !== '' && !hasValidDistance;
  const invalidFirstStub = showFirstStubInput && hasFirstStubText && !hasValidFirstStub;
  const visibleWarnings =
    distanceText.trim() !== '' || hasFirstStubText ? result.warnings : [];

  function handleBackPress() {
    const safeRouter = router as typeof router & { canGoBack?: () => boolean };
    if (typeof safeRouter.canGoBack === 'function' && safeRouter.canGoBack()) {
      router.back();
      return;
    }
    router.replace(Routes.home);
  }

  function applySetup(nextSetup: SetupValues) {
    setSetup(
      patchCalculatorSetup(setup, {
        conduitType: DEFAULT_CONDUIT_TYPE,
        conduitSize: nextSetup.conduitSize,
        benderProfileId: nextSetup.benderProfileId,
        unit: nextSetup.unit,
        rounding: nextSetup.rounding,
      }),
    );
    setSetupVisible(false);
  }

  function applyDeductOverride(overrideInches: number | undefined) {
    const overrides = { ...setup.stub90DeductOverridesInches };
    if (overrideInches === undefined) {
      delete overrides[conduitSize];
    } else {
      overrides[conduitSize] = overrideInches;
    }
    setSetup(patchCalculatorSetup(setup, { stub90DeductOverridesInches: overrides }));
    setDeductSheetVisible(false);
  }

  function resetInputs() {
    setDistanceText('');
    setFirstStubLengthText('');
    setShowFirstStubInput(false);
    setFirstStubSheetVisible(false);
  }

  function enableFirstStub() {
    setShowFirstStubInput(true);
    setFirstStubSheetVisible(true);
  }

  function removeFirstStub() {
    setFirstStubLengthText('');
    setShowFirstStubInput(false);
    setFirstStubSheetVisible(false);
  }

  const secondaryResults = result.isValid && result.isFirstStubLayoutValid
    ? [
        {
          label: backToBackCopy.results.firstDeductMark,
          value: result.firstDeductMarkFormatted ?? '\u2014',
        },
        {
          label: result.isDeductOverridden
            ? backToBackCopy.results.deductCustom
            : backToBackCopy.results.deduct,
          value: result.deductFormatted ?? '\u2014',
          tone: result.isDeductOverridden ? ('primary' as const) : undefined,
          onPress: () => setDeductSheetVisible(true),
        },
      ]
    : result.isValid && hasValidFirstStub
      ? [
          {
            label: backToBackCopy.results.deduct,
            value: result.deductFormatted ?? 'Set',
            tone: 'primary' as const,
            onPress: () => setDeductSheetVisible(true),
          },
        ]
      : undefined;

  return (
    <BendCalculatorLayout
      title={backToBackCopy.screenTitle}
      subtitle=""
      centerTitle
      inputDensity="compact"
      workspaceDensity="compact"
      onBackPress={handleBackPress}
      trust={{
        benderName: benderProfile.name,
        meta: setupMeta,
        onEdit: () => setSetupVisible(true),
      }}
      inputs={[
        ...(showFirstStubInput
          ? [
              {
                type: 'row' as const,
                key: 'measurements',
                inputs: [
                  {
                    type: 'field' as const,
                    key: 'distance',
                    label: backToBackCopy.fields.distance.label,
                    value: distanceText,
                    onChangeText: setDistanceText,
                    placeholder: backToBackCopy.fields.distance.placeholder,
                    unit: showFieldUnit ? unitLabel : undefined,
                    variant: 'compact' as const,
                    lengthInput,
                    error: invalidDistance
                      ? backToBackCopy.fields.distance.errorRequired
                      : undefined,
                  },
                  {
                    type: 'field' as const,
                    key: 'firstStub',
                    label: backToBackCopy.fields.firstStub.label,
                    value: firstStubLengthText,
                    onChangeText: setFirstStubLengthText,
                    placeholder: backToBackCopy.fields.firstStub.placeholder,
                    unit: showFieldUnit ? unitLabel : undefined,
                    variant: 'compact' as const,
                    lengthInput,
                    lengthSheetOpen: firstStubSheetVisible,
                    onLengthSheetOpenChange: setFirstStubSheetVisible,
                    error: invalidFirstStub
                      ? backToBackCopy.fields.firstStub.errorRequired
                      : undefined,
                  },
                ],
              },
            ]
          : [
              {
                type: 'field' as const,
                key: 'distance',
                label: backToBackCopy.fields.distance.label,
                value: distanceText,
                onChangeText: setDistanceText,
                placeholder: backToBackCopy.fields.distance.placeholder,
                unit: showFieldUnit ? unitLabel : undefined,
                variant: 'compact' as const,
                lengthInput,
                error: invalidDistance
                  ? backToBackCopy.fields.distance.errorRequired
                  : undefined,
              },
            ]),
      ]}
      workspace={
        <BackToBackDiagram
          data={result.diagramData}
          isEmpty={!hasValidDistance}
          isInvalid={invalidDistance || invalidFirstStub}
        />
      }
      primaryResult={
        result.isValid && result.second90MarkFormatted
          ? {
              label: backToBackCopy.results.second90Mark,
              value: result.second90MarkFormatted,
            }
          : undefined
      }
      secondaryResults={secondaryResults}
      dock={{
        left: [{ key: 'reset', label: 'Reset', onPress: resetInputs }],
        center: showFirstStubInput
          ? {
              key: 'remove-first-stub',
              label: backToBackCopy.fields.firstStub.removeButton,
              variant: 'pill',
              onPress: removeFirstStub,
            }
          : {
              key: 'add-first-stub',
              label: backToBackCopy.fields.firstStub.addButton,
              variant: 'pill',
              onPress: enableFirstStub,
            },
        guide: { onPress: () => router.push(guideRoute('backToBack')) },
      }}
      warnings={visibleWarnings}
      footer={
        <>
          <EditSetupSheet
            visible={setupVisible}
            values={{
              conduitType,
              conduitSize,
              benderProfileId,
              unit,
              rounding,
              bendAngle: BACK_TO_BACK_CONFIG.bendAngle,
            }}
            onCancel={() => setSetupVisible(false)}
            onApply={applySetup}
          />
          <BackToBackDeductOverrideSheet
            visible={deductSheetVisible}
            tradeSize={conduitSize}
            unitSystem={unit}
            benderName={benderProfile.name}
            benderDeductFormatted={
              chartDeductInches !== undefined
                ? formatLength(chartDeductInches, unit, rounding)
                : 'No chart for this size'
            }
            currentOverrideInches={deductOverrideInches}
            onCancel={() => setDeductSheetVisible(false)}
            onApply={applyDeductOverride}
          />
        </>
      }
    />
  );
}
