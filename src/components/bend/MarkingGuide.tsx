/**
 * Figma: workbench/MarkingGuide — hero pipe visualization (View/Text only).
 */
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export type MarkingGuideProps = {
  mark1Label: string;
  mark1Value: string;
  mark2Label: string;
  mark2Value: string;
  distanceValue: string;
  unit?: string;
};

const PIPE_HEIGHT = 64;
const MARK_WIDTH = 4;

export function MarkingGuide({
  mark1Label,
  mark1Value,
  mark2Label,
  mark2Value,
  distanceValue,
  unit = 'in',
}: MarkingGuideProps) {
  const distanceDisplay = unit === 'in' ? `${distanceValue}"` : `${distanceValue} ${unit}`;

  return (
    <View style={styles.container}>
      <View style={styles.labelsRow}>
        <MarkLabel label={mark1Label} value={mark1Value} align="left" />
        <MarkLabel label={mark2Label} value={mark2Value} align="right" />
      </View>

      <View style={styles.pipeWrap}>
        <View style={styles.pipe}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <View key={i} style={styles.textureLine} />
          ))}
        </View>

        <View style={[styles.mark, styles.markLeft]} />
        <View style={[styles.mark, styles.markRight]} />

        <View style={styles.distanceRow}>
          <View style={styles.distanceLine}>
            <View style={styles.dotLeft} />
            <View style={styles.dotRight} />
          </View>
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>{distanceDisplay}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function MarkLabel({
  label,
  value,
  align,
}: {
  label: string;
  value: string;
  align: 'left' | 'right';
}) {
  return (
    <View style={[styles.markLabelBlock, align === 'right' && styles.markLabelRight]}>
      <Text style={styles.markLabelTitle}>{label}</Text>
      <Text style={styles.markLabelValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xxxl,
  },
  markLabelBlock: {
    gap: spacing.xs,
  },
  markLabelRight: {
    alignItems: 'flex-end',
  },
  markLabelTitle: {
    fontSize: 12,
    color: colors.muted,
  },
  markLabelValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  pipeWrap: {
    height: PIPE_HEIGHT + spacing.xxl,
    justifyContent: 'center',
  },
  pipe: {
    height: PIPE_HEIGHT,
    borderRadius: radius.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    opacity: 1,
  },
  textureLine: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
    opacity: 0.35,
  },
  mark: {
    position: 'absolute',
    width: MARK_WIDTH,
    top: spacing.xxl,
    bottom: spacing.xxl,
    backgroundColor: colors.mark,
    borderRadius: 2,
  },
  markLeft: {
    left: 32,
  },
  markRight: {
    right: 32,
  },
  distanceRow: {
    position: 'absolute',
    left: 40,
    right: 40,
    top: '50%',
    marginTop: -12,
    height: 24,
    justifyContent: 'center',
  },
  distanceLine: {
    height: 1,
    backgroundColor: colors.primaryBorder,
  },
  dotLeft: {
    position: 'absolute',
    left: 0,
    top: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  dotRight: {
    position: 'absolute',
    right: 0,
    top: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  distanceBadge: {
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    marginLeft: -40,
    width: 80,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.screen,
  },
  distanceText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
