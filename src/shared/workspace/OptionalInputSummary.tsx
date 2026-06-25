import { StyleSheet, View } from 'react-native';

import { MeasurementChip } from './MeasurementChip';

export type OptionalInputSummaryProps = {
  label: string;
  value: string;
  unit?: string;
  onPress: () => void;
};

/** Compact optional-field summary for the input strip — opens the length sheet on tap. */
export function OptionalInputSummary({ label, value, unit, onPress }: OptionalInputSummaryProps) {
  const displayValue = unit ? `${value} ${unit}` : value;

  return (
    <View style={styles.wrap}>
      <MeasurementChip label={label} value={displayValue} tone="primary" size="compact" onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    maxWidth: '72%',
  },
});
