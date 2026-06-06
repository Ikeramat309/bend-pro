/**
 * Offset calculator — diagram-first layout using shared UI chunks.
 *
 * Input state lives here; math lives in engine/offset.engine.ts.
 */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { BendAngle, ConduitType, RoundingOption, TradeSize, UnitSystem } from '@/core/types';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { getBenderProfile } from '@/data/benders';
import { Routes } from '@/navigation';
import { AppHeader, AppScreen, FieldInput, Sheet } from '@/shared/ui';
import {
  AngleSelector,
  EditSetupSheet,
  PipeWorkspaceResult,
  SetupSummary,
  type BendAngleOption,
  type SetupValues,
} from '@/shared/workspace';
import { colors, radius, spacing, typography } from '@/theme';
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

          <Pressable
            onPress={() => setAngleSheetVisible(true)}
            style={({ pressed }) => [styles.angleCard, pressed && styles.angleCardPressed]}
            accessibilityRole="button"
            accessibilityLabel={offsetCopy.fields.bendAngle.label}>
            <Text style={styles.angleLabel}>{offsetCopy.fields.bendAngle.label}</Text>
            <View style={styles.angleValueRow}>
              <Text style={styles.angleValue}>{bendAngle}°</Text>
              <Text style={styles.angleChevron}>›</Text>
            </View>
          </Pressable>
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
            <Pressable
              onPress={() => setShowMark1Input(true)}
              style={({ pressed }) => [styles.addMarkButton, pressed && styles.addMarkButtonPressed]}
              accessibilityRole="button">
              <Text style={styles.addMarkIcon}>＋</Text>
              <Text style={styles.addMarkText}>{offsetCopy.fields.mark1.addButton}</Text>
            </Pressable>
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

        {visibleWarnings.length > 0 ? (
          <View style={styles.warningCard}>
            {visibleWarnings.map((warning) => (
              <Text key={warning} style={styles.warningText}>
                {warning}
              </Text>
            ))}
          </View>
        ) : null}
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
  angleCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 92,
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  angleCardPressed: {
    opacity: 0.9,
  },
  angleLabel: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  angleValueRow: {
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  angleValue: {
    color: colors.text,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
  },
  angleChevron: {
    color: colors.primary,
    fontSize: 32,
    lineHeight: 34,
  },
  markPanel: {
    marginTop: -spacing.xs,
  },
  addMarkButton: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  addMarkButtonPressed: {
    opacity: 0.88,
  },
  addMarkIcon: {
    color: colors.primary,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '800',
  },
  addMarkText: {
    ...typography.chip,
    color: colors.primary,
  },
  warningCard: {
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.warning,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  warningText: {
    ...typography.subtitle,
    color: colors.warning,
  },
});
