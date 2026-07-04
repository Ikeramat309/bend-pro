import { buildManufacturerProfile } from './buildManufacturerProfile';

const GREENLEE_SOURCE = ['GREENLEE_SITE_RITE_52087654_REV3'] as const;

export const GREENLEE_SITE_RITE_ALUMINUM = buildManufacturerProfile({
  id: 'greenlee-site-rite-aluminum',
  name: 'Greenlee Site-Rite (Aluminum)',
  brand: 'Greenlee',
  series: 'Site-Rite hand bender',
  material: 'aluminum',
  verificationStatus: 'verified_default',
  description: 'Manufacturer chart — Greenlee Site-Rite use guide.',
  sourceNote: 'Take-up and radius from Greenlee Site-Rite use guide (52087654 Rev. 3).',
  sizeSpecs: {
    '1/2': {
      models: '840A; 840AH',
      takeUpInches: 5,
      centerlineRadiusInches: 4.1875,
      sourceIds: GREENLEE_SOURCE,
    },
    '3/4': {
      models: '841A; 841AH',
      takeUpInches: 6,
      centerlineRadiusInches: 5.125,
      sourceIds: GREENLEE_SOURCE,
    },
    '1': {
      models: '842A; 842AH',
      takeUpInches: 8,
      centerlineRadiusInches: 6.5,
      sourceIds: GREENLEE_SOURCE,
    },
    '1-1/4': {
      models: '843A; 843AH',
      takeUpInches: 11,
      centerlineRadiusInches: 9.625,
      sourceIds: GREENLEE_SOURCE,
    },
  },
});

export const GREENLEE_SITE_RITE_IRON = buildManufacturerProfile({
  id: 'greenlee-site-rite-iron',
  name: 'Greenlee Site-Rite (Iron)',
  brand: 'Greenlee',
  series: 'Site-Rite hand bender',
  material: 'iron',
  verificationStatus: 'verified_default',
  description: 'Manufacturer chart — Greenlee Site-Rite use guide.',
  sourceNote: 'Take-up and radius from Greenlee Site-Rite use guide (52087654 Rev. 3).',
  sizeSpecs: {
    '1/2': {
      models: '840F; 840FH',
      takeUpInches: 5,
      centerlineRadiusInches: 4.1875,
      sourceIds: GREENLEE_SOURCE,
    },
    '3/4': {
      models: '841F; 841FH',
      takeUpInches: 6,
      centerlineRadiusInches: 5.125,
      sourceIds: GREENLEE_SOURCE,
    },
    '1': {
      models: '842F; 842FH',
      takeUpInches: 8,
      centerlineRadiusInches: 6.5,
      sourceIds: GREENLEE_SOURCE,
    },
    '1-1/4': {
      models: '843F; 843FH',
      takeUpInches: 11,
      centerlineRadiusInches: 9.625,
      sourceIds: GREENLEE_SOURCE,
    },
  },
});

export const GREENLEE_SITE_RITE_DUAL_SHOE = buildManufacturerProfile({
  id: 'greenlee-site-rite-dual-shoe',
  name: 'Greenlee Site-Rite Dual-Shoe (844A)',
  brand: 'Greenlee',
  series: 'Site-Rite dual-shoe hand bender',
  material: 'aluminum dual-shoe',
  verificationStatus: 'verified_default',
  description: 'Manufacturer chart — Greenlee Site-Rite use guide.',
  sourceNote: 'Take-up and radius from Greenlee Site-Rite use guide (52087654 Rev. 3).',
  sizeSpecs: {
    '1/2': {
      models: '844A; 844AH — 1/2" groove',
      takeUpInches: 5,
      centerlineRadiusInches: 4.1875,
      sourceIds: GREENLEE_SOURCE,
      note: 'Dual-shoe model — values are for this groove/size.',
    },
    '3/4': {
      models: '844A; 844AH — 3/4" groove',
      takeUpInches: 6,
      centerlineRadiusInches: 5.125,
      sourceIds: GREENLEE_SOURCE,
      note: 'Dual-shoe model — values are for this groove/size.',
    },
  },
});

