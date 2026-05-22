import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth } from '@/constants/theme';
import {
  CalculatorSpacing,
  CalculatorTypography,
  useCalculatorTheme,
} from '@/theme';

export type CalculatorLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  showBack?: boolean;
  onBack?: () => void;
};

export function CalculatorLayout({
  title,
  subtitle,
  children,
  footer,
  contentContainerStyle,
}: CalculatorLayoutProps) {
  const colors = useCalculatorTheme();

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <ThemedText style={[styles.title, { color: colors.text }]}>{title}</ThemedText>
          {subtitle ? (
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</ThemedText>
          ) : null}
        </View>

        <View style={styles.body}>{children}</View>

        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: CalculatorSpacing.lg,
    paddingBottom: CalculatorSpacing.xxl,
    gap: CalculatorSpacing.lg,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    gap: CalculatorSpacing.sm,
    paddingTop: CalculatorSpacing.md,
  },
  title: {
    ...CalculatorTypography.title,
  },
  subtitle: {
    ...CalculatorTypography.subtitle,
  },
  body: {
    gap: CalculatorSpacing.lg,
  },
  footer: {
    gap: CalculatorSpacing.md,
    marginTop: CalculatorSpacing.sm,
  },
});
