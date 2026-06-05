import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { layout } from '@/theme/spacing';
import { workspaceColors, workspaceSpacing } from '@/theme/workspaceTheme';

type AppScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export function AppScreen({
  children,
  scroll = false,
  contentStyle,
  edges = ['top', 'left', 'right'],
}: AppScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView style={styles.safe} edges={edges}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: workspaceColors.background,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: workspaceSpacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: workspaceSpacing.lg,
    paddingBottom: workspaceSpacing.section,
    gap: workspaceSpacing.lg,
  },
});
