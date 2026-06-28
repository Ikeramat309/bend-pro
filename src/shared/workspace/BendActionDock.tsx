import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing, typography, useTheme, workspaceTheme, type ThemePalette } from '@/theme';

import type { BendActionDockConfig } from './workspaceTypes';

export type BendActionDockProps = BendActionDockConfig;

/** Adaptive calculator action dock — left actions plus Guide on the right. */
export function BendActionDock({ left, guide }: BendActionDockProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
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

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingTop: workspaceTheme.dock.paddingTop,
      // Continuous surface — quiet borderless actions, no dock bar.
      backgroundColor: 'transparent',
    },
    left: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: spacing.lg,
    },
    action: {
      minHeight: workspaceTheme.dock.actionMinHeight,
      paddingVertical: spacing.xs + 2,
      justifyContent: 'center',
    },
    actionEmphasis: {},
    actionPressed: {
      opacity: workspaceTheme.dock.pressedOpacity,
    },
    actionDisabled: {
      opacity: workspaceTheme.dock.disabledOpacity,
    },
    actionText: {
      ...typography.label,
      color: c.muted,
      fontWeight: '600',
      fontSize: 14,
    },
    actionTextEmphasis: {
      color: c.primary,
      fontWeight: '700',
    },
    actionTextDisabled: {
      color: c.muted,
    },
    guide: {
      minHeight: workspaceTheme.dock.actionMinHeight,
      paddingVertical: spacing.xs + 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    guideText: {
      ...typography.label,
      color: c.primary,
      fontWeight: '700',
      fontSize: 14,
    },
  });
}
