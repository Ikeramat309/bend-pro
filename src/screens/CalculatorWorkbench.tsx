import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AngleSelector,
  CalculatorLayout,
  ConduitSelector,
  InputCard,
  ResultCard,
  RoundingSelector,
  UnitToggle,
  type AngleOption,
  type ConduitType,
  type RoundingId,
} from '@/components/calculator-ui';
import type { UnitSystem } from '@/engine/types';
import { CalculatorSpacing, useCalculatorTheme } from '@/theme';

/**
 * Component showcase — no calculator math.
 * Wire real engines later under src/calculators/.
 */
export function CalculatorWorkbench() {
  const router = useRouter();
  const colors = useCalculatorTheme();

  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [offset, setOffset] = useState('12');
  const [run, setRun] = useState('48');
  const [angle, setAngle] = useState<AngleOption | null>(30);
  const [conduitType, setConduitType] = useState<ConduitType>('EMT');
  const [sizeId, setSizeId] = useState('3/4');
  const [rounding, setRounding] = useState<RoundingId>('1/16');

  const lengthUnit = unitSystem === 'imperial' ? 'in' : 'mm';
  const roundingValue: RoundingId =
    unitSystem === 'metric'
      ? ['exact', '1mm', '5mm', '10mm'].includes(rounding)
        ? rounding
        : '1mm'
      : ['exact', '1/16', '1/8', '1/4'].includes(rounding)
        ? rounding
        : '1/16';

  const handleUnitChange = (system: UnitSystem) => {
    setUnitSystem(system);
    setSizeId(system === 'metric' ? '21' : '3/4');
    setRounding(system === 'metric' ? '1mm' : '1/16');
  };

  return (
    <CalculatorLayout
      title="Calculator Workbench"
      subtitle="UI component preview — Offset Bend skeleton (no math yet)">
      <Pressable onPress={() => router.back()} style={styles.backRow}>
        <Text style={[styles.backText, { color: colors.primary }]}>← Back</Text>
      </Pressable>

      <View style={[styles.sectionLabel, { borderColor: colors.cardBorder }]}>
        <Text style={[styles.sectionText, { color: colors.textMuted }]}>GLOBAL</Text>
      </View>

      <UnitToggle value={unitSystem} onChange={handleUnitChange} />
      <RoundingSelector
        value={roundingValue}
        onChange={setRounding}
        unitSystem={unitSystem}
      />
      <ConduitSelector
        conduitType={conduitType}
        onConduitTypeChange={setConduitType}
        sizeId={sizeId}
        onSizeChange={setSizeId}
        unitSystem={unitSystem}
      />

      <View style={[styles.sectionLabel, { borderColor: colors.cardBorder }]}>
        <Text style={[styles.sectionText, { color: colors.textMuted }]}>INPUTS</Text>
      </View>

      <InputCard
        label="Offset height"
        value={offset}
        onChangeText={setOffset}
        placeholder="0"
        unitLabel={lengthUnit}
      />
      <InputCard
        label="Run length"
        value={run}
        onChangeText={setRun}
        placeholder="0"
        unitLabel={lengthUnit}
      />
      <AngleSelector value={angle} onChange={setAngle} />

      <View style={[styles.sectionLabel, { borderColor: colors.cardBorder }]}>
        <Text style={[styles.sectionText, { color: colors.textMuted }]}>RESULTS (PLACEHOLDER)</Text>
      </View>

      <ResultCard title="Shrinkage" value="—" subtitle="Awaiting engine" />
      <ResultCard
        title="Total length"
        value="—"
        highlight
        subtitle="Primary result slot"
      />
      <ResultCard title="Mark distance" value="—" />
    </CalculatorLayout>
  );
}

const styles = StyleSheet.create({
  backRow: {
    marginTop: -CalculatorSpacing.sm,
    marginBottom: CalculatorSpacing.xs,
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionLabel: {
    borderTopWidth: 1,
    paddingTop: CalculatorSpacing.md,
    marginTop: CalculatorSpacing.xs,
  },
  sectionText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});
