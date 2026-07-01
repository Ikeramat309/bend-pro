import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing, touchTarget, typography, useTheme, workspaceTheme, type ThemePalette } from '@/theme';

import type { BendActionDockConfig, BendDockAction } from './workspaceTypes';

export type BendActionDockProps = BendActionDockConfig;

function DockAction({
  action,
  emphasized,
  styles,
}: {
  action: BendDockAction;
  emphasized: boolean;
  styles: ReturnType<typeof makeStyles>;
}) {
  const isPill = action.variant === 'pill';

  return (
    <Pressable
      onPress={action.onPress}
      disabled={action.disabled}
      style={({ pressed }) => [
        styles.action,
        emphasized && styles.actionEmphasis,
        isPill && styles.actionPill,
        action.disabled && styles.actionDisabled,
        pressed && !action.disabled && styles.actionPressed,
      ]}
      accessibilityRole="button">
      <Text
        style={[
          styles.actionText,
          emphasized && styles.actionTextEmphasis,
          isPill && styles.actionTextPill,
          action.disabled && styles.actionTextDisabled,
        ]}>
        {action.label}
      </Text>
    </Pressable>
  );
}

/** Adaptive calculator action dock — left actions, optional center action, Guide on the right. */
export function BendActionDock({ left, center, guide }: BendActionDockProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const balanced = Boolean(center);

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <View style={balanced ? styles.slotLeft : styles.left}>
        {left.map((action, index) => {
          const emphasized =
            !balanced &&
            (action.variant === 'emphasis' ||
              (action.variant !== 'default' && index === left.length - 1 && left.length > 1));

          return <DockAction key={action.key} action={action} emphasized={emphasized} styles={styles} />;
        })}
      </View>

      {center ? (
        <View style={styles.slotCenter}>
          <DockAction action={center} emphasized={false} styles={styles} />
        </View>
      ) : null}

      <View style={balanced ? styles.slotRight : styles.guideSlot}>
        {guide ? (
          <Pressable
            onPress={guide.onPress}
            style={({ pressed }) => [styles.guide, pressed && styles.actionPressed]}
            accessibilityRole="button">
            <Text style={styles.guideText}>{guide.label ?? 'Guide'}</Text>
          </Pressable>
        ) : balanced ? (
          <View style={styles.slotSpacer} />
        ) : null}
      </View>
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
      backgroundColor: 'transparent',
    },
    left: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: spacing.lg,
    },
    slotLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minWidth: 0,
    },
    slotCenter: {
      flex: 1.35,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 0,
    },
    slotRight: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      minWidth: 0,
    },
    guideSlot: {
      flexShrink: 0,
    },
    slotSpacer: {
      minWidth: touchTarget,
      minHeight: workspaceTheme.dock.actionMinHeight,
    },
    action: {
      minHeight: workspaceTheme.dock.actionMinHeight,
      paddingVertical: spacing.xs + 2,
      justifyContent: 'center',
    },
    actionEmphasis: {},
    actionPill: {
      paddingHorizontal: spacing.md,
      borderRadius: workspaceTheme.dock.actionBorderRadius,
      backgroundColor: workspaceTheme.dock.actionEmphasisBackground,
      borderWidth: 1,
      borderColor: workspaceTheme.dock.actionEmphasisBorder,
    },
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
    actionTextPill: {
      color: workspaceTheme.dock.actionEmphasisText,
      fontWeight: '700',
      fontSize: 13,
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
