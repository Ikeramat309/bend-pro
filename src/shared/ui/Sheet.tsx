import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing, touchTarget, typography, uiTheme, useTheme, type ThemePalette } from '@/theme';

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
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
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
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
              accessibilityRole="button">
              <Text style={styles.secondaryText}>{secondaryLabel}</Text>
            </Pressable>
            {onPrimaryPress ? (
              <Pressable
                onPress={onPrimaryPress}
                style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
                accessibilityRole="button">
                <Text style={styles.primaryText}>{primaryLabel}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: uiTheme.sheet.backdrop,
    },
    sheet: {
      width: '100%',
      maxWidth: uiTheme.layout.maxContentWidth,
      alignSelf: 'center',
      maxHeight: uiTheme.sheet.maxHeight,
      borderTopLeftRadius: uiTheme.sheet.borderRadius,
      borderTopRightRadius: uiTheme.sheet.borderRadius,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: c.border,
      backgroundColor: c.screen,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      gap: spacing.lg,
    },
    handle: {
      width: 40,
      height: 4,
      alignSelf: 'center',
      borderRadius: 999,
      backgroundColor: c.border,
    },
    header: {
      gap: spacing.xs,
    },
    title: {
      color: c.text,
      fontSize: 18,
      fontWeight: '700',
      lineHeight: 24,
    },
    subtitle: {
      ...typography.subtitle,
      color: c.muted,
      fontSize: 14,
    },
    content: {
      gap: spacing.lg,
      paddingBottom: spacing.xs,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    secondaryButton: {
      flex: 1,
      minHeight: touchTarget - 4,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: uiTheme.chip.borderRadius,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    primaryButton: {
      flex: 1,
      minHeight: touchTarget - 4,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: uiTheme.chip.borderRadius,
      backgroundColor: c.primary,
    },
    buttonPressed: {
      opacity: 0.88,
    },
    secondaryText: {
      ...typography.chip,
      color: c.text,
      fontWeight: '600',
    },
    primaryText: {
      ...typography.chip,
      color: c.background,
      fontWeight: '700',
    },
  });
}
