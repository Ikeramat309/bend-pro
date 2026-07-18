export const compound90Copy = {
  screenTitle: 'Compound 90',
  fields: {
    shape: { label: 'Obstruction Shape' },
    primaryDimension: {
      circle: 'Diameter',
      box: 'Height',
      diamond: 'Side Length',
      placeholder: 'Enter size',
      errorRequired: 'Enter a dimension greater than 0.',
    },
    secondaryDimension: {
      label: 'Width',
      placeholder: 'Enter width',
      errorRequired: 'Enter a width greater than 0.',
    },
    clearance: {
      label: 'Clearance / Side',
      placeholder: '0',
      error: 'Clearance must be 0 or greater.',
    },
    firstMark: {
      label: 'First Bend Mark',
      placeholder: 'Optional',
      addButton: 'Add First Mark',
    },
  },
  results: {
    distanceBetweenBends: 'Centers Apart',
    firstMark: 'First Bend Mark',
    secondMark: 'Second Bend Mark',
  },
  diagram: {
    emptyMessage: 'Choose how the obstruction sits, then enter its size.',
    invalidMessage: 'Enter valid obstruction dimensions.',
    fieldCue: 'Mark both centers · bend 45° twice · keep bends in plane',
  },
} as const;
