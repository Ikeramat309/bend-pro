/**
 * FILE: src/calculators/offset/OffsetScreen.tsx
 *
 * PURPOSE:
 * Full user-facing Offset Bend calculator screen.
 *
 * DATA FLOW:
 * 1. User types/selects values in this screen.
 * 2. React state stores those values as strings/options.
 * 3. useMemo sends clean numbers into calculateOffset().
 * 4. calculateOffset() returns formatted results.
 * 5. ResultCard displays the results.
 *
 * IMPORTANT:
 * This file is UI only.
 * The math stays in offset.logic.ts.
 */

// IMPORTS
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  ActionResultCard,
  AngleSelector,
  AppTopBar,
  BigMeasurementInput,
  DrawerRow,
  EditSetupSheet,
  MarkingGuide,
  SetupChip,
  type BendAngleOption,
  type OffsetSetupValues,
  type SetupBender,
} from '@/components/bend';
import { BEND_FAMILIES, type BendLibraryItem } from '@/data/bendLibrary';
import { colors, layout, spacing } from '@/theme';
import { Routes } from '@/navigation';

import { calculateOffset } from './offset.logic';
import type { BendAngle, ConduitType, RoundingOption, Unit } from './offset.types';

// =============================================================================
// DEFAULTS — starting values for this calculator
// =============================================================================

const DEFAULT_UNIT: Unit = 'imperial';
const DEFAULT_ANGLE: BendAngle = 30;
const DEFAULT_CONDUIT_TYPE: ConduitType = 'EMT';
const DEFAULT_BENDER: SetupBender = 'Generic Hand Bender';

// =============================================================================
// LOCAL MODAL COMPONENTS — placeholder interactions for Phase 3
// =============================================================================

