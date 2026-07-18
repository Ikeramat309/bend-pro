/** User-facing labels and messages for Back-to-Back 90. */
export const backToBackCopy = {
  screenTitle: 'Back-to-Back 90\u00B0',
  fields: {
    distance: {
      label: 'Back-to-Back Distance',
      placeholder: '0',
      errorRequired: 'Enter a back-to-back distance greater than 0.',
    },
    firstStub: {
      label: 'First Stub Length',
      placeholder: 'Optional',
      addButton: 'Add First Stub',
      removeButton: 'Remove First Stub',
      errorRequired: 'Enter a first stub length greater than 0.',
    },
  },
  results: {
    second90Mark: 'Second 90 Mark',
    firstDeductMark: 'First Deduct Mark',
    deduct: 'Deduct',
    deductCustom: 'Deduct \u2022 Custom',
  },
  trust: {
    deductScope: 'Bender affects first stub deduct only',
  },
  deductOverride: {
    title: 'Deduct Override',
    fieldLabel: 'Custom Deduct',
    placeholder: 'Bender value',
    description:
      'Enter a measured deduct for the first stub. It replaces the bender chart value for this EMT size.',
    clearHint: 'Leave blank to use the bender value.',
    errorInvalid: 'Enter a value greater than 0, or leave blank.',
  },
  diagram: {
    backToBackDistance: 'Back-to-Back',
    firstStub: 'First Stub',
    arrowMark: '1 \u00B7 Arrow',
    starMark: '2 \u00B7 Star',
    fieldCue: 'First 90: arrow \u00B7 measure from back \u00B7 second 90: star',
    emptyMessage: 'Enter the back-to-back distance.',
    invalidMessage: 'Check the entered measurements.',
  },
} as const;
