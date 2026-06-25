import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, touchTarget, typography, workspaceTheme } from '@/theme';

import type { BendActionDockConfig } from './workspaceTypes';

export type BendActionDockProps = BendActionDockConfig;

/** Adaptive calculator action dock — left actions plus Guide on the right. */
export function BendActionDock({ left, guide }: BendActionDockProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <View style={styles.left}>
        {left.map((action, index) => {
          const emphasized =
            action.variant === 'emphasis' ||
            (action.variant !== 'default' && index === left.length - 1 && left.length > 1);

          return (
            <Pressable
              key={action.key}
              onPress={action.onPress}
              disabled={action.disabled}
              style={({ pressed }) => [
                styles.action,
                emphasized && styles.actionEmphasis,
                action.disabled && styles.actionDisabled,
                pressed && !action.disabled && styles.actionPressed,
              ]}
              accessibilityRole="button">
              <Text
                style={[
                  styles.actionText,
                  emphasized && styles.actionTextEmphasis,
                  action.disabled && styles.actionTextDisabled,
                ]}>
                {action.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {guide ? (
        <Pressable
          onPress={guide.onPress}
          style={({ pressed }) => [styles.guide, pressed && styles.actionPressed]}
          accessibilityRole="button">
          <Text style={styles.guideText}>{guide.label ?? 'Guide'}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.screen,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  action: {
    minHeight: touchTarget - 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  actionEmphasis: {
    borderColor: workspaceTheme.dock.actionEmphasisBorder,
    backgroundColor: workspaceTheme.dock.actionEmphasisBackground,
  },
  actionPressed: {
    opacity: 0.88,
  },
  actionDisabled: {
    opacity: 0.45,
  },
  actionText: {
    ...typography.label,
    color: colors.text,
    fontWeight: '600',
    fontSize: 13,
  },
  actionTextEmphasis: {
    color: workspaceTheme.dock.actionEmphasisText,
    fontWeight: '700',
  },
  actionTextDisabled: {
    color: colors.muted,
  },
  guide: {
    minHeight: touchTarget - 10,
    minWidth: 76,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideText: {
    ...typography.label,
    color: colors.muted,
    fontWeight: '700',
    fontSize: 13,
  },
});
