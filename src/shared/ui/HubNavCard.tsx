import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, uiTheme } from '@/theme';

export type HubNavCardProps = {
  label: string;
  description: string;
  onPress: () => void;
};

export function HubNavCard({ label, description, onPress }: HubNavCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button">
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    minHeight: uiTheme.hub.navCard.minHeight,
    padding: uiTheme.hub.navCard.padding,
    borderRadius: uiTheme.hub.navCard.borderRadius,
    borderWidth: 1,
    borderColor: uiTheme.hub.navCard.borderColor,
    backgroundColor: uiTheme.hub.navCard.backgroundColor,
  },
  pressed: {
    opacity: 0.88,
  },
  text: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
  },
  chevron: {
    color: colors.primary,
    fontSize: uiTheme.hub.chevronSize,
    lineHeight: 30,
    fontWeight: '600',
  },
});
