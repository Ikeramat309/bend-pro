/**
 * Multiplier override bottom sheet — lets the user replace the standard
 * offset angle-table multiplier with a value from their own chart or sticker.
 *
 * Draft state while open; parent updates only on Apply. Blank input clears
 * the override. Shrink still uses the table's shrink-per-inch for the angle.
 */
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MAX_OFFSET_MULTIPLIER } from '@/core/settings';
import type { BendAngle } from '@/core/types';
import { parseStrictPositiveDecimal } from '@/core/validation';
import { FieldInput } from '@/shared/ui';
import { Sheet } from '@/shared/ui/Sheet';
import { colors, spacing, typography } from '@/theme';

import { formatMultiplier } from '../engine/offsetAngleData';
import { offsetCopy } from '../offset.copy';

export type MultiplierOverrideSheetProps = {
  visible: boolean;
  bendAngle: BendAngle;
  benderName: string;
  /** Standard table multiplier for this angle, formatted for display. */
  chartMultiplierFormatted: string;
  currentOverride?: number;
  onCancel: () => void;
  /** `undefined` clears the override (back to the table value). */
  onApply: (override: number | undefined) => void;
};

export function MultiplierOverrideSheet(props: MultiplierOverrideSheetProps) {
  if (!props.visible) {
    return (
      <Sheet
        visible={false}
        title={offsetCopy.multiplierOverride.title}
        onClose={props.onCancel}
        onSecondaryPress={props.onCancel}
      />
    );
  }

  return <MultiplierOverrideSheetOpen {...props} />;
}

/** Mounted only while open — draft text resets from the stored override. */
function MultiplierOverrideSheetOpen({
  bendAngle,
  benderName,
  chartMultiplierFormatted,
  currentOverride,
  onCancel,
  onApply,
}: MultiplierOverrideSheetProps) {
  const [text, setText] = useState(() =>
    currentOverride !== undefined ? formatMultiplier(currentOverride) : '',
  );

  const isBlank = text.trim() === '';
  const parsed = parseStrictPositiveDecimal(text);
  const isValid = isBlank || (parsed !== undefined && parsed <= MAX_OFFSET_MULTIPLIER);

  function handleApply() {
    if (!isValid) return;
    onApply(isBlank ? undefined : parsed);
  }

  return (
    <Sheet
      visible
      title={offsetCopy.multiplierOverride.title}
      subtitle={`${benderName} • ${bendAngle}°`}
      onClose={onCancel}
      onSecondaryPress={onCancel}
      onPrimaryPress={handleApply}>
      <Text style={styles.description}>{offsetCopy.multiplierOverride.description}</Text>

      <FieldInput
        label={offsetCopy.multiplierOverride.fieldLabel}
        value={text}
        onChangeText={setText}
        placeholder={offsetCopy.multiplierOverride.placeholder}
        inputProps={{ keyboardType: 'decimal-pad' }}
        error={!isValid ? offsetCopy.multiplierOverride.errorInvalid : undefined}
      />

      <View style={styles.chartCard}>
        <Text style={styles.chartLine}>
          {offsetCopy.multiplierOverride.chartLine(bendAngle, chartMultiplierFormatted)}
        </Text>
        <Text style={styles.hintLine}>{offsetCopy.multiplierOverride.clearHint}</Text>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  description: {
    ...typography.subtitle,
    color: colors.muted,
  },
  chartCard: {
    gap: spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  chartLine: {
    ...typography.subtitle,
    color: colors.text,
  },
  hintLine: {
    ...typography.subtitle,
    color: colors.muted,
  },
});
