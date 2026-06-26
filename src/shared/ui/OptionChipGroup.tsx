import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { spacing, typography, uiTheme, useTheme, type ThemePalette } from '@/theme';

export type OptionChipGroupProps<T extends string> = {
  title: string;
  options: readonly T[];
  selected: T;
  onSelect: (value: T) => void;
};

/** Titled row of selectable chips — used by setup sheets and settings. */
export function OptionChipGroup<T extends string>({
  title,
  options,
  selected,
  onSelect,
}: OptionChipGroupProps<T>) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const chips = options.map((option) => {
    const active = selected === option;
    return (
      <Pressable
        key={option}
        onPress={() => onSelect(option)}
        style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.chipPressed]}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}>
        <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
      </Pressable>
    );
  });

  const chipContainer =
    options.length > 6 ? (
      <ScrollView
        style={styles.chipScroll}
        contentContainerStyle={styles.chipWrap}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}>
        {chips}
      </ScrollView>
    ) : (
      <View style={styles.chipWrap}>{chips}</View>
    );

  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      {chipContainer}
    </View>
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    group: {
      gap: spacing.sm,
    },
    groupTitle: { ...uiTheme.chip.groupTitle, color: c.muted },
    chipWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    chipScroll: {
      maxHeight: 168,
    },
    chip: {
      minHeight: uiTheme.chip.minHeight,
      justifyContent: 'center',
      borderRadius: uiTheme.chip.borderRadius,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface2,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    chipActive: {
      borderColor: c.primaryBorder,
      backgroundColor: c.primaryMuted,
    },
    chipPressed: {
      opacity: 0.88,
    },
    chipText: {
      ...typography.chip,
      color: c.text,
      fontSize: 13,
    },
    chipTextActive: {
      color: c.primary,
      fontWeight: '700',
    },
  });
}
