import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AngleSelector,
  CalculatorLayout,
  ConduitSelector,
  InputCard,
  ResultCard,
  RoundingSelector,
  UnitToggle,
  type AngleOption,
  type RoundingId,
} from '@/components/calculator-ui';
import {
  runWorkbench,
  WORKBENCH_PRESETS,
  type CalculatorType,
  type WorkbenchInputs,
  type WorkbenchPresetId,
  type WorkbenchUnit,
} from '@/calculators/workbench';
import { CalculatorRadii, CalculatorSpacing, CalculatorTypography, useCalculatorTheme } from '@/theme';

const CALCULATOR_OPTIONS: { id: CalculatorType; label: string }[] = [
  { id: 'offset-bend', label: 'Offset Bend' },
  { id: 'stub-90', label: 'Stub 90' },
  { id: '3-point-saddle', label: '3 Point Saddle' },
  { id: '4-point-saddle', label: '4 Point Saddle' },
  { id: 'rolling-offset', label: 'Rolling Offset' },
];

const DEFAULT_INPUTS: WorkbenchInputs = {
  offsetHeight: '12',
  firstMark: '24',
  angle: 30,
  conduitType: 'EMT',
  conduitSizeId: '3/4',
  unit: 'imperial',
  rounding: '1/16',
};

function WorkbenchSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const colors = useCalculatorTheme();
  return (
    <View style={sectionStyles.wrap}>
      <View style={[sectionStyles.header, { borderColor: colors.cardBorder }]}>
        <Text style={[sectionStyles.headerText, { color: colors.textMuted }]}>{title}</Text>
      </View>
      <View style={sectionStyles.body}>{children}</View>
    </View>
  );
}

function CodeBlock({ text }: { text: string }) {
  const colors = useCalculatorTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={[codeStyles.block, { backgroundColor: colors.inputBackground, borderColor: colors.cardBorder }]}>
        <Text style={[codeStyles.text, { color: colors.text }]} selectable>
          {text}
        </Text>
      </View>
    </ScrollView>
  );
}

