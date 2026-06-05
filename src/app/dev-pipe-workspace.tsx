import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

import {
  DimensionLine,
  MarkLine,
  PipeSegment,
} from '@/shared/diagrams/primitives';
import { AppScreen, CalculatorHeader } from '@/shared/ui';
import {
  GuidedModeButton,
  MeasurementChip,
  MethodPill,
  PipeWorkspaceCard,
  SpecStrip,
} from '@/shared/workspace';
import { workspaceColors, workspaceSpacing } from '@/theme/workspaceTheme';

type PreviewMeasurementId = 'deductMark' | 'stubLength' | 'deduct' | 'legLength';

const SPEC_ITEMS = [
  { id: 'conduit', label: 'EMT' },
  { id: 'size', label: '3/4"' },
  { id: 'bender', label: 'Ideal' },
  { id: 'angle', label: '90°' },
];

const MEASUREMENTS = [
  { id: 'deductMark' as const, label: 'Deduct Mark', value: '23 1/2', tone: 'default' as const },
  { id: 'stubLength' as const, label: 'Stub Length', value: '29 1/2', tone: 'blue' as const },
  { id: 'deduct' as const, label: 'Deduct', value: '6', tone: 'orange' as const },
  { id: 'legLength' as const, label: 'Leg Length', value: '14 1/2', tone: 'blue' as const },
];

function Stub90PreviewDiagram({
  selectedMeasurement,
}: {
  selectedMeasurement: PreviewMeasurementId | null;
}) {
  const pipePath = 'M 18 218 H 262 Q 308 218 308 172 V 34';
  const bendPath = 'M 262 218 Q 308 218 308 172';

  return (
    <Svg viewBox="0 0 360 300" width="100%" height={280}>
      <PipeSegment d={pipePath} shadow active={selectedMeasurement === 'stubLength'} />
      <Path
        d={bendPath}
        fill="none"
        stroke={
          selectedMeasurement === 'deduct'
            ? workspaceColors.accentOrangeSoft
            : 'rgba(255, 122, 47, 0.12)'
        }
        strokeWidth={24}
        strokeLinecap="round"
      />
      <PipeSegment
        d={bendPath}
        color={workspaceColors.pipeDark}
        strokeWidth={2}
        active={selectedMeasurement === 'deduct'}
      />

      <Circle cx={18} cy={218} r={5} fill={workspaceColors.pipeDark} />

      <MarkLine
        x={238}
        y1={204}
        y2={232}
        label="DEDUCT MARK"
        active={selectedMeasurement === 'deductMark'}
      />

      <DimensionLine
        x1={20}
        y1={264}
        x2={236}
        y2={264}
        label='DEDUCT MARK 23 1/2"'
        tone="default"
        active={selectedMeasurement === 'deductMark'}
      />

      <DimensionLine
        x1={334}
        y1={218}
        x2={334}
        y2={34}
        label='STUB 29 1/2"'
        tone="blue"
        active={selectedMeasurement === 'stubLength'}
      />

      <G>
        <DimensionLine
          x1={278}
          y1={173}
          x2={238}
          y2={151}
          label='DEDUCT 6"'
          tone="orange"
          showArrows={false}
          active={selectedMeasurement === 'deduct'}
        />
      </G>

      <DimensionLine
        x1={18}
        y1={20}
        x2={262}
        y2={20}
        label='LEG 14 1/2"'
        tone="blue"
        active={selectedMeasurement === 'legLength'}
      />
    </Svg>
  );
}

export default function DevPipeWorkspaceScreen() {
  const router = useRouter();
  const [selectedMeasurement, setSelectedMeasurement] = useState<PreviewMeasurementId | null>(
    'stubLength',
  );

  function handleBackPress() {
    const safeRouter = router as typeof router & { canGoBack?: () => boolean };

    if (typeof safeRouter.canGoBack === 'function' && safeRouter.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  }

  return (
    <AppScreen scroll contentStyle={styles.screenContent}>
      <CalculatorHeader
        title="90° Bend"
        subtitle="Pipe workspace preview"
        onBackPress={handleBackPress}
      />

      <MethodPill label="Multiplier Method" active />

      <SpecStrip items={SPEC_ITEMS} />

      <PipeWorkspaceCard gridHeight={300}>
        <Stub90PreviewDiagram selectedMeasurement={selectedMeasurement} />

        <View style={styles.chipGrid}>
          {MEASUREMENTS.map((measurement) => (
            <MeasurementChip
              key={measurement.id}
              label={measurement.label}
              value={measurement.value}
              unit='"'
              tone={measurement.tone}
              active={selectedMeasurement === measurement.id}
              onPress={() =>
                setSelectedMeasurement((current) =>
                  current === measurement.id ? null : measurement.id,
                )
              }
            />
          ))}
        </View>
      </PipeWorkspaceCard>

      <GuidedModeButton onPress={() => undefined} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingTop: workspaceSpacing.sm,
    gap: workspaceSpacing.lg,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: workspaceSpacing.sm,
  },
});
