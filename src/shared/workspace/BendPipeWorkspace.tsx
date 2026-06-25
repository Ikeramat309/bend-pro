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

/** Hero pipe workspace — diagram-first with a compact result strip below. */
export function BendPipeWorkspace({ diagram, primaryResult, secondaryResults }: BendPipeWorkspaceProps) {
  const secondary = (secondaryResults ?? []).slice(0, 2);
  const hasResults = Boolean(primaryResult || secondary.length > 0);

  return (
    <View style={styles.wrap}>
      <PipeWorkspaceCard variant="highlight">
        <View style={styles.cardInner}>
          <View style={[styles.diagramWell, !hasResults && styles.diagramWellSolo]}>{diagram}</View>

          {hasResults ? (
            <View style={styles.resultStrip}>
              {primaryResult ? (
                <View style={styles.primarySlot}>
                  <Text style={styles.primaryLabel} numberOfLines={1}>
                    {primaryResult.label}
                  </Text>
                  <Text
                    style={styles.primaryValue}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}>
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
        </View>
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
  cardInner: {
    flex: 1,
    minHeight: workspaceTheme.workspace.diagramMinHeight + workspaceTheme.workspace.resultStripMaxHeight,
  },
  diagramWell: {
    flex: 1,
    minHeight: workspaceTheme.workspace.diagramMinHeight,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  diagramWellSolo: {
    borderBottomWidth: 0,
  },
  resultStrip: {
    flexShrink: 0,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    gap: spacing.sm,
    maxHeight: workspaceTheme.workspace.resultStripMaxHeight,
    paddingHorizontal: workspaceTheme.workspace.resultStripPaddingHorizontal,
    paddingVertical: workspaceTheme.workspace.resultStripPaddingVertical,
    backgroundColor: workspaceTheme.workspace.resultBarBackground,
  },
  primarySlot: {
    flex: 1,
    minWidth: 0,
    gap: 1,
    paddingRight: spacing.xs,
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
    maxWidth: '42%',
  },
});
