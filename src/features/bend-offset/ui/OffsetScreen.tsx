/**
 * Offset calculator — diagram-first layout using shared UI chunks.
 *
 * Input state lives here; math lives in engine/offset.engine.ts.
 */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { BendAngle } from '@/core/types';
import { patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { getBenderProfile } from '@/data/benders';
import { Routes } from '@/navigation';
import { AppHeader, AppScreen, FieldInput, Sheet } from '@/shared/ui';
import {
  AngleSelector,
  EditSetupSheet,
  OptionalFieldButton,
  PipeWorkspaceResult,
  SetupSummary,
  WarningList,
  type BendAngleOption,
  type SetupValues,
} from '@/shared/workspace';
import { colors, spacing } from '@/theme';
import { getRoundingLabel } from '@/utils/rounding';
import { getLengthUnitLabel, getUnitSystemLabel } from '@/utils/units';
import { parseLengthInput } from '@/utils/parseLengthInput';

import { calculateOffset } from '../engine/offset.engine';
import { OFFSET_CONFIG } from '../offset.config';
import { offsetCopy } from '../offset.copy';
import { OffsetDiagram } from './OffsetDiagram';

export default function OffsetScreen() {
  const router = useRouter();

  const [offsetHeightText, setOffsetHeightText] = useState('');
  const [mark1Text, setMark1Text] = useState('');
  const [showMark1Input, setShowMark1Input] = useState(false);
  const [bendAngle, setBendAngle] = useState<BendAngle>(OFFSET_CONFIG.defaultAngle);
  const [setupVisible, setSetupVisible] = useState(false);
  const [angleSheetVisible, setAngleSheetVisible] = useState(false);

  // Shared, persisted setup — follows the user across calculators and restarts.
  const { setup, setSetup } = useCalculatorSetup();
  const { unit, rounding, conduitType, conduitSize, benderProfileId } = setup;

  const benderProfile = getBenderProfile(benderProfileId);
  const offsetHeight = parseLengthInput(offsetHeightText);
  const mark1Number = parseLengthInput(mark1Text);
  const hasMark1 = mark1Number !== undefined;
  const unitLabel = getLengthUnitLabel(unit);
  const setupSummary = `${conduitType} ${conduitSize}"`;
  const setupSubtitle = `${getUnitSystemLabel(unit)} • ${getRoundingLabel(rounding)}`;
  const hasValidOffset = offsetHeight !== undefined && offsetHeight > 0;
  // Imperial users type tape-measure fractions ("12 3/8") — needs a keyboard
  // with space and slash. Falls back to the default keyboard on Android.
  const lengthKeyboard = unit === 'imperial' ? ('numbers-and-punctuation' as const) : ('decimal-pad' as const);

  const result = useMemo(
    () =>
      calculateOffset({
        offsetHeight: offsetHeight ?? Number.NaN,
        mark1: hasMark1 ? mark1Number : undefined,
        bendAngle,
        benderProfileId,
        conduitType,
        tradeSize: conduitSize,
        unitSystem: unit,
        roundingPrecision: rounding,
      }),
    [
      benderProfileId,
      bendAngle,
      conduitSize,
      conduitType,
      hasMark1,
      mark1Number,
      offsetHeight,
      rounding,
      unit,
    ],
  );

  const distanceValue = hasValidOffset ? result.distanceBetweenBendsFormatted : '—';
  const mark1Value = hasValidOffset
    ? hasMark1
      ? result.mark1Formatted ?? '—'
      : offsetCopy.results.mark1Optional
    : '—';
  const mark2Value = hasValidOffset
    ? hasMark1
      ? result.mark2Formatted ?? '—'
      : `+ ${result.distanceBetweenBendsFormatted}`
    : '—';
  const visibleWarnings = offsetHeightText.trim() !== '' ? result.warnings : [];

  const mark1Error =
    mark1Text.trim() !== '' && mark1Number === undefined
      ? offsetCopy.fields.mark1.errorInvalid
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

  return (
    <View style={styles.screen}>
      <AppHeader
        showBack
        title={offsetCopy.screenTitle}
        subtitle={setupSummary}
        onBackPress={handleBackPress}
      />

      <AppScreen scroll>
        <SetupSummary
          title={benderProfile.name}
          subtitle={setupSubtitle}
          onEdit={() => setSetupVisible(true)}
        />

        <View style={styles.inputRow}>
          <FieldInput
            variant="compact"
            label={offsetCopy.fields.offsetHeight.label}
            value={offsetHeightText}
            onChangeText={setOffsetHeightText}
            placeholder={offsetCopy.fields.offsetHeight.placeholder}
            unit={unitLabel}
            inputProps={{ keyboardType: lengthKeyboard }}
            error={
              offsetHeightText !== '' && !hasValidOffset
                ? offsetCopy.fields.offsetHeight.errorRequired
                : undefined
            }
          />

          <FieldInput
            variant="picker"
            label={offsetCopy.fields.bendAngle.label}
            value={`${bendAngle}°`}
            onChangeText={() => {}}
            onPress={() => setAngleSheetVisible(true)}
          />
        </View>

        <View style={styles.markPanel}>
          {showMark1Input ? (
            <FieldInput
              label={offsetCopy.fields.mark1.label}
              value={mark1Text}
              onChangeText={setMark1Text}
              placeholder={offsetCopy.fields.mark1.placeholder}
              unit={unitLabel}
              variant="compact"
              inputProps={{ keyboardType: lengthKeyboard }}
              error={mark1Error}
            />
          ) : (
            <OptionalFieldButton
              label={offsetCopy.fields.mark1.addButton}
              onPress={() => setShowMark1Input(true)}
            />
          )}
        </View>

        <PipeWorkspaceResult
          title={offsetCopy.workspaceTitle}
          diagram={
            <OffsetDiagram
              data={result.diagramData}
              isEmpty={!hasValidOffset}
              isInvalid={offsetHeightText !== '' && !hasValidOffset}
            />
          }
          primaryLabel={offsetCopy.results.distanceBetweenBends}
          primaryValue={distanceValue}
          chips={[
            { label: offsetCopy.results.shrink, value: result.shrinkFormatted },
            {
              label: offsetCopy.results.mark1,
              value: mark1Value,
              tone: hasMark1 ? 'primary' : 'default',
            },
            { label: offsetCopy.results.mark2, value: mark2Value },
          ]}
        />

        <WarningList warnings={visibleWarnings} />
      </AppScreen>

      <Sheet
        visible={angleSheetVisible}
        title={offsetCopy.angleSheetTitle}
        subtitle={offsetCopy.angleSheetSubtitle}
        onClose={() => setAngleSheetVisible(false)}
        onSecondaryPress={() => setAngleSheetVisible(false)}
        primaryLabel="Done"
        onPrimaryPress={() => setAngleSheetVisible(false)}>
        <AngleSelector
          label={offsetCopy.fields.bendAngle.label}
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
