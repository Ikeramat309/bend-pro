/**
 * Bender database — browse generic and custom profiles; set the active profile.
 */
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  patchCalculatorSetup,
  useCalculatorSetup,
} from '@/core/settings';
import {
  DEFAULT_BENDER_PROFILE_ID,
  filterAllBenderProfiles,
  formatProfileStub90Summary,
  isBenderProfileNameTaken,
  MAX_CUSTOM_BENDER_PROFILES,
  mergeBenderProfiles,
  type BenderProfile,
  type CustomBenderProfileStored,
} from '@/data/benders';
import { Routes } from '@/navigation';
import { CustomBenderSheet } from '@/screens/CustomBenderSheet';
import { AppHeader, AppScreen, BottomNav, FieldInput, type BendTabId } from '@/shared/ui';
import { colors, radius, spacing, typography } from '@/theme';

type SheetState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; profile: CustomBenderProfileStored };

export function BenderDatabaseScreen() {
  const router = useRouter();
  const { setup, setSetup } = useCalculatorSetup();
  const [searchText, setSearchText] = useState('');
  const [sheetState, setSheetState] = useState<SheetState>({ mode: 'closed' });
  const [sheetError, setSheetError] = useState<string | undefined>();

  const customProfiles = setup.customBenderProfiles;
  const allProfiles = useMemo(() => mergeBenderProfiles(customProfiles), [customProfiles]);
  const profiles = useMemo(
    () => filterAllBenderProfiles(searchText, customProfiles),
    [customProfiles, searchText],
  );
  const activeProfileId = setup.benderProfileId;
  const canAddCustom = customProfiles.length < MAX_CUSTOM_BENDER_PROFILES;

  function handleTabChange(tab: BendTabId) {
    if (tab === 'layout') router.push(Routes.home);
    if (tab === 'bends') router.push(Routes.bends);
    if (tab === 'benders') router.push(Routes.benderDatabase);
    if (tab === 'guide') router.push(Routes.guide);
  }

  function selectProfile(profileId: string) {
    setSetup(patchCalculatorSetup(setup, { benderProfileId: profileId }));
  }

  function saveCustomProfile(profile: CustomBenderProfileStored) {
    if (isBenderProfileNameTaken(profile.name, customProfiles, profile.id)) {
      setSheetError('A profile with this name already exists.');
      return;
    }

    setSheetError(undefined);

    const isEdit = customProfiles.some((entry) => entry.id === profile.id);
    const nextCustom = isEdit
      ? customProfiles.map((entry) => (entry.id === profile.id ? profile : entry))
      : [...customProfiles, profile];

    const patch: Parameters<typeof patchCalculatorSetup>[1] = {
      customBenderProfiles: nextCustom,
    };

    if (sheetState.mode === 'create') {
      patch.benderProfileId = profile.id;
    }

    setSetup(patchCalculatorSetup(setup, patch));
    setSheetState({ mode: 'closed' });
  }

  function deleteCustomProfile(profileId: string) {
    const nextCustom = customProfiles.filter((entry) => entry.id !== profileId);
    const patch: Parameters<typeof patchCalculatorSetup>[1] = {
      customBenderProfiles: nextCustom,
    };

    if (setup.benderProfileId === profileId) {
      patch.benderProfileId = DEFAULT_BENDER_PROFILE_ID;
    }

    setSetup(patchCalculatorSetup(setup, patch));
    setSheetState({ mode: 'closed' });
  }

  const profileCountLabel = `${allProfiles.length} profile${allProfiles.length === 1 ? '' : 's'}`;

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Benders"
        subtitle={profileCountLabel}
        rightIcon={<Text style={styles.topIcon}>⚙</Text>}
        onRightPress={() => router.push(Routes.settings)}
      />

      <AppScreen scroll contentStyle={styles.content}>
        <Text style={styles.intro}>
          Generic field-reference charts and your custom measured deducts. These are not manufacturer
          shoe charts — use manual override on a calculator if a single size differs.
        </Text>

        {canAddCustom ? (
          <Pressable
            onPress={() => setSheetState({ mode: 'create' })}
            style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
            accessibilityRole="button">
            <Text style={styles.addButtonText}>+ Add Custom Bender</Text>
          </Pressable>
        ) : (
          <Text style={styles.limitHint}>
            Maximum of {MAX_CUSTOM_BENDER_PROFILES} custom benders saved. Edit or delete one to add
            another.
          </Text>
        )}

        <FieldInput
          label="Search"
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Name or description"
        />

        <View style={styles.list}>
          {profiles.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No matching profiles</Text>
              <Text style={styles.emptyBody}>Try a different search term.</Text>
            </View>
          ) : (
            profiles.map((profile) => (
              <BenderProfileCard
                key={profile.id}
                profile={profile}
                isActive={profile.id === activeProfileId}
                onSelect={() => selectProfile(profile.id)}
                onEdit={
                  profile.category === 'custom'
                    ? () => {
                        const stored = customProfiles.find((entry) => entry.id === profile.id);
                        if (stored) setSheetState({ mode: 'edit', profile: stored });
                      }
                    : undefined
                }
              />
            ))
          )}
        </View>
      </AppScreen>

      <CustomBenderSheet
        visible={sheetState.mode !== 'closed'}
        mode={sheetState.mode === 'edit' ? 'edit' : 'create'}
        profile={sheetState.mode === 'edit' ? sheetState.profile : undefined}
        onCancel={() => {
          setSheetState({ mode: 'closed' });
          setSheetError(undefined);
        }}
        onSave={saveCustomProfile}
        saveError={sheetError}
        onDelete={
          sheetState.mode === 'edit'
            ? () => deleteCustomProfile(sheetState.profile.id)
            : undefined
        }
      />

      <BottomNav activeTab="benders" onTabChange={handleTabChange} />
    </View>
  );
}

