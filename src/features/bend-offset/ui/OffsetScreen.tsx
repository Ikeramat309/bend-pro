import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { BendAngle } from '@/core/types';
import { snapshotSetupFromInput } from '@/core/calculations';
import { getCalculatorById } from '@/core/calculators';
import { getSetupOverrideHint, patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import { usePersistRecentLayout, useRestoreRecentLayout } from '@/core/sessions';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { getBenderProfile } from '@/data/benders';
import { Routes, guideRoute } from '@/navigation';
import { LengthInputSheet, Sheet } from '@/shared/ui';
import {
  AngleSelector,
  BendCalculatorLayout,
  EditSetupSheet,
  type BendAngleOption,
  type SetupValues,
} from '@/shared/workspace';
import { formatLength } from '@/utils/formatLength';
import { getRoundingLabel } from '@/utils/rounding';
import { getLengthUnitLabel, getLengthInputMode, getUnitSystemLabel } from '@/utils/units';
import { parseLengthInput } from '@/utils/parseLengthInput';

import { calculateOffset } from '../engine/offset.engine';
import { formatMultiplier, getOffsetAngleData } from '../engine/offsetAngleData';
import { toOffsetCalculationResult } from '../engine/offsetCalculationResult';
import {
  createOffsetInputSnapshot,
  restoreOffsetFromLayout,
  toStoredInputSnapshot,
} from '../engine/offsetInputSnapshot';
import { OFFSET_CONFIG } from '../offset.config';
import { offsetCopy } from '../offset.copy';
import { MultiplierOverrideSheet } from './MultiplierOverrideSheet';
import { OffsetDiagram } from './OffsetDiagram';
import { ShrinkOverrideSheet } from './ShrinkOverrideSheet';

/** Keep end caps, bend tags, and the field cue inside the workspace at every size. */
const DIAGRAM_DISPLAY_SCALE = 1;

export default function OffsetScreen() {
  const router = useRouter();

  const [offsetHeightText, setOffsetHeightText] = useState('');
  const [mark1Text, setMark1Text] = useState('');
  const [mark1SheetVisible, setMark1SheetVisible] = useState(false);
  const [bendAngle, setBendAngle] = useState<BendAngle>(OFFSET_CONFIG.defaultAngle);
  const [setupVisible, setSetupVisible] = useState(false);
  const [angleSheetVisible, setAngleSheetVisible] = useState(false);
  const [multiplierSheetVisible, setMultiplierSheetVisible] = useState(false);
  const [shrinkSheetVisible, setShrinkSheetVisible] = useState(false);

  useRestoreRecentLayout('offset', restoreOffsetFromLayout, (fields) => {
    setOffsetHeightText(fields.offsetHeightText);
    setMark1Text(fields.mark1Text);
    setBendAngle(fields.bendAngle);
  });

  const { setup, setSetup } = useCalculatorSetup();
  const { unit, rounding, conduitType, conduitSize, benderProfileId, customBenderProfiles } = setup;
  const multiplierOverride = setup.offsetMultiplierOverrides[bendAngle];
  const shrinkPerInchOverride = setup.offsetShrinkPerInchOverrides[bendAngle];

  const benderProfile = getBenderProfile(benderProfileId, customBenderProfiles);
  const chartAngleData = getOffsetAngleData(bendAngle);
  const chartMultiplier = chartAngleData?.multiplier ?? 0;
  const chartShrinkPerInch = chartAngleData?.shrinkPerInch ?? 0;
  const offsetHeight = parseLengthInput(offsetHeightText);
  const mark1Number = parseLengthInput(mark1Text);
  const hasMark1 = mark1Number !== undefined;
  const unitLabel = getLengthUnitLabel(unit);
  const showFieldUnit = unit === 'metric';
  const setupSummary = `${conduitType} ${conduitSize}"`;
  const overrideHint = getSetupOverrideHint(setup, { calculator: 'offset', bendAngle });
  const setupMeta = [`${getUnitSystemLabel(unit)} • ${getRoundingLabel(rounding)}`, overrideHint]
    .filter(Boolean)
    .join(' • ');
  const hasValidOffset = offsetHeight !== undefined && offsetHeight > 0;
  const lengthInput = getLengthInputMode(unit);

  const engineInput = useMemo(
    () => ({
      offsetHeight: offsetHeight ?? Number.NaN,
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
      benderProfileId,
      customBenderProfiles,
      bendAngle,
      conduitSize,
      conduitType,
      hasMark1,
      mark1Number,
      multiplierOverride,
      shrinkPerInchOverride,
      offsetHeight,
      rounding,
      unit,
    ],
  );

  const result = useMemo(() => calculateOffset(engineInput), [engineInput]);

  const calculationResult = useMemo(
    () => toOffsetCalculationResult(engineInput, result),
    [engineInput, result],
  );

  usePersistRecentLayout({
    calculatorId: 'offset',
    calculatorTitle: getCalculatorById('offset')?.title ?? 'Basic Offset',
    inputSnapshot: toStoredInputSnapshot(createOffsetInputSnapshot(engineInput)),
    setupSnapshot: snapshotSetupFromInput(engineInput),
    calculationResult,
    enabled: offsetHeightText.trim() !== '',
  });

  const distanceValue = hasValidOffset ? result.distanceBetweenBendsFormatted : '—';
  const visibleWarnings = offsetHeightText.trim() !== '' ? result.warnings : [];

  const shrinkChipLabel = result.isShrinkOverridden
    ? offsetCopy.results.shrinkCustom
    : offsetCopy.results.shrink;
  const multiplierChipLabel = result.isMultiplierOverridden
    ? offsetCopy.results.multiplierCustom
    : offsetCopy.results.multiplier;

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

  function resetInputs() {
    setOffsetHeightText('');
    setMark1Text('');
    setMark1SheetVisible(false);
  }

  return (
    <BendCalculatorLayout
      title={offsetCopy.screenTitle}
      subtitle=""
      centerTitle
      inputDensity="compact"
      workspaceDensity="compact"
      onBackPress={handleBackPress}
      trust={{
        benderName: benderProfile.name,
        meta: [setupSummary, setupMeta].filter(Boolean).join(' • '),
        onEdit: () => setSetupVisible(true),
      }}
      inputs={[
        {
          type: 'row',
          key: 'main',
          inputs: [
            {
              type: 'field',
              key: 'offsetHeight',
              label: offsetCopy.fields.offsetHeight.label,
              value: offsetHeightText,
              onChangeText: setOffsetHeightText,
              placeholder: offsetCopy.fields.offsetHeight.placeholder,
              unit: showFieldUnit ? unitLabel : undefined,
              variant: 'compact',
              lengthInput,
              error:
                offsetHeightText !== '' && !hasValidOffset
                  ? offsetCopy.fields.offsetHeight.errorRequired
                  : undefined,
            },
            {
              type: 'picker',
              key: 'angle',
              label: offsetCopy.fields.bendAngle.label,
              value: `${bendAngle}°`,
              onPress: () => setAngleSheetVisible(true),
            },
          ],
        },
      ]}
      workspace={
        <View style={styles.diagramScaleWrap}>
          <View style={styles.diagramScaleInner}>
            <OffsetDiagram
              data={result.diagramData}
              isEmpty={!hasValidOffset}
              isInvalid={offsetHeightText !== '' && !hasValidOffset}
            />
          </View>
        </View>
      }
      primaryResult={
        hasValidOffset
          ? { label: offsetCopy.results.distanceBetweenBends, value: distanceValue }
          : undefined
      }
      secondaryResults={
        hasValidOffset
          ? [
              {
                label: shrinkChipLabel,
                value: result.shrinkFormatted,
                tone: result.isShrinkOverridden ? 'primary' : undefined,
                onPress: () => setShrinkSheetVisible(true),
              },
              {
                label: multiplierChipLabel,
                value: formatMultiplier(result.multiplier),
                tone: result.isMultiplierOverridden ? 'primary' : undefined,
                onPress: () => setMultiplierSheetVisible(true),
              },
            ]
          : undefined
      }
      dock={{
        left: [{ key: 'reset', label: 'Reset', onPress: resetInputs }],
        center: {
          key: 'set-mark',
          label: 'Set First Mark',
          variant: 'pill',
          onPress: () => setMark1SheetVisible(true),
        },
        guide: { onPress: () => router.push(guideRoute('offset')) },
      }}
      warnings={visibleWarnings}
      footer={
        <>
          <LengthInputSheet
            visible={mark1SheetVisible}
            label={offsetCopy.fields.mark1.label}
            value={mark1Text}
            unit={showFieldUnit ? unitLabel : undefined}
            placeholder={offsetCopy.fields.mark1.placeholder}
            onCommit={(text) => {
              setMark1Text(text);
              setMark1SheetVisible(false);
            }}
            onCancel={() => setMark1SheetVisible(false)}
          />
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
          <MultiplierOverrideSheet
            visible={multiplierSheetVisible}
            bendAngle={bendAngle}
            benderName={benderProfile.name}
            chartMultiplierFormatted={formatMultiplier(chartMultiplier)}
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
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  diagramScaleWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  diagramScaleInner: {
    flex: 1,
    width: '100%',
    transform: [{ scale: DIAGRAM_DISPLAY_SCALE }],
  },
});
