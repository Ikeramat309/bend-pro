import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CalculatorSetup } from '@/core/settings';
import type { BenderProfile } from '@/data/benders';
import {
  buildManufacturerDetailRows,
  buildProfileDeductRows,
  formatChartKindLabel,
  formatProfileDeductCell,
  formatVerificationStatusLabel,
  getProfileCapabilities,
  isVerificationStatusWarning,
  profileHasRadiusData,
} from '@/data/benders';
import { HubStatusBadge, Sheet, SheetFormGroup } from '@/shared/ui';
import { spacing, typography, useTheme, type ThemePalette } from '@/theme';

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
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const isManufacturer = profile.chartKind === 'manufacturer';
  const deductRows = buildProfileDeductRows(profile, setup.stub90DeductOverridesInches);
  const manufacturerRows = buildManufacturerDetailRows(profile);
  const capabilities = getProfileCapabilities(profile);
  const hasOverride = deductRows.some((row) => row.overrideDeductInches !== undefined);
  const hasRadiusData = profileHasRadiusData(profile);
  const verificationStatus = profile.verificationStatus;
  const subtitle =
    isManufacturer && verificationStatus !== undefined
      ? formatVerificationStatusLabel(verificationStatus)
      : formatChartKindLabel(profile.chartKind);

  return (
    <Sheet
      visible={visible}
      title={profile.name}
      subtitle={subtitle}
      onClose={onClose}
      onSecondaryPress={onClose}
      onPrimaryPress={isActive ? onClose : onSelect}
      primaryLabel={isActive ? 'Done' : 'Use as active bender'}>
      <View style={styles.headerMeta}>
        {isActive ? <HubStatusBadge label="Active" tone="primary" /> : null}
        {isManufacturer && verificationStatus !== undefined ? (
          <HubStatusBadge
            label={formatVerificationStatusLabel(verificationStatus)}
            tone={isVerificationStatusWarning(verificationStatus) ? 'warning' : 'muted'}
          />
        ) : (
          <Text style={styles.category}>{profile.category}</Text>
        )}
      </View>

      <Text style={styles.description}>{profile.description}</Text>
      {!isManufacturer && profile.sourceNote ? (
        <Text style={styles.sourceNote}>{profile.sourceNote}</Text>
      ) : null}

      {onEdit ? (
        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [styles.editLink, pressed && styles.editLinkPressed]}
          accessibilityRole="button">
          <Text style={styles.editLinkText}>Edit custom profile</Text>
        </Pressable>
      ) : null}

      {isManufacturer ? (
        <SheetFormGroup
          title="Manufacturer chart"
          hint="Take-up values drive Stub 90 deduct marks when present. Missing values require a custom deduct.">
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.tableHeaderCell, styles.sizeCol]}>Size</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, styles.modelsCol]}>Models</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, styles.valueCol]}>Take-up</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, styles.valueCol]}>Radius</Text>
            </View>
            {manufacturerRows.map((row) => (
              <View key={row.tradeSize}>
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.sizeCol]}>{row.tradeSize}&quot; EMT</Text>
                  <Text style={[styles.tableCell, styles.modelsCol]}>{row.models}</Text>
                  <Text style={[styles.tableCell, styles.valueCol, styles.mutedCell]}>
                    {formatProfileDeductCell(row.takeUpInches, setup.unit, setup.rounding)}
                  </Text>
                  <Text style={[styles.tableCell, styles.valueCol, styles.mutedCell]}>
                    {formatProfileDeductCell(
                      row.centerlineRadiusInches,
                      setup.unit,
                      setup.rounding,
                    )}
                  </Text>
                </View>
                {row.note ? <Text style={styles.rowNote}>{row.note}</Text> : null}
              </View>
            ))}
          </View>
          {hasRadiusData ? (
            <Text style={styles.radiusCaption}>
              Radius is reference info — it does not change marks yet.
            </Text>
          ) : null}
          {profile.sourceNote ? (
            <View style={styles.sourceNoteBlock}>
              <Text style={styles.sourceNoteBlockText}>{profile.sourceNote}</Text>
            </View>
          ) : null}
        </SheetFormGroup>
      ) : (
        <SheetFormGroup
          title="Stub 90 deduct chart"
          hint="Values in inches unless your unit setting formats them differently below. Overrides replace chart values per size.">
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.tableHeaderCell, styles.sizeCol]}>Size</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, styles.valueCol]}>Chart</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, styles.valueCol]}>In use</Text>
            </View>
            {deductRows.map((row) => (
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
      )}

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

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    headerMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    category: {
      ...typography.subtitle,
      color: c.muted,
      textTransform: 'capitalize',
    },
    description: {
      ...typography.subtitle,
      color: c.text,
    },
    sourceNote: {
      ...typography.subtitle,
      color: c.muted,
      fontStyle: 'italic',
    },
    sourceNoteBlock: {
      borderRadius: 12,
      backgroundColor: c.surface2,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    sourceNoteBlockText: {
      ...typography.subtitle,
      color: c.muted,
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
      color: c.primary,
    },
    table: {
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      overflow: 'hidden',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: c.surface2,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    tableCell: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      fontSize: 13,
      lineHeight: 18,
      color: c.text,
      fontVariant: ['tabular-nums'],
    },
    tableHeaderCell: {
      fontSize: 10,
      lineHeight: 13,
      fontWeight: '700',
      letterSpacing: 0.55,
      textTransform: 'uppercase',
      color: c.muted,
    },
    sizeCol: {
      flex: 0.9,
    },
    modelsCol: {
      flex: 1.4,
    },
    valueCol: {
      flex: 0.85,
      textAlign: 'right',
    },
    mutedCell: {
      color: c.muted,
    },
    overrideCell: {
      color: c.primary,
      fontWeight: '700',
    },
    rowNote: {
      fontSize: 12,
      lineHeight: 16,
      color: c.muted,
      fontStyle: 'italic',
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    radiusCaption: {
      fontSize: 12,
      lineHeight: 16,
      color: c.muted,
    },
    overrideFootnote: {
      fontSize: 12,
      lineHeight: 16,
      color: c.muted,
    },
    capabilityLine: {
      ...typography.subtitle,
      color: c.muted,
    },
  });
}
