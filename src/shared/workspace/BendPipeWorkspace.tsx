import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, workspaceTheme } from '@/theme';

import { MeasurementChip } from './MeasurementChip';
import { PipeWorkspaceCard } from './PipeWorkspaceCard';
import type { BendResultConfig } from './workspaceTypes';

export type BendPipeWorkspaceProps = {
  diagram: ReactNode;
  primaryResult?: BendResultConfig;
  secondaryResults?: BendResultConfig[];
};

/** Hero pipe workspace — large diagram with limited floating result cards. */
export function BendPipeWorkspace({ diagram, primaryResult, secondaryResults }: BendPipeWorkspaceProps) {
  const secondary = (secondaryResults ?? []).slice(0, 2);
  const hasResults = Boolean(primaryResult || secondary.length > 0);

  return (
    <View style={styles.wrap}>
      <PipeWorkspaceCard variant="highlight">
        <View style={[styles.diagramWell, !hasResults && styles.diagramWellSolo]}>{diagram}</View>

        {hasResults ? (
          <View style={styles.floatRow}>
            {primaryResult ? (
              <View style={[styles.primaryCard, secondary.length > 0 && styles.primaryCardCompact]}>
                <Text style={styles.primaryLabel}>{primaryResult.label}</Text>
                <Text style={styles.primaryValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                  {primaryResult.value}
                </Text>
              </View>
            ) : null}

            {secondary.map((result) => (
              <View key={result.label} style={styles.secondarySlot}>
                <MeasurementChip
                  label={result.label}
                  value={result.value}
                  tone={result.tone}
                  size="compact"
                  onPress={result.onPress}
                />
              </View>
            ))}
          </View>
        ) : null}
      </PipeWorkspaceCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minHeight: workspaceTheme.workspace.minHeight,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  diagramWell: {
    minHeight: workspaceTheme.workspace.diagramMinHeight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  diagramWellSolo: {
    borderBottomWidth: 0,
  },
  floatRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: workspaceTheme.workspace.resultBarBackground,
  },
  primaryCard: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 132,
    gap: 2,
    paddingRight: spacing.sm,
  },
  primaryCardCompact: {
    minWidth: 108,
  },
  primaryLabel: {
    ...workspaceTheme.primaryResult.label,
    color: colors.muted,
    fontWeight: '600',
    letterSpacing: 0.55,
    textTransform: 'uppercase',
  },
  primaryValue: {
    fontSize: workspaceTheme.primaryResult.valueSize,
    lineHeight: workspaceTheme.primaryResult.valueLineHeight,
    fontWeight: '700',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  secondarySlot: {
    flexShrink: 0,
    maxWidth: '46%',
  },
});