export const KLEIN_ANGLE_SETTER_IRON = buildManufacturerProfile({
  id: 'klein-angle-setter-iron',
  name: 'Klein Angle Setter (Iron)',
  brand: 'Klein',
  series: 'Angle Setter hand bender',
  material: 'iron',
  verificationStatus: 'verified_default',
  description: 'Manufacturer chart — Klein Angle Setter product specs.',
  sourceNote: 'Take-up and radius from Klein official product pages.',
  sizeSpecs: {
    '1/2': {
      models: '51608 head; 51603 full assembly',
      takeUpInches: 5,
      centerlineRadiusInches: 4.625,
      sourceIds: ['KLEIN_51608_PRODUCT'],
    },
    '3/4': {
      models: '51609 head; 51604 full assembly',
      takeUpInches: 6,
      centerlineRadiusInches: 5.5,
      sourceIds: ['KLEIN_51604_PRODUCT'],
    },
    '1': {
      models: '51610 head; 51605 full assembly',
      takeUpInches: 8,
      centerlineRadiusInches: 7.375,
      sourceIds: ['KLEIN_51610_PRODUCT'],
    },
  },
});

export const KLEIN_ANGLE_SETTER_ALUMINUM = buildManufacturerProfile({
  id: 'klein-angle-setter-aluminum',
  name: 'Klein Angle Setter (Aluminum)',
  brand: 'Klein',
  series: 'Angle Setter hand bender',
  material: 'aluminum',
  verificationStatus: 'verified_default',
  description: 'Manufacturer chart — Klein Angle Setter product specs.',
  sourceNote: 'Take-up and radius from Klein official product pages.',
  sizeSpecs: {
    '1/2': {
      models: '51606 full assembly',
      takeUpInches: 5,
      centerlineRadiusInches: 4.625,
      sourceIds: ['KLEIN_51606_PRODUCT'],
    },
    '3/4': {
      models: '51607 full assembly',
      takeUpInches: 6,
      centerlineRadiusInches: 5.5,
      sourceIds: ['KLEIN_51607_PRODUCT'],
    },
  },
});

const GARDNER_SOURCES = ['GARDNER_HOWTO_GAR_BRO_032_1220', 'GARDNER_NPA_759_BIGBEN'] as const;

export const GARDNER_BIGBEN_ALUMINUM = buildManufacturerProfile({
  id: 'gardner-bigben-aluminum',
  name: 'Gardner Bender BigBen (Aluminum)',
  brand: 'Gardner Bender',
  series: 'BigBen hand bender',
  material: 'aluminum',
  verificationStatus: 'verified_with_source_note',
  description: 'Manufacturer chart — Gardner BigBen How To Guide + product sheet.',
  sourceNote:
    'Radii from current How To Guide + NPA-759. The older B-0040 guide mislabels the deduct values (5/6/8) as radius — do not use it for radius.',
  sizeSpecs: {
    '1/2': {
      models: '960 head; 960H head+handle',
      takeUpInches: 5,
      centerlineRadiusInches: 3.69,
      sourceIds: GARDNER_SOURCES,
    },
    '3/4': {
      models: '961 head; 961H head+handle',
      takeUpInches: 6,
      centerlineRadiusInches: 4.74,
      sourceIds: GARDNER_SOURCES,
    },
    '1': {
      models: '962 head; 962H head+handle',
      takeUpInches: 8,
      centerlineRadiusInches: 5.81,
      sourceIds: GARDNER_SOURCES,
    },
  },
});

const IDEAL_FIELD_LAYOUT_SOURCE_NOTE =
  'Official stub-up heights confirmed; no official centerline radius published — precise diagram geometry not available.';

export const IDEAL_ALUMINUM = buildManufacturerProfile({
  id: 'ideal-aluminum',
  name: 'IDEAL Aluminum',
  brand: 'IDEAL',
  series: 'Aluminum hand bender',
  material: 'aluminum',
  verificationStatus: 'field_layout_only',
  description: 'Manufacturer stub-up heights — no published centerline radius.',
  sourceNote: IDEAL_FIELD_LAYOUT_SOURCE_NOTE,
  sizeSpecs: {
    '1/2': {
      models: '74-031 head; 74-046 head+handle',
      takeUpInches: 5,
      sourceIds: ['IDEAL_74_031_PRODUCT'],
    },
    '3/4': {
      models: '74-032 head; 74-047 head+handle',
      takeUpInches: 6,
      sourceIds: ['IDEAL_74_032_PRODUCT'],
    },
  },
});

