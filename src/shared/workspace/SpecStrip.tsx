import { StyleSheet, Text, View } from 'react-native';

import { fontSize, fontWeight } from '@/theme/typography';
import { workspaceColors, workspaceRadius, workspaceSpacing } from '@/theme/workspaceTheme';

export type SpecStripItem = {
  id: string;
  label: string;
};

type SpecStripProps = {
  items: SpecStripItem[];
};

export function SpecStrip({ items }: SpecStripProps) {
  return (
    <View style={styles.strip}>
      {items.map((item, index) => (
        <View key={item.id} style={styles.itemWrap}>
          {index > 0 ? <View style={styles.divider} /> : null}
          <Text style={styles.item}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: workspaceSpacing.sm,
    paddingHorizontal: workspaceSpacing.md,
    paddingVertical: workspaceSpacing.sm + 2,
    borderRadius: workspaceRadius.lg,
    borderWidth: 1,
    borderColor: workspaceColors.border,
    backgroundColor: workspaceColors.surface,
  },
  itemWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: workspaceSpacing.sm,
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: workspaceColors.border,
  },
  item: {
    color: workspaceColors.textSecondary,
    fontSize: fontSize.sm,
    lineHeight: 18,
    fontWeight: fontWeight.semibold,
  },
});
