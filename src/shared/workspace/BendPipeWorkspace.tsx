import { useMemo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { spacing, useTheme, workspaceTheme, type ThemePalette } from '@/theme';

import { MeasurementChip } from './MeasurementChip';
import { PipeWorkspaceCard } from './PipeWorkspaceCard';
import type { BendResultConfig } from './workspaceTypes';

export type BendPipeWorkspaceProps = {
  diagram: ReactNode;
  primaryResult?: BendResultConfig;
  secondaryResults?: BendResultConfig[];
};

/** Hero pipe workspace — diagram-first with a centered primary result below the pipe. */
export function BendPipeWorkspace({ diagram, primaryResult, secondaryResults }: BendPipeWorkspaceProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const secondary = (secondaryResults ?? []).slice(0, 2);
  const hasResults = Boolean(primaryResult || secondary.length > 0);

  return (
    <View style={styles.wrap}>
      <PipeWorkspaceCard variant="highlight">
        <View style={styles.cardInner}>
          <View style={[styles.diagramWell, !hasResults && styles.diagramWellSolo]}>{diagram}</View>

          {hasResults ? (
            <View style={styles.resultHero}>
              {primaryResult ? (
                <View style={styles.primaryBlock}>
                  <Text style={styles.primaryLabel} numberOfLines={1}>
                    {primaryResult.label}
                  </Text>
                  <Text
                    style={styles.primaryValue}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}>
                    {primaryResult.value}
                  </Text>
                </View>
              ) : null}

              {secondary.length > 0 ? (
                <View style={styles.secondaryRow}>
                  {secondary.map((result) => (
                    <MeasurementChip
                      key={result.label}
                      label={result.label}
                      value={result.value}
                      tone={result.tone}
                      size="compact"
                      onPress={result.onPress}
                    />
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
      </PipeWorkspaceCard>
    </View>
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    wrap: {
      flex: 1,
      minHeight: workspaceTheme.workspace.minHeight,
      paddingHorizontal: spacing.lg,
      paddingTop: workspaceTheme.workspace.wrapPaddingTop,
      paddingBottom: workspaceTheme.workspace.wrapPaddingBottom,
    },
    cardInner: {
      flex: 1,
      minHeight: workspaceTheme.workspace.diagramMinHeight + 88,
    },
    diagramWell: {
      flex: 1,
      minHeight: workspaceTheme.workspace.diagramMinHeight,
      width: '100%',
    },
    diagramWellSolo: {},
    resultHero: {
      flexShrink: 0,
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xs,
      paddingBottom: spacing.sm,
      backgroundColor: 'transparent',
    },
    primaryBlock: {
      alignItems: 'center',
      gap: 2,
      width: '100%',
    },
    primaryLabel: {
      ...workspaceTheme.primaryResult.label,
      color: c.muted,
      fontWeight: '600',
      letterSpacing: 0.65,
      textTransform: 'uppercase',
      textAlign: 'center',
    },
    primaryValue: {
      fontSize: 42,
      lineHeight: 46,
      fontWeight: '700',
      color: c.text,
      fontVariant: ['tabular-nums'],
      textAlign: 'center',
    },
    secondaryRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.sm,
    },
  });
}
