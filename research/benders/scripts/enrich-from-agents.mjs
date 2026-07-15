#!/usr/bin/env node
/**
 * Enrich merged corpus with Agent 1/3 identity leads (no invented numbers).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../data');
const DATE = '2026-07-14';

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA, name), 'utf8'));
}
function save(name, doc) {
  fs.writeFileSync(path.join(DATA, name), JSON.stringify(doc, null, 2) + '\n');
}

const manufacturers = load('manufacturers.json');
const sources = load('sources.json');
const models = load('models.json');

const srcIds = new Set(sources.sources.map((s) => s.id));
const modelIds = new Set(models.models.map((m) => m.id));
const skuKeys = new Set();
for (const m of models.models) {
  for (const s of [...m.skus, ...m.modelNumbers]) {
    skuKeys.add(`${m.manufacturerId}::${String(s).toLowerCase()}`);
  }
}

function addSrc(s) {
  if (srcIds.has(s.id)) return;
  sources.sources.push(s);
  srcIds.add(s.id);
}
function addModel(m) {
  if (modelIds.has(m.id)) return;
  for (const s of [...(m.skus || []), ...(m.modelNumbers || [])]) {
    const k = `${m.manufacturerId}::${String(s).toLowerCase()}`;
    if (skuKeys.has(k)) return; // skip colliding SKU
  }
  models.models.push({
    introducedDate: null,
    discontinuedDate: null,
    replacementModelIds: [],
    parentFrameModelId: null,
    operationMode: null,
    ...m,
  });
  modelIds.add(m.id);
  for (const s of [...(m.skus || []), ...(m.modelNumbers || [])]) {
    skuKeys.add(`${m.manufacturerId}::${String(s).toLowerCase()}`);
  }
}

// Update NSI notes from Agent 1 discovery
const nsi = manufacturers.manufacturers.find((m) => m.id === 'mfr-nsi');
if (nsi) {
  nsi.notes =
    'Cast aluminum hand benders CB50/CB75/CB100 discovered on NSI site (Agent 1). TORK is controls/timers — not conduit benders. Chart values not yet extracted.';
}

addSrc({
  id: 'src-nsi-hand-benders-lead',
  publisher: 'NSI Industries',
  manufacturerId: 'mfr-nsi',
  title: 'NSI cast aluminum conduit hand benders (CB series) — catalog lead',
  url: 'https://nsiindustries.com/',
  sourceType: 'official_product_page',
  retrievalDate: DATE,
  publicationOrRevisionDate: null,
  region: 'US',
  currency: 'unknown',
  modelsCovered: ['CB50', 'CB75', 'CB100'],
  pageTableOrSection: null,
  excerpt: 'Agent 1 catalog map cites CB50/CB75/CB100 cast aluminum hand benders',
  accessNotes: 'Open dedicated product pages and capture stub-up/radius before promoting facts.',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});

for (const [sku, size] of [
  ['CB50', '1/2'],
  ['CB75', '3/4'],
  ['CB100', '1'],
]) {
  addModel({
    id: `model-nsi-${sku.toLowerCase()}`,
    manufacturerId: 'mfr-nsi',
    brand: 'NSI',
    family: 'CB hand bender',
    series: 'Cast aluminum hand bender',
    modelNumbers: [sku],
    skus: [sku],
    aliases: [],
    category: 'hand',
    driveType: 'manual',
    material: 'aluminum',
    marketStatus: 'unknown',
    regions: ['US'],
    supportedConduitTypes: ['EMT'],
    supportedNominalSizes: [size],
    sourceIds: ['src-nsi-hand-benders-lead'],
    notes: 'Identity lead from Agent 1 catalog map; no chart facts staged yet.',
    researchClass: 'reference_only',
    operationMode: 'hand_continuous',
  });
}

// Remove empty nsi placeholder if present
models.models = models.models.filter((m) => m.id !== 'model-nsi-placeholder');

addSrc({
  id: 'src-greenlee-1800-product',
  publisher: 'Greenlee',
  manufacturerId: 'mfr-greenlee',
  title: 'Greenlee 1800 ratchet mechanical bender product page',
  url: 'https://www.greenlee.com/us/en/benderhand-ratchet-1800-1800',
  sourceType: 'official_product_page',
  retrievalDate: DATE,
  publicationOrRevisionDate: null,
  region: 'US',
  currency: 'current',
  modelsCovered: ['1800', '1800G1'],
  pageTableOrSection: 'Product page',
  excerpt: 'Ratchet mechanical Chicago-style bender family',
  accessNotes: 'Identity; extract deduct charts from official manual before promoting.',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});
addSrc({
  id: 'src-greenlee-1801-product',
  publisher: 'Greenlee',
  manufacturerId: 'mfr-greenlee',
  title: 'Greenlee 1801 ratchet mechanical bender product page',
  url: 'https://www.greenlee.com/us/en/benderhand-ratchet-1801-m2-1801',
  sourceType: 'official_product_page',
  retrievalDate: DATE,
  publicationOrRevisionDate: null,
  region: 'US',
  currency: 'current',
  modelsCovered: ['1801', '1801G1'],
  pageTableOrSection: 'Product page',
  excerpt: 'Ratchet mechanical for larger sizes',
  accessNotes: '',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});
addSrc({
  id: 'src-greenlee-854dx-product',
  publisher: 'Greenlee',
  manufacturerId: 'mfr-greenlee',
  title: 'Greenlee 854DX electric conduit bender',
  url: 'https://www.greenlee.com/us/en/electric-conduit-bender-854dx',
  sourceType: 'official_product_page',
  retrievalDate: DATE,
  publicationOrRevisionDate: null,
  region: 'US',
  currency: 'current',
  modelsCovered: ['854DX'],
  pageTableOrSection: 'Product page',
  excerpt: 'Digital pendant electric bender',
  accessNotes: '',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});

addModel({
  id: 'model-greenlee-1800',
  manufacturerId: 'mfr-greenlee',
  brand: 'Greenlee',
  family: '1800',
  series: 'Ratchet mechanical (Chicago-style)',
  modelNumbers: ['1800', '1800G1'],
  skus: ['1800', '1800G1'],
  aliases: ['Chicago-style ratchet'],
  category: 'mechanical',
  driveType: 'ratchet',
  material: null,
  marketStatus: 'active',
  regions: ['US'],
  supportedConduitTypes: ['IMC', 'RMC'],
  supportedNominalSizes: ['1/2', '3/4', '1'],
  sourceIds: ['src-greenlee-1800-product'],
  notes: 'Official product page identity; EMT chart not staged in this pass.',
  researchClass: 'identity_verified',
  operationMode: 'one_shot',
});
addModel({
  id: 'model-greenlee-1801',
  manufacturerId: 'mfr-greenlee',
  brand: 'Greenlee',
  family: '1801',
  series: 'Ratchet mechanical',
  modelNumbers: ['1801', '1801G1'],
  skus: ['1801', '1801G1'],
  aliases: [],
  category: 'mechanical',
  driveType: 'ratchet',
  material: null,
  marketStatus: 'active',
  regions: ['US'],
  supportedConduitTypes: ['IMC', 'RMC'],
  supportedNominalSizes: ['1-1/4', '1-1/2'],
  sourceIds: ['src-greenlee-1801-product'],
  notes: 'Official product page identity.',
  researchClass: 'identity_verified',
  operationMode: 'one_shot',
});
addModel({
  id: 'model-greenlee-854dx',
  manufacturerId: 'mfr-greenlee',
  brand: 'Greenlee',
  family: '854',
  series: '854DX electric',
  modelNumbers: ['854DX'],
  skus: ['854DX'],
  aliases: [],
  category: 'electric',
  driveType: 'electric',
  material: null,
  marketStatus: 'active',
  regions: ['US'],
  supportedConduitTypes: ['EMT', 'IMC', 'RMC'],
  supportedNominalSizes: [],
  sourceIds: ['src-greenlee-854dx-product'],
  notes: 'Identity only pending shoe chart extraction.',
  researchClass: 'identity_verified',
  operationMode: 'one_shot',
});

// Ideal assemblies from Agent 1
for (const [sku, size, material] of [
  ['74-046', '1/2', 'aluminum'],
  ['74-047', '3/4', 'aluminum'],
  ['74-026', '1/2', 'ductile iron'],
  ['74-027', '3/4', 'ductile iron'],
  ['74-028', '1', 'ductile iron'],
]) {
  addModel({
    id: `model-ideal-${sku}`,
    manufacturerId: 'mfr-ideal',
    brand: 'IDEAL',
    family: 'IDEAL hand bender',
    series: 'Head+handle assembly',
    modelNumbers: [sku],
    skus: [sku],
    aliases: [],
    category: 'hand',
    driveType: 'manual',
    material,
    marketStatus: 'active',
    regions: ['US', 'CA'],
    supportedConduitTypes: ['EMT'],
    supportedNominalSizes: [size],
    sourceIds: ['src-ideal-74-031'],
    notes: 'Assembly SKU from production sizeSpecs / Agent 1 map; chart values live on head SKUs.',
    researchClass: 'identity_verified',
    operationMode: 'hand_continuous',
  });
}

addSrc({
  id: 'src-southwire-mcb34-product',
  publisher: 'Southwire',
  manufacturerId: 'mfr-southwire',
  title: 'MCB3/4 3/4 Conduit Bender Aluminum product page',
  url: 'https://www.southwire.com/tools-equipment/bending/mcb3-4-3-4-conduit-bender-aluminum/p/58281240',
  sourceType: 'official_product_page',
  retrievalDate: DATE,
  publicationOrRevisionDate: null,
  region: 'US',
  currency: 'current',
  modelsCovered: ['MCB3/4', '58281240'],
  pageTableOrSection: 'Product page',
  excerpt: 'Southwire MCB3/4 aluminum conduit bender product listing',
  accessNotes: 'Corroborates cutsheet identity; still no take-up published in research pass.',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});

addSrc({
  id: 'src-milwaukee-hand-instruction-58-14-4060',
  publisher: 'Milwaukee',
  manufacturerId: 'mfr-milwaukee',
  title: 'Milwaukee hand bender instruction sheet 58-14-4060d3',
  url: 'https://documents.milwaukeetool.com/58-14-4060d3.pdf',
  sourceType: 'official_pdf_manual',
  retrievalDate: DATE,
  publicationOrRevisionDate: null,
  region: 'US',
  currency: 'current',
  modelsCovered: ['48-22-4070', '48-22-4071', '48-22-4072', '48-22-4080', '48-22-4081', '48-22-4082'],
  pageTableOrSection: 'Instruction sheet',
  excerpt: 'Offset/saddle tables; Agent 1 notes no stub take-up chart',
  accessNotes: 'Confirms absence of published stub-up for Milwaukee hand line.',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});

// Gardner Cyclone / Ultra Eegor identity
addSrc({
  id: 'src-gardner-b1000-manual',
  publisher: 'Gardner Bender',
  manufacturerId: 'mfr-gardner-bender',
  title: 'Portable Cyclone B1000 manual GAR_TL_086_0320',
  url: 'https://www.gardnerbender.com/-/media/inriver/GAR_TL_086_0320_B1000-MANUAL.pdf',
  sourceType: 'official_pdf_manual',
  retrievalDate: DATE,
  publicationOrRevisionDate: '0320',
  region: 'US',
  currency: 'current',
  modelsCovered: ['B1000', 'B1000PT', 'PT200'],
  pageTableOrSection: 'Manual',
  excerpt: 'Portable Cyclone threader-powered bender family',
  accessNotes: 'Identity; extract charts before promoting EMT deducts.',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});
addModel({
  id: 'model-gardner-b1000',
  manufacturerId: 'mfr-gardner-bender',
  brand: 'Gardner Bender',
  family: 'Cyclone',
  series: 'Portable Cyclone',
  modelNumbers: ['B1000', 'B1000PT'],
  skus: ['B1000', 'B1000PT'],
  aliases: [],
  category: 'mechanical',
  driveType: 'mechanical',
  material: null,
  marketStatus: 'active',
  regions: ['US'],
  supportedConduitTypes: ['EMT', 'IMC', 'RMC'],
  supportedNominalSizes: [],
  sourceIds: ['src-gardner-b1000-manual'],
  notes: 'Threader-powered portable; charts not extracted in this pass.',
  researchClass: 'identity_verified',
  operationMode: 'one_shot',
});

addSrc({
  id: 'src-agent3-greenlee-881gx',
  publisher: 'Greenlee',
  manufacturerId: 'mfr-greenlee',
  title: '881GX Hydraulic Bender product page',
  url: 'https://www.greenlee.com/us/en/881gx-hydraulic-bender',
  sourceType: 'official_product_page',
  retrievalDate: DATE,
  publicationOrRevisionDate: null,
  region: 'US',
  currency: 'current',
  modelsCovered: ['881GX', '94811G', '94812G', '94813G', '94814G'],
  pageTableOrSection: 'Specifications; Standard Equipment',
  excerpt: 'One shot hydraulic; 2-1/2 to 4 EMT IMC Rigid',
  accessNotes: 'From Agent 3 source harvest.',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});

for (const sku of ['94811G', '94812G', '94813G', '94814G']) {
  addModel({
    id: `model-greenlee-${sku.toLowerCase()}`,
    manufacturerId: 'mfr-greenlee',
    brand: 'Greenlee',
    family: '881 Cam-Track',
    series: '881GX standard shoe group',
    modelNumbers: [sku],
    skus: [sku],
    aliases: [],
    category: 'shoe',
    driveType: 'n/a',
    material: null,
    marketStatus: 'active',
    regions: ['US'],
    supportedConduitTypes: ['EMT', 'IMC', 'RMC'],
    supportedNominalSizes: [],
    sourceIds: ['src-agent3-greenlee-881gx'],
    notes: 'Standard equipment shoe group SKU on 881GX page — size mapping pending manual extract.',
    researchClass: 'identity_verified',
    parentFrameModelId: 'model-greenlee-881',
    operationMode: 'one_shot',
  });
}

// Agent 3 identity leads (must live in this script for deterministic rebuild)
addSrc({
  id: 'src-milwaukee-5150-20',
  publisher: 'Milwaukee',
  manufacturerId: 'mfr-milwaukee',
  title: 'M18 FUEL 5150-20 conduit bender product page (Agent 3 lead)',
  url: 'https://www.milwaukeetool.com/',
  sourceType: 'official_product_page',
  retrievalDate: DATE,
  publicationOrRevisionDate: null,
  region: 'US',
  currency: 'unknown',
  modelsCovered: ['5150-20'],
  pageTableOrSection: null,
  excerpt: 'Portable battery branch bender identity from Agent 3 notes',
  accessNotes:
    'Open dedicated Milwaukee 5150-20 page and capture shoe SKUs/charts before promoting facts.',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});
addSrc({
  id: 'src-gardner-b2000-lead',
  publisher: 'Gardner Bender',
  manufacturerId: 'mfr-gardner-bender',
  title: 'Gardner B2000 Cyclone electric identity (Agent 3)',
  url: 'https://www.gardnerbender.com/',
  sourceType: 'official_product_page',
  retrievalDate: DATE,
  publicationOrRevisionDate: null,
  region: 'US',
  currency: 'unknown',
  modelsCovered: ['B2000'],
  pageTableOrSection: null,
  excerpt: 'B2000 Cyclone electric identity noted by Agent 3',
  accessNotes: 'Locate dedicated product/manual URL before numeric facts.',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});
addSrc({
  id: 'src-greenlee-1818-lead',
  publisher: 'Greenlee',
  manufacturerId: 'mfr-greenlee',
  title: 'Greenlee 1818 mechanical/table identity (Agent 3)',
  url: 'https://www.greenlee.com/',
  sourceType: 'official_product_page',
  retrievalDate: DATE,
  publicationOrRevisionDate: null,
  region: 'US',
  currency: 'unknown',
  modelsCovered: ['1818', '1818T'],
  pageTableOrSection: null,
  excerpt: '1818 family referenced in Greenlee bending literature',
  accessNotes: 'Confirm current product page and charts.',
  redistributionLicenseStatus: 'url_reference_only',
  contentChecksum: null,
});

addModel({
  id: 'model-milwaukee-5150-20',
  manufacturerId: 'mfr-milwaukee',
  brand: 'Milwaukee',
  family: 'M18 FUEL',
  series: '5150-20 portable conduit bender',
  modelNumbers: ['5150-20'],
  skus: ['5150-20'],
  aliases: [],
  category: 'electric',
  driveType: 'battery',
  material: null,
  marketStatus: 'active',
  regions: ['US'],
  supportedConduitTypes: ['EMT'],
  supportedNominalSizes: [],
  sourceIds: ['src-milwaukee-5150-20'],
  notes: 'Agent 3 identity lead — portable battery branch bender; shoe charts not staged.',
  researchClass: 'reference_only',
  operationMode: 'one_shot',
});
addModel({
  id: 'model-gardner-b2000',
  manufacturerId: 'mfr-gardner-bender',
  brand: 'Gardner Bender',
  family: 'Cyclone',
  series: 'B2000 Cyclone electric',
  modelNumbers: ['B2000'],
  skus: ['B2000'],
  aliases: [],
  category: 'electric',
  driveType: 'electric',
  material: null,
  marketStatus: 'active',
  regions: ['US'],
  supportedConduitTypes: ['EMT', 'IMC', 'RMC'],
  supportedNominalSizes: [],
  sourceIds: ['src-gardner-b2000-lead'],
  notes: 'Agent 3 identity; charts not staged this pass.',
  researchClass: 'identity_verified',
  operationMode: 'one_shot',
});
addModel({
  id: 'model-greenlee-1818',
  manufacturerId: 'mfr-greenlee',
  brand: 'Greenlee',
  family: '1818',
  series: '1818 mechanical/table',
  modelNumbers: ['1818', '1818T'],
  skus: ['1818'],
  aliases: [],
  category: 'mechanical',
  driveType: 'mechanical',
  material: null,
  marketStatus: 'unknown',
  regions: ['US'],
  supportedConduitTypes: ['EMT', 'IMC', 'RMC'],
  supportedNominalSizes: [],
  sourceIds: ['src-greenlee-1818-lead'],
  notes: 'Agent 3 literature identity; confirm current status.',
  researchClass: 'reference_only',
  operationMode: 'one_shot',
});
addModel({
  id: 'model-current-751',
  manufacturerId: 'mfr-current-tools',
  brand: 'Current Tools',
  family: '751',
  series: 'Mechanical bender',
  modelNumbers: ['751'],
  skus: ['751'],
  aliases: [],
  category: 'mechanical',
  driveType: 'ratchet',
  material: null,
  marketStatus: 'unknown',
  regions: ['US'],
  supportedConduitTypes: ['EMT', 'IMC', 'RMC'],
  supportedNominalSizes: [],
  sourceIds: [],
  notes: 'Agent 3 lists 751 alongside 750; confirm dedicated manual before charts.',
  researchClass: 'reference_only',
  operationMode: 'one_shot',
});

save('manufacturers.json', manufacturers);
save('sources.json', sources);
save('models.json', models);
console.log({
  manufacturers: manufacturers.manufacturers.length,
  sources: sources.sources.length,
  models: models.models.length,
});