type BenderProfileCardProps = {
  profile: BenderProfile;
  isActive: boolean;
  onSelect: () => void;
  onEdit?: () => void;
};

function BenderProfileCard({ profile, isActive, onSelect, onEdit }: BenderProfileCardProps) {
  const categoryLabel = profile.category.charAt(0).toUpperCase() + profile.category.slice(1);

  return (
    <View style={[styles.card, isActive && styles.cardActive]}>
      <Pressable
        onPress={onSelect}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
        style={({ pressed }) => [styles.cardBody, pressed && styles.cardPressed]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleBlock}>
            <Text style={styles.cardTitle}>{profile.name}</Text>
            <Text style={styles.cardCategory}>{categoryLabel}</Text>
          </View>
          {isActive ? (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.cardDescription}>{profile.description}</Text>
        <Text style={styles.cardDeducts}>
          Stub 90 deduct: {formatProfileStub90Summary(profile)}
        </Text>
      </Pressable>

      {onEdit ? (
        <Pressable
          onPress={onEdit}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${profile.name}`}
          style={({ pressed }) => [styles.editButton, pressed && styles.cardPressed]}>
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.section,
  },
  topIcon: {
    color: colors.text,
    fontSize: 20,
  },
  intro: {
    ...typography.subtitle,
    color: colors.muted,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryMuted,
    paddingVertical: spacing.md,
  },
  addButtonPressed: {
    opacity: 0.9,
  },
  addButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '700',
  },
  limitHint: {
    ...typography.subtitle,
    color: colors.muted,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  cardBody: {
    gap: spacing.sm,
    padding: spacing.lg,
  },
  cardActive: {
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryMuted,
  },
  cardPressed: {
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  cardTitleBlock: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  cardCategory: {
    ...typography.subtitle,
    color: colors.muted,
    fontSize: 12,
  },
  editButton: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.sm,
  },
  editButtonText: {
    ...typography.tabLabel,
    color: colors.primary,
    fontWeight: '600',
  },
  cardDescription: {
    ...typography.subtitle,
    color: colors.muted,
  },
  cardDeducts: {
    ...typography.subtitle,
    color: colors.text,
    fontWeight: '600',
  },
  activeBadge: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  activeBadgeText: {
    ...typography.tabLabel,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  emptyCard: {
    gap: spacing.xs,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  emptyTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  emptyBody: {
    ...typography.subtitle,
    color: colors.muted,
  },
});
