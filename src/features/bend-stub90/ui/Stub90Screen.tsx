/**
 * Stub 90 calculator — diagram-first layout using shared UI chunks.
 *
 * Input state lives here; math lives in engine/stub90.engine.ts.
 */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { getSetupOverrideHint, patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import {
    DEFAULT_EMT_STUB90_TAKE_UP_INCHES,
    formatStub90DeductContextAction,
    formatStub90DeductContextLine,
    getBenderProfile,
    getEmtStub90TakeUpInches,
    resolveStub90DeductContext,
} from '@/data/benders';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { Routes } from '@/navigation';
import { AppHeader, AppScreen, FieldInput } from '@/shared/ui';
import {
    BenderProfileContext,
    EditSetupSheet,
    OptionalFieldButton,
    PipeWorkspaceResult,
    SetupSummary,
    WarningList,
    type SetupValues,
} from '@/shared/workspace';
import { colors, spacing } from '@/theme';
import { formatLength } from '@/utils/formatLength';
import { getRoundingLabel } from '@/utils/rounding';
import { getLengthUnitLabel, getUnitSystemLabel } from '@/utils/units';
import { parseLengthInput } from '@/utils/parseLengthInput';

import { calculateStub90 } from '../engine/stub90.engine';
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

  // Shared, persisted setup — follows the user across calculators and restarts.
  const { setup, setSetup } = useCalculatorSetup();
  const { unit, rounding, conduitType, conduitSize, benderProfileId, customBenderProfiles } = setup;
  const deductOverrideInches = setup.stub90DeductOverridesInches[conduitSize];

  const benderProfile = getBenderProfile(benderProfileId, customBenderProfiles);
  const benderChartDeductInches =
    getEmtStub90TakeUpInches(benderProfile, conduitSize) ?? DEFAULT_EMT_STUB90_TAKE_UP_INCHES;
  const stubLength = parseLengthInput(stubLengthText);
  const legLength = parseLengthInput(legLengthText);
  const hasValidLegLength = legLength !== undefined && legLength > 0;
  const unitLabel = getLengthUnitLabel(unit);
  const setupSummary = `${conduitType} ${conduitSize}"`;
  const overrideHint = getSetupOverrideHint(setup, { calculator: 'stub90' });
  const setupSubtitle = [
    `${getUnitSystemLabel(unit)} • ${getRoundingLabel(rounding)}`,
    overrideHint,
  ]
    .filter(Boolean)
    .join(' • ');
  const hasValidStubLength = stubLength !== undefined && stubLength > 0;
  // Imperial users type tape-measure fractions ("12 3/8") — needs a keyboard
  // with space and slash. Falls back to the default keyboard on Android.
  const lengthKeyboard = unit === 'imperial' ? ('numbers-and-punctuation' as const) : ('decimal-pad' as const);

  const result = useMemo(
    () =>
      calculateStub90({
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

  const hasValidDeductMark = hasValidStubLength && result.isValidDeductMark;
  const deductMarkValue = hasValidDeductMark ? result.deductMarkFormatted ?? '—' : '—';
  const deductContext = resolveStub90DeductContext(
    benderProfile,
    conduitSize,
    result.deduct,
    deductOverrideInches,
  );
  const profileContextMessage = formatStub90DeductContextLine(deductContext, unit, rounding);
  const profileContextAction = formatStub90DeductContextAction(deductContext);
  const profileContextTone = deductContext.source === 'default-fallback' ? 'warning' : 'info';
  const visibleWarnings = stubLengthText.trim() !== '' ? result.warnings : [];

  const legLengthError =
    legLengthText.trim() !== '' && !hasValidLegLength
      ? stub90Copy.fields.leg.errorRequired
      : undefined;

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

  return (
    <View style={styles.screen}>
      <AppHeader
        showBack
        title={stub90Copy.screenTitle}
        subtitle={setupSummary}
        onBackPress={handleBackPress}
      />

      <AppScreen scroll>
        <SetupSummary
          title={benderProfile.name}
          subtitle={setupSubtitle}
          onEdit={() => setSetupVisible(true)}
        />

        <BenderProfileContext
          message={profileContextMessage}
          action={profileContextAction}
          tone={profileContextTone}
        />

        <FieldInput
          label={stub90Copy.fields.stubLength.label}
          value={stubLengthText}
          onChangeText={setStubLengthText}
          placeholder={stub90Copy.fields.stubLength.placeholder}
          unit={unitLabel}
          inputProps={{ keyboardType: lengthKeyboard }}
          error={
            stubLengthText !== '' && !hasValidStubLength
              ? stub90Copy.fields.stubLength.errorRequired
              : undefined
          }
        />

        <View style={styles.legPanel}>
          {showLegInput ? (
            <FieldInput
              label={stub90Copy.fields.leg.label}
              value={legLengthText}
              onChangeText={setLegLengthText}
              placeholder={stub90Copy.fields.leg.placeholder}
              unit={unitLabel}
              variant="compact"
              inputProps={{ keyboardType: lengthKeyboard }}
              error={legLengthError}
            />
          ) : (
            <OptionalFieldButton
              label={stub90Copy.fields.leg.addButton}
              onPress={() => setShowLegInput(true)}
            />
          )}
        </View>

        <PipeWorkspaceResult
          title={stub90Copy.workspaceTitle}
          diagram={
            <Stub90Diagram
              data={result.diagramData}
              isEmpty={!hasValidStubLength}
              isInvalid={hasValidStubLength && !result.isValidDeductMark}
            />
          }
          primaryLabel={stub90Copy.results.deductMark}
          primaryValue={deductMarkValue}
          chips={[
            {
              label: result.isDeductOverridden
                ? stub90Copy.results.deductCustom
                : stub90Copy.results.deduct,
              value: result.deductFormatted,
              tone: result.isDeductOverridden ? ('primary' as const) : undefined,
              onPress: () => setDeductSheetVisible(true),
            },
            ...(hasValidLegLength && result.legLengthFormatted
              ? [{ label: stub90Copy.results.leg, value: result.legLengthFormatted }]
              : []),
          ]}
        />

        <WarningList warnings={visibleWarnings} />
      </AppScreen>

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
        benderDeductFormatted={formatLength(benderChartDeductInches, unit, rounding)}
        currentOverrideInches={deductOverrideInches}
        onCancel={() => setDeductSheetVisible(false)}
        onApply={applyDeductOverride}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  legPanel: {
    marginTop: -spacing.xs,
  },
});
