/**
 * FILE: src/screens/HomeScreen.tsx
 *
 * PURPOSE: App home hub — navigation cards to main areas.
 * INPUTS:  None (static links).
 * OUTPUTS: UI only; uses expo-router to change screens.
 *
 * DATA FLOW: User tap → router.push(Routes.*) → Expo loads src/app/[route].tsx
 */

// IMPORTS
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppTopBar, BottomNavigation, type BendTabId } from '@/components/bend';
import { Routes } from '@/navigation';
import { colors, layout, radius, spacing, typography } from '@/theme';

// CONSTANTS — menu items (add new calculators here later)
const NAV_ITEMS = [
  { label: 'Continue Layout', description: 'Open Basic Offset', route: Routes.offset },
  { label: 'Bend Library', description: 'Choose a conduit layout', route: Routes.bends },
  { label: 'Bender Database', description: 'Manage benders and shoes', route: Routes.benderDatabase },
] as const;

// UI
export function HomeScreen() {
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
        title="Bend Pro"
        subtitle="Layout"
        badge="Beta"
        rightIcon={<Text style={styles.topIcon}>⚙</Text>}
        onRightPress={() => router.push(Routes.settings)}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.navSection}>
          <Text style={styles.sectionTitle}>Start</Text>
          {NAV_ITEMS.map((item) => (
            <Pressable key={item.label} onPress={() => router.push(item.route)}>
              <View style={styles.navButton}>
                <View style={styles.navText}>
                  <Text style={styles.navLabel}>{item.label}</Text>
                  <Text style={styles.navDescription}>{item.description}</Text>
                </View>
                <Text style={styles.navArrow}>›</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <BottomNavigation activeTab="layout" onTabChange={handleTabChange} />
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
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.section,
    gap: spacing.xxl,
  },
  topIcon: {
    color: colors.text,
    fontSize: 20,
  },
  navSection: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  navButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 72,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  navText: {
    flex: 1,
    gap: spacing.xs,
  },
  navLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  navDescription: {
    ...typography.subtitle,
    color: colors.muted,
  },
  navArrow: {
    color: colors.primary,
    fontSize: 28,
    lineHeight: 32,
  },
});

// EXPORTS — HomeScreen
