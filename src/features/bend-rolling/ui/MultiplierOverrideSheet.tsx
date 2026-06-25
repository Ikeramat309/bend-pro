/**
 * Multiplier override bottom sheet for Rolling Offset.
 */
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MAX_OFFSET_MULTIPLIER } from '@/core/settings';
import type { BendAngle } from '@/core/types';
import { parseStrictPositiveDecimal } from '@/core/validation';
import { FieldInput } from '@/shared/ui';
import { Sheet } from '@/shared/ui/Sheet';
import { colors, spacing, typography } from '@/theme';

import { formatRollingMultiplier } from '../engine/rollingAngleData';
import { rollingCopy } from '../rolling.copy';

export type MultiplierOverrideSheetProps = {
  visible: boolean;
  bendAngle: BendAngle;
  benderName: string;
  chartMultiplierFormatted: string;
  currentOverride?: number;
  onCancel: () => void;
  onApply: (override: number | undefined) => void;
};

export function MultiplierOverrideSheet(props: MultiplierOverrideSheetProps) {
  if (!props.visible) {
    return (
      <Sheet
        visible={false}
        title={rollingCopy.multiplierOverride.title}
        onClose={props.onCancel}
        onSecondaryPress={props.onCancel}
      />
    );
  }

  return <MultiplierOverrideSheetOpen {...props} />;
}

function MultiplierOverrideSheetOpen({
  bendAngle,
  benderName,
  chartMultiplierFormatted,
  currentOverride,
  onCancel,
  onApply,
}: MultiplierOverrideSheetProps) {
  const [text, setText] = useState(() =>
    currentOverride !== undefined ? formatRollingMultiplier(currentOverride) : '',
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
      title={rollingCopy.multiplierOverride.title}
      subtitle={`${benderName} • ${bendAngle}°`}
      onClose={onCancel}
      onSecondaryPress={onCancel}
      onPrimaryPress={handleApply}>
      <Text style={styles.description}>{rollingCopy.multiplierOverride.description}</Text>

      <FieldInput
        label={rollingCopy.multiplierOverride.fieldLabel}
        value={text}
        onChangeText={setText}
        placeholder={rollingCopy.multiplierOverride.placeholder}
        inputProps={{ keyboardType: 'decimal-pad' }}
        error={!isValid ? rollingCopy.multiplierOverride.errorInvalid : undefined}
      />

      <View style={styles.chartCard}>
        <Text style={styles.chartLine}>
          {rollingCopy.multiplierOverride.chartLine(bendAngle, chartMultiplierFormatted)}
        </Text>
        <Text style={styles.hintLine}>{rollingCopy.multiplierOverride.clearHint}</Text>
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
