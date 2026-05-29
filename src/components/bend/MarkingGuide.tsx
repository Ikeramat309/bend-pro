/**
 * Figma: workbench/MarkingGuide — field mark visualization (View/Text only).
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export type MarkingGuideProps = {
  mark1Label: string;
  mark1Value: string;
  mark2Label: string;
  mark2Value: string;
  distanceValue: string;
  unit?: string;
  angleDeg?: number;
  variant?: 'pipe' | 'compact';
  compactChrome?: 'card' | 'embedded';
  isEmpty?: boolean;
  onPress?: () => void;
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
  angleDeg,
  variant = 'pipe',
  compactChrome = 'card',
  isEmpty = false,
  onPress,
}: MarkingGuideProps) {
  const distanceDisplay = unit === '' ? distanceValue : unit === 'in' ? `${distanceValue}"` : `${distanceValue} ${unit}`;

  if (variant === 'compact') {
    const compactStyle = compactChrome === 'embedded' ? styles.compactEmbedded : styles.compactContainer;
    const compactContent = (
      <>
        <View style={styles.compactHeader}>
          <MarkLabel label={mark1Label} value={mark1Value} align="left" />
          {compactChrome === 'card' ? (
            <View style={styles.angleBadge}>
              <Text style={styles.angleText}>{angleDeg ?? '--'}°</Text>
            </View>
          ) : null}
          <MarkLabel label={mark2Label} value={mark2Value} align="right" />
        </View>

        <View style={styles.compactGlyph}>
          {compactChrome === 'embedded' ? (
            <View style={[styles.angleBadge, styles.angleBadgeFloating]}>
              <Text style={styles.angleText}>{angleDeg ?? '--'}°</Text>
            </View>
          ) : null}

          {isEmpty ? (
            <View style={styles.emptyVisual}>
              <View style={styles.emptyPipe} />
              <Text style={styles.emptyText}>Enter rise</Text>
            </View>
          ) : (
            <>
              <View style={[styles.glyphRun, styles.glyphRunLeft]} />
              <View style={[styles.glyphRun, styles.glyphRunRight]} />
              <View style={[styles.glyphRise, styles.glyphRiseUp]} />

              <View style={[styles.compactMark, styles.compactMarkLeft]} />
              <View style={[styles.compactMark, styles.compactMarkRight]} />

              <View style={styles.compactDistance}>
                <View style={styles.compactDistanceLine} />
                <View style={styles.distanceBadge}>
                  <Text style={styles.distanceText}>{distanceDisplay}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {compactChrome === 'embedded' ? (
          <View style={styles.straightStrip}>
            <View style={styles.straightPipe} />
            {isEmpty ? null : (
              <>
                <View style={[styles.straightMark, styles.straightMarkLeft]} />
                <View style={[styles.straightMark, styles.straightMarkRight]} />

                <Text style={[styles.stripLabel, styles.stripLabelLeft]}>{mark1Label.toUpperCase()}</Text>
                <Text style={[styles.stripLabel, styles.stripLabelRight]}>{mark2Label.toUpperCase()}</Text>

                <View style={styles.stripDistance}>
                  <View style={styles.compactDistanceLine} />
                  <View style={styles.stripDistanceBadge}>
                    <Text style={styles.distanceText}>{distanceDisplay}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        ) : null}
      </>
    );

    if (onPress) {
      return (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [compactStyle, pressed && styles.compactPressed]}
          accessibilityRole="button"
          accessibilityLabel="View offset layout">
          {compactContent}
        </Pressable>
      );
    }

    return <View style={compactStyle}>{compactContent}</View>;
  }

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
    flex: 1,
    gap: 2,
  },
  markLabelRight: {
    alignItems: 'flex-end',
  },
  markLabelTitle: {
    ...typography.tabLabel,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    opacity: 0.86,
  },
  markLabelValue: {
    ...typography.chip,
    fontWeight: '600',
    color: colors.primary,
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
    marginLeft: -44,
    minWidth: 88,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.background,
  },
  distanceText: {
    ...typography.chip,
    color: colors.primary,
  },
  compactContainer: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  compactEmbedded: {
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  compactPressed: {
    opacity: 0.9,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  angleBadge: {
    minWidth: 52,
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  angleBadgeFloating: {
    position: 'absolute',
    right: 0,
    top: 2,
    zIndex: 2,
  },
  angleText: {
    ...typography.chip,
    color: colors.primary,
  },
  compactGlyph: {
    height: 142,
    justifyContent: 'center',
  },
  emptyVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emptyPipe: {
    width: '72%',
    height: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.muted,
    opacity: 0.22,
  },
  emptyText: {
    ...typography.chip,
    color: colors.muted,
  },
  glyphRun: {
    position: 'absolute',
    height: 9,
    borderRadius: radius.full,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.text,
    opacity: 0.72,
  },
  glyphRunLeft: {
    left: 18,
    right: '57%',
    top: 64,
  },
  glyphRunRight: {
    left: '56%',
    right: 18,
    top: 34,
  },
  glyphRise: {
    position: 'absolute',
    left: '40%',
    width: 86,
    height: 9,
    borderRadius: radius.full,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: colors.text,
    opacity: 0.72,
  },
  glyphRiseUp: {
    top: 50,
    transform: [{ rotate: '-35deg' }],
  },
  compactMark: {
    position: 'absolute',
    top: 38,
    bottom: 40,
    width: MARK_WIDTH,
    borderRadius: radius.full,
    backgroundColor: colors.mark,
  },
  compactMarkLeft: {
    left: 44,
  },
  compactMarkRight: {
    right: 44,
  },
  compactDistance: {
    position: 'absolute',
    left: 54,
    right: 54,
    bottom: 20,
    height: 28,
    justifyContent: 'center',
  },
  compactDistanceLine: {
    height: 2,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    opacity: 0.85,
  },
  straightStrip: {
    height: 86,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    justifyContent: 'center',
  },
  straightPipe: {
    height: 12,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.text,
    backgroundColor: colors.muted,
    opacity: 0.72,
  },
  straightMark: {
    position: 'absolute',
    width: MARK_WIDTH,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.mark,
    top: 27,
  },
  straightMarkLeft: {
    left: 58,
  },
  straightMarkRight: {
    right: 58,
  },
  stripLabel: {
    position: 'absolute',
    top: 12,
    ...typography.tabLabel,
    color: colors.text,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  stripLabelLeft: {
    left: 34,
  },
  stripLabelRight: {
    right: 34,
  },
  stripDistance: {
    position: 'absolute',
    left: 68,
    right: 68,
    bottom: 8,
    height: 28,
    justifyContent: 'center',
  },
  stripDistanceBadge: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surface2,
  },
});
