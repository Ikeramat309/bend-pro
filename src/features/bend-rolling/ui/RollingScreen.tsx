/**
 * Rolling Offset calculator — diagram-first layout using shared UI chunks.
 *
 * Input state lives here; math lives in engine/rolling.engine.ts.
 */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { BendAngle } from '@/core/types';
import { getSetupOverrideHint, patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { getBenderProfile } from '@/data/benders';
import { Routes } from '@/navigation';
import { AppHeader, AppScreen, FieldInput, Sheet } from '@/shared/ui';
import {
  AngleSelector,
  BenderProfileContext,
  EditSetupSheet,
  OptionalFieldButton,
  PipeWorkspaceResult,
  SetupSummary,
  WarningList,
  type BendAngleOption,
  type SetupValues,
} from '@/shared/workspace';
import { colors, spacing } from '@/theme';
import { formatLength } from '@/utils/formatLength';
import { getRoundingLabel } from '@/utils/rounding';
import { getLengthUnitLabel, getUnitSystemLabel } from '@/utils/units';
import { parseLengthInput } from '@/utils/parseLengthInput';

import { calculateRolling } from '../engine/rolling.engine';
import { formatRollingMultiplier, getRollingAngleData } from '../engine/rollingAngleData';
import { ROLLING_CONFIG } from '../rolling.config';
import { rollingCopy } from '../rolling.copy';
import { MultiplierOverrideSheet } from './MultiplierOverrideSheet';
import { RollingDiagram } from './RollingDiagram';
import { ShrinkOverrideSheet } from './ShrinkOverrideSheet';

export default function RollingScreen() {
  const router = useRouter();

  const [offsetHeightText, setOffsetHeightText] = useState('');
  const [offsetRollText, setOffsetRollText] = useState('');
  const [mark1Text, setMark1Text] = useState('');
  const [showMark1Input, setShowMark1Input] = useState(false);
  const [bendAngle, setBendAngle] = useState<BendAngle>(ROLLING_CONFIG.defaultAngle);
  const [setupVisible, setSetupVisible] = useState(false);
  const [angleSheetVisible, setAngleSheetVisible] = useState(false);
  const [multiplierSheetVisible, setMultiplierSheetVisible] = useState(false);
  const [shrinkSheetVisible, setShrinkSheetVisible] = useState(false);

  const { setup, setSetup } = useCalculatorSetup();
  const { unit, rounding, conduitType, conduitSize, benderProfileId, customBenderProfiles } = setup;
  const multiplierOverride = setup.offsetMultiplierOverrides[bendAngle];
  const shrinkPerInchOverride = setup.offsetShrinkPerInchOverrides[bendAngle];

  const benderProfile = getBenderProfile(benderProfileId, customBenderProfiles);
  const chartAngleData = getRollingAngleData(bendAngle);
  const chartMultiplier = chartAngleData?.multiplier ?? 0;
  const chartShrinkPerInch = chartAngleData?.shrinkPerInch ?? 0;
  const offsetHeight = parseLengthInput(offsetHeightText);
  const offsetRoll = parseLengthInput(offsetRollText);
  const mark1Number = parseLengthInput(mark1Text);
  const hasMark1 = mark1Number !== undefined;
  const unitLabel = getLengthUnitLabel(unit);
  const setupSummary = `${conduitType} ${conduitSize}"`;
  const overrideHint = getSetupOverrideHint(setup, { calculator: 'offset', bendAngle });
  const setupSubtitle = [
    `${getUnitSystemLabel(unit)} • ${getRoundingLabel(rounding)}`,
    overrideHint,
  ]
    .filter(Boolean)
    .join(' • ');
  const hasValidOffset = offsetHeight !== undefined && offsetHeight > 0;
  const hasValidRoll = offsetRoll !== undefined && offsetRoll > 0;
  const hasValidInputs = hasValidOffset && hasValidRoll;
  const profileContextMessage = rollingCopy.profileContext(benderProfile.name, bendAngle);
  const lengthKeyboard = unit === 'imperial' ? ('numbers-and-punctuation' as const) : ('decimal-pad' as const);

  const result = useMemo(
    () =>
      calculateRolling({
        offsetHeight: offsetHeight ?? Number.NaN,
        advance: offsetRoll ?? Number.NaN,
        mark1: hasMark1 ? mark1Number : undefined,
        bendAngle,
        benderProfileId,
        conduitType,
        tradeSize: conduitSize,
        unitSystem: unit,
        roundingPrecision: rounding,
        multiplierOverride,
        shrinkPerInchOverride,
        customBenderProfiles,
      }),
    [
      offsetRoll,
      benderProfileId,
      customBenderProfiles,
      bendAngle,
      conduitSize,
      conduitType,
      hasMark1,
      mark1Number,
      multiplierOverride,
      offsetHeight,
      rounding,
      shrinkPerInchOverride,
      unit,
    ],
  );

  const distanceValue = hasValidInputs ? result.distanceBetweenBendsFormatted : '—';
  const offsetHeightValue = hasValidInputs ? result.offsetHeightFormatted : '—';
  const offsetRollValue = hasValidInputs ? result.advanceFormatted : '—';
  const mark1Value = hasValidInputs
    ? hasMark1
      ? result.mark1Formatted ?? '—'
      : rollingCopy.results.mark1Optional
    : '—';
  const mark2Value = hasValidInputs
    ? hasMark1
      ? result.mark2Formatted ?? '—'
      : `+ ${result.distanceBetweenBendsFormatted}`
    : '—';

  const inputsStarted = offsetHeightText.trim() !== '' || offsetRollText.trim() !== '';
  const visibleWarnings = inputsStarted ? result.warnings : [];

  const mark1Error =
    mark1Text.trim() !== '' && mark1Number === undefined
      ? rollingCopy.fields.mark1.errorInvalid
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
    if (nextSetup.bendAngle !== 90) {
      setBendAngle(nextSetup.bendAngle);
    }
    setSetupVisible(false);
  }

  function applyMultiplierOverride(override: number | undefined) {
    const overrides = { ...setup.offsetMultiplierOverrides };
    if (override === undefined) {
      delete overrides[bendAngle];
    } else {
      overrides[bendAngle] = override;
    }
    setSetup(patchCalculatorSetup(setup, { offsetMultiplierOverrides: overrides }));
    setMultiplierSheetVisible(false);
  }

  function applyShrinkOverride(overrideInches: number | undefined) {
    const overrides = { ...setup.offsetShrinkPerInchOverrides };
    if (overrideInches === undefined) {
      delete overrides[bendAngle];
    } else {
      overrides[bendAngle] = overrideInches;
    }
    setSetup(patchCalculatorSetup(setup, { offsetShrinkPerInchOverrides: overrides }));
    setShrinkSheetVisible(false);
  }

  const multiplierChipLabel = result.isMultiplierOverridden
    ? `${rollingCopy.results.multiplierCustom} (${bendAngle}°)`
    : `${rollingCopy.results.multiplier} (${bendAngle}°)`;

  const shrinkChipLabel = result.isShrinkOverridden
    ? `${rollingCopy.results.shrinkCustom} (${bendAngle}°)`
    : `${rollingCopy.results.shrink} (${bendAngle}°)`;

  return (
    <View style={styles.screen}>
      <AppHeader
        showBack
        title={rollingCopy.screenTitle}
        subtitle={setupSummary}
        onBackPress={handleBackPress}
      />

      <AppScreen scroll>
        <SetupSummary
          title={benderProfile.name}
          subtitle={setupSubtitle}
          onEdit={() => setSetupVisible(true)}
        />

        <BenderProfileContext message={profileContextMessage} tone="info" />

        <View style={styles.inputRow}>
          <FieldInput
            variant="compact"
            label={rollingCopy.fields.offsetHeight.label}
            value={offsetHeightText}
            onChangeText={setOffsetHeightText}
            placeholder={rollingCopy.fields.offsetHeight.placeholder}
            unit={unitLabel}
            inputProps={{ keyboardType: lengthKeyboard }}
            error={
              offsetHeightText !== '' && !hasValidOffset
                ? rollingCopy.fields.offsetHeight.errorRequired
                : undefined
            }
          />

          <FieldInput
            variant="compact"
            label={rollingCopy.fields.offsetRoll.label}
            value={offsetRollText}
            onChangeText={setOffsetRollText}
            placeholder={rollingCopy.fields.offsetRoll.placeholder}
            unit={unitLabel}
            inputProps={{ keyboardType: lengthKeyboard }}
            error={
              offsetRollText !== '' && !hasValidRoll
                ? rollingCopy.fields.offsetRoll.errorRequired
                : undefined
            }
          />
        </View>

        <FieldInput
          variant="picker"
          label={rollingCopy.fields.bendAngle.label}
          value={`${bendAngle}°`}
          onChangeText={() => {}}
          onPress={() => setAngleSheetVisible(true)}
        />

        <View style={styles.markPanel}>
          {showMark1Input ? (
            <FieldInput
              label={rollingCopy.fields.mark1.label}
              value={mark1Text}
              onChangeText={setMark1Text}
              placeholder={rollingCopy.fields.mark1.placeholder}
              unit={unitLabel}
              variant="compact"
              inputProps={{ keyboardType: lengthKeyboard }}
              error={mark1Error}
            />
          ) : (
            <OptionalFieldButton
              label={rollingCopy.fields.mark1.addButton}
              onPress={() => setShowMark1Input(true)}
            />
          )}
        </View>

        <PipeWorkspaceResult
          title={rollingCopy.workspaceTitle}
          diagram={
            <RollingDiagram
              data={result.diagramData}
              isEmpty={!hasValidInputs}
              isInvalid={inputsStarted && !hasValidInputs}
            />
          }
          primaryLabel={rollingCopy.results.distanceBetweenBends}
          primaryValue={distanceValue}
          chips={[
            {
              label: rollingCopy.results.offsetHeight,
              value: offsetHeightValue,
              tone: 'primary',
            },
            {
              label: rollingCopy.results.offsetRoll,
              value: offsetRollValue,
              tone: 'primary',
            },
            {
              label: multiplierChipLabel,
              value: formatRollingMultiplier(result.multiplier),
              tone: result.isMultiplierOverridden ? 'primary' : undefined,
              onPress: () => setMultiplierSheetVisible(true),
            },
            {
              label: shrinkChipLabel,
              value: result.shrinkFormatted,
              tone: result.isShrinkOverridden ? 'primary' : undefined,
              onPress: () => setShrinkSheetVisible(true),
            },
            {
              label: rollingCopy.results.mark1,
              value: mark1Value,
              tone: hasMark1 ? 'primary' : 'default',
            },
            { label: rollingCopy.results.mark2, value: mark2Value },
          ]}
        />

        <WarningList warnings={visibleWarnings} />
      </AppScreen>

      <Sheet
        visible={angleSheetVisible}
        title={rollingCopy.angleSheetTitle}
        subtitle={rollingCopy.angleSheetSubtitle}
        onClose={() => setAngleSheetVisible(false)}
        onSecondaryPress={() => setAngleSheetVisible(false)}
        primaryLabel="Done"
        onPrimaryPress={() => setAngleSheetVisible(false)}>
        <AngleSelector
          label={rollingCopy.fields.bendAngle.label}
          selectedAngle={bendAngle as BendAngleOption}
          onSelect={(angle) => setBendAngle(angle as BendAngle)}
        />
      </Sheet>

      <EditSetupSheet
        visible={setupVisible}
        values={{
          conduitType,
          conduitSize,
          benderProfileId,
          unit,
          rounding,
          bendAngle,
        }}
        onCancel={() => setSetupVisible(false)}
        onApply={applySetup}
      />

      <MultiplierOverrideSheet
        visible={multiplierSheetVisible}
        bendAngle={bendAngle}
        benderName={benderProfile.name}
        chartMultiplierFormatted={formatRollingMultiplier(chartMultiplier)}
        currentOverride={multiplierOverride}
        onCancel={() => setMultiplierSheetVisible(false)}
        onApply={applyMultiplierOverride}
      />

      <ShrinkOverrideSheet
        visible={shrinkSheetVisible}
        bendAngle={bendAngle}
        benderName={benderProfile.name}
        unitSystem={unit}
        chartShrinkPerInchFormatted={formatLength(chartShrinkPerInch, unit, rounding)}
        currentOverrideInches={shrinkPerInchOverride}
        onCancel={() => setShrinkSheetVisible(false)}
        onApply={applyShrinkOverride}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inputRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'stretch',
  },
  markPanel: {
    marginTop: -spacing.xs,
  },
});
