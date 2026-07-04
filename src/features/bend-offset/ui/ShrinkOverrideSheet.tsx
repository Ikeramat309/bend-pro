/**
 * Shrink-per-inch override bottom sheet — lets the user replace the standard
 * offset shrink rate with a value from their own chart or field experience.
 *
 * Draft state while open; parent updates only on Apply. Blank input clears
 * the override. Values are stored in inches per inch of offset height.
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

import { offsetCopy } from '../offset.copy';

export type ShrinkOverrideSheetProps = {
  visible: boolean;
  bendAngle: BendAngle;
  benderName: string;
  unitSystem: UnitSystem;
  /** Standard table shrink per inch, formatted for display. */
  chartShrinkPerInchFormatted: string;
  currentOverrideInches?: number;
  onCancel: () => void;
  /** `undefined` clears the override (back to the table value). */
  onApply: (overrideInches: number | undefined) => void;
};

export function ShrinkOverrideSheet(props: ShrinkOverrideSheetProps) {
  if (!props.visible) {
    return (
      <Sheet
        visible={false}
        title={offsetCopy.shrinkOverride.title}
        onClose={props.onCancel}
        onSecondaryPress={props.onCancel}
      />
    );
  }

  return <ShrinkOverrideSheetOpen {...props} />;
}

/** Mounted only while open — draft text resets from the stored override. */
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
      title={offsetCopy.shrinkOverride.title}
      subtitle={`${benderName} • ${bendAngle}°`}
      onClose={onCancel}
      onSecondaryPress={onCancel}
      onPrimaryPress={handleApply}>
      <Text style={styles.description}>{offsetCopy.shrinkOverride.description}</Text>

      <FieldInput
        label={offsetCopy.shrinkOverride.fieldLabel}
        value={text}
        onChangeText={setText}
        placeholder={offsetCopy.shrinkOverride.placeholder}
        unit={getLengthUnitLabel(unitSystem)}
        lengthInput={lengthInput}
        error={!isValid ? offsetCopy.shrinkOverride.errorInvalid : undefined}
      />

      <View style={styles.chartCard}>
        <Text style={styles.chartLine}>
          {offsetCopy.shrinkOverride.chartLine(bendAngle, chartShrinkPerInchFormatted)}
        </Text>
        <Text style={styles.hintLine}>{offsetCopy.shrinkOverride.clearHint}</Text>
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
