/**
 * FILE: src/calculators/offset/OffsetScreen.tsx
 *
 * PURPOSE:
 * Full user-facing Offset Bend calculator screen.
 *
 * DATA FLOW:
 * 1. User types/selects values in this screen.
 * 2. React state stores those values as strings/options.
 * 3. useMemo sends clean numbers into calculateOffset().
 * 4. calculateOffset() returns formatted results.
 * 5. ResultCard displays the results.
 *
 * IMPORTANT:
 * This file is UI only.
 * The math stays in offset.logic.ts.
 */

// IMPORTS
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
import { CalculatorRadii, CalculatorSpacing, CalculatorTypography, useCalculatorTheme } from '@/theme';

import { calculateOffset } from './offset.logic';
import type { BendAngle, RoundingOption, Unit } from './offset.types';

// =============================================================================
// DEFAULTS — starting values for this calculator
// =============================================================================

const DEFAULT_UNIT: Unit = 'imperial';
const DEFAULT_ANGLE: BendAngle = 30;
const DEFAULT_CONDUIT_TYPE: ConduitType = 'EMT';

// =============================================================================
// SMALL DISPLAY SECTIONS — only used by this screen
// =============================================================================

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const colors = useCalculatorTheme();

  return (
    <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      <Text style={[styles.infoTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.infoBody}>{children}</View>
    </View>
  );
}

function InfoLine({ children }: { children: React.ReactNode }) {
  const colors = useCalculatorTheme();

  return <Text style={[styles.infoText, { color: colors.textSecondary }]}>{children}</Text>;
}

// =============================================================================
// MAIN SCREEN
// =============================================================================

