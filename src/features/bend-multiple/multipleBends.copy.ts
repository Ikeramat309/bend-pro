export const multipleBendsCopy = {
  screenTitle: 'Multiple Bends',
  fields: {
    stickLength: 'Conduit Length',
    markPosition: 'Mark From Start',
    markType: 'Mark Type',
    bendAngle: 'Bend Angle',
    direction: 'Bend Direction',
    flip: 'Flip Conduit Before Bend',
  },
  results: {
    tail: 'Tail After Last Mark',
    marks: 'Marks',
    totalDegrees: 'Total Bend',
  },
  diagram: {
    empty: 'Add a bend or cut mark to build the stick plan.',
    invalid: 'Fix the highlighted marks before using this layout.',
    fieldCue: 'Measure every mark from the same start end',
  },
} as const;

