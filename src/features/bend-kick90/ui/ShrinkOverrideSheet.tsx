/**
 * Shrink-per-inch override bottom sheet for Kick 90.
 */
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  formatCanonicalLengthForDisplay,
  parsePositiveLengthToCanonicalInches,
} from '@/core/measurements';
import { MAX_OFFSET_SHRINK_PER_INCH } from '@/core/settings';
import type { BendAngle, UnitSystem } from '@/core/types';
import { FieldInput } from '@/shared/ui';
import { Sheet } from '@/shared/ui/Sheet';
import { spacing, typography, useTheme, type ThemePalette } from '@/theme';
import { getLengthUnitLabel, getLengthInputMode } from '@/utils/units';

import { kick90Copy } from '../kick90.copy';

export type ShrinkOverrideSheetProps = {
  visible: boolean;
  bendAngle: BendAngle;
  benderName: string;
  unitSystem: UnitSystem;
  chartShrinkPerInchFormatted: string;
  currentOverrideInches?: number;
  onCancel: () => void;
  onApply: (overrideInches: number | undefined) => void;
};

export function ShrinkOverrideSheet(props: ShrinkOverrideSheetProps) {
  if (!props.visible) {
    return (
      <Sheet
        visible={false}
        title={kick90Copy.shrinkOverride.title}
        onClose={props.onCancel}
        onSecondaryPress={props.onCancel}
      />
    );
  }

  return <ShrinkOverrideSheetOpen {...props} />;
}

function ShrinkOverrideSheetOpen({
  bendAngle,
  benderName,
  unitSystem,
  chartShrinkPerInchFormatted,
  currentOverrideInches,
  onCancel,
  onApply,
}: ShrinkOverrideSheetProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [text, setText] = useState(() =>
    currentOverrideInches !== undefined
      ? formatCanonicalLengthForDisplay(currentOverrideInches, unitSystem)
      : '',
  );

  const isBlank = text.trim() === '';
  const parsedInches = parsePositiveLengthToCanonicalInches(text, unitSystem);
  const isValid =
    isBlank || (parsedInches !== undefined && parsedInches <= MAX_OFFSET_SHRINK_PER_INCH);

  const lengthInput = getLengthInputMode(unitSystem);

  function handleApply() {
    if (!isValid) return;
    onApply(isBlank ? undefined : parsedInches);
  }

  return (
    <Sheet
      visible
      title={kick90Copy.shrinkOverride.title}
      subtitle={`${benderName} • ${bendAngle}°`}
      onClose={onCancel}
      onSecondaryPress={onCancel}
      onPrimaryPress={handleApply}>
      <Text style={styles.description}>{kick90Copy.shrinkOverride.description}</Text>

      <FieldInput
        label={kick90Copy.shrinkOverride.fieldLabel}
        value={text}
        onChangeText={setText}
        placeholder={kick90Copy.shrinkOverride.placeholder}
        unit={getLengthUnitLabel(unitSystem)}
        lengthInput={lengthInput}
        error={!isValid ? kick90Copy.shrinkOverride.errorInvalid : undefined}
      />

      <View style={styles.chartCard}>
        <Text style={styles.chartLine}>
          {kick90Copy.shrinkOverride.chartLine(bendAngle, chartShrinkPerInchFormatted)}
        </Text>
        <Text style={styles.hintLine}>{kick90Copy.shrinkOverride.clearHint}</Text>
      </View>
    </Sheet>
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    description: {
      ...typography.subtitle,
      color: c.muted,
    },
    chartCard: {
      gap: spacing.xs,
      paddingTop: spacing.sm,
    },
    chartLine: {
      ...typography.subtitle,
      color: c.text,
    },
    hintLine: {
      ...typography.subtitle,
      color: c.muted,
    },
  });
}
