import { Pressable, StyleSheet, Text, View } from 'react-native';

import { layout } from '@/theme/spacing';
import { fontSize, fontWeight } from '@/theme/typography';
import { workspaceColors, workspaceSpacing } from '@/theme/workspaceTheme';

type CalculatorHeaderProps = {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  onMenuPress?: () => void;
};

export function CalculatorHeader({
  title,
  subtitle,
  onBackPress,
  onMenuPress,
}: CalculatorHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onBackPress}
        style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
        accessibilityRole="button"
        accessibilityLabel="Go back">
        <Text style={styles.iconGlyph}>‹</Text>
      </Pressable>

      <View style={styles.titleBlock}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <Pressable
        onPress={onMenuPress}
        style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
        accessibilityRole="button"
        accessibilityLabel="Open menu">
        <Text style={styles.menuGlyph}>⋯</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: layout.topBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: workspaceSpacing.md,
    paddingVertical: workspaceSpacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: workspaceColors.border,
    backgroundColor: workspaceColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPressed: {
    opacity: 0.88,
  },
  iconGlyph: {
    color: workspaceColors.textPrimary,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: fontWeight.semibold,
    marginTop: -2,
  },
  menuGlyph: {
    color: workspaceColors.textPrimary,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: fontWeight.bold,
    letterSpacing: 1,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    color: workspaceColors.textPrimary,
    fontSize: fontSize.lg,
    lineHeight: 24,
    fontWeight: fontWeight.semibold,
  },
  subtitle: {
    color: workspaceColors.textMuted,
    fontSize: fontSize.sm,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
  },
});
