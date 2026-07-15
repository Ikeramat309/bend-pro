#!/usr/bin/env node
/**
 * Correction-only pass for research/benders/data/*.json
 * Does not touch src/data/benders/.
 *
 * Ordered rebuild (deterministic):
 *   1. node research/benders/scripts/build-corpus.mjs
 *   2. node research/benders/scripts/enrich-from-agents.mjs
 *   3. node research/benders/scripts/correct-corpus.mjs   ← this file
 *   4. node research/benders/scripts/validate.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'data');
const DATE = '2026-07-14';
const repaired = [];

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA, name), 'utf8'));
}
function save(name, doc) {
  fs.writeFileSync(path.join(DATA, name), JSON.stringify(doc, null, 2) + '\n');
}
function note(id, why) {
  repaired.push({ id, why });
}

const manufacturers = load('manufacturers.json');
const sources = load('sources.json');
const models = load('models.json');
const measurements = load('measurements.json');
const conflicts = load('conflicts.json');

function modelById(id) {
  return models.models.find((m) => m.id === id);
}
function factById(id) {
  return measurements.measurements.find((f) => f.id === id);
}
function upsertSource(s) {
  const i = sources.sources.findIndex((x) => x.id === s.id);
  if (i >= 0) sources.sources[i] = { ...sources.sources[i], ...s };
  else sources.sources.push(s);
}
function upsertFact(f) {
  const i = measurements.measurements.findIndex((x) => x.id === f.id);
  const full = {
    accessoryOrShoeId: null,
    operation: null,
    page: null,
    section: null,
    table: null,
    excerpt: null,
    conflictGroupId: null,
    notes: '',
    productionScope: 'emt_in_scope',
    derivation: 'direct',
    ...f,
  };
  if (i >= 0) measurements.measurements[i] = { ...measurements.measurements[i], ...full };
  else measurements.measurements.push(full);
}
function upsertConflict(c) {
  const i = conflicts.conflicts.findIndex((x) => x.id === c.id);
  if (i >= 0) conflicts.conflicts[i] = c;
  else conflicts.conflicts.push(c);
}
function upsertModel(m) {
  const i = models.models.findIndex((x) => x.id === m.id);
  const full = {
    introducedDate: null,
    discontinuedDate: null,
    replacementModelIds: [],
    parentFrameModelId: null,
    operationMode: null,
    ...m,
  };
  if (i >= 0) models.models[i] = { ...models.models[i], ...full };
  else models.models.push(full);
}

// ---------------------------------------------------------------------------
// 3a. Greenlee 844A/AH — merge product-page scope ambiguity
// ---------------------------------------------------------------------------
upsertSource({
  id: 'src-greenlee-844ah-product',
  publisher: 'Greenlee',
  manufacturerId: 'mfr-greenlee',
  title: '844AH Dual-Shoe Hand Bender w/ Handle product page',
  url: 'https://www.greenlee.com/us/en/844ah',
  sourceType: 'official_product_page',
  retrievalDate: DATE,
  publicationOrRevisionDate: null,
  region: 'US',
  currency: 'current',
  modelsCovered: ['844A', '844AH'],
  pageTableOrSection: 'Specifications — Centerline Bend Radius',
  excerpt: 'Centerline Bend Radius 4-3/16 in (single unqualified value)',
  accessNotes:
    'Source-scope ambiguity: page prints one CLR for a dual-groove tool. Do not apply to 3/4 groove; prefer use-guide groove table.',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});
note('src-greenlee-844ah-product', 'Added 844AH product page source for scope ambiguity');

const m844 = modelById('model-greenlee-844a');
if (m844 && !m844.sourceIds.includes('src-greenlee-844ah-product')) {
  m844.sourceIds = [...m844.sourceIds, 'src-greenlee-844ah-product'];
  note('model-greenlee-844a', 'Linked 844AH product page source');
}

// Keep use-guide groove facts as official_corroborated (do NOT downgrade)
for (const id of [
  'fact-844a-emt-1_2-deduct',
  'fact-844a-emt-1_2-clr',
  'fact-844a-emt-3_4-deduct',
  'fact-844a-emt-3_4-clr',
]) {
  const f = factById(id);
  if (f) {
    f.evidenceStatus = 'official_corroborated';
    f.confidence = 'high';
    f.derivation = 'direct';
    if (id.includes('3_4-clr')) {
      f.conflictGroupId = 'conflict-greenlee-844-clr-listing';
      f.notes =
        'Use-guide 3/4 groove CLR 5-1/8. Product page single 4-3/16 must not override this groove value.';
    } else {
      f.conflictGroupId = null;
    }
    note(id, 'Preserved use-guide groove fact as direct official_corroborated');
  }
}

upsertFact({
  id: 'fact-844ah-product-page-clr-unqualified',
  modelId: 'model-greenlee-844a',
  conduitType: 'EMT',
  nominalSize: 'unqualified',
  property: 'centerline_radius',
  originalLabel: 'Centerline Bend Radius (product page, no groove)',
  originalValue: '4-3/16',
  originalUnit: 'inch',
  normalizedValueInches: 4.1875,
  sourceId: 'src-greenlee-844ah-product',
  section: 'Specifications',
  excerpt: 'Centerline Bend Radius 4-3/16 in (single value)',
  evidenceStatus: 'official_conflict',
  confidence: 'medium',
  conflictGroupId: 'conflict-greenlee-844-clr-listing',
  notes:
    'Source-scope ambiguity only. Must not be interpreted as the 3/4 groove CLR. Use-guide groove values remain authoritative.',
  productionScope: 'emt_in_scope',
  derivation: 'direct',
});
note('fact-844ah-product-page-clr-unqualified', 'Canonicalized 844AH unqualified CLR as conflict evidence');

upsertConflict({
  id: 'conflict-greenlee-844-clr-listing',
  modelId: 'model-greenlee-844a',
  property: 'centerline_radius',
  nominalSize: '3/4',
  competingFactIds: ['fact-844a-emt-3_4-clr', 'fact-844ah-product-page-clr-unqualified'],
  conflictType: 'family_vs_model_scope',
  analysis:
    'Use guide prints dual-shoe groove radii 4-3/16 (1/2) and 5-1/8 (3/4). 844AH product page prints a single unqualified Centerline Bend Radius 4-3/16. That page value must not be applied to the 3/4 groove.',
  recommendedNextStep:
    'Prefer use-guide groove table for marking math. Keep product-page CLR visible as scope ambiguity only.',
  status: 'open',
});
note('conflict-greenlee-844-clr-listing', 'Merged held 844AH CLR scope conflict into canonical');

// ---------------------------------------------------------------------------
// 3b. Gardner B-0040 — correct URL; rejected radius for all sizes
// ---------------------------------------------------------------------------
upsertSource({
  id: 'src-gardner-b0040-legacy-mislabeled',
  publisher: 'Gardner Bender',
  manufacturerId: 'mfr-gardner-bender',
  title: 'Legacy B-0040 How To Bend Guide (mislabeled radius column)',
  url: 'https://file.ecmindustries.com/-/media/inriver/B-0040.pdf',
  sourceType: 'archived_official',
  retrievalDate: DATE,
  publicationOrRevisionDate: 'B-0040',
  region: 'US',
  currency: 'archived',
  modelsCovered: ['960', '961', '962'],
  pageTableOrSection: 'Radius column (incorrect — contains deduct values 5/6/8)',
  excerpt: 'Legacy guide mislabels deduct 5/6/8 as radius',
  accessNotes: 'Superseded by GAR_BRO_032_1220. Retain only as rejected mislabel evidence.',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});
note('src-gardner-b0040-legacy-mislabeled', 'Corrected B-0040 URL to ECM Industries archived PDF');

// Replace single rejected fact with per-size rejected claims
measurements.measurements = measurements.measurements.filter(
  (f) => f.id !== 'fact-gardner-b0040-rejected-radius-mislabeled',
);

const b0040Rows = [
  ['960', '1/2', 5],
  ['961', '3/4', 6],
  ['962', '1', 8],
];
const b0040FactIds = [];
for (const [sku, size, val] of b0040Rows) {
  const id = `fact-gardner-b0040-${sku}-rejected-radius`;
  b0040FactIds.push(id);
  upsertFact({
    id,
    modelId: `model-gardner-${sku}`,
    conduitType: 'EMT',
    nominalSize: size,
    property: 'centerline_radius',
    originalLabel: 'Radius (B-0040 mislabel of deduct)',
    originalValue: val,
    originalUnit: 'inch',
    normalizedValueInches: val,
    sourceId: 'src-gardner-b0040-legacy-mislabeled',
    table: 'Radius column',
    excerpt: `B-0040 prints Radius ${val} for ${sku} (equals EMT deduct)`,
    evidenceStatus: 'rejected',
    confidence: 'none',
    conflictGroupId: `conflict-gardner-b0040-${sku}`,
    notes: 'Rejected. Deduct values mislabeled as radius. Never a production candidate.',
    productionScope: 'n/a',
    derivation: 'direct',
  });
  note(id, `Rejected B-0040 radius mislabel for ${sku} ${size}`);

  const good = factById(`fact-gardner-${sku}-clr`);
  if (good) {
    good.conflictGroupId = `conflict-gardner-b0040-${sku}`;
  }

  upsertConflict({
    id: `conflict-gardner-b0040-${sku}`,
    modelId: `model-gardner-${sku}`,
    property: 'centerline_radius',
    nominalSize: size,
    competingFactIds: [`fact-gardner-${sku}-clr`, id],
    conflictType: 'revision_change',
    analysis: `Current How To Guide prints true radius for ${sku}; B-0040 printed deduct ${val} in the radius column.`,
    recommendedNextStep: 'Keep B-0040 rejected; prefer current How To Guide + NPA-759.',
    status: 'needs_human_review',
  });
}

// Remove old single B-0040 conflict if present
conflicts.conflicts = conflicts.conflicts.filter((c) => c.id !== 'conflict-gardner-radius-mislabeled');

// ---------------------------------------------------------------------------
// 3c. IDEAL — fix 74-006, direct official pages, downgrade assemblies
// ---------------------------------------------------------------------------
upsertSource({
  id: 'src-ideal-74-003',
  publisher: 'IDEAL',
  manufacturerId: 'mfr-ideal',
  title: 'Ductile Iron Bender Head 1 EMT — 74-003',
  url: 'https://idealelectricalinc.com/product/ductile-iron-bender-head-1-emt/',
  sourceType: 'official_product_page',
  retrievalDate: DATE,
  publicationOrRevisionDate: null,
  region: 'US',
  currency: 'current',
  modelsCovered: ['74-003'],
  pageTableOrSection: 'Key Specifications — Stub Up Height',
  excerpt: 'Stub Up Height 8 inches',
  accessNotes: '',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});
upsertSource({
  id: 'src-ideal-74-006',
  publisher: 'IDEAL',
  manufacturerId: 'mfr-ideal',
  title: 'Ductile Iron Bender Head 1-1/4 EMT — 74-006',
  url: 'https://idealelectricalinc.com/en-ca/product/ductile-iron-bender-head-1-1-4-emt/',
  sourceType: 'official_product_page',
  retrievalDate: DATE,
  publicationOrRevisionDate: null,
  region: 'CA',
  currency: 'current',
  modelsCovered: ['74-006'],
  pageTableOrSection: 'Key Specifications — Stub Up Height',
  excerpt: 'Stub Up Height 11 inches; Head Only configuration',
  accessNotes: 'Dedicated head SKU — distinct from 74-034 head+handle assembly.',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});
upsertSource({
  id: 'src-ideal-74-034',
  publisher: 'IDEAL',
  manufacturerId: 'mfr-ideal',
  title: 'Ductile Iron Bender w/ Handle 1-1/4 EMT — 74-034',
  url: 'https://idealelectricalinc.com/product/ductile-iron-bender-w-handle-1-1-4-emt/',
  sourceType: 'official_product_page',
  retrievalDate: DATE,
  publicationOrRevisionDate: null,
  region: 'US',
  currency: 'current',
  modelsCovered: ['74-034'],
  pageTableOrSection: 'Key Specifications — Stub Up Height',
  excerpt: 'Stub Up Height 11 inches; Head and Handle configuration',
  accessNotes: 'Assembly SKU distinct from 74-006 head-only.',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});
note('src-ideal-74-003', 'Dedicated official page for 74-003');
note('src-ideal-74-006', 'Dedicated official page for 74-006 head');
note('src-ideal-74-034', 'Corrected dedicated official page for 74-034 assembly');

// Remove wrong related-nav source usage for facts
const m006 = modelById('model-ideal-74-006');
if (m006) {
  m006.sourceIds = ['src-ideal-74-006'];
  m006.researchClass = 'chart_candidate';
  m006.notes =
    'Head-only SKU. Separate from 74-034 head+handle assembly unless docs prove otherwise.';
  note('model-ideal-74-006', 'Linked dedicated source; chart_candidate');
}
const m034 = modelById('model-ideal-74-034');
if (m034) {
  m034.sourceIds = ['src-ideal-74-034'];
  m034.researchClass = 'chart_candidate';
  m034.aliases = [];
  m034.notes = 'Head+handle assembly. Separate identity from 74-006 head-only.';
  note('model-ideal-74-034', 'Separate assembly identity; dedicated source');
}
const m003 = modelById('model-ideal-74-003');
if (m003) {
  m003.sourceIds = ['src-ideal-74-003'];
  m003.researchClass = 'chart_candidate';
  m003.notes = 'Stub Up Height confirmed on dedicated product page.';
  note('model-ideal-74-003', 'Promoted to chart_candidate with dedicated source');
}

// Remove old secondary/missing facts; replace with direct
measurements.measurements = measurements.measurements.filter(
  (f) =>
    ![
      'fact-ideal-74-003-stub-prod-mirror',
      'fact-ideal-74-034-stub-prod-mirror',
      'fact-ideal-74-006-stub-unknown',
    ].includes(f.id),
);

upsertFact({
  id: 'fact-ideal-74-003-stub',
  modelId: 'model-ideal-74-003',
  conduitType: 'EMT',
  nominalSize: '1',
  property: 'stub_take_up',
  originalLabel: 'Stub Up Height',
  originalValue: 8,
  originalUnit: 'inch',
  normalizedValueInches: 8,
  sourceId: 'src-ideal-74-003',
  section: 'Key Specifications',
  excerpt: 'Stub Up Height 8 inches',
  evidenceStatus: 'official_exact',
  confidence: 'high',
  notes: 'Direct official product page.',
  derivation: 'direct',
});
upsertFact({
  id: 'fact-ideal-74-006-stub',
  modelId: 'model-ideal-74-006',
  conduitType: 'EMT',
  nominalSize: '1-1/4',
  property: 'stub_take_up',
  originalLabel: 'Stub Up Height',
  originalValue: 11,
  originalUnit: 'inch',
  normalizedValueInches: 11,
  sourceId: 'src-ideal-74-006',
  section: 'Key Specifications',
  excerpt: 'Stub Up Height 11 inches',
  evidenceStatus: 'official_exact',
  confidence: 'high',
  notes: 'Head-only. Distinct from 74-034 assembly.',
  derivation: 'direct',
});
upsertFact({
  id: 'fact-ideal-74-034-stub',
  modelId: 'model-ideal-74-034',
  conduitType: 'EMT',
  nominalSize: '1-1/4',
  property: 'stub_take_up',
  originalLabel: 'Stub Up Height',
  originalValue: 11,
  originalUnit: 'inch',
  normalizedValueInches: 11,
  sourceId: 'src-ideal-74-034',
  section: 'Key Specifications',
  excerpt: 'Stub Up Height 11 inches',
  evidenceStatus: 'official_exact',
  confidence: 'high',
  notes: 'Head+handle assembly. Distinct from 74-006 head.',
  derivation: 'direct',
});
note('fact-ideal-74-003-stub', 'Direct official stub-up 8');
note(
  'fact-ideal-74-006-stub',
  'New model/source coverage of existing 11-inch Stub Up Height chart value — not new bending math',
);
note('fact-ideal-74-034-stub', 'Direct official stub-up 11 on assembly');

// Close old IDEAL conflict — same stub value on separate identities is not a conflict
conflicts.conflicts = conflicts.conflicts.filter((c) => c.id !== 'conflict-ideal-114-sku');
note('conflict-ideal-114-sku', 'Removed — 74-006 and 74-034 are separate identities with matching stub-up');

// Downgrade assemblies lacking dedicated sources
for (const sku of ['74-046', '74-047', '74-026', '74-027', '74-028']) {
  const m = modelById(`model-ideal-${sku}`);
  if (m) {
    m.researchClass = 'reference_only';
    m.sourceIds = [];
    m.notes =
      'Assembly identity known from related-product navigation / production notes. Dedicated official product page not yet captured — identity_pending / reference_only until dedicated source added.';
    note(m.id, 'Downgraded to reference_only pending dedicated source');
  }
}

// ---------------------------------------------------------------------------
// 3d. NSI — homepage is discovery lead, not product page
// ---------------------------------------------------------------------------
upsertSource({
  id: 'src-nsi-hand-benders-lead',
  publisher: 'NSI Industries',
  manufacturerId: 'mfr-nsi',
  title: 'NSI Industries website — CB series discovery lead',
  url: 'https://nsiindustries.com/',
  sourceType: 'other',
  retrievalDate: DATE,
  publicationOrRevisionDate: null,
  region: 'US',
  currency: 'unknown',
  modelsCovered: ['CB50', 'CB75', 'CB100'],
  pageTableOrSection: null,
  excerpt: 'Manufacturer homepage used only as discovery lead for CB series',
  accessNotes:
    'Not a model-specific product page. Reclassify to official_product_page only after dedicated CB50/CB75/CB100 pages are captured.',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});
note('src-nsi-hand-benders-lead', 'Reclassified homepage as discovery lead (sourceType other)');

for (const sku of ['cb50', 'cb75', 'cb100']) {
  const m = modelById(`model-nsi-${sku}`);
  if (m) {
    m.researchClass = 'reference_only';
    m.notes =
      'Discovery lead only. No model-specific official product page captured — do not treat homepage as product evidence.';
    note(m.id, 'Confirmed reference_only pending dedicated pages');
  }
}

// ---------------------------------------------------------------------------
// 4. Powered-family modeling
// ---------------------------------------------------------------------------
// Split 555C / 555CX / 555DX
const m555 = modelById('model-greenlee-555c');
if (m555) {
  m555.modelNumbers = ['555C'];
  m555.skus = ['555C'];
  m555.notes =
    '555C classic power unit. Shoe compatibility differs by generation — do not assume CX/DX shoe charts transfer without explicit docs.';
  m555.researchClass = 'identity_verified';
  note('model-greenlee-555c', 'Narrowed to 555C only');
}
upsertModel({
  id: 'model-greenlee-555cx',
  manufacturerId: 'mfr-greenlee',
  brand: 'Greenlee',
  family: '555',
  series: '555 Series electric conduit bender',
  modelNumbers: ['555CX'],
  skus: ['555CX'],
  aliases: [],
  category: 'electric',
  driveType: 'electric',
  material: null,
  marketStatus: 'unknown',
  regions: ['US'],
  supportedConduitTypes: ['EMT', 'IMC', 'RMC'],
  supportedNominalSizes: ['1/2', '3/4', '1', '1-1/4', '1-1/2', '2'],
  sourceIds: ['src-greenlee-555-single-shoe-52065584-rev02'],
  notes: 'Separate generation from 555C. Shoe groups may differ — research-only until model-specific charts confirmed.',
  researchClass: 'identity_verified',
  operationMode: 'one_shot',
});
upsertModel({
  id: 'model-greenlee-555dx',
  manufacturerId: 'mfr-greenlee',
  brand: 'Greenlee',
  family: '555',
  series: '555 Series electric conduit bender',
  modelNumbers: ['555DX'],
  skus: ['555DX'],
  aliases: [],
  category: 'electric',
  driveType: 'electric',
  material: null,
  marketStatus: 'unknown',
  regions: ['US'],
  supportedConduitTypes: ['EMT', 'IMC', 'RMC'],
  supportedNominalSizes: ['1/2', '3/4', '1', '1-1/4', '1-1/2', '2'],
  sourceIds: ['src-greenlee-555-single-shoe-52065584-rev02'],
  notes: 'Separate generation from 555C. Research-only until model-specific charts confirmed.',
  researchClass: 'identity_verified',
  operationMode: 'one_shot',
});
note('model-greenlee-555cx', 'Split 555CX from 555C');
note('model-greenlee-555dx', 'Split 555DX from 555C');

// Parent shoe 23803 stays on 555C only
const shoe23803 = modelById('model-greenlee-shoe-23803');
if (shoe23803) {
  shoe23803.parentFrameModelId = 'model-greenlee-555c';
  shoe23803.researchClass = 'conflict_review';
  shoe23803.notes =
    'Research-only powered shoe. CLR conflict open. Not a hand-bender production candidate.';
}

// Split 881 / 881CT / 881GX
const m881 = modelById('model-greenlee-881');
if (m881) {
  m881.modelNumbers = ['881'];
  m881.skus = ['881'];
  m881.marketStatus = 'superseded';
  m881.replacementModelIds = ['model-greenlee-881gx'];
  m881.notes =
    'Legacy Cam-Track frame. Do not transfer charts to 881GX without direct GX evidence.';
  m881.sourceIds = ['src-greenlee-2015-bending-catalog'];
  note('model-greenlee-881', 'Narrowed to legacy 881; superseded by 881GX');
}
upsertModel({
  id: 'model-greenlee-881ct',
  manufacturerId: 'mfr-greenlee',
  brand: 'Greenlee',
  family: '881 Cam-Track',
  series: '881CT hydraulic Cam-Track (legacy)',
  modelNumbers: ['881CT'],
  skus: ['881CT'],
  aliases: ['Cam-Track CT'],
  category: 'hydraulic',
  driveType: 'hydraulic',
  material: null,
  marketStatus: 'superseded',
  regions: ['US'],
  supportedConduitTypes: ['EMT', 'IMC', 'RMC'],
  supportedNominalSizes: ['2-1/2', '3', '3-1/2', '4'],
  sourceIds: ['src-greenlee-2015-bending-catalog', 'src-greenlee-881-4in-shoe-31274'],
  notes:
    'Legacy CT generation. Shoe/CLR facts for CT must not be copied to 881GX without GX-specific official tables.',
  researchClass: 'identity_verified',
  operationMode: 'one_shot',
  replacementModelIds: ['model-greenlee-881gx'],
});
upsertModel({
  id: 'model-greenlee-881gx',
  manufacturerId: 'mfr-greenlee',
  brand: 'Greenlee',
  family: '881 Cam-Track',
  series: '881GX hydraulic Cam-Track (current)',
  modelNumbers: ['881GX', '881GXD'],
  skus: ['881GX', '881GXD'],
  aliases: [],
  category: 'hydraulic',
  driveType: 'hydraulic',
  material: null,
  marketStatus: 'active',
  regions: ['US'],
  supportedConduitTypes: ['EMT', 'IMC', 'RMC'],
  supportedNominalSizes: ['2-1/2', '3', '3-1/2', '4'],
  sourceIds: ['src-agent3-greenlee-881gx'],
  notes:
    'Current generation. No CT CLR/shoe measurements transferred. Charts pending GX-specific official extract.',
  researchClass: 'identity_verified',
  operationMode: 'one_shot',
});
note('model-greenlee-881ct', 'Split legacy 881CT');
note('model-greenlee-881gx', 'Current 881GX without inherited CT charts');

// Retarget catalog shoe facts that cited 881CT — keep on CT / catalog shoes, not GX
for (const f of measurements.measurements) {
  if (f.modelId?.startsWith('model-greenlee-27') || f.modelId === 'model-greenlee-31274') {
    f.productionScope = 'out_of_production_scope';
    f.notes = `${f.notes || ''} Research-only powered shoe; not app hand-bender scope.`.trim();
  }
}
// 31274 parent → 881CT (catalog evidence), not GX
const m31274 = modelById('model-greenlee-31274');
if (m31274) {
  m31274.parentFrameModelId = 'model-greenlee-881ct';
  m31274.researchClass = 'chart_candidate';
  m31274.notes =
    'Shoe group documented for Cam-Track family. Not transferred to 881GX without GX-specific evidence.';
}

// 881GX standard equipment shoes — identity only, no CT measurements
for (const sku of ['94811g', '94812g', '94813g', '94814g']) {
  const m = modelById(`model-greenlee-${sku}`);
  if (m) {
    m.parentFrameModelId = 'model-greenlee-881gx';
    m.researchClass = 'identity_verified';
    m.notes =
      '881GX standard equipment SKU. No CLR transferred from 881CT catalog shoes.';
  }
}

// Powered research-only: BEMT-52, 23803 facts, Current Tools
for (const f of measurements.measurements) {
  const model = modelById(f.modelId);
  if (!model) continue;
  if (['electric', 'hydraulic', 'mechanical', 'shoe'].includes(model.category) && model.category !== 'hand') {
    if (f.productionScope === 'emt_in_scope') {
      f.productionScope = 'out_of_production_scope';
    }
    if (model.researchClass === 'chart_candidate' && model.id !== 'model-greenlee-31274') {
      // keep chart_candidate for research quality but mark notes
    }
  }
}

const bemt = modelById('model-gardner-bemt-52');
if (bemt) {
  bemt.researchClass = 'reference_only';
  bemt.notes = 'Powered EMT shoe — research-only for current hand-bender app scope.';
  note('model-gardner-bemt-52', 'Reclassified powered shoe research-only');
}
const b2555 = modelById('model-gardner-b2555');
if (b2555) {
  b2555.researchClass = 'reference_only';
  note('model-gardner-b2555', 'Powered frame research-only');
}

for (const m of models.models) {
  if (m.manufacturerId === 'mfr-current-tools') {
    if (m.researchClass === 'chart_candidate') {
      m.researchClass = 'reference_only';
      note(m.id, 'Current Tools powered values held research-only');
    }
    m.notes = `${m.notes || ''} Research-only for current EMT hand-bender app.`.trim();
  }
}

// Derived minimum-stub from formula → field_reference_only + derivation derived
for (const f of measurements.measurements) {
  if (f.id.includes('minstub') && f.notes?.toLowerCase().includes('derived')) {
    f.evidenceStatus = 'field_reference_only';
    f.confidence = 'medium';
    f.derivation = 'derived';
    f.notes =
      'Derived from explicit manual formula (deduct + 2). Not a directly printed cell value — field_reference_only.';
    note(f.id, 'Reclassified derived min-stub as field_reference_only');
  }
  // CT254 min stubs are printed in Chart B — keep official_exact / direct
  if (f.id.startsWith('fact-ct254-') && f.property === 'minimum_stub') {
    f.derivation = 'direct';
    f.evidenceStatus = 'official_exact';
    f.productionScope = 'out_of_production_scope';
  }
}

// Approximate note on 555 deducts
for (const f of measurements.measurements) {
  if (f.id.startsWith('fact-23803-emt-') && f.property === 'stub_deduct') {
    f.confidence = 'medium';
    f.notes =
      'Manual states figures are approximate. Electric shoe — research-only; not a hand production candidate.';
    f.productionScope = 'out_of_production_scope';
    f.approximate = true;
    f.derivation = 'direct';
  }
  if (f.id.startsWith('fact-23803-emt-') && f.property === 'centerline_radius') {
    f.productionScope = 'out_of_production_scope';
    f.derivation = 'direct';
  }
  if (f.id.startsWith('fact-bemt52-') || f.id.startsWith('fact-ct254-')) {
    f.productionScope = 'out_of_production_scope';
    f.derivation = f.derivation || 'direct';
  }
}

// Mark all hand chart facts as derivation direct if missing
for (const f of measurements.measurements) {
  if (!f.derivation) f.derivation = 'direct';
}

// Explicitly remove obsolete related-nav source (superseded by src-ideal-74-006)
sources.sources = sources.sources.filter((s) => s.id !== 'src-ideal-74-006-related');
for (const m of models.models) {
  if (Array.isArray(m.sourceIds)) {
    m.sourceIds = m.sourceIds.filter((id) => id !== 'src-ideal-74-006-related');
  }
}
measurements.measurements = measurements.measurements.filter(
  (f) => f.sourceId !== 'src-ideal-74-006-related',
);
note('src-ideal-74-006-related', 'Removed obsolete related-nav source from canonical');

// 751 is identity-only until a dedicated manual is captured — no borrowed 753 source
const m751 = modelById('model-current-751');
if (m751) {
  m751.sourceIds = [];
}

// Ensure hand chart_candidate models that are powered shoes stay out
for (const m of models.models.filter((x) => x.category === 'shoe' || x.category === 'electric' || x.category === 'hydraulic')) {
  if (m.researchClass === 'chart_candidate' && m.id.startsWith('model-gardner-bemt')) {
    m.researchClass = 'reference_only';
  }
}

save('manufacturers.json', manufacturers);
save('sources.json', sources);
save('models.json', models);
save('measurements.json', measurements);
save('conflicts.json', conflicts);

fs.writeFileSync(
  path.join(ROOT, 'reports', 'CORRECTION_PASS_REPAIRED_IDS.json'),
  JSON.stringify({ retrievedDate: DATE, repaired }, null, 2) + '\n',
);

console.log(
  JSON.stringify(
    {
      manufacturers: manufacturers.manufacturers.length,
      sources: sources.sources.length,
      models: models.models.length,
      measurements: measurements.measurements.length,
      conflicts: conflicts.conflicts.length,
      repaired: repaired.length,
    },
    null,
    2,
  ),
);
