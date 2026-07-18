/**
 * Kick 90 calculator — diagram-first layout using shared workspace shell.
 */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import type { BendAngle } from '@/core/types';
import { snapshotSetupFromInput } from '@/core/calculations';
import { getCalculatorById } from '@/core/calculators';
import { getSetupOverrideHint, patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import { usePersistRecentLayout, useRestoreRecentLayout } from '@/core/sessions';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { formatSetupOnlyBenderMeta, formatStandardOffsetTableTrustTitle, getBenderProfile } from '@/data/benders';
import { Routes, guideRoute } from '@/navigation';
import { LengthInputSheet, Sheet } from '@/shared/ui';
import {
  AngleSelector,
  BendCalculatorLayout,
  EditSetupSheet,
  OptionalInputSummary,
  type BendAngleOption,
  type SetupValues,
} from '@/shared/workspace';
import { formatLength } from '@/utils/formatLength';
import { getRoundingLabel } from '@/utils/rounding';
import { getLengthUnitLabel, getLengthInputMode, getUnitSystemLabel } from '@/utils/units';
import { parseLengthInput } from '@/utils/parseLengthInput';

import { calculateKick90 } from '../engine/kick90.engine';
import { formatKick90Multiplier, getKick90AngleData } from '../engine/kick90AngleData';
import { toKick90CalculationResult } from '../engine/kick90CalculationResult';
import {
  createKick90InputSnapshot,
  restoreKick90FromLayout,
  toStoredInputSnapshot,
} from '../engine/kick90InputSnapshot';
import { KICK90_CONFIG } from '../kick90.config';
import { kick90Copy } from '../kick90.copy';
import { Kick90Diagram } from './Kick90Diagram';
import { MultiplierOverrideSheet } from './MultiplierOverrideSheet';
import { ShrinkOverrideSheet } from './ShrinkOverrideSheet';

export default function Kick90Screen() {
  const router = useRouter();

  const [kickRiseText, setKickRiseText] = useState('');
  const [mark1Text, setMark1Text] = useState('');
  const [mark1SheetVisible, setMark1SheetVisible] = useState(false);
  const [bendAngle, setBendAngle] = useState<BendAngle>(KICK90_CONFIG.defaultAngle);
  const [setupVisible, setSetupVisible] = useState(false);
  const [angleSheetVisible, setAngleSheetVisible] = useState(false);
  const [multiplierSheetVisible, setMultiplierSheetVisible] = useState(false);
  const [shrinkSheetVisible, setShrinkSheetVisible] = useState(false);

  useRestoreRecentLayout('kick90', restoreKick90FromLayout, (fields) => {
    setKickRiseText(fields.kickRiseText);
    setMark1Text(fields.mark1Text);
    setBendAngle(fields.bendAngle);
  });

  const { setup, setSetup } = useCalculatorSetup();
  const { unit, rounding, conduitType, conduitSize, benderProfileId, customBenderProfiles } = setup;
  const multiplierOverride = setup.offsetMultiplierOverrides[bendAngle];
  const shrinkPerInchOverride = setup.offsetShrinkPerInchOverrides[bendAngle];

  const benderProfile = getBenderProfile(benderProfileId, customBenderProfiles);
  const chartAngleData = getKick90AngleData(bendAngle);
  const chartMultiplier = chartAngleData?.multiplier ?? 0;
  const chartShrinkPerInch = chartAngleData?.shrinkPerInch ?? 0;
  const kickRise = parseLengthInput(kickRiseText);
  const mark1Number = parseLengthInput(mark1Text);
  const hasMark1 = mark1Number !== undefined;
  const unitLabel = getLengthUnitLabel(unit);
  const showFieldUnit = unit === 'metric';
  const setupSummary = `${conduitType} ${conduitSize}"`;
  const overrideHint = getSetupOverrideHint(setup, { calculator: 'offset', bendAngle });
  const setupSubtitle = [
    `${getUnitSystemLabel(unit)} • ${getRoundingLabel(rounding)}`,
    overrideHint,
  ]
    .filter(Boolean)
    .join(' • ');
  const setupOnlyMeta = formatSetupOnlyBenderMeta(benderProfile.name);
  const hasValidKickRise = kickRise !== undefined && kickRise > 0;
  const lengthInput = getLengthInputMode(unit);

  const engineInput = useMemo(
    () => ({
      kickRise: kickRise ?? Number.NaN,
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
      kickRise,
      mark1Number,
      multiplierOverride,
      rounding,
      shrinkPerInchOverride,
      unit,
    ],
  );

  const result = useMemo(() => calculateKick90(engineInput), [engineInput]);

  const calculationResult = useMemo(
    () => toKick90CalculationResult(engineInput, result),
    [engineInput, result],
  );

  usePersistRecentLayout({
    calculatorId: 'kick90',
    calculatorTitle: getCalculatorById('kick90')?.title ?? 'Kick 90',
    inputSnapshot: toStoredInputSnapshot(createKick90InputSnapshot(engineInput)),
    setupSnapshot: snapshotSetupFromInput(engineInput),
    calculationResult,
    enabled: kickRiseText.trim() !== '',
  });

  const distanceValue = hasValidKickRise ? result.distanceBetweenBendsFormatted : '—';
  const visibleWarnings = kickRiseText.trim() !== '' ? result.warnings : [];

  function handleMark1Commit(text: string) {
    setMark1Text(text);
    setMark1SheetVisible(false);
  }

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
    ? `${kick90Copy.results.multiplierCustom} (${bendAngle}°)`
    : `${kick90Copy.results.multiplier} (${bendAngle}°)`;

  const shrinkChipLabel = result.isShrinkOverridden
    ? `${kick90Copy.results.shrinkCustom} (${bendAngle}°)`
    : `${kick90Copy.results.shrink} (${bendAngle}°)`;

  function resetInputs() {
    setKickRiseText('');
    setMark1Text('');
    setMark1SheetVisible(false);
  }

  return (
    <BendCalculatorLayout
      title={kick90Copy.screenTitle}
      subtitle=""
      centerTitle
      inputDensity="compact"
      workspaceDensity="compact"
      onBackPress={handleBackPress}
      trust={{
        benderName: formatStandardOffsetTableTrustTitle(bendAngle),
        meta: [setupOnlyMeta, setupSummary, setupSubtitle].filter(Boolean).join(' • '),
        onEdit: () => setSetupVisible(true),
      }}
      inputs={[
        {
          type: 'row',
          key: 'main',
          inputs: [
            {
              type: 'field',
              key: 'kickRise',
              label: kick90Copy.fields.kickRise.label,
              value: kickRiseText,
              onChangeText: setKickRiseText,
              placeholder: kick90Copy.fields.kickRise.placeholder,
              unit: showFieldUnit ? unitLabel : undefined,
              variant: 'compact',
              lengthInput,
              error:
                kickRiseText !== '' && !hasValidKickRise
                  ? kick90Copy.fields.kickRise.errorRequired
                  : undefined,
            },
            {
              type: 'picker',
              key: 'angle',
              label: kick90Copy.fields.bendAngle.label,
              value: `${bendAngle}°`,
              onPress: () => setAngleSheetVisible(true),
            },
          ],
        },
        ...(mark1Text.trim()
          ? [
              {
                type: 'custom' as const,
                key: 'mark1Summary',
                node: (
                  <OptionalInputSummary
                    label={kick90Copy.fields.mark1.label}
                    value={mark1Text}
                    unit={showFieldUnit ? unitLabel : undefined}
                    onPress={() => setMark1SheetVisible(true)}
                  />
                ),
              },
            ]
          : []),
      ]}
      workspace={
        <Kick90Diagram
          data={result.diagramData}
          isEmpty={!hasValidKickRise}
          isInvalid={kickRiseText.trim() !== '' && !hasValidKickRise}
        />
      }
      primaryResult={
        hasValidKickRise
          ? { label: kick90Copy.results.distanceBetweenBends, value: distanceValue }
          : undefined
      }
      secondaryResults={
        hasValidKickRise
          ? [
              {
                label: shrinkChipLabel,
                value: result.shrinkFormatted,
                tone: result.isShrinkOverridden ? 'primary' : undefined,
                onPress: () => setShrinkSheetVisible(true),
              },
              {
                label: multiplierChipLabel,
                value: formatKick90Multiplier(result.multiplier),
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
        guide: { onPress: () => router.push(guideRoute('kick90')) },
      }}
      warnings={visibleWarnings}
      footer={
        <>
          <LengthInputSheet
            visible={mark1SheetVisible}
            label={kick90Copy.fields.mark1.label}
            value={mark1Text}
            unit={showFieldUnit ? unitLabel : undefined}
            placeholder={kick90Copy.fields.mark1.placeholder}
            onCommit={handleMark1Commit}
            onCancel={() => setMark1SheetVisible(false)}
          />
          <Sheet
            visible={angleSheetVisible}
            title={kick90Copy.angleSheetTitle}
            subtitle={kick90Copy.angleSheetSubtitle}
            onClose={() => setAngleSheetVisible(false)}
            onSecondaryPress={() => setAngleSheetVisible(false)}
            primaryLabel="Done"
            onPrimaryPress={() => setAngleSheetVisible(false)}>
            <AngleSelector
              label={kick90Copy.fields.bendAngle.label}
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
            chartMultiplierFormatted={formatKick90Multiplier(chartMultiplier)}
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
