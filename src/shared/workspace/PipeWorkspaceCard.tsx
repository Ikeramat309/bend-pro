import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fontSize, fontWeight } from '@/theme/typography';
import { workspaceColors, workspaceRadius, workspaceSpacing } from '@/theme/workspaceTheme';

import { DiagramGrid } from '@/shared/diagrams/primitives/DiagramGrid';

type PipeWorkspaceCardProps = {
  title?: string;
  children: ReactNode;
  gridHeight?: number;
};

export function PipeWorkspaceCard({
  title = 'PIPE WORKSPACE',
  children,
  gridHeight = 320,
}: PipeWorkspaceCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.gridLayer} pointerEvents="none">
          <DiagramGrid width="100%" height={gridHeight} />
        </View>
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: workspaceRadius.xl,
    borderWidth: 1,
    borderColor: workspaceColors.border,
    backgroundColor: workspaceColors.surfaceElevated,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: workspaceSpacing.lg,
    paddingTop: workspaceSpacing.lg,
    paddingBottom: workspaceSpacing.sm,
  },
  title: {
    color: workspaceColors.textMuted,
    fontSize: fontSize.xs,
    lineHeight: 16,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.2,
  },
  body: {
    position: 'relative',
    minHeight: 280,
  },
  gridLayer: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    paddingHorizontal: workspaceSpacing.md,
    paddingBottom: workspaceSpacing.lg,
    gap: workspaceSpacing.lg,
  },
});
