import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { formatCanonicalLengthForDisplay, toCanonicalInches } from '@/core/measurements';
import { patchCalculatorSetup, useCalculatorSetup } from '@/core/settings';
import { snapshotSetupFromInput } from '@/core/calculations';
import { usePersistRecentLayout, useRestoreRecentLayout } from '@/core/sessions';
import { formatSetupOnlyBenderMeta, getBenderProfile } from '@/data/benders';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { BendCalculatorLayout, EditSetupSheet, type SetupValues } from '@/shared/workspace';
import { spacing, useTheme, type ThemePalette } from '@/theme';
import { formatLength } from '@/utils/formatLength';
import { parseLengthInput } from '@/utils/parseLengthInput';
import { getRoundingLabel } from '@/utils/rounding';
import { getLengthInputMode, getLengthUnitLabel, getUnitSystemLabel } from '@/utils/units';

import { calculateMultipleBends, sortMultipleBendsMarks } from '../engine/multipleBends.engine';
import {
  createMultipleBendsInputSnapshot,
  restoreMultipleBendsFromLayout,
  toStoredInputSnapshot,
} from '../engine/multipleBendsInputSnapshot';
import { toMultipleBendsCalculationResult } from '../engine/multipleBendsResult';
import type { MultipleBendsMarkInput } from '../engine/multipleBends.types';
import { MULTIPLE_BENDS_CONFIG } from '../multipleBends.config';
import { multipleBendsCopy } from '../multipleBends.copy';
import { MarkEditorSheet } from './MarkEditorSheet';
import { MultipleBendsDiagram } from './MultipleBendsDiagram';

export type MultipleBendsScreenProps = {
  onBackPress: () => void;
  onGuidePress?: () => void;
};

