export type Stub90ConduitDiagramData = {
  type: 'stub90';
  firstMark: number;
  stubLength: number;
  deduct: number;
  legLength?: number;
  unitLabel: string;
  formatted: {
    firstMark: string;
    stubLength: string;
    deduct: string;
    legLength?: string;
    conduitLength?: string;
  };
};

export type ConduitDiagramData = Stub90ConduitDiagramData;