export function CalculatorWorkbench() {
  const router = useRouter();
  const colors = useCalculatorTheme();

  const [calculatorType, setCalculatorType] = useState<CalculatorType>('offset-bend');
  const [inputs, setInputs] = useState<WorkbenchInputs>(DEFAULT_INPUTS);

  const result = useMemo(() => runWorkbench(calculatorType, inputs), [calculatorType, inputs]);
  const lengthUnit = inputs.unit === 'imperial' ? 'in' : 'mm';

  const patchInputs = (patch: Partial<WorkbenchInputs>) => {
    setInputs((prev) => ({ ...prev, ...patch }));
  };

  const applyPreset = (presetId: WorkbenchPresetId) => {
    const preset = WORKBENCH_PRESETS[presetId];
    setCalculatorType(preset.calculatorType);
    setInputs({ ...DEFAULT_INPUTS, ...preset.inputs });
  };

  const handleUnitChange = (unit: WorkbenchUnit) => {
    patchInputs({
      unit,
      conduitSizeId: unit === 'metric' ? '21' : '3/4',
      rounding: unit === 'metric' ? '1mm' : '1/16',
    });
  };

  const metricRounding = new Set<string>(['exact', '1mm', '5mm', '10mm']);
  const imperialRounding = new Set<string>(['exact', '1/16', '1/8', '1/4']);
  const roundingValue: RoundingId =
    inputs.unit === 'metric'
      ? metricRounding.has(inputs.rounding)
        ? inputs.rounding
        : '1mm'
      : imperialRounding.has(inputs.rounding)
        ? inputs.rounding
        : '1/16';

  const rawJson = JSON.stringify(result.raw, null, 2);
  const warningText =
    result.warnings.length > 0 ? result.warnings.join('\n') : 'No warnings';

  return (
    <CalculatorLayout
      title="Calculator Workbench"
      subtitle="Engine testing station — not final calculator UI">
      <Pressable onPress={() => router.back()} style={styles.backRow}>
        <Text style={[styles.backText, { color: colors.primary }]}>← Back</Text>
      </Pressable>

      <WorkbenchSection title="CALCULATOR">
        <View style={styles.chipRow}>
          {CALCULATOR_OPTIONS.map((opt) => {
            const active = calculatorType === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setCalculatorType(opt.id)}
                style={[
                  styles.calcChip,
                  {
                    backgroundColor: active ? colors.chipActive : colors.chipInactive,
                    borderColor: active ? colors.chipActive : colors.cardBorder,
                  },
                ]}>
                <Text style={[styles.calcChipText, { color: active ? '#FFF' : colors.text }]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {!result.available ? (
          <Text style={[styles.comingSoon, { color: colors.accent }]}>Coming soon</Text>
        ) : null}
      </WorkbenchSection>

      <WorkbenchSection title="TEST PRESETS">
        <View style={styles.chipRow}>
          {(Object.keys(WORKBENCH_PRESETS) as WorkbenchPresetId[]).map((id) => (
            <Pressable
              key={id}
              onPress={() => applyPreset(id)}
              style={[styles.presetBtn, { backgroundColor: colors.segmentInactive, borderColor: colors.cardBorder }]}>
              <Text style={[styles.presetBtnText, { color: colors.text }]}>
                {WORKBENCH_PRESETS[id].label}
              </Text>
            </Pressable>
          ))}
        </View>
      </WorkbenchSection>

      {calculatorType === 'offset-bend' ? (
        <WorkbenchSection title="RAW INPUTS">
          <UnitToggle value={inputs.unit} onChange={handleUnitChange} />
          <RoundingSelector
            value={roundingValue}
            onChange={(r) => patchInputs({ rounding: r })}
            unitSystem={inputs.unit}
          />
          <ConduitSelector
            conduitType={inputs.conduitType}
            onConduitTypeChange={(t) => patchInputs({ conduitType: t })}
            sizeId={inputs.conduitSizeId}
            onSizeChange={(id) => patchInputs({ conduitSizeId: id })}
            unitSystem={inputs.unit}
          />
          <InputCard
            label="Offset height"
            value={inputs.offsetHeight}
            onChangeText={(v) => patchInputs({ offsetHeight: v })}
            unitLabel={lengthUnit}
          />
          <InputCard
            label="First mark"
            value={inputs.firstMark}
            onChangeText={(v) => patchInputs({ firstMark: v })}
            unitLabel={lengthUnit}
          />
          <AngleSelector
            value={inputs.angle}
            onChange={(a: AngleOption) => patchInputs({ angle: a })}
          />
        </WorkbenchSection>
      ) : (
        <WorkbenchSection title="RAW INPUTS">
          <Text style={{ color: colors.textSecondary }}>Inputs available when engine is implemented.</Text>
        </WorkbenchSection>
      )}

      <WorkbenchSection title="RAW OUTPUT">
        <CodeBlock text={rawJson} />
      </WorkbenchSection>

      <WorkbenchSection title="FORMATTED OUTPUT">
        {result.formatted ? (
          <>
            <ResultCard title="Spacing" value={result.formatted.spacing} />
            <ResultCard title="Shrink" value={result.formatted.shrink} highlight />
            <ResultCard title="First Mark" value={result.formatted.firstMark} />
            <ResultCard title="Second Mark" value={result.formatted.secondMark} />
            <ResultCard title="Multiplier" value={result.formatted.multiplier} />
            <ResultCard title="Conduit size" value={result.formatted.conduitSize} />
          </>
        ) : (
          <Text style={[styles.comingSoon, { color: colors.textMuted }]}>Coming soon</Text>
        )}
      </WorkbenchSection>

      <WorkbenchSection title="WARNINGS">
        <View
          style={[
            styles.warningBox,
            {
              backgroundColor: result.warnings.length ? colors.card : colors.inputBackground,
              borderColor: result.warnings.length ? colors.danger : colors.cardBorder,
            },
          ]}>
          <Text
            style={[
              styles.warningText,
              { color: result.warnings.length ? colors.danger : colors.success },
            ]}>
            {warningText}
          </Text>
        </View>
      </WorkbenchSection>
    </CalculatorLayout>
  );
}

export default CalculatorWorkbench;

const styles = StyleSheet.create({
  backRow: {
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CalculatorSpacing.sm,
  },
  calcChip: {
    borderRadius: CalculatorRadii.md,
    borderWidth: 1,
    paddingHorizontal: CalculatorSpacing.md,
    paddingVertical: CalculatorSpacing.sm,
    minHeight: 40,
    justifyContent: 'center',
  },
  calcChipText: {
    ...CalculatorTypography.chip,
    fontSize: 13,
  },
  presetBtn: {
    borderRadius: CalculatorRadii.md,
    borderWidth: 1,
    paddingHorizontal: CalculatorSpacing.md,
    paddingVertical: CalculatorSpacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  presetBtnText: {
    ...CalculatorTypography.chip,
  },
  comingSoon: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: CalculatorSpacing.sm,
  },
  warningBox: {
    borderRadius: CalculatorRadii.md,
    borderWidth: 1,
    padding: CalculatorSpacing.lg,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'monospace',
  },
});

const sectionStyles = StyleSheet.create({
  wrap: {
    gap: CalculatorSpacing.md,
  },
  header: {
    borderTopWidth: 1,
    paddingTop: CalculatorSpacing.md,
  },
  headerText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  body: {
    gap: CalculatorSpacing.lg,
  },
});

const codeStyles = StyleSheet.create({
  block: {
    borderRadius: CalculatorRadii.md,
    borderWidth: 1,
    padding: CalculatorSpacing.lg,
    maxWidth: '100%',
  },
  text: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
});
