import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

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
  const cardStyle = [styles.card, variant === 'highlight' && styles.cardHighlight];
  const body = (
    <>
      {title ? <Text style={styles.title}>{title}</Text> : null}
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
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    gap: spacing.lg,
    overflow: 'hidden',
  },
  cardHighlight: {
    borderColor: colors.primary,
    backgroundColor: colors.surface2,
  },
  pressed: {
    opacity: 0.92,
  },
  title: {
    ...typography.label,
    color: colors.primary,
    fontWeight: '700',
  },
});
