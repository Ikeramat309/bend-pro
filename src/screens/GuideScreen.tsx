/**
 * FILE: src/screens/GuideScreen.tsx
 *
 * PURPOSE:
 * Placeholder Guide tab destination for Phase 5 bottom navigation.
 */

// IMPORTS
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppTopBar, BottomNavigation, type BendTabId } from '@/components/bend';
import { Routes } from '@/navigation';
import { colors, layout, radius, spacing, typography } from '@/theme';

// UI
export function GuideScreen() {
  const router = useRouter();

  function handleTabChange(tab: BendTabId) {
    if (tab === 'layout') router.push(Routes.home);
    if (tab === 'bends') router.push(Routes.bends);
    if (tab === 'benders') router.push(Routes.benderDatabase);
    if (tab === 'guide') router.push(Routes.guide);
  }

  return (
    <View style={styles.screen}>
      <AppTopBar
        title="Guide"
        subtitle="Learning content coming soon"
        rightIcon={<Text style={styles.topIcon}>⚙</Text>}
        onRightPress={() => router.push(Routes.settings)}
      />
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Guided learning is coming soon.</Text>
          <Text style={styles.body}>
            Formulas, bend steps, common mistakes, and apprentice-friendly walkthroughs will live here.
          </Text>
        </View>
      </View>
      <BottomNavigation activeTab="guide" onTabChange={handleTabChange} />
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    padding: spacing.lg,
  },
  topIcon: {
    color: colors.text,
    fontSize: 20,
  },
  card: {
    gap: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  title: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  body: {
    ...typography.subtitle,
    color: colors.muted,
  },
});

// EXPORTS — GuideScreen
