import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, layout, spacing, touchTarget, typography } from '@/theme';

export type SheetProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children?: ReactNode;
  primaryLabel?: string;
  onPrimaryPress?: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
};

/** Bottom sheet shell for setup and modal flows. */
export function Sheet({
  visible,
  title,
  subtitle,
  onClose,
  children,
  primaryLabel = 'Apply',
  onPrimaryPress,
  secondaryLabel = 'Cancel',
  onSecondaryPress,
}: SheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              onPress={onSecondaryPress ?? onClose}
              style={styles.secondaryButton}
              accessibilityRole="button">
              <Text style={styles.secondaryText}>{secondaryLabel}</Text>
            </Pressable>
            {onPrimaryPress ? (
              <Pressable onPress={onPrimaryPress} style={styles.primaryButton} accessibilityRole="button">
                <Text style={styles.primaryText}>{primaryLabel}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(5, 7, 11, 0.82)',
  },
  sheet: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    maxHeight: '88%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.screen,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  handle: {
    width: 48,
    height: 4,
    alignSelf: 'center',
    borderRadius: 999,
    backgroundColor: colors.border,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.muted,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  primaryButton: {
    flex: 1,
    minHeight: touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  secondaryText: {
    ...typography.chip,
    color: colors.text,
  },
  primaryText: {
    ...typography.chip,
    color: colors.background,
  },
});
