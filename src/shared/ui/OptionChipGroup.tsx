import { Pressable, StyleSheet, Text, View } from 'react-native';

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
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.chipWrap}>
        {options.map((option) => {
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
        })}
      </View>
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
