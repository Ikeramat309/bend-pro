/**
 * FILE: src/components/ResultCard.tsx
 *
 * PURPOSE: Display one calculated output (label + big value).
 * INPUTS:  title, value (already formatted string from engine), optional highlight.
 * OUTPUTS: Card UI — NO math here; parent passes formatted strings.
 *
 * FUTURE REUSE: Offset shrink, stub length, voltage drop %, etc.
 */

// IMPORTS
import { StyleSheet, Text, View } from 'react-native';

import {
  CalculatorRadii,
  CalculatorShadow,
  CalculatorSpacing,
  CalculatorTypography,
  useCalculatorTheme,
} from '@/theme';

// TYPES
export type ResultCardProps = {
  title: string;
  value: string;
  highlight?: boolean;
  subtitle?: string;
};

// UI
export function ResultCard({ title, value, highlight = false, subtitle }: ResultCardProps) {
  const colors = useCalculatorTheme();

  return (
    <View
      style={[
        styles.card,
        CalculatorShadow,
        {
          backgroundColor: highlight ? colors.resultHighlight : colors.card,
          borderColor: highlight ? colors.resultHighlightBorder : colors.cardBorder,
        },
      ]}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
      <Text style={[styles.value, { color: highlight ? colors.success : colors.text }]}>{value}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

// STYLES
const styles = StyleSheet.create({
  card: {
    borderRadius: CalculatorRadii.lg,
    borderWidth: 1,
    padding: CalculatorSpacing.lg,
    gap: CalculatorSpacing.sm,
  },
  title: {
    ...CalculatorTypography.resultTitle,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  value: { ...CalculatorTypography.resultValue },
  subtitle: { fontSize: 13, lineHeight: 18 },
});

// EXPORTS — ResultCard, ResultCardProps