export const IDEAL_DUCTILE_IRON = buildManufacturerProfile({
  id: 'ideal-ductile-iron',
  name: 'IDEAL Ductile Iron',
  brand: 'IDEAL',
  series: 'Ductile iron hand bender',
  material: 'ductile iron',
  verificationStatus: 'field_layout_only',
  description: 'Manufacturer stub-up heights — no published centerline radius.',
  sourceNote: IDEAL_FIELD_LAYOUT_SOURCE_NOTE,
  sizeSpecs: {
    '1/2': {
      models: '74-001 head; 74-026 head+handle; 74-126 BenderBoot',
      takeUpInches: 5,
      sourceIds: ['IDEAL_74_001_PRODUCT'],
    },
    '3/4': {
      models: '74-002 head; 74-027 head+handle; 74-127 BenderBoot',
      takeUpInches: 6,
      sourceIds: ['IDEAL_74_002_PRODUCT'],
    },
    '1': {
      models: '74-003 head; 74-028 head+handle',
      takeUpInches: 8,
      sourceIds: ['IDEAL_74_003_PRODUCT'],
    },
    '1-1/4': {
      models: '74-034 head+handle',
      takeUpInches: 11,
      sourceIds: ['IDEAL_74_034_PRODUCT'],
    },
  },
});

const MILWAUKEE_REFERENCE_SOURCE_NOTE =
  'Model and capacity confirmed; Milwaukee publishes no stub-up height or radius. Set a custom deduct to calculate marks.';

export const MILWAUKEE_ALUMINUM = buildManufacturerProfile({
  id: 'milwaukee-aluminum',
  name: 'Milwaukee (Aluminum)',
  brand: 'Milwaukee',
  series: 'Hand bender',
  material: 'aluminum',
  verificationStatus: 'reference_only',
  description: 'Identity only — no published take-up. Calibrate with a custom deduct.',
  sourceNote: MILWAUKEE_REFERENCE_SOURCE_NOTE,
  sizeSpecs: {
    '1/2': {
      models: '48-22-4070',
      sourceIds: ['MILWAUKEE_48_22_4070_PRODUCT'],
    },
    '3/4': {
      models: '48-22-4071',
      sourceIds: ['MILWAUKEE_48_22_4071_PRODUCT'],
    },
    '1': {
      models: '48-22-4072',
      sourceIds: ['MILWAUKEE_48_22_4072_PRODUCT'],
    },
  },
});

export const MILWAUKEE_IRON = buildManufacturerProfile({
  id: 'milwaukee-iron',
  name: 'Milwaukee (Iron)',
  brand: 'Milwaukee',
  series: 'Hand bender',
  material: 'ductile iron',
  verificationStatus: 'reference_only',
  description: 'Identity only — no published take-up. Calibrate with a custom deduct.',
  sourceNote: MILWAUKEE_REFERENCE_SOURCE_NOTE,
  sizeSpecs: {
    '1/2': {
      models: '48-22-4080',
      sourceIds: ['MILWAUKEE_48_22_4080_PRODUCT'],
    },
    '3/4': {
      models: '48-22-4081',
      sourceIds: ['MILWAUKEE_48_22_4081_PRODUCT'],
    },
    '1': {
      models: '48-22-4082',
      sourceIds: ['MILWAUKEE_48_22_4082_PRODUCT'],
    },
  },
});

export const SOUTHWIRE_MCB = buildManufacturerProfile({
  id: 'southwire-mcb',
  name: 'Southwire MCB',
  brand: 'Southwire',
  series: 'Conduit hand bender',
  material: 'aluminum (1/2, 3/4) / ductile iron (1)',
  verificationStatus: 'reference_only',
  description: 'Identity only — no published take-up. Calibrate with a custom deduct.',
  sourceNote:
    'Model and capacity confirmed; Southwire publishes no stub-up height or radius. Set a custom deduct to calculate marks.',
  sizeSpecs: {
    '1/2': {
      models: 'MCB1/2; 58281340',
      sourceIds: ['SOUTHWIRE_2024_HAND_BENDERS_CUTSHEET'],
    },
    '3/4': {
      models: 'MCB3/4; 58281240',
      sourceIds: ['SOUTHWIRE_2024_HAND_BENDERS_CUTSHEET'],
    },
    '1': {
      models: 'MCB1; 58281440',
      sourceIds: ['SOUTHWIRE_2024_HAND_BENDERS_CUTSHEET'],
    },
  },
});

/** All manufacturer profiles from workbook v1.1. */
export const MANUFACTURER_BENDER_PROFILES = [
  GREENLEE_SITE_RITE_ALUMINUM,
  GREENLEE_SITE_RITE_IRON,
  GREENLEE_SITE_RITE_DUAL_SHOE,
  KLEIN_ANGLE_SETTER_IRON,
  KLEIN_ANGLE_SETTER_ALUMINUM,
  GARDNER_BIGBEN_ALUMINUM,
  IDEAL_ALUMINUM,
  IDEAL_DUCTILE_IRON,
  MILWAUKEE_ALUMINUM,
  MILWAUKEE_IRON,
  SOUTHWIRE_MCB,
] as const;
