/**
 * Compact bend visuals for field calculator hero cards.
 *
 * Keep this deliberately small: future bend types can add their own branch
 * without turning this into a generic drawing engine.
 */
import { MarkingGuide } from './MarkingGuide';

export type BendVisualType =
  | 'offset'
  | 'stub90'
  | 'backToBack90'
  | 'kick90'
  | 'rollingOffset'
  | 'parallelOffset'
  | 'saddle3'
  | 'saddle4';

export type BendVisualProps = {
  bendType: BendVisualType;
  mark1Label: string;
  mark1Value: string;
  mark2Label: string;
  mark2Value: string;
  distanceValue: string;
  angleDeg: number;
  isEmpty?: boolean;
  onPress?: () => void;
};

export function BendVisual({
  bendType,
  mark1Label,
  mark1Value,
  mark2Label,
  mark2Value,
  distanceValue,
  angleDeg,
  isEmpty = false,
  onPress,
}: BendVisualProps) {
  if (bendType !== 'offset') {
    return null;
  }

  return (
    <MarkingGuide
      variant="compact"
      mark1Label={mark1Label}
      mark1Value={mark1Value}
      mark2Label={mark2Label}
      mark2Value={mark2Value}
      distanceValue={distanceValue}
      angleDeg={angleDeg}
      isEmpty={isEmpty}
      compactChrome="embedded"
      unit=""
      onPress={onPress}
    />
  );
}