function OffsetModal({
  visible,
  title,
  children,
  onClose,
}: {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Pressable onPress={onClose} style={styles.modalCloseButton} accessibilityRole="button">
              <Text style={styles.modalCloseIcon}>×</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>

          <Pressable onPress={onClose} style={styles.primaryButton} accessibilityRole="button">
            <Text style={styles.primaryButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function MenuItem({
  title,
  subtitle,
  onPress,
}: {
  title: string;
  subtitle?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.menuItem} accessibilityRole="button">
      <Text style={styles.menuItemText}>{title}</Text>
      {subtitle ? <Text style={styles.menuItemSubtitle}>{subtitle}</Text> : null}
    </Pressable>
  );
}

// =============================================================================
// MAIN SCREEN
// =============================================================================

export default function OffsetScreen() {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // STATE — what the user typed or selected
  // ---------------------------------------------------------------------------

  const [unit, setUnit] = useState<Unit>(DEFAULT_UNIT);
  const [bendAngle, setBendAngle] = useState<BendAngle>(DEFAULT_ANGLE);
  const [rounding, setRounding] = useState<RoundingOption>('1/16');

  // TextInputs store strings. First mark starts empty = optional (no layout mark mode).
  const [offsetHeightText, setOffsetHeightText] = useState('');
  const [firstMark, setFirstMark] = useState('');
  const [showFirstMark, setShowFirstMark] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [setupVisible, setSetupVisible] = useState(false);
  const [guidedVisible, setGuidedVisible] = useState(false);
  const [menuNotice, setMenuNotice] = useState('');

  const [conduitType, setConduitType] = useState<ConduitType>(DEFAULT_CONDUIT_TYPE);
  const [conduitSize, setConduitSize] = useState('1/2');
  const [bender, setBender] = useState<SetupBender>(DEFAULT_BENDER);

  // ---------------------------------------------------------------------------
  // DERIVED VALUES — convert UI strings into calculator-friendly numbers
  // ---------------------------------------------------------------------------

  const offsetHeight = Number(offsetHeightText || 0);

  // BEGINNER NOTE: undefined tells the engine to skip mark-distance outputs.
  const firstMarkNumber = firstMark.trim() === '' ? undefined : Number(firstMark);

  const unitLabel = unit === 'metric' ? 'mm' : 'in';
  const setupSummary = `${conduitType} ${conduitSize}" • ${bendAngle}°`;
  const setupSubText = `${bender} • ${unit === 'metric' ? 'Metric' : 'Imperial'} • ${rounding}`;

  // ---------------------------------------------------------------------------
  // CALCULATION — UI sends input into the pure logic file
  // ---------------------------------------------------------------------------

  const result = useMemo(() => {
    return calculateOffset({
      offsetHeight,
      firstMark: firstMarkNumber,
      bendAngle,
      unit,
      rounding,
      conduitSize,
      conduitType,
    });
  }, [offsetHeight, firstMarkNumber, bendAngle, unit, rounding, conduitSize, conduitType]);

  const firstMarkInputError =
    firstMark.trim() !== '' &&
    (firstMarkNumber === undefined || !Number.isFinite(firstMarkNumber) || firstMarkNumber < 0)
      ? 'Enter a valid non-negative value, or leave blank.'
      : undefined;

  const hasFirstMark = firstMarkNumber !== undefined && Number.isFinite(firstMarkNumber);
  const mark1Value = hasFirstMark ? result.firstMarkFormatted ?? '—' : 'Start';
  const mark2Value = hasFirstMark ? result.secondMarkFormatted ?? '—' : `+ ${result.spacingFormatted}`;

  function handleBackPress() {
    const safeRouter = router as typeof router & { canGoBack?: () => boolean };

    if (typeof safeRouter.canGoBack === 'function' && safeRouter.canGoBack()) {
      router.back();
      return;
    }

    router.replace(Routes.home);
  }

  function openSetupModal() {
    setMenuVisible(false);
    setSetupVisible(true);
  }

  function openGuidedModal() {
    setMenuVisible(false);
    setGuidedVisible(true);
  }

  function openSwitchBendPlaceholder() {
    setMenuNotice('This bend type is coming soon.');
  }

  function openSettings() {
    setMenuVisible(false);
    router.push(Routes.settings);
  }

  function handleQuickBendPress(item: BendLibraryItem) {
    if (item.status === 'active' && item.title === 'Basic Offset') {
      setMenuNotice('Basic Offset is already open.');
      return;
    }

    openSwitchBendPlaceholder();
  }

  function applySetup(nextSetup: OffsetSetupValues) {
    setConduitType(nextSetup.conduitType);
    setConduitSize(nextSetup.conduitSize);
    setBender(nextSetup.bender);
    setUnit(nextSetup.unit);
    setRounding(nextSetup.rounding);
    setSetupVisible(false);
  }

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------

  return (
    <View style={styles.screen}>
      <AppTopBar
        showBack
        title="Offset Bend"
        subtitle={setupSummary}
        onBackPress={handleBackPress}
        rightIcon={<Text style={styles.menuIcon}>☰</Text>}
        onRightPress={() => {
          setMenuNotice('');
          setMenuVisible(true);
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <SetupChip
          mainText={setupSummary}
          subText={setupSubText}
          onEdit={openSetupModal}
        />

        <BigMeasurementInput
          label="Offset Height"
          value={offsetHeightText}
          onChangeText={setOffsetHeightText}
          placeholder="0"
          unit={unitLabel}
          error={offsetHeightText !== '' && offsetHeight <= 0 ? 'Enter a value greater than 0.' : undefined}
        />

        <AngleSelector
          selectedAngle={bendAngle as BendAngleOption}
          onSelect={(angle) => setBendAngle(angle as BendAngle)}
        />

        <MarkingGuide
          mark1Label="Mark 1"
          mark1Value={mark1Value}
          mark2Label="Mark 2"
          mark2Value={mark2Value}
          distanceValue={result.spacingFormatted}
          unit=""
        />

        <ActionResultCard
          label="Mark 2 Distance"
          value={result.spacingFormatted}
          helperText="Measure from Mark 1"
          variant="primary"
        />

        <ActionResultCard
          label="Shrink"
          value={result.shrinkFormatted}
          helperText="Only if landing on target"
          variant="secondary"
        />

        <DrawerRow
          title="Optional First Mark"
          isExpanded={showFirstMark}
          onPress={() => setShowFirstMark((current) => !current)}
          trailingLabel={showFirstMark ? 'Hide' : '+'}
        />

        {showFirstMark ? (
          <BigMeasurementInput
            label="First Mark"
            value={firstMark}
            onChangeText={setFirstMark}
            placeholder="Optional layout mark"
            unit={unitLabel}
            error={firstMarkInputError}
          />
        ) : null}

        <DrawerRow
          title="Guided Mode"
          subtitle="Open step-by-step learning view"
          variant="primary"
          onPress={openGuidedModal}
          trailingLabel="Open"
        />
      </ScrollView>

      <OffsetModal visible={menuVisible} title="Offset Menu" onClose={() => setMenuVisible(false)}>
        <Text style={styles.menuSectionTitle}>Switch Bend</Text>
        {BEND_FAMILIES.map((family) => (
          <View key={family.title} style={styles.menuFamily}>
            <Text style={styles.menuFamilyTitle}>{family.title}</Text>
            {family.items.map((item) => (
              <MenuItem
                key={item.title}
                title={item.title}
                subtitle={item.status === 'active' ? 'Active' : 'Coming Soon'}
                onPress={() => handleQuickBendPress(item)}
              />
            ))}
          </View>
        ))}

        <Text style={styles.menuSectionTitle}>Actions</Text>
        <MenuItem title="Edit Setup" onPress={openSetupModal} />
        <MenuItem title="Guided Mode" onPress={openGuidedModal} />
        <MenuItem title="Settings" onPress={openSettings} />
        <MenuItem title="Close" onPress={() => setMenuVisible(false)} />
        {menuNotice ? <Text style={styles.placeholderText}>{menuNotice}</Text> : null}
      </OffsetModal>

      <EditSetupSheet
        visible={setupVisible}
        values={{
          conduitType,
          conduitSize,
          bender,
          unit,
          rounding,
          bendAngle,
        }}
        onCancel={() => setSetupVisible(false)}
        onApply={applySetup}
      />

      <OffsetModal visible={guidedVisible} title="Guided Mode" onClose={() => setGuidedVisible(false)}>
        <Text style={styles.modalText}>
          Formulas, bend steps, common mistakes, and learning support will live here.
        </Text>
        <View style={styles.formulaCard}>
          <Text style={styles.formulaText}>Spacing = Offset Height × Multiplier</Text>
          <Text style={styles.formulaText}>Shrink = Offset Height × Shrink Constant</Text>
        </View>
      </OffsetModal>
    </View>
  );
}

// =============================================================================
// STYLES
// =============================================================================

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
  menuIcon: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
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
    maxHeight: '88%',
    alignSelf: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.screen,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseIcon: {
    color: colors.muted,
    fontSize: 28,
    lineHeight: 32,
  },
  modalBody: {
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  modalText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  menuItem: {
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  menuItemText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  menuItemSubtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  menuSectionTitle: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  menuFamily: {
    gap: spacing.sm,
  },
  menuFamilyTitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  placeholderText: {
    color: colors.warning,
    fontSize: 14,
    lineHeight: 20,
  },
  valueList: {
    gap: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  valueLine: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  formulaCard: {
    gap: spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryMuted,
    padding: spacing.lg,
  },
  formulaText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  primaryButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
});

// =============================================================================
// EXPORTS — default OffsetScreen exported above
// =============================================================================
