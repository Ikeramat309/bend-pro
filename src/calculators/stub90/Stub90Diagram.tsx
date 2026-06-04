import { ConduitDiagram2D } from '@/components/diagram/ConduitDiagram2D';
import type { Stub90ConduitDiagramData } from '@/components/diagram/diagramTypes';

export type Stub90DiagramProps = {
  data?: Stub90ConduitDiagramData;
  isEmpty?: boolean;
  isInvalid?: boolean;
};

export function Stub90Diagram({
  data,
  isEmpty = false,
  isInvalid = false,
}: Stub90DiagramProps) {
  return (
    <ConduitDiagram2D
      diagramData={isEmpty ? undefined : data}
      isInvalid={isInvalid}
      emptyMessage={
        isInvalid
          ? 'Stub length must be greater than deduct.'
          : 'Enter stub length to calculate deduct mark.'
      }
    />
  );
}
