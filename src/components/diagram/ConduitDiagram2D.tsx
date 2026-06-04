import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Marker,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';

import { radius, spacing } from '@/theme';

import { conduitDiagramMetrics, conduitDiagramTheme as theme } from './diagramTheme';
import type { ConduitDiagramData, Stub90ConduitDiagramData } from './diagramTypes';

export type ConduitDiagram2DProps = {
  diagramData?: ConduitDiagramData;
  isInvalid?: boolean;
  emptyMessage?: string;
};

export function ConduitDiagram2D({
  diagramData,
  isInvalid = false,
  emptyMessage = 'Enter valid measurements to draw the conduit layout.',
}: ConduitDiagram2DProps) {
  if (!diagramData || isInvalid) {
    return (
      <View style={styles.card}>
        <Stub90GhostPreview message={emptyMessage} />
      </View>
    );
  }

  if (diagramData.type === 'stub90') {
    return (
      <View style={styles.card}>
        <Stub90CombinedDiagram data={diagramData} />
      </View>
    );
  }

  return null;
}

function Stub90GhostPreview({ message }: { message: string }) {
  return (
    <Svg viewBox="0 0 360 300" width="100%" height={300}>
      <Defs>
        <LinearGradient id="ghostPipeGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={theme.pipe} stopOpacity="0.28" />
          <Stop offset="1" stopColor={theme.pipeCore} stopOpacity="0.24" />
        </LinearGradient>
      </Defs>

      <Rect x={1} y={1} width={358} height={298} rx={16} fill={theme.canvas} stroke={theme.border} />
      <Path
        d="M 18 218 H 262 Q 308 218 308 172 V 34"
        fill="none"
        stroke={theme.pipeShadow}
        strokeWidth={20}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.72}
      />
      <Path
        d="M 18 218 H 262 Q 308 218 308 172 V 34"
        fill="none"
        stroke="url(#ghostPipeGradient)"
        strokeWidth={conduitDiagramMetrics.pipeStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line
        x1={238}
        y1={205}
        x2={238}
        y2={230}
        stroke={theme.mark}
        strokeWidth={conduitDiagramMetrics.markStroke}
        strokeLinecap="round"
        opacity={0.34}
      />
      <Line x1={332} y1={218} x2={332} y2={34} stroke={theme.dimension} strokeWidth={0.9} opacity={0.45} />
      <Line x1={18} y1={262} x2={238} y2={262} stroke={theme.dimension} strokeWidth={0.9} opacity={0.34} />
      <SvgText x={180} y={282} fill={theme.mutedLabel} fontSize={12} textAnchor="middle">
        {message}
      </SvgText>
    </Svg>
  );
}

