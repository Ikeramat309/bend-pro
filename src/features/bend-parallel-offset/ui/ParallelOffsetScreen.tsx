import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { snapshotSetupFromInput } from '@/core/calculations';
import { getCalculatorById } from '@/core/calculators';
import { patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import { usePersistRecentLayout, useRestoreRecentLayout } from '@/core/sessions';
import type { BendAngle } from '@/core/types';
import { formatSetupOnlyBenderMeta, getBenderProfile } from '@/data/benders';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { Routes } from '@/navigation';
import { Sheet } from '@/shared/ui';
import {
  AngleSelector,
  BendCalculatorLayout,
  EditSetupSheet,
  type BendAngleOption,
  type SetupValues,
} from '@/shared/workspace';
import { getLengthUnitLabel, getLengthInputMode, getUnitSystemLabel } from '@/utils/units';
import { getRoundingLabel } from '@/utils/rounding';
import { parseLengthInput } from '@/utils/parseLengthInput';

import { calculateParallelOffset } from '../engine/parallelOffset.engine';
import { toParallelOffsetCalculationResult } from '../engine/parallelOffsetCalculationResult';
import {
  createParallelOffsetInputSnapshot,
  restoreParallelOffsetFromLayout,
  toStoredInputSnapshot,
} from '../engine/parallelOffsetInputSnapshot';
import type {
  ParallelOffsetMode,
  ParallelOffsetShiftDirection,
} from '../engine/parallelOffset.types';
import { PARALLEL_OFFSET_CONFIG } from '../parallelOffset.config';
import { parallelOffsetCopy } from '../parallelOffset.copy';
import { ParallelOffsetDiagram } from './ParallelOffsetDiagram';
import { ParallelOffsetLayoutSheet } from './ParallelOffsetLayoutSheet';

export type ParallelOffsetScreenProps = {
  /** Integration hook; the feature does not own guide registration or routing. */
  onGuidePress?: () => void;
};

export default function ParallelOffsetScreen({ onGuidePress }: ParallelOffsetScreenProps) {
  const router = useRouter();
  const [mode, setMode] = useState<ParallelOffsetMode>(PARALLEL_OFFSET_CONFIG.defaultMode);
  const [centerSpacingText, setCenterSpacingText] = useState('');
  const [offsetHeightText, setOffsetHeightText] = useState('');
  const [bendAngle, setBendAngle] = useState<BendAngle>(PARALLEL_OFFSET_CONFIG.defaultAngle);
  const [conduitCount, setConduitCount] = useState<number>(
    PARALLEL_OFFSET_CONFIG.defaultConduitCount,
  );
  const [baseMarkText, setBaseMarkText] = useState('');
  const [shiftDirection, setShiftDirection] = useState<ParallelOffsetShiftDirection>(
    PARALLEL_OFFSET_CONFIG.defaultShiftDirection,
  );
  const [angleSheetVisible, setAngleSheetVisible] = useState(false);
  const [layoutSheetVisible, setLayoutSheetVisible] = useState(false);
  const [setupVisible, setSetupVisible] = useState(false);

  useRestoreRecentLayout('parallelOffset', restoreParallelOffsetFromLayout, (fields) => {
    setMode(fields.mode);
    setCenterSpacingText(fields.centerSpacingText);
    setOffsetHeightText(fields.offsetHeightText);
    setBendAngle(fields.bendAngle as BendAngle);
    setConduitCount(fields.conduitCount);
    setBaseMarkText(fields.baseMarkText);
    setShiftDirection(fields.shiftDirection);
  });

  const { setup, setSetup } = useCalculatorSetup();
  const { unit, rounding, conduitType, conduitSize, benderProfileId, customBenderProfiles } = setup;
  const benderProfile = getBenderProfile(benderProfileId, customBenderProfiles);
  const centerSpacing = parseLengthInput(centerSpacingText);
  const offsetHeight = parseLengthInput(offsetHeightText);
  const baseMark = parseLengthInput(baseMarkText);
  const baseMarkStarted = baseMarkText.trim() !== '';
  const lengthInput = getLengthInputMode(unit);
  const unitLabel = getLengthUnitLabel(unit);
  const hasValidSpacing = centerSpacing !== undefined && centerSpacing > 0;
  const hasValidHeight = offsetHeight !== undefined && offsetHeight > 0;
  const simpleReady = mode === 'simple' && hasValidSpacing;
  const layoutReady = mode === 'layout' && hasValidSpacing && hasValidHeight;
  const ready = simpleReady || layoutReady;
  const started =
    mode === 'simple'
      ? centerSpacingText.trim() !== ''
      : offsetHeightText.trim() !== '' || (!hasValidSpacing && centerSpacingText.trim() !== '');

  const engineInput = useMemo(
    () => ({
      mode,
      centerSpacing: centerSpacing ?? Number.NaN,
      offsetHeight: mode === 'layout' ? (offsetHeight ?? Number.NaN) : undefined,
      bendAngle,
      conduitCount: mode === 'layout' ? conduitCount : undefined,
      baseMark:
        mode === 'layout' && baseMarkStarted ? (baseMark ?? Number.NaN) : undefined,
      shiftDirection: mode === 'layout' ? shiftDirection : undefined,
      benderProfileId,
      conduitType,
      tradeSize: conduitSize,
      unitSystem: unit,
      roundingPrecision: rounding,
      customBenderProfiles,
    }),
    [
      baseMark,
      baseMarkStarted,
      bendAngle,
      benderProfileId,
      centerSpacing,
      conduitCount,
      conduitSize,
      conduitType,
      customBenderProfiles,
      mode,
      offsetHeight,
      rounding,
      shiftDirection,
      unit,
    ],
  );
  const result = useMemo(() => calculateParallelOffset(engineInput), [engineInput]);
  const calculationResult = useMemo(
    () => toParallelOffsetCalculationResult(engineInput, result),
    [engineInput, result],
  );

  usePersistRecentLayout({
    calculatorId: 'parallelOffset',
    calculatorTitle: getCalculatorById('parallelOffset')?.title ?? 'Parallel Offsets',
    inputSnapshot: toStoredInputSnapshot(createParallelOffsetInputSnapshot(engineInput)),
    setupSnapshot: snapshotSetupFromInput(engineInput),
    calculationResult,
    enabled: started,
  });

  const setupMeta = [
    formatSetupOnlyBenderMeta(benderProfile.name),
    `${conduitType} ${conduitSize}"`,
    `${getUnitSystemLabel(unit)} • ${getRoundingLabel(rounding)}`,
  ].join(' • ');
  const visibleWarnings = started ? result.warnings : [];
  const baseMarkError =
    baseMarkStarted && (baseMark === undefined || baseMark < 0)
      ? 'Enter a non-negative Pipe 1 Mark 1, or leave it blank.'
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
    if ((PARALLEL_OFFSET_CONFIG.validAngles as readonly number[]).includes(nextSetup.bendAngle)) {
      setBendAngle(nextSetup.bendAngle as BendAngle);
    }
    setSetupVisible(false);
  }

  function resetInputs() {
    setMode(PARALLEL_OFFSET_CONFIG.defaultMode);
    setCenterSpacingText('');
    setOffsetHeightText('');
    setBendAngle(PARALLEL_OFFSET_CONFIG.defaultAngle);
    setConduitCount(PARALLEL_OFFSET_CONFIG.defaultConduitCount);
    setBaseMarkText('');
    setShiftDirection(PARALLEL_OFFSET_CONFIG.defaultShiftDirection);
    setLayoutSheetVisible(false);
  }

  function enterFullLayout() {
    setMode('layout');
    setLayoutSheetVisible(true);
  }

  function useSimpleMode() {
    setMode('simple');
    setLayoutSheetVisible(false);
  }

  return (
    <BendCalculatorLayout
      title={parallelOffsetCopy.screenTitle}
      subtitle=""
      centerTitle
      inputDensity="compact"
      workspaceDensity="compact"
      onBackPress={handleBackPress}
      trust={{
        benderName: `Parallel field method • tan(${bendAngle / 2}°)`,
        meta: setupMeta,
        note: 'Use the same conduit size, shoe radius, and bend angle across the rack.',
        onEdit: () => setSetupVisible(true),
      }}
      inputs={
        mode === 'simple'
          ? [
              {
                type: 'row',
                key: 'simple-inputs',
                inputs: [
                  {
                    type: 'field',
                    key: 'centerSpacing',
                    label: parallelOffsetCopy.fields.centerSpacing.shortLabel,
                    value: centerSpacingText,
                    onChangeText: setCenterSpacingText,
                    placeholder: parallelOffsetCopy.fields.centerSpacing.placeholder,
                    unit: unitLabel,
                    variant: 'compact',
                    lengthInput,
                    error:
                      centerSpacingText !== '' && !hasValidSpacing
                        ? parallelOffsetCopy.fields.centerSpacing.errorRequired
                        : undefined,
                  },
                  {
                    type: 'picker',
                    key: 'bendAngle',
                    label: parallelOffsetCopy.fields.bendAngle.label,
                    value: `${bendAngle}°`,
                    onPress: () => setAngleSheetVisible(true),
                  },
                ],
              },
            ]
          : [
              {
                type: 'row',
                key: 'layout-main',
                inputs: [
                  {
                    type: 'field',
                    key: 'offsetHeight',
                    label: parallelOffsetCopy.fields.offsetHeight.label,
                    value: offsetHeightText,
                    onChangeText: setOffsetHeightText,
                    placeholder: parallelOffsetCopy.fields.offsetHeight.placeholder,
                    unit: unitLabel,
                    variant: 'compact',
                    lengthInput,
                    error:
                      offsetHeightText !== '' && !hasValidHeight
                        ? parallelOffsetCopy.fields.offsetHeight.errorRequired
                        : undefined,
                  },
                  {
                    type: 'picker',
                    key: 'bendAngle',
                    label: parallelOffsetCopy.fields.bendAngle.label,
                    value: `${bendAngle}°`,
                    onPress: () => setAngleSheetVisible(true),
                  },
                ],
              },
              {
                type: 'field',
                key: 'centerSpacing',
                label: parallelOffsetCopy.fields.centerSpacing.label,
                value: centerSpacingText,
                onChangeText: setCenterSpacingText,
                placeholder: parallelOffsetCopy.fields.centerSpacing.placeholder,
                unit: unitLabel,
                variant: 'compact',
                lengthInput,
                error:
                  centerSpacingText !== '' && !hasValidSpacing
                    ? parallelOffsetCopy.fields.centerSpacing.errorRequired
                    : undefined,
              },
            ]
      }
      workspace={
        <ParallelOffsetDiagram
          data={result.diagramData}
          mode={mode}
          bendAngle={bendAngle}
          isEmpty={!ready}
          isInvalid={started && !ready}
        />
      }
      primaryResult={
        result.isValid
          ? {
              label: parallelOffsetCopy.results.adjustment,
              value: result.adjustmentPerConduitFormatted,
            }
          : undefined
      }
      secondaryResults={
        result.isValid && mode === 'layout'
          ? [
              {
                label: parallelOffsetCopy.results.distanceBetweenBends,
                value: result.distanceBetweenBendsFormatted ?? '—',
              },
              {
                label: parallelOffsetCopy.results.totalShift,
                value: result.totalRackShiftFormatted,
              },
            ]
          : undefined
      }
      dock={{
        left: [{ key: 'reset', label: 'Reset', onPress: resetInputs }],
        center: {
          key: mode === 'simple' ? 'full-layout' : 'layout-options',
          label: mode === 'simple' ? parallelOffsetCopy.modes.layout : 'Layout Options',
          variant: 'pill',
          onPress: mode === 'simple' ? enterFullLayout : () => setLayoutSheetVisible(true),
        },
        guide: onGuidePress ? { onPress: onGuidePress } : undefined,
      }}
      warnings={visibleWarnings}
      footer={
        <>
          <Sheet
            visible={angleSheetVisible}
            title={parallelOffsetCopy.angleSheetTitle}
            subtitle={parallelOffsetCopy.angleSheetSubtitle}
            onClose={() => setAngleSheetVisible(false)}
            primaryLabel="Done"
            onPrimaryPress={() => setAngleSheetVisible(false)}
            onSecondaryPress={() => setAngleSheetVisible(false)}>
            <AngleSelector
              label={parallelOffsetCopy.fields.bendAngle.label}
              selectedAngle={bendAngle as BendAngleOption}
              angles={PARALLEL_OFFSET_CONFIG.validAngles}
              onSelect={(angle) => setBendAngle(angle as BendAngle)}
            />
          </Sheet>
          <ParallelOffsetLayoutSheet
            visible={layoutSheetVisible}
            conduitCount={conduitCount}
            shiftDirection={shiftDirection}
            baseMarkText={baseMarkText}
            baseMarkError={baseMarkError}
            lengthInput={lengthInput}
            unitLabel={unitLabel}
            conduits={result.conduits}
            onConduitCountChange={setConduitCount}
            onShiftDirectionChange={setShiftDirection}
            onBaseMarkChange={setBaseMarkText}
            onClose={() => setLayoutSheetVisible(false)}
            onUseSimpleMode={useSimpleMode}
          />
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
        </>
      }
    />
  );
}
