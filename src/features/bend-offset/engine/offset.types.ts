/**
 * FILE: src/calculators/offset/offset.types.ts
 *
 * PURPOSE:
 * TypeScript type definitions for the Offset Bend calculator only.
 *
 * BEGINNER NOTE:
 * A "type" describes the shape of data. It does not run any math.
 * These types make sure the screen, validation, and logic files all agree
 * on what an Offset input/result should look like.
 */

// =============================================================================
// BASIC OPTIONS — values the user can choose from the UI
// =============================================================================

/** App unit mode. Metric input means the user types millimetres. Imperial means inches. */
export type Unit = 'imperial' | 'metric';

/** Standard offset bend angles used by electricians. */
export type BendAngle = 10 | 22.5 | 30 | 45 | 60;

/**
 * Rounding options must match your existing RoundingSelector component.
 * Imperial uses fractions. Metric uses mm steps.
 */
export type RoundingOption = 'exact' | '1/16' | '1/8' | '1/4' | '1mm' | '5mm' | '10mm';
// conduit types 
export type ConduitType = 'EMT' | 'RMC' | 'IMC' | 'PVC';
/** Warning shown to the user. It does not always stop calculation. */
export type OffsetWarning = {
  id: string;
  message: string;
};

/**
 * Everything the offset calculator needs to run.
 *
 * DATA FLOW:
 * OffsetScreen collects these values from UI state,
 * then passes this object into calculateOffset().
 */
export type OffsetInput = {
  offsetHeight: number;
  firstMark?: number;
  bendAngle: BendAngle;
  unit: Unit;
  rounding: RoundingOption;
  conduitSize: string;
  conduitType: ConduitType;
};


// Offset Geometry 

export type OffsetVisualGeometry = {
  calculatorType: 'offset';
  unit: Unit;
  conduitType: ConduitType;
  conduitSize: string;
  angleDeg: BendAngle;

  offsetHeightInches: number;
  spacingInches: number;
  shrinkInches: number;

  firstMarkInches?: number;
  secondMarkInches?: number;
  adjustedFirstMarkInches?: number;

  points: {
    x: number;
    y: number;
  }[];
};

/**
 * Final calculation output.
 *
 * IMPORTANT:
 * Raw values stay in inches so the math is consistent.
 * Formatted values are what the UI displays to the user.
 */
export type OffsetResult = {
  offsetHeightInches: number;

  spacingInches: number;
  shrinkInches: number;

  firstMarkInches?: number;
  secondMarkInches?: number;
  adjustedFirstMarkInches?: number;

  spacingFormatted: string;
  shrinkFormatted: string;

  firstMarkFormatted?: string;
  secondMarkFormatted?: string;
  adjustedFirstMarkFormatted?: string;

  multiplier: number;
  shrinkPerInch: number;
  visualGeometry: OffsetVisualGeometry;
  steps: string[];
  benderNotes:string[]
  warnings: OffsetWarning[];
};

// =============================================================================
// EXPORTS — all exported inline above
// =============================================================================
