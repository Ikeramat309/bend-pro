import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import {
  DEFAULT_BENDER_PROFILE_ID,
  filterAllBenderProfiles,
  getBenderProfile,
  isBenderProfileNameTaken,
  isKnownBenderProfileId,
  MAX_CUSTOM_BENDER_PROFILES,
  mergeBenderProfiles,
  splitProfilesByChartKind,
  type BenderProfile,
  type CustomBenderProfileStored,
} from '@/data/benders';
import { benderDatabaseRoute, Routes } from '@/navigation';
import { BenderProfileDetailSheet } from '@/screens/BenderProfileDetailSheet';
import { CustomBenderSheet } from '@/screens/CustomBenderSheet';
import {
  AppHeader,
  AppScreen,
  BenderProfileCard,
  BottomNav,
  HubAddButton,
  HubEmptyState,
  HubSearchField,
  HubSectionTitle,
  SetupOverridesCard,
  type BendTabId,
} from '@/shared/ui';
import { spacing, typography, uiTheme, useTheme, type ThemePalette } from '@/theme';

type SheetState =
  | { mode: 'closed' }
  | { mode: 'create' }
  | { mode: 'edit'; profile: CustomBenderProfileStored };

export function BenderDatabaseScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { profile: profileParam } = useLocalSearchParams<{ profile?: string | string[] }>();
  const profileIdFromRoute = Array.isArray(profileParam) ? profileParam[0] : profileParam;

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
  const { manufacturer, generic, custom } = useMemo(
    () => splitProfilesByChartKind(profiles),
    [profiles],
  );
  const activeProfileId = setup.benderProfileId;
  const canAddCustom = customProfiles.length < MAX_CUSTOM_BENDER_PROFILES;
  const detailProfileId =
    profileIdFromRoute && isKnownBenderProfileId(profileIdFromRoute, customProfiles)
      ? profileIdFromRoute
      : undefined;
  const detailProfile = detailProfileId
    ? getBenderProfile(detailProfileId, customProfiles)
    : undefined;

  function handleTabChange(tab: BendTabId) {
    if (tab === 'layout') router.push(Routes.home);
    if (tab === 'bends') router.push(Routes.bends);
    if (tab === 'benders') router.push(Routes.benderDatabase);
    if (tab === 'guide') router.push(Routes.guide);
  }

  function selectProfile(profileId: string) {
    setSetup(patchCalculatorSetup(setup, { benderProfileId: profileId }));
  }

  function openProfileDetail(profile: BenderProfile) {
    router.push(benderDatabaseRoute(profile.id));
  }

  function closeProfileDetail() {
    const safeRouter = router as typeof router & { canGoBack?: () => boolean };
    if (typeof safeRouter.canGoBack === 'function' && safeRouter.canGoBack()) {
      router.back();
      return;
    }
    router.replace(Routes.benderDatabase);
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
    router.push(benderDatabaseRoute(profile.id));
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
    if (detailProfileId === profileId) {
      closeProfileDetail();
    }
  }

  function renderProfileList(items: readonly BenderProfile[]) {
    return items.map((profile) => (
      <BenderProfileCard
        key={profile.id}
        profile={profile}
        isActive={profile.id === activeProfileId}
        onSelect={() => selectProfile(profile.id)}
        onViewChart={() => openProfileDetail(profile)}
        onEdit={
          profile.category === 'custom'
            ? () => {
                const stored = customProfiles.find((entry) => entry.id === profile.id);
                if (stored) setSheetState({ mode: 'edit', profile: stored });
              }
            : undefined
        }
      />
    ));
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
          Manufacturer charts from published specs, generic field references, and your own measured
          benders. Tap Chart on a profile for the full table and sources.
        </Text>

        <SetupOverridesCard />

        {canAddCustom ? (
          <HubAddButton label="+ Add Custom Bender" onPress={() => setSheetState({ mode: 'create' })} />
        ) : (
          <Text style={styles.limitHint}>
            Maximum of {MAX_CUSTOM_BENDER_PROFILES} custom benders saved. Edit or delete one to add
            another.
          </Text>
        )}

        <HubSearchField
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search bender name"
        />

        {profiles.length === 0 ? (
          <HubEmptyState title="No matching profiles" body="Try a different search term." />
        ) : (
          <View style={styles.list}>
            {manufacturer.length > 0 ? (
              <View style={styles.section}>
                <HubSectionTitle>Manufacturer charts</HubSectionTitle>
                {renderProfileList(manufacturer)}
              </View>
            ) : null}

            {generic.length > 0 ? (
              <View style={styles.section}>
                <HubSectionTitle>Generic charts</HubSectionTitle>
                {renderProfileList(generic)}
              </View>
            ) : null}

            {custom.length > 0 ? (
              <View style={styles.section}>
                <HubSectionTitle>Your benders</HubSectionTitle>
                {renderProfileList(custom)}
              </View>
            ) : null}
          </View>
        )}
      </AppScreen>

      {detailProfile ? (
        <BenderProfileDetailSheet
          visible
          profile={detailProfile}
          setup={setup}
          isActive={detailProfile.id === activeProfileId}
          onClose={closeProfileDetail}
          onSelect={() => {
            selectProfile(detailProfile.id);
            closeProfileDetail();
          }}
          onEdit={
            detailProfile.category === 'custom'
              ? () => {
                  const stored = customProfiles.find((entry) => entry.id === detailProfile.id);
                  if (stored) {
                    closeProfileDetail();
                    setSheetState({ mode: 'edit', profile: stored });
                  }
                }
              : undefined
          }
        />
      ) : null}

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

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: c.background,
    },
    content: {
      gap: uiTheme.hub.sectionGap,
      paddingBottom: uiTheme.layout.sectionBottom,
    },
    topIcon: {
      color: c.text,
      fontSize: 20,
    },
    intro: {
      ...uiTheme.hub.intro,
      color: c.muted,
    },
    limitHint: {
      ...typography.subtitle,
      color: c.muted,
    },
    list: {
      gap: uiTheme.hub.sectionGap,
    },
    section: {
      gap: spacing.sm,
    },
  });
}
