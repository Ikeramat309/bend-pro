/**
 * Rolling Offset calculator — diagram-first layout using shared workspace shell.
 */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import type { BendAngle } from '@/core/types';
import { getSetupOverrideHint, patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { getBenderProfile } from '@/data/benders';
import { Routes, guideRoute } from '@/navigation';
import { Sheet } from '@/shared/ui';
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
  const lengthInput = getLengthInputMode(unit);

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

  function resetInputs() {
    setOffsetHeightText('');
    setOffsetRollText('');
    setMark1Text('');
    setShowMark1Input(false);
  }

  const setMarkLabel = hasMark1 || showMark1Input ? 'Set First Mark' : 'Set Roll';

  return (
    <BendCalculatorLayout
      title={rollingCopy.screenTitle}
      subtitle={setupSummary}
      onBackPress={handleBackPress}
      trust={{
        benderName: benderProfile.name,
        meta: setupSubtitle,
        note: profileContextMessage,
        onEdit: () => setSetupVisible(true),
      }}
      inputs={[
        {
          type: 'row',
          key: 'offset',
          inputs: [
            {
              type: 'field',
              key: 'offsetHeight',
              label: rollingCopy.fields.offsetHeight.label,
              value: offsetHeightText,
              onChangeText: setOffsetHeightText,
              placeholder: rollingCopy.fields.offsetHeight.placeholder,
              unit: unitLabel,
              variant: 'compact',
              lengthInput,
              error:
                offsetHeightText !== '' && !hasValidOffset
                  ? rollingCopy.fields.offsetHeight.errorRequired
                  : undefined,
            },
            {
              type: 'field',
              key: 'offsetRoll',
              label: rollingCopy.fields.offsetRoll.label,
              value: offsetRollText,
              onChangeText: setOffsetRollText,
              placeholder: rollingCopy.fields.offsetRoll.placeholder,
              unit: unitLabel,
              variant: 'compact',
              lengthInput,
              error:
                offsetRollText !== '' && !hasValidRoll
                  ? rollingCopy.fields.offsetRoll.errorRequired
                  : undefined,
            },
          ],
        },
        {
          type: 'picker',
          key: 'angle',
          label: rollingCopy.fields.bendAngle.label,
          value: `${bendAngle}°`,
          onPress: () => setAngleSheetVisible(true),
        },
        {
          type: 'optional',
          key: 'mark1',
          addLabel: rollingCopy.fields.mark1.addButton,
          onAdd: () => setShowMark1Input(true),
          visible: showMark1Input,
          field: {
            type: 'field',
            key: 'mark1Field',
            label: rollingCopy.fields.mark1.label,
            value: mark1Text,
            onChangeText: setMark1Text,
            placeholder: rollingCopy.fields.mark1.placeholder,
            unit: unitLabel,
            variant: 'compact',
            lengthInput,
            error: mark1Error,
          },
        },
      ]}
      workspace={
        <RollingDiagram
          data={result.diagramData}
          isEmpty={!hasValidInputs}
          isInvalid={inputsStarted && !hasValidInputs}
        />
      }
      primaryResult={
        hasValidInputs
          ? { label: rollingCopy.results.distanceBetweenBends, value: distanceValue }
          : undefined
      }
      secondaryResults={
        hasValidInputs
          ? [
              {
                label: shrinkChipLabel,
                value: result.shrinkFormatted,
                tone: result.isShrinkOverridden ? 'primary' : undefined,
                onPress: () => setShrinkSheetVisible(true),
              },
              {
                label: multiplierChipLabel,
                value: formatRollingMultiplier(result.multiplier),
                tone: result.isMultiplierOverridden ? 'primary' : undefined,
                onPress: () => setMultiplierSheetVisible(true),
              },
            ]
          : undefined
      }
      dock={{
        left: [
          { key: 'reset', label: 'Reset', onPress: resetInputs },
          {
            key: 'set-mark',
            label: setMarkLabel,
            onPress: () => setShowMark1Input(true),
          },
        ],
        guide: { onPress: () => router.push(guideRoute('rolling')) },
      }}
      warnings={visibleWarnings}
      footer={
        <>
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
        </>
      }
    />
  );
}
