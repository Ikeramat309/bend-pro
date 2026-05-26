/**
 * FILE: src/screens/BendsScreen.tsx
 *
 * PURPOSE:
 * Bend library tab. This is where users choose a bend calculator without
 * crowding the active calculator screen.
 *
 * IMPORTANT:
 * This screen contains navigation and display only. It does not add calculator
 * logic. Basic Offset is the only active calculator in Phase 5.
 */

// IMPORTS
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppTopBar, BottomNavigation, type BendTabId } from '@/components/bend';
import { BEND_FAMILIES, type BendLibraryItem } from '@/data/bendLibrary';
import { Routes } from '@/navigation';
import { colors, layout, radius, spacing, typography } from '@/theme';

// UI
export function BendsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [comingSoonVisible, setComingSoonVisible] = useState(false);

  const filteredFamilies = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return BEND_FAMILIES;
    }

    return BEND_FAMILIES.map((family) => ({
      ...family,
      items: family.items.filter((item) =>
        `${family.title} ${item.title} ${item.description ?? ''}`.toLowerCase().includes(normalized),
      ),
    })).filter((family) => family.items.length > 0);
  }, [search]);

  function handleTabChange(tab: BendTabId) {
    if (tab === 'layout') router.push(Routes.home);
    if (tab === 'bends') router.push(Routes.bends);
    if (tab === 'benders') router.push(Routes.benderDatabase);
    if (tab === 'guide') router.push(Routes.guide);
  }

  function handleBendPress(item: BendLibraryItem) {
    if (item.status === 'active' && item.title === 'Basic Offset') {
      router.push(Routes.offset);
      return;
    }

    setComingSoonVisible(true);
  }

  return (
    <View style={styles.screen}>
      <AppTopBar
        title="Bends"
        subtitle="Choose a conduit layout"
        rightIcon={<Text style={styles.topIcon}>⚙</Text>}
        onRightPress={() => router.push(Routes.settings)}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search bend type"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          returnKeyType="search"
        />

        {filteredFamilies.map((family) => (
          <View key={family.title} style={styles.familySection}>
            <Text style={styles.familyTitle}>{family.title}</Text>
            <View style={styles.list}>
              {family.items.map((item) => (
                <BendRow key={item.title} item={item} onPress={() => handleBendPress(item)} />
              ))}
            </View>
          </View>
        ))}

        {filteredFamilies.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No bend types found.</Text>
          </View>
        ) : null}
      </ScrollView>

      <BottomNavigation activeTab="bends" onTabChange={handleTabChange} />

      <Modal
        visible={comingSoonVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setComingSoonVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Coming Soon</Text>
            <Text style={styles.modalText}>This bend type is coming soon.</Text>
            <Pressable
              onPress={() => setComingSoonVisible(false)}
              style={styles.modalButton}
              accessibilityRole="button">
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function BendRow({ item, onPress }: { item: BendLibraryItem; onPress: () => void }) {
  const active = item.status === 'active';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && styles.rowPressed,
        !active && styles.rowComingSoon,
      ]}
      accessibilityRole="button">
      <View style={styles.rowText}>
        <View style={styles.rowTitleLine}>
          <Text style={styles.rowTitle}>{item.title}</Text>
          {!active ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Coming Soon</Text>
            </View>
          ) : null}
        </View>
        {item.description ? <Text style={styles.rowDescription}>{item.description}</Text> : null}
      </View>
      <Text style={[styles.chevron, active ? styles.chevronActive : styles.chevronMuted]}>›</Text>
    </Pressable>
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
  searchInput: {
    minHeight: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    color: colors.text,
    ...typography.body,
  },
  familySection: {
    gap: spacing.md,
  },
  familyTitle: {
    ...typography.label,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  list: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowPressed: {
    opacity: 0.88,
  },
  rowComingSoon: {
    opacity: 0.72,
  },
  rowText: {
    flex: 1,
    gap: spacing.xs,
  },
  rowTitleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  rowTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  rowDescription: {
    ...typography.subtitle,
    color: colors.muted,
  },
  badge: {
    borderRadius: radius.full,
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.background,
  },
  chevron: {
    fontSize: 28,
    lineHeight: 32,
  },
  chevronActive: {
    color: colors.primary,
  },
  chevronMuted: {
    color: colors.muted,
  },
  emptyCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.muted,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: 'rgba(5, 7, 11, 0.82)',
  },
  modalCard: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.screen,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  modalText: {
    ...typography.body,
    color: colors.muted,
  },
  modalButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    ...typography.chip,
    color: colors.background,
  },
});

// EXPORTS — BendsScreen