function MarkSequenceStrip({
  marks,
  unitSystem,
  roundingPrecision,
  onEdit,
  onRemove,
}: {
  marks: readonly MultipleBendsMarkInput[];
  unitSystem: Parameters<typeof formatLength>[1];
  roundingPrecision: Parameters<typeof formatLength>[2];
  onEdit: (mark: MultipleBendsMarkInput) => void;
  onRemove: (id: string) => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (!marks.length) {
    return <Text style={styles.emptySequence}>No marks yet · add bends or cuts as you lay out the stick.</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sequence}>
      {marks.map((mark, index) => (
        <View key={mark.id} style={styles.markRow}>
          <Pressable onPress={() => onEdit(mark)} style={({ pressed }) => [styles.markMain, pressed && styles.pressed]}>
            <Text style={styles.markOrder}>{index + 1}</Text>
            <View>
              <Text style={styles.markPosition}>
                {formatLength(mark.positionInches, unitSystem, roundingPrecision)}
              </Text>
              <Text style={styles.markMeta}>
                {mark.kind === 'cut'
                  ? 'CUT'
                  : `${mark.angleDegrees ?? 0}° · ${(mark.direction ?? 'up').toUpperCase()}${mark.flip ? ' · FLIP' : ''}`}
              </Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => onRemove(mark.id)}
            style={styles.smallAction}
            accessibilityRole="button"
            accessibilityLabel={`Remove mark ${index + 1}`}>
            <Text style={styles.removeText}>×</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

export default function MultipleBendsScreen({ onBackPress, onGuidePress }: MultipleBendsScreenProps) {
  const { setup, setSetup } = useCalculatorSetup();
  const { unit, rounding, conduitType, conduitSize, benderProfileId, customBenderProfiles } = setup;
  const [lengthText, setLengthText] = useState(() =>
    formatCanonicalLengthForDisplay(MULTIPLE_BENDS_CONFIG.defaultStickLengthInches, unit),
  );
  const [marks, setMarks] = useState<MultipleBendsMarkInput[]>([]);
  const [editingMark, setEditingMark] = useState<MultipleBendsMarkInput | null>(null);
  const [setupVisible, setSetupVisible] = useState(false);
  const nextId = useRef(1);
  const enteredLength = parseLengthInput(lengthText);
  const totalLength = enteredLength === undefined ? undefined : toCanonicalInches(enteredLength, unit);
  const lengthInput = getLengthInputMode(unit);
  const unitLabel = getLengthUnitLabel(unit);
  const benderProfile = getBenderProfile(benderProfileId, customBenderProfiles);

  useRestoreRecentLayout('multipleBends', restoreMultipleBendsFromLayout, (fields) => {
    setLengthText(fields.lengthText);
    setMarks(fields.marks);
  });

  const engineResult = useMemo(
    () => calculateMultipleBends({ totalLengthInches: totalLength ?? Number.NaN, marks }),
    [marks, totalLength],
  );
  const calculationResult = useMemo(
    () =>
      toMultipleBendsCalculationResult(engineResult, {
        unitSystem: unit,
        roundingPrecision: rounding,
        conduitType,
        tradeSize: conduitSize,
        benderProfileId,
        benderProfile: {
          id: benderProfile.id,
          name: benderProfile.name,
          category: benderProfile.category,
        },
      }),
    [
      benderProfile.category,
      benderProfile.id,
      benderProfile.name,
      benderProfileId,
      conduitSize,
      conduitType,
      engineResult,
      rounding,
      unit,
    ],
  );
  const orderedMarks = useMemo(
    () => sortMultipleBendsMarks(marks).map(({ mark }) => mark),
    [marks],
  );

  const inputSnapshot = useMemo(
    () =>
      toStoredInputSnapshot(
        createMultipleBendsInputSnapshot(totalLength ?? 0, marks),
      ),
    [marks, totalLength],
  );

  usePersistRecentLayout({
    calculatorId: 'multipleBends',
    calculatorTitle: multipleBendsCopy.screenTitle,
    inputSnapshot,
    setupSnapshot: snapshotSetupFromInput({
      unitSystem: unit,
      roundingPrecision: rounding,
      conduitType,
      tradeSize: conduitSize,
      benderProfileId,
    }),
    calculationResult,
    enabled: marks.length > 0 && totalLength !== undefined,
  });

  function addMark() {
    if (marks.length >= MULTIPLE_BENDS_CONFIG.maxMarks) return;
    const lastPosition = marks.reduce((max, mark) => Math.max(max, mark.positionInches), 0);
    const suggested = Math.min(totalLength ?? lastPosition + 12, lastPosition + 12);
    setEditingMark({
      id: `new-${Date.now()}-${nextId.current++}`,
      positionInches: suggested,
      kind: 'bend',
      angleDegrees: 30,
      direction: 'up',
      flip: false,
    });
  }

  function saveMark(next: MultipleBendsMarkInput) {
    setMarks((current) => {
      const index = current.findIndex((mark) => mark.id === next.id);
      const updated =
        index < 0
          ? [...current, { ...next, id: next.id.replace(/^new-/, 'mark-') }]
          : current.map((mark) => (mark.id === next.id ? next : mark));
      return sortMultipleBendsMarks(updated).map(({ mark }) => mark);
    });
    setEditingMark(null);
  }

  function reset() {
    setLengthText(
      formatCanonicalLengthForDisplay(MULTIPLE_BENDS_CONFIG.defaultStickLengthInches, unit),
    );
    setMarks([]);
    setEditingMark(null);
  }

  const sequence = (
    <MarkSequenceStrip
      marks={orderedMarks}
      unitSystem={unit}
      roundingPrecision={rounding}
      onEdit={setEditingMark}
      onRemove={(id) => setMarks((current) => current.filter((mark) => mark.id !== id))}
    />
  );

  function applySetup(nextSetup: SetupValues) {
    const canonicalLength = totalLength;
    setSetup(
      patchCalculatorSetup(setup, {
        conduitType: DEFAULT_CONDUIT_TYPE,
        conduitSize: nextSetup.conduitSize,
        benderProfileId: nextSetup.benderProfileId,
        unit: nextSetup.unit,
        rounding: nextSetup.rounding,
      }),
    );
    if (canonicalLength !== undefined) {
      setLengthText(formatCanonicalLengthForDisplay(canonicalLength, nextSetup.unit));
    }
    setSetupVisible(false);
  }

  return (
    <BendCalculatorLayout
      title={multipleBendsCopy.screenTitle}
      subtitle=""
      centerTitle
      inputDensity="compact"
      workspaceDensity="compact"
      onBackPress={onBackPress}
      trust={{
        benderName: 'Single-Stick Mark Planner',
        meta: [
          formatSetupOnlyBenderMeta(benderProfile.name),
          `${conduitType} ${conduitSize}"`,
          `${getUnitSystemLabel(unit)} · ${getRoundingLabel(rounding)}`,
          'No take-up, gain, or shoe math',
        ].join(' · '),
        onEdit: () => setSetupVisible(true),
      }}
      inputs={[
        {
          type: 'field',
          key: 'stickLength',
          label: multipleBendsCopy.fields.stickLength,
          value: lengthText,
          onChangeText: setLengthText,
          lengthInput,
          unit: unitLabel,
          variant: 'compact',
          error: totalLength === undefined || totalLength <= 0 ? 'Enter a conduit length greater than 0.' : undefined,
        },
        { type: 'custom', key: 'sequence', node: sequence },
      ]}
      workspace={
        <MultipleBendsDiagram
          data={engineResult.diagramData}
          unitSystem={unit}
          roundingPrecision={rounding}
          isEmpty={!marks.length}
        />
      }
      primaryResult={
        totalLength !== undefined
          ? {
              label: multipleBendsCopy.results.tail,
              value:
                engineResult.layout.tailAfterLastMarkInches === null
                  ? '—'
                  : formatLength(engineResult.layout.tailAfterLastMarkInches, unit, rounding),
            }
          : undefined
      }
      secondaryResults={[
        { label: multipleBendsCopy.results.marks, value: String(engineResult.layout.marks.length) },
        { label: multipleBendsCopy.results.totalDegrees, value: `${engineResult.layout.totalBendDegrees}°` },
      ]}
      warnings={[...engineResult.warnings]}
      dock={{
        left: [{ key: 'reset', label: 'Reset', onPress: reset }],
        center: {
          key: 'add-mark',
          label: marks.length >= MULTIPLE_BENDS_CONFIG.maxMarks ? 'Mark Limit Reached' : 'Add Mark',
          variant: 'pill',
          onPress: addMark,
          disabled: marks.length >= MULTIPLE_BENDS_CONFIG.maxMarks,
        },
        guide: onGuidePress ? { onPress: onGuidePress } : undefined,
      }}
      footer={
        <>
          <MarkEditorSheet
            visible={editingMark !== null}
            mark={editingMark}
            unitSystem={unit}
            onCancel={() => setEditingMark(null)}
            onSave={saveMark}
          />
          <EditSetupSheet
            visible={setupVisible}
            values={{ conduitType, conduitSize, benderProfileId, unit, rounding, bendAngle: 90 }}
            onCancel={() => setSetupVisible(false)}
            onApply={applySetup}
          />
        </>
      }
    />
  );
}

function makeStyles(c: ThemePalette) {
  return StyleSheet.create({
    emptySequence: { color: c.muted, fontSize: 11, lineHeight: 16, textAlign: 'center', paddingVertical: spacing.xs },
    sequence: { gap: spacing.sm, paddingVertical: spacing.xs },
    markRow: { flexDirection: 'row', alignItems: 'center' },
    markMain: { flex: 1, minHeight: 46, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingLeft: spacing.xs, paddingRight: spacing.xs },
    markOrder: { color: c.mark, fontSize: 14, fontWeight: '800' },
    markPosition: { color: c.text, fontSize: 13, lineHeight: 17, fontWeight: '700', fontVariant: ['tabular-nums'] },
    markMeta: { color: c.muted, fontSize: 10, lineHeight: 14, fontWeight: '700', letterSpacing: 0.35 },
    smallAction: { width: 40, minHeight: 46, alignItems: 'center', justifyContent: 'center' },
    removeText: { color: c.error, fontSize: 19, lineHeight: 22, fontWeight: '600' },
    pressed: { opacity: 0.8 },
  });
}
