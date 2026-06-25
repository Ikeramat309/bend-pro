import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, spacing, typography, workspaceTheme } from '@/theme';

export type PipeWorkspaceCardProps = {
  children: ReactNode;
  title?: string;
  variant?: 'default' | 'highlight';
  onPress?: () => void;
};

/** Card shell for pipe diagrams and calculator workspace content. */
export function PipeWorkspaceCard({
  children,
  title,
  variant = 'default',
  onPress,
}: PipeWorkspaceCardProps) {
  const isWorkspace = variant === 'highlight';
  const cardStyle: StyleProp<ViewStyle> = [
    styles.card,
    isWorkspace && styles.cardWorkspace,
  ];
  const body = (
    <>
      {title ? (
        <Text style={[styles.title, isWorkspace && styles.titleWorkspace]}>{title}</Text>
      ) : null}
      {children}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [...cardStyle, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={title ? `View ${title}` : 'View workspace'}>
        {body}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{body}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    gap: spacing.lg,
    overflow: 'hidden',
  },
  cardWorkspace: {
    flex: 1,
    minHeight: 0,
    padding: 0,
    gap: 0,
    borderColor: workspaceTheme.workspace.cardBorderColor,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: 0.92,
  },
  title: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '700',
  },
  titleWorkspace: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.muted,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
});