function Stub90CombinedDiagram({ data }: { data: Stub90ConduitDiagramData }) {
  const hasLegLength = Boolean(data.formatted.legLength);

  return (
    <Svg viewBox="0 0 360 300" width="100%" height={300}>
      <Defs>
        <LinearGradient id="pipeGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={theme.pipe} stopOpacity="1" />
          <Stop offset="1" stopColor={theme.pipeCore} stopOpacity="1" />
        </LinearGradient>
        <Marker
          id="diagramArrow"
          markerWidth={5}
          markerHeight={5}
          refX={3.2}
          refY={3.2}
          orient="auto"
          markerUnits="strokeWidth">
          <Path d="M 0 0 L 6.4 3.2 L 0 6.4 z" fill={theme.arrowFill} />
        </Marker>
      </Defs>

      <Rect x={1} y={1} width={358} height={298} rx={16} fill={theme.canvas} stroke={theme.border} />

      <Path
        d="M 18 218 H 262 Q 308 218 308 172 V 34"
        fill="none"
        stroke={theme.pipeShadow}
        strokeWidth={20}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 18 218 H 262 Q 308 218 308 172 V 34"
        fill="none"
        stroke="url(#pipeGradient)"
        strokeWidth={conduitDiagramMetrics.pipeStroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 34 213 H 262 Q 300 213 300 172 V 50"
        fill="none"
        stroke={theme.pipeHighlight}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <Path
        d="M 260 218 Q 308 218 308 170"
        fill="none"
        stroke={theme.deduct}
        strokeWidth={25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 262 218 Q 308 218 308 172"
        fill="none"
        stroke={theme.deductStroke}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Line x1={278} y1={173} x2={238} y2={151} stroke={theme.deductStroke} strokeWidth={0.9} />
      <SvgText x={216} y={147} fill={theme.deductStroke} fontSize={10.5} fontWeight="700" textAnchor="middle">
        DEDUCT
      </SvgText>
      <SvgText x={216} y={161} fill={theme.mutedLabel} fontSize={10.5} textAnchor="middle">
        {data.formatted.deduct}
      </SvgText>

      <Circle cx={18} cy={218} r={6.5} fill={theme.pipeCore} />
      <Line x1={18} y1={207} x2={18} y2={229} stroke={theme.dimensionStrong} strokeWidth={0.9} opacity={0.7} />

      <G>
        <Line
          x1={238}
          y1={203}
          x2={238}
          y2={232}
          stroke={theme.mark}
          strokeWidth={conduitDiagramMetrics.markStroke}
          strokeLinecap="round"
        />
      <SvgText x={238} y={190} fill={theme.mark} fontSize={10.5} fontWeight="800" textAnchor="middle">
          DEDUCT MARK
        </SvgText>
      </G>

      <Line
        x1={20}
        y1={264}
        x2={236}
        y2={264}
        stroke={theme.dimension}
        strokeWidth={conduitDiagramMetrics.dimensionStroke}
        markerStart="url(#diagramArrow)"
        markerEnd="url(#diagramArrow)"
      />
      <Line x1={18} y1={236} x2={18} y2={272} stroke={theme.dimension} strokeWidth={0.7} />
      <Line x1={238} y1={236} x2={238} y2={272} stroke={theme.dimension} strokeWidth={0.7} />
      <SvgText x={128} y={256} fill={theme.mutedLabel} fontSize={10.5} fontWeight="700" textAnchor="middle">
        DEDUCT MARK
      </SvgText>
      <SvgText x={128} y={279} fill={theme.label} fontSize={11.5} fontWeight="800" textAnchor="middle">
        {data.formatted.firstMark}
      </SvgText>

      <Line
        x1={334}
        y1={218}
        x2={334}
        y2={34}
        stroke={theme.dimension}
        strokeWidth={conduitDiagramMetrics.dimensionStroke}
        markerStart="url(#diagramArrow)"
        markerEnd="url(#diagramArrow)"
      />
      <Line x1={314} y1={218} x2={342} y2={218} stroke={theme.dimension} strokeWidth={0.7} />
      <Line x1={314} y1={34} x2={342} y2={34} stroke={theme.dimension} strokeWidth={0.7} />
      <SvgText
        x={351}
        y={126}
        fill={theme.label}
        fontSize={10.5}
        fontWeight="800"
        textAnchor="middle"
        transform="rotate(90 351 126)">
        STUB LENGTH {data.formatted.stubLength}
      </SvgText>

      {hasLegLength ? (
        <>
          <Line
            x1={18}
            y1={20}
            x2={262}
            y2={20}
            stroke={theme.dimension}
            strokeWidth={conduitDiagramMetrics.dimensionStroke}
            markerStart="url(#diagramArrow)"
            markerEnd="url(#diagramArrow)"
          />
          <Line x1={18} y1={14} x2={18} y2={30} stroke={theme.dimension} strokeWidth={0.7} />
          <Line x1={262} y1={14} x2={262} y2={30} stroke={theme.dimension} strokeWidth={0.7} />
          <SvgText x={140} y={13} fill={theme.label} fontSize={10.5} fontWeight="800" textAnchor="middle">
            LEG LENGTH {data.formatted.legLength}
          </SvgText>
        </>
      ) : null}

      <SvgText x={306} y={28} fill={theme.mutedLabel} fontSize={11} fontWeight="700" textAnchor="middle">
        90° STUB
      </SvgText>

      {data.formatted.conduitLength ? (
        <G>
          <Rect x={172} y={210} width={142} height={24} rx={12} fill="rgba(16, 23, 34, 0.92)" stroke={theme.border} />
          <SvgText x={243} y={226} fill={theme.label} fontSize={11} fontWeight="700" textAnchor="middle">
            CONDUIT {data.formatted.conduitLength}
          </SvgText>
        </G>
      ) : null}
    </Svg>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: theme.canvas,
    marginTop: spacing.xs,
  },
});
