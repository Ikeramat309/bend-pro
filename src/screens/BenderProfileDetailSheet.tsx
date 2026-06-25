import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CalculatorSetup } from '@/core/settings';
import type { BenderProfile } from '@/data/benders';
import {
  buildProfileDeductRows,
  formatChartKindLabel,
  formatProfileDeductCell,
  getProfileCapabilities,
} from '@/data/benders';
import { HubStatusBadge, Sheet, SheetFormGroup } from '@/shared/ui';
import { colors, spacing, typography } from '@/theme';

export type BenderProfileDetailSheetProps = {
  visible: boolean;
  profile: BenderProfile;
  setup: CalculatorSetup;
  isActive: boolean;
  onClose: () => void;
  onSelect: () => void;
  onEdit?: () => void;
};

/** Full stub 90 chart and profile context for the bender database. */
export function BenderProfileDetailSheet({
  visible,
  profile,
  setup,
  isActive,
  onClose,
  onSelect,
  onEdit,
}: BenderProfileDetailSheetProps) {
  const rows = buildProfileDeductRows(profile, setup.stub90DeductOverridesInches);
  const capabilities = getProfileCapabilities(profile);
  const hasOverride = rows.some((row) => row.overrideDeductInches !== undefined);

  return (
    <Sheet
      visible={visible}
      title={profile.name}
      subtitle={formatChartKindLabel(profile.chartKind)}
      onClose={onClose}
      onSecondaryPress={onClose}
      onPrimaryPress={isActive ? onClose : onSelect}
      primaryLabel={isActive ? 'Done' : 'Use as active bender'}>
      <View style={styles.headerMeta}>
        {isActive ? <HubStatusBadge label="Active" tone="primary" /> : null}
        <Text style={styles.category}>{profile.category}</Text>
      </View>

      <Text style={styles.description}>{profile.description}</Text>
      {profile.sourceNote ? <Text style={styles.sourceNote}>{profile.sourceNote}</Text> : null}

      {onEdit ? (
        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [styles.editLink, pressed && styles.editLinkPressed]}
          accessibilityRole="button">
          <Text style={styles.editLinkText}>Edit custom profile</Text>
        </Pressable>
      ) : null}

      <SheetFormGroup
        title="Stub 90 deduct chart"
        hint="Values in inches unless your unit setting formats them differently below. Overrides replace chart values per size.">
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.sizeCol]}>Size</Text>
            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.valueCol]}>Chart</Text>
            <Text style={[styles.tableCell, styles.tableHeaderCell, styles.valueCol]}>In use</Text>
          </View>
          {rows.map((row) => (
            <View key={row.tradeSize} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.sizeCol]}>{row.tradeSize}&quot; EMT</Text>
              <Text style={[styles.tableCell, styles.valueCol, styles.mutedCell]}>
                {formatProfileDeductCell(row.chartDeductInches, setup.unit, setup.rounding)}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  styles.valueCol,
                  row.overrideDeductInches !== undefined && styles.overrideCell,
                ]}>
                {formatProfileDeductCell(row.effectiveDeductInches, setup.unit, setup.rounding)}
                {row.overrideDeductInches !== undefined ? ' *' : ''}
              </Text>
            </View>
          ))}
        </View>
        {hasOverride ? (
          <Text style={styles.overrideFootnote}>
            * Manual override active — clear from Manual overrides below or tap Deduct on Stub 90.
          </Text>
        ) : null}
      </SheetFormGroup>

      <SheetFormGroup title="Used by calculators">
        {capabilities.map((line) => (
          <Text key={line} style={styles.capabilityLine}>
            • {line}
          </Text>
        ))}
      </SheetFormGroup>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  category: {
    ...typography.subtitle,
    color: colors.muted,
    textTransform: 'capitalize',
  },
  description: {
    ...typography.subtitle,
    color: colors.text,
  },
  sourceNote: {
    ...typography.subtitle,
    color: colors.muted,
    fontStyle: 'italic',
  },
  editLink: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  editLinkPressed: {
    opacity: 0.88,
  },
  editLinkText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.surface2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableCell: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  tableHeaderCell: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.55,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  sizeCol: {
    flex: 1.1,
  },
  valueCol: {
    flex: 1,
    textAlign: 'right',
  },
  mutedCell: {
    color: colors.muted,
  },
  overrideCell: {
    color: colors.primary,
    fontWeight: '700',
  },
  overrideFootnote: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.muted,
  },
  capabilityLine: {
    ...typography.subtitle,
    color: colors.muted,
  },
});