export default function OffsetScreen() {
  // ---------------------------------------------------------------------------
  // STATE — what the user typed or selected
  // ---------------------------------------------------------------------------

  const [unit, setUnit] = useState<Unit>(DEFAULT_UNIT);
  const [bendAngle, setBendAngle] = useState<BendAngle>(DEFAULT_ANGLE);
  const [rounding, setRounding] = useState<RoundingOption>('1/16');

  // TextInputs store strings. First mark starts empty = optional (no layout mark mode).
  const [offsetHeightText, setOffsetHeightText] = useState('');
  const [firstMark, setFirstMark] = useState('');

  const [conduitType, setConduitType] = useState<ConduitType>(DEFAULT_CONDUIT_TYPE);
  const [conduitSize, setConduitSize] = useState('1/2');

  // ---------------------------------------------------------------------------
  // DERIVED VALUES — convert UI strings into calculator-friendly numbers
  // ---------------------------------------------------------------------------

  const offsetHeight = Number(offsetHeightText || 0);

  // BEGINNER NOTE: undefined tells the engine to skip mark-distance outputs.
  const firstMarkNumber = firstMark.trim() === '' ? undefined : Number(firstMark);

  const unitLabel = unit === 'metric' ? 'mm' : 'in';
  const subtitle =
    unit === 'metric'
      ? 'Metric mode: enter and read measurements in millimetres only.'
      : 'Imperial mode: enter and read measurements in inches only.';

  // ---------------------------------------------------------------------------
  // UNIT CHANGE — do NOT auto-convert typed input
  // ---------------------------------------------------------------------------

  function handleUnitChange(nextUnit: Unit) {
    setUnit(nextUnit);

    setConduitSize(nextUnit === 'metric' ? '21' : '1/2');
    setRounding(nextUnit === 'metric' ? '1mm' : '1/16');
  }

  // ---------------------------------------------------------------------------
  // CALCULATION — UI sends input into the pure logic file
  // ---------------------------------------------------------------------------

  const result = useMemo(() => {
    return calculateOffset({
      offsetHeight,
      firstMark: firstMarkNumber,
      bendAngle,
      unit,
      rounding,
      conduitSize,
      conduitType,
    });
  }, [offsetHeight, firstMarkNumber, bendAngle, unit, rounding, conduitSize, conduitType]);

  const firstMarkInputError =
    firstMark.trim() !== '' &&
    (firstMarkNumber === undefined || !Number.isFinite(firstMarkNumber) || firstMarkNumber < 0)
      ? 'Enter a valid non-negative value, or leave blank.'
      : undefined;

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------

  return (
    <CalculatorLayout title="Offset Bend Beta" subtitle={subtitle}>
      <UnitToggle value={unit} onChange={handleUnitChange} />

      <ConduitSelector
        conduitType={conduitType}
        onConduitTypeChange={setConduitType}
        sizeId={conduitSize}
        onSizeChange={setConduitSize}
        unitSystem={unit}
      />

      <AngleSelector
        label="Bend angle"
        value={bendAngle as AngleOption}
        onChange={(angle) => setBendAngle(angle as BendAngle)}
      />

      <RoundingSelector
        value={rounding as RoundingId}
        onChange={(id) => setRounding(id as RoundingOption)}
        unitSystem={unit}
      />

      <InputCard
        label="Offset height"
        value={offsetHeightText}
        onChangeText={setOffsetHeightText}
        placeholder={`Enter offset height in ${unitLabel}`}
        unitLabel={unitLabel}
        error={offsetHeightText !== '' && offsetHeight <= 0 ? 'Enter a value greater than 0.' : undefined}
      />

      <InputCard
        label="First mark"
        value={firstMark}
        onChangeText={setFirstMark}
        placeholder="Optional layout mark"
        unitLabel={unitLabel}
        error={firstMarkInputError}
      />

      <ResultCard title="Spacing between bends" value={result.spacingFormatted} highlight />
      <ResultCard title="Shrink" value={result.shrinkFormatted} />
      <ResultCard title="Multiplier" value={`${result.multiplier}`} subtitle={`${bendAngle}° offset multiplier`} />

      {result.firstMarkFormatted ? (
        <ResultCard title="First mark" value={result.firstMarkFormatted} />
      ) : null}

      {result.secondMarkFormatted ? (
        <ResultCard title="Second mark" value={result.secondMarkFormatted} highlight />
      ) : null}

      {result.adjustedFirstMarkFormatted ? (
        <ResultCard
          title="Shrink-adjusted first mark"
          value={result.adjustedFirstMarkFormatted}
          subtitle="Use when the finished offset must land at a specific point"
        />
      ) : null}

      <InfoSection title="Warnings">
        {result.warnings.length === 0 ? (
          <InfoLine>No warnings.</InfoLine>
        ) : (
          result.warnings.map((warning) => <InfoLine key={warning.id}>• {warning.message}</InfoLine>)
        )}
      </InfoSection>

      <InfoSection title="How to bend">
        {result.firstMarkFormatted && result.secondMarkFormatted ? (
          <>
            <InfoLine>1. Mark your first bend at {result.firstMarkFormatted}.</InfoLine>
            <InfoLine>2. Measure {result.spacingFormatted} from the first mark.</InfoLine>
            <InfoLine>3. Mark your second bend at {result.secondMarkFormatted}.</InfoLine>
            <InfoLine>4. Bend both marks using {bendAngle}°.</InfoLine>
            <InfoLine>5. Account for shrink: {result.shrinkFormatted}.</InfoLine>
          </>
        ) : (
          <>
            <InfoLine>1. Space your bends {result.spacingFormatted} apart (center to center).</InfoLine>
            <InfoLine>2. Bend both marks using {bendAngle}°.</InfoLine>
            <InfoLine>3. Account for shrink: {result.shrinkFormatted}.</InfoLine>
            <InfoLine>4. Enter a first mark above to calculate exact mark locations on the conduit.</InfoLine>
          </>
        )}
      </InfoSection>

      <InfoSection title="Calculation steps">
        {result.steps.map((step) => (
          <InfoLine key={step}>• {step}</InfoLine>
        ))}
      </InfoSection>

      <InfoSection title="Bender / field notes">
        {result.benderNotes.map((note) => (
          <InfoLine key={note}>• {note}</InfoLine>
        ))}
      </InfoSection>
    </CalculatorLayout>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  infoCard: {
    borderRadius: CalculatorRadii.lg,
    borderWidth: 1,
    padding: CalculatorSpacing.lg,
    gap: CalculatorSpacing.md,
  },
  infoTitle: {
    ...CalculatorTypography.label,
    fontSize: 16,
  },
  infoBody: {
    gap: CalculatorSpacing.sm,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

// =============================================================================
// EXPORTS — default OffsetScreen exported above
// =============================================================================
