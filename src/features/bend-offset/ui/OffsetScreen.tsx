/**
 * Offset calculator — diagram-first layout using shared UI chunks.
 *
 * Input state lives here; math lives in engine/offset.engine.ts.
 */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { BendAngle, ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';
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
import { hasPositiveNumber, parseOptionalNumber } from '@/utils/validation';

import { calculateOffset } from '../engine/offset.engine';
import type { OffsetDiagramViewData } from '../engine/offset.types';
import { OFFSET_CONFIG } from '../offset.config';
import { offsetCopy } from '../offset.copy';
import { OffsetDiagram } from './OffsetDiagram';

export default function OffsetScreen() {
  const router = useRouter();

  const [offsetHeightText, setOffsetHeightText] = useState('');
  const [mark1Text, setMark1Text] = useState('');
  const [showMark1Input, setShowMark1Input] = useState(false);
  const [bendAngle, setBendAngle] = useState<BendAngle>(OFFSET_CONFIG.defaultAngle);
  const [unit, setUnit] = useState<UnitSystem>(OFFSET_CONFIG.defaultUnit);
  const [rounding, setRounding] = useState<RoundingOption>(OFFSET_CONFIG.defaultRounding);
  const [conduitType, setConduitType] = useState<ConduitType>(OFFSET_CONFIG.defaultConduitType);
  const [conduitSize, setConduitSize] = useState<TradeSize>(OFFSET_CONFIG.defaultTradeSize);
  const [benderProfileId, setBenderProfileId] = useState(OFFSET_CONFIG.defaultBenderProfileId);
  const [setupVisible, setSetupVisible] = useState(false);
  const [angleSheetVisible, setAngleSheetVisible] = useState(false);

  const benderProfile = getBenderProfile(benderProfileId);
  const offsetHeight = Number(offsetHeightText || 0);
  const mark1Number = parseOptionalNumber(mark1Text);
  const hasMark1 = mark1Number !== undefined && Number.isFinite(mark1Number);
  const unitLabel = getLengthUnitLabel(unit);
  const setupSummary = `${conduitType} ${conduitSize}"`;
  const setupSubtitle = `${getUnitSystemLabel(unit)} • ${getRoundingLabel(rounding)}`;
  const hasValidOffset = hasPositiveNumber(offsetHeightText);

  const result = useMemo(
    () =>
      calculateOffset({
        offsetHeight,
        firstMark: hasMark1 ? mark1Number : undefined,
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

  const diagramData: OffsetDiagramViewData | undefined = hasValidOffset
    ? {
        distanceBetweenBends: result.distanceBetweenBendsFormatted,
        offsetHeight: result.offsetHeightFormatted,
        shrink: result.shrinkFormatted,
        mark1: mark1Value,
        mark2: mark2Value,
        showMarks: hasMark1,
        angleDeg: bendAngle,
      }
    : undefined;

  const mark1Error =
    mark1Text.trim() !== '' &&
    (mark1Number === undefined || !Number.isFinite(mark1Number) || mark1Number < 0)
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
    setConduitType(DEFAULT_CONDUIT_TYPE);
    setConduitSize(nextSetup.conduitSize);
    setBenderProfileId(nextSetup.benderProfileId);
    setUnit(nextSetup.unit);
    setRounding(nextSetup.rounding);
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
            error={
              offsetHeightText !== '' && offsetHeight <= 0
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
              data={diagramData}
              isEmpty={!hasValidOffset}
              isInvalid={offsetHeightText !== '' && offsetHeight <= 0}
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
