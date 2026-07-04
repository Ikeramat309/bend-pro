/**
 * Multiplier override bottom sheet for Kick 90.
 */
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MAX_OFFSET_MULTIPLIER } from '@/core/settings';
import type { BendAngle } from '@/core/types';
import { parseStrictPositiveDecimal } from '@/core/validation';
import { FieldInput } from '@/shared/ui';
import { Sheet } from '@/shared/ui/Sheet';
import { spacing, typography, useTheme, type ThemePalette } from '@/theme';

import { formatKick90Multiplier } from '../engine/kick90AngleData';
import { kick90Copy } from '../kick90.copy';

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
        title={kick90Copy.multiplierOverride.title}
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
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [text, setText] = useState(() =>
    currentOverride !== undefined ? formatKick90Multiplier(currentOverride) : '',
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
      title={kick90Copy.multiplierOverride.title}
      subtitle={`${benderName} • ${bendAngle}°`}
      onClose={onCancel}
      onSecondaryPress={onCancel}
      onPrimaryPress={handleApply}>
      <Text style={styles.description}>{kick90Copy.multiplierOverride.description}</Text>

      <FieldInput
        label={kick90Copy.multiplierOverride.fieldLabel}
        value={text}
        onChangeText={setText}
        placeholder={kick90Copy.multiplierOverride.placeholder}
        inputProps={{ keyboardType: 'decimal-pad' }}
        error={!isValid ? kick90Copy.multiplierOverride.errorInvalid : undefined}
      />

      <View style={styles.chartCard}>
        <Text style={styles.chartLine}>
          {kick90Copy.multiplierOverride.chartLine(bendAngle, chartMultiplierFormatted)}
        </Text>
        <Text style={styles.hintLine}>{kick90Copy.multiplierOverride.clearHint}</Text>
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
