import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { snapshotSetupFromInput } from '@/core/calculations';
import { getCalculatorById } from '@/core/calculators';
import { getSetupOverrideHint, patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import { usePersistRecentLayout, useRestoreRecentLayout } from '@/core/sessions';
import {
  formatStub90DeductContextAction,
  formatStub90DeductContextLine,
  getBenderProfile,
  getEmtStub90TakeUpInches,
  resolveStub90DeductContext,
} from '@/data/benders';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { Routes, guideRoute } from '@/navigation';
import {
  BendCalculatorLayout,
  EditSetupSheet,
  type SetupValues,
} from '@/shared/workspace';
import { formatLength } from '@/utils/formatLength';
import { getRoundingLabel } from '@/utils/rounding';
import { getLengthUnitLabel, getLengthInputMode, getUnitSystemLabel } from '@/utils/units';
import { parseLengthInput } from '@/utils/parseLengthInput';

import { calculateStub90 } from '../engine/stub90.engine';
import { toStub90CalculationResult } from '../engine/stub90CalculationResult';
import {
  createStub90InputSnapshot,
  restoreStub90FromLayout,
  toStoredInputSnapshot,
} from '../engine/stub90InputSnapshot';
import { STUB90_CONFIG } from '../stub90.config';
import { stub90Copy } from '../stub90.copy';
import { DeductOverrideSheet } from './DeductOverrideSheet';
import { Stub90Diagram } from './Stub90Diagram';

export default function Stub90Screen() {
  const router = useRouter();

  const [stubLengthText, setStubLengthText] = useState('');
  const [legLengthText, setLegLengthText] = useState('');
  const [showLegInput, setShowLegInput] = useState(false);
  const [setupVisible, setSetupVisible] = useState(false);
  const [deductSheetVisible, setDeductSheetVisible] = useState(false);

  useRestoreRecentLayout('stub90', restoreStub90FromLayout, (fields) => {
    setStubLengthText(fields.stubLengthText);
    setLegLengthText(fields.legLengthText);
    setShowLegInput(fields.showLegInput);
  });

  const { setup, setSetup } = useCalculatorSetup();
  const { unit, rounding, conduitType, conduitSize, benderProfileId, customBenderProfiles } = setup;
  const deductOverrideInches = setup.stub90DeductOverridesInches[conduitSize];

  const benderProfile = getBenderProfile(benderProfileId, customBenderProfiles);
  const chartDeductInches = getEmtStub90TakeUpInches(benderProfile, conduitSize);
  const stubLength = parseLengthInput(stubLengthText);
  const legLength = parseLengthInput(legLengthText);
  const hasValidLegLength = legLength !== undefined && legLength > 0;
  const unitLabel = getLengthUnitLabel(unit);
  const setupSummary = `${conduitType} ${conduitSize}"`;
  const overrideHint = getSetupOverrideHint(setup, { calculator: 'stub90' });
  const setupMeta = [`${getUnitSystemLabel(unit)} • ${getRoundingLabel(rounding)}`, overrideHint]
    .filter(Boolean)
    .join(' • ');
  const hasValidStubLength = stubLength !== undefined && stubLength > 0;
  const lengthInput = getLengthInputMode(unit);

  const engineInput = useMemo(
    () => ({
      stubHeight: stubLength ?? Number.NaN,
      legLength: hasValidLegLength ? legLength : undefined,
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
      customBenderProfiles,
      conduitSize,
      conduitType,
      deductOverrideInches,
      hasValidLegLength,
      legLength,
      rounding,
      stubLength,
      unit,
    ],
  );

  const result = useMemo(() => calculateStub90(engineInput), [engineInput]);

  const calculationResult = useMemo(
    () => toStub90CalculationResult(engineInput, result),
    [engineInput, result],
  );

  usePersistRecentLayout({
    calculatorId: 'stub90',
    calculatorTitle: getCalculatorById('stub90')?.title ?? '90° Stub',
    inputSnapshot: toStoredInputSnapshot(createStub90InputSnapshot(engineInput)),
    setupSnapshot: snapshotSetupFromInput(engineInput),
    calculationResult,
    enabled: stubLengthText.trim() !== '',
  });

  const hasValidDeductMark = hasValidStubLength && result.isValidDeductMark;
  const deductMarkValue = hasValidDeductMark ? result.deductMarkFormatted ?? '—' : '—';
  const deductContext = resolveStub90DeductContext(
    benderProfile,
    conduitSize,
    result.deductSource === 'missing-chart' ? undefined : result.deduct,
    deductOverrideInches,
  );
  const profileContextMessage = formatStub90DeductContextLine(deductContext, unit, rounding);
  const profileContextAction = formatStub90DeductContextAction(deductContext);
  const profileContextTone = deductContext.source === 'missing-chart' ? 'warning' : 'info';
  const visibleWarnings = stubLengthText.trim() !== '' ? result.warnings : [];

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
    setStubLengthText('');
    setLegLengthText('');
    setShowLegInput(false);
  }

  return (
    <BendCalculatorLayout
      title={stub90Copy.screenTitle}
      subtitle={setupSummary}
      onBackPress={handleBackPress}
      trust={{
        benderName: benderProfile.name,
        meta: setupMeta,
        note: profileContextMessage,
        noteTone: profileContextTone,
        noteAction: profileContextAction,
        onEdit: () => setSetupVisible(true),
        onNoteAction: profileContextAction ? () => setDeductSheetVisible(true) : undefined,
      }}
      inputs={[
        {
          type: 'field',
          key: 'stubLength',
          label: stub90Copy.fields.stubLength.label,
          value: stubLengthText,
          onChangeText: setStubLengthText,
          placeholder: stub90Copy.fields.stubLength.placeholder,
          unit: unitLabel,
          lengthInput,
          error:
            stubLengthText !== '' && !hasValidStubLength
              ? stub90Copy.fields.stubLength.errorRequired
              : undefined,
        },
        {
          type: 'optional',
          key: 'leg',
          addLabel: stub90Copy.fields.leg.addButton,
          onAdd: () => setShowLegInput(true),
          visible: showLegInput,
          field: {
            type: 'field',
            key: 'legField',
            label: stub90Copy.fields.leg.label,
            value: legLengthText,
            onChangeText: setLegLengthText,
            placeholder: stub90Copy.fields.leg.placeholder,
            unit: unitLabel,
            variant: 'compact',
            lengthInput,
            error:
              legLengthText.trim() !== '' && !hasValidLegLength
                ? stub90Copy.fields.leg.errorRequired
                : undefined,
          },
        },
      ]}
      workspace={
        <Stub90Diagram
          data={result.diagramData}
          isEmpty={!hasValidStubLength}
          isInvalid={hasValidStubLength && !result.isValidDeductMark}
        />
      }
      primaryResult={
        hasValidStubLength
          ? { label: stub90Copy.results.deductMark, value: deductMarkValue }
          : undefined
      }
      secondaryResults={
        hasValidStubLength && result.deductSource !== 'missing-chart'
          ? [
              {
                label: result.isDeductOverridden
                  ? stub90Copy.results.deductCustom
                  : stub90Copy.results.deduct,
                value: result.deductFormatted,
                tone: result.isDeductOverridden ? 'primary' : undefined,
                onPress: () => setDeductSheetVisible(true),
              },
            ]
          : undefined
      }
      dock={{
        left: [{ key: 'reset', label: 'Reset', onPress: resetInputs }],
        guide: { onPress: () => router.push(guideRoute('stub90')) },
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
              bendAngle: STUB90_CONFIG.bendAngle,
            }}
            onCancel={() => setSetupVisible(false)}
            onApply={applySetup}
          />
          <DeductOverrideSheet
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
