import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, uiTheme } from '@/theme';

export type AppScreenProps = {
  children: ReactNode;
  /** Wrap body in ScrollView for form-style screens. */
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  footer?: ReactNode;
};

/** Standard full-screen shell: safe area, background, optional scroll and footer slot. */
export function AppScreen({ children, scroll = false, contentStyle, footer }: AppScreenProps) {
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.body, contentStyle]}>{children}</View>
  );

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        {body}
      </SafeAreaView>
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  scrollContent: {
    width: '100%',
    maxWidth: uiTheme.layout.maxContentWidth,
    alignSelf: 'center',
    padding: uiTheme.layout.screenPadding,
    paddingBottom: uiTheme.layout.sectionBottom,
    gap: uiTheme.hub.contentGap,
  },
});
