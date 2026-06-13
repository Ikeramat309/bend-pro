import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, touchTarget, typography } from '@/theme';

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
  const chips = options.map((option) => {
    const active = selected === option;
    return (
      <Pressable
        key={option}
        onPress={() => onSelect(option)}
        style={[styles.chip, active && styles.chipActive]}
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

const styles = StyleSheet.create({
  group: {
    gap: spacing.sm,
  },
  groupTitle: {
    ...typography.label,
    color: colors.muted,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chipScroll: {
    maxHeight: 168,
  },
  chip: {
    minHeight: touchTarget,
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryMuted,
  },
  chipText: {
    ...typography.chip,
    color: colors.text,
  },
  chipTextActive: {
    color: colors.primary,
  },
});
