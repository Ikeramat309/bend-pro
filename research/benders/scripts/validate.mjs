#!/usr/bin/env node
/**
 * Staging corpus validator for research/benders/.
 * Loads JSON Schemas under schema/ and enforces enums, required fields,
 * fractions, source applicability, and separated candidate metrics.
 * Does not touch production src/data/benders/.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const SCHEMA = path.join(ROOT, 'schema');
const ASSETS = path.join(ROOT, 'assets');

/** Current Bend Pro app-supported EMT trade sizes (v1). */
const APP_SUPPORTED_SIZES = new Set(['1/2', '3/4', '1', '1-1/4']);

/** Production workbook baseline model ids (staging mirrors). */
const EXISTING_PRODUCTION_BASELINE_MODELS = new Set([
  'model-greenlee-840a',
  'model-greenlee-841a',
  'model-greenlee-842a',
  'model-greenlee-843a',
  'model-greenlee-840f',
  'model-greenlee-841f',
  'model-greenlee-842f',
  'model-greenlee-843f',
  'model-greenlee-844a',
  'model-klein-51608',
  'model-klein-51609',
  'model-klein-51610',
  'model-klein-51606',
  'model-klein-51607',
  'model-gardner-960',
  'model-gardner-961',
  'model-gardner-962',
  'model-ideal-74-031',
  'model-ideal-74-032',
  'model-ideal-74-001',
  'model-ideal-74-002',
  'model-ideal-74-003',
  'model-ideal-74-034',
  'model-milwaukee-48-22-4070',
  'model-milwaukee-48-22-4071',
  'model-milwaukee-48-22-4072',
  'model-milwaukee-48-22-4080',
  'model-milwaukee-48-22-4081',
  'model-milwaukee-48-22-4082',
  'model-southwire-mcb1-2',
  'model-southwire-mcb3-4',
  'model-southwire-mcb1',
]);

const errors = [];
const warnings = [];
function fail(msg) {
  errors.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}

function readJson(full) {
  try {
    return JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch (e) {
    fail(`Invalid JSON ${full}: ${e.message}`);
    return null;
  }
}

function loadSchema(name) {
  const full = path.join(SCHEMA, name);
  if (!fs.existsSync(full)) {
    fail(`Missing schema: ${name}`);
    return null;
  }
  return readJson(full);
}

const common = loadSchema('common.json');
const schemas = {
  manufacturers: loadSchema('manufacturers.schema.json'),
  sources: loadSchema('sources.schema.json'),
  models: loadSchema('models.schema.json'),
  measurements: loadSchema('measurements.schema.json'),
  conflicts: loadSchema('conflicts.schema.json'),
  'asset-manifest': loadSchema('asset-manifest.schema.json'),
};

function resolveRef(ref) {
  // e.g. common.json#/$defs/id
  const m = String(ref).match(/common\.json#\/\$defs\/(.+)$/);
  if (m && common?.$defs?.[m[1]]) return common.$defs[m[1]];
  return null;
}

function checkType(value, schema, pathLabel) {
  if (!schema) return;
  if (schema.anyOf) {
    const ok = schema.anyOf.some((branch) => {
      const before = errors.length;
      checkType(value, branch, pathLabel);
      if (errors.length > before) {
        errors.length = before;
        return false;
      }
      return true;
    });
    if (!ok) fail(`${pathLabel}: value does not match anyOf`);
    return;
  }
  if (schema.$ref) {
    checkType(value, resolveRef(schema.$ref), pathLabel);
    return;
  }
  if (schema.const !== undefined && value !== schema.const) {
    fail(`${pathLabel}: expected const ${JSON.stringify(schema.const)}`);
  }
  if (schema.enum && !schema.enum.includes(value)) {
    fail(`${pathLabel}: ${JSON.stringify(value)} not in enum`);
  }
  if (schema.type === 'string') {
    if (typeof value !== 'string') fail(`${pathLabel}: expected string`);
    else {
      if (schema.minLength && value.length < schema.minLength) fail(`${pathLabel}: too short`);
      if (schema.maxLength && value.length > schema.maxLength) fail(`${pathLabel}: too long`);
      if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
        fail(`${pathLabel}: pattern mismatch`);
      }
    }
  } else if (schema.type === 'number') {
    if (typeof value !== 'number' || Number.isNaN(value)) fail(`${pathLabel}: expected number`);
    else {
      if (schema.exclusiveMinimum !== undefined && !(value > schema.exclusiveMinimum)) {
        fail(`${pathLabel}: must be > ${schema.exclusiveMinimum}`);
      }
    }
  } else if (schema.type === 'boolean') {
    if (typeof value !== 'boolean') fail(`${pathLabel}: expected boolean`);
  } else if (schema.type === 'null') {
    if (value !== null) fail(`${pathLabel}: expected null`);
  } else if (schema.type === 'array') {
    if (!Array.isArray(value)) fail(`${pathLabel}: expected array`);
    else if (schema.items) {
      value.forEach((item, i) => checkType(item, schema.items, `${pathLabel}[${i}]`));
    }
    if (schema.minItems && (!Array.isArray(value) || value.length < schema.minItems)) {
      fail(`${pathLabel}: minItems ${schema.minItems}`);
    }
  } else if (schema.type === 'integer') {
    if (!Number.isInteger(value)) fail(`${pathLabel}: expected integer`);
  } else if (schema.type === 'object') {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      fail(`${pathLabel}: expected object`);
      return;
    }
    for (const req of schema.required || []) {
      if (!(req in value)) fail(`${pathLabel}: missing required "${req}"`);
    }
    if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(schema.properties || {}));
      for (const k of Object.keys(value)) {
        if (!allowed.has(k)) fail(`${pathLabel}: unexpected property "${k}"`);
      }
    }
    for (const [k, propSchema] of Object.entries(schema.properties || {})) {
      if (k in value) checkType(value[k], propSchema, `${pathLabel}.${k}`);
    }
  }
}

/** Parse inches from number or fraction strings like 4-3/16 or 21 1/2. */
function parseInches(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  const t = String(value).trim().replace(/["″]/g, '');
  if (/^\d+(\.\d+)?$/.test(t)) return Number(t);
  let m = t.match(/^(\d+)-(\d+)\/(\d+)$/);
  if (m) return Number(m[1]) + Number(m[2]) / Number(m[3]);
  m = t.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (m) return Number(m[1]) + Number(m[2]) / Number(m[3]);
  m = t.match(/^(\d+)\/(\d+)$/);
  if (m) return Number(m[1]) / Number(m[3] || m[2]);
  return NaN;
}

function inchesFrom(value, unit) {
  const n = parseInches(value);
  if (n === null) return null;
  if (!Number.isFinite(n)) return NaN;
  const u = String(unit || '').toLowerCase();
  if (u === 'inch' || u === 'inches' || u === 'in') return n;
  if (u === 'mm') return n / 25.4;
  if (u === 'cm') return n / 2.54;
  if (['none', 'ratio', 'degree', 'degrees', 'lb', 'kg', 'unknown'].includes(u)) return null;
  return NaN;
}

const manufacturersDoc = readJson(path.join(DATA, 'manufacturers.json'));
const sourcesDoc = readJson(path.join(DATA, 'sources.json'));
const modelsDoc = readJson(path.join(DATA, 'models.json'));
const measurementsDoc = readJson(path.join(DATA, 'measurements.json'));
const conflictsDoc = readJson(path.join(DATA, 'conflicts.json'));
const assetsDoc = readJson(path.join(DATA, 'asset-manifest.json'));

if (schemas.manufacturers && manufacturersDoc) {
  checkType(manufacturersDoc, schemas.manufacturers, 'manufacturers.json');
}
if (schemas.sources && sourcesDoc) checkType(sourcesDoc, schemas.sources, 'sources.json');
if (schemas.models && modelsDoc) checkType(modelsDoc, schemas.models, 'models.json');
if (schemas.measurements && measurementsDoc) {
  // Schema already defines derivation + approximate; validate directly (no additionalProperties override)
  checkType(measurementsDoc, schemas.measurements, 'measurements.json');
}
if (schemas.conflicts && conflictsDoc) checkType(conflictsDoc, schemas.conflicts, 'conflicts.json');
if (schemas['asset-manifest'] && assetsDoc) {
  checkType(assetsDoc, schemas['asset-manifest'], 'asset-manifest.json');
}

const manufacturers = manufacturersDoc?.manufacturers ?? [];
const sources = sourcesDoc?.sources ?? [];
const models = modelsDoc?.models ?? [];
const measurements = measurementsDoc?.measurements ?? [];
const conflicts = conflictsDoc?.conflicts ?? [];
const assets = assetsDoc?.assets ?? [];

function uniqueIds(items, label) {
  const seen = new Map();
  for (const item of items) {
    if (!item?.id) {
      fail(`${label}: missing id`);
      continue;
    }
    if (seen.has(item.id)) fail(`${label}: duplicate id "${item.id}"`);
    seen.set(item.id, true);
  }
  return seen;
}

const mfrIds = uniqueIds(manufacturers, 'manufacturers');
const sourceIds = uniqueIds(sources, 'sources');
const modelIds = uniqueIds(models, 'models');
const factIds = uniqueIds(measurements, 'measurements');
uniqueIds(conflicts, 'conflicts');
uniqueIds(assets, 'assets');

// Warn only on exact full-URL duplicates. Query-key CDN document URLs may share a path base.
const urlIndex = new Map();
for (const s of sources) {
  if (!s.url) fail(`source ${s.id}: missing url`);
  if (!mfrIds.has(s.manufacturerId) && s.manufacturerId != null) {
    fail(`source ${s.id}: unknown manufacturerId`);
  }
  const key = String(s.url).toLowerCase();
  if (!urlIndex.has(key)) urlIndex.set(key, []);
  urlIndex.get(key).push(s.id);
}
for (const [url, ids] of urlIndex) {
  if (ids.length > 1) {
    warn(`reused exact source URL (${ids.length} sources): ${ids.join(', ')} → ${url}`);
  }
}

const skuIndex = new Map();
for (const model of models) {
  if (!mfrIds.has(model.manufacturerId)) fail(`model ${model.id}: unknown manufacturerId`);
  for (const sid of model.sourceIds ?? []) {
    if (!sourceIds.has(sid)) fail(`model ${model.id}: unknown sourceId ${sid}`);
    else {
      const src = sources.find((s) => s.id === sid);
      // Model-to-source applicability
      if (src && Array.isArray(src.modelsCovered) && src.modelsCovered.length > 0) {
        const covered = new Set(src.modelsCovered.map((x) => String(x).toLowerCase()));
        const nums = [...(model.modelNumbers || []), ...(model.skus || [])].map((x) =>
          String(x).toLowerCase(),
        );
        const familyHit =
          nums.some((n) => covered.has(n)) ||
          [...covered].some((c) => nums.some((n) => n.includes(c) || c.includes(n)));
        // Discovery/homepage leads may cover series names only
        if (!familyHit && src.modelsCovered.length > 0) {
          warn(
            `model ${model.id}: source ${sid} modelsCovered ${JSON.stringify(src.modelsCovered)} may not apply`,
          );
        }
        if (
          model.researchClass === 'identity_verified' &&
          model.category !== 'accessory' &&
          src.sourceType === 'official_product_page' &&
          !familyHit &&
          src.modelsCovered.length > 0
        ) {
          const title = String(src.title || '').toLowerCase();
          const claimsOtherSku = [...covered].some((c) => {
            const compact = c.replace(/[^a-z0-9]/gi, '');
            return !nums.includes(c) && compact.length > 2 && title.includes(compact);
          });
          if (claimsOtherSku) {
            fail(
              `model ${model.id}: identity_verified cites unrelated product page ${sid}`,
            );
          }
        }
      }
      if (
        model.researchClass === 'identity_verified' &&
        (src.sourceType === 'other' || src.sourceType === 'retailer_listing')
      ) {
        fail(
          `model ${model.id}: identity_verified cannot rest solely on ${src.sourceType} source ${sid}`,
        );
      }
    }
  }
  // Models with empty sourceIds cannot be identity_verified
  if (
    (model.researchClass === 'identity_verified' || model.researchClass === 'chart_candidate') &&
    (!model.sourceIds || model.sourceIds.length === 0)
  ) {
    fail(`model ${model.id}: ${model.researchClass} requires at least one sourceId`);
  }
  for (const rid of model.replacementModelIds ?? []) {
    if (!modelIds.has(rid)) fail(`model ${model.id}: unknown replacementModelId ${rid}`);
  }
  for (const sku of [...(model.skus ?? []), ...(model.modelNumbers ?? [])]) {
    const key = `${model.manufacturerId}::${String(sku).toLowerCase()}`;
    if (skuIndex.has(key) && skuIndex.get(key) !== model.id) {
      fail(`duplicate SKU/model number "${sku}" on ${skuIndex.get(key)} and ${model.id}`);
    }
    skuIndex.set(key, model.id);
  }
}

const factKeyIndex = new Map();
const openConflictIds = new Set(
  conflicts.filter((c) => c.status === 'open' || c.status === 'needs_human_review').map((c) => c.id),
);

for (const fact of measurements) {
  if (!modelIds.has(fact.modelId)) fail(`measurement ${fact.id}: unknown modelId`);
  if (!sourceIds.has(fact.sourceId)) fail(`measurement ${fact.id}: unknown sourceId`);

  if (fact.originalValue === 0 || fact.normalizedValueInches === 0) {
    fail(`measurement ${fact.id}: zero not allowed`);
  }

  if (fact.normalizedValueInches != null) {
    if (typeof fact.normalizedValueInches !== 'number' || fact.normalizedValueInches <= 0) {
      fail(`measurement ${fact.id}: normalizedValueInches must be positive or null`);
    }
    if (!fact.originalUnit || fact.originalUnit === 'unknown') {
      fail(`measurement ${fact.id}: originalUnit required when normalized set`);
    }
    const expected = inchesFrom(fact.originalValue, fact.originalUnit);
    if (Number.isFinite(expected)) {
      if (Math.abs(expected - fact.normalizedValueInches) > 1e-6) {
        fail(
          `measurement ${fact.id}: normalized ${fact.normalizedValueInches} != converted ${expected} from ${JSON.stringify(fact.originalValue)}`,
        );
      }
    } else if (Number.isNaN(expected)) {
      fail(
        `measurement ${fact.id}: cannot parse originalValue ${JSON.stringify(fact.originalValue)} as inches`,
      );
    } else if (
      expected === null &&
      ['degree', 'degrees', 'lb', 'kg', 'ratio', 'none'].includes(String(fact.originalUnit).toLowerCase())
    ) {
      fail(`measurement ${fact.id}: non-length unit should not have normalizedValueInches`);
    }
  }

  // Fractional strings must parse when unit is inch
  if (
    typeof fact.originalValue === 'string' &&
    /[-\s]\d+\/\d+|\d+\/\d+/.test(fact.originalValue) &&
    ['inch', 'inches', 'in'].includes(String(fact.originalUnit).toLowerCase())
  ) {
    const p = parseInches(fact.originalValue);
    if (!Number.isFinite(p)) fail(`measurement ${fact.id}: bad fraction ${fact.originalValue}`);
  }

  if (fact.derivation === 'derived' && fact.evidenceStatus === 'official_exact') {
    fail(`measurement ${fact.id}: derived facts cannot be official_exact`);
  }

  if (fact.conflictGroupId && !conflicts.some((c) => c.id === fact.conflictGroupId)) {
    fail(`measurement ${fact.id}: unknown conflictGroupId ${fact.conflictGroupId}`);
  }

  const key = [
    fact.modelId,
    fact.accessoryOrShoeId ?? '',
    fact.conduitType,
    fact.nominalSize,
    fact.property,
    fact.operation ?? '',
    fact.sourceId,
  ].join('|');
  if (factKeyIndex.has(key)) {
    fail(`duplicate fact key: ${fact.id} vs ${factKeyIndex.get(key)}`);
  }
  factKeyIndex.set(key, fact.id);

  // Source applicability for facts
  const src = sources.find((s) => s.id === fact.sourceId);
  const model = models.find((m) => m.id === fact.modelId);
  if (src && model && src.modelsCovered?.length) {
    const covered = new Set(src.modelsCovered.map((x) => String(x).toLowerCase()));
    const nums = [...(model.modelNumbers || []), ...(model.skus || [])].map((x) =>
      String(x).toLowerCase(),
    );
    const hit = nums.some((n) => covered.has(n) || [...covered].some((c) => n.includes(c) || c.includes(n)));
    if (!hit && fact.evidenceStatus !== 'rejected' && fact.nominalSize !== 'unqualified') {
      warn(`measurement ${fact.id}: source modelsCovered may not include model SKUs`);
    }
  }
}

for (const c of conflicts) {
  if (!modelIds.has(c.modelId)) fail(`conflict ${c.id}: unknown modelId`);
  if (!Array.isArray(c.competingFactIds) || c.competingFactIds.length < 2) {
    fail(`conflict ${c.id}: needs >=2 competingFactIds`);
  }
  for (const fid of c.competingFactIds ?? []) {
    if (!factIds.has(fid)) fail(`conflict ${c.id}: unknown fact ${fid}`);
  }
}

// Assets
const standaloneIconFiles = [];
for (const asset of assets) {
  for (const file of asset.files ?? []) {
    const full = path.join(ASSETS, file.replace(/^assets\//, ''));
    const alt = path.join(ROOT, file);
    if (!fs.existsSync(full) && !fs.existsSync(alt) && asset.reviewStatus !== 'placeholder_only') {
      fail(`asset ${asset.id}: missing file ${file}`);
    }
  }
  if (!asset.license) fail(`asset ${asset.id}: missing license`);
  if (!asset.accessibilityLabel) fail(`asset ${asset.id}: missing accessibilityLabel`);
  if (asset.category === 'bender-type' || asset.category === 'status') {
    standaloneIconFiles.push(...(asset.files || []));
  }
}

const preview = assets.find((a) => a.category === 'preview');
if (preview) {
  // Preview must reference the same standalone icon paths (embedded or listed)
  const previewPath = path.join(ASSETS, (preview.files?.[0] || '').replace(/^assets\//, ''));
  if (fs.existsSync(previewPath)) {
    const previewText = fs.readFileSync(previewPath, 'utf8');
    for (const iconFile of standaloneIconFiles) {
      const base = path.basename(iconFile, '.svg');
      if (!previewText.includes(base) && !previewText.includes(iconFile)) {
        warn(`preview may not include standalone icon ${iconFile}`);
      }
    }
  }
}

const standaloneIcons = assets.filter(
  (a) => a.originalDesign && a.reviewStatus !== 'placeholder_only' && a.category !== 'preview',
);
const placeholders = assets.filter((a) => a.reviewStatus === 'placeholder_only');
const previews = assets.filter((a) => a.category === 'preview');
if (standaloneIcons.length !== 14) {
  fail(`expected 14 standalone icons, found ${standaloneIcons.length}`);
}

function isPoweredModel(model) {
  return ['electric', 'hydraulic', 'mechanical', 'shoe'].includes(model.category);
}

function isSafeNewHandCandidate(fact, model) {
  if (!model || model.category !== 'hand') return false;
  if (fact.conduitType !== 'EMT') return false;
  if (!APP_SUPPORTED_SIZES.has(fact.nominalSize)) return false;
  if (!['stub_take_up', 'stub_deduct', 'centerline_radius'].includes(fact.property)) return false;
  if (!['official_exact', 'official_corroborated'].includes(fact.evidenceStatus)) return false;
  if (fact.confidence !== 'high') return false;
  if (fact.derivation === 'derived') return false;
  if (fact.approximate) return false;
  if (fact.conflictGroupId && openConflictIds.has(fact.conflictGroupId)) return false;
  if (fact.normalizedValueInches == null) return false;
  if (fact.productionScope === 'out_of_production_scope' || fact.productionScope === 'n/a') return false;
  const src = sources.find((s) => s.id === fact.sourceId);
  if (!src || !String(src.sourceType).startsWith('official')) return false;
  if (EXISTING_PRODUCTION_BASELINE_MODELS.has(model.id)) return false;
  return true;
}

function isExistingBaselineFact(fact, model) {
  if (!model || !EXISTING_PRODUCTION_BASELINE_MODELS.has(model.id)) return false;
  if (fact.conduitType !== 'EMT') return false;
  if (!['stub_take_up', 'stub_deduct', 'centerline_radius'].includes(fact.property)) return false;
  if (fact.evidenceStatus === 'rejected' || fact.evidenceStatus === 'missing') return false;
  if (fact.normalizedValueInches == null && fact.originalValue == null) return false;
  return true;
}

const metrics = {
  existingProductionBaselineFacts: 0,
  newHandCandidates: 0,
  poweredResearchFacts: 0,
  heldConflictFacts: 0,
  derivedReferenceFacts: 0,
};

const newHandCandidateIds = [];
for (const fact of measurements) {
  const model = models.find((m) => m.id === fact.modelId);
  if (!model) continue;
  if (fact.conflictGroupId && openConflictIds.has(fact.conflictGroupId)) {
    metrics.heldConflictFacts++;
  }
  if (fact.derivation === 'derived' || fact.evidenceStatus === 'field_reference_only') {
    metrics.derivedReferenceFacts++;
  }
  if (isPoweredModel(model) && fact.originalValue != null && fact.evidenceStatus !== 'rejected') {
    metrics.poweredResearchFacts++;
  }
  if (isExistingBaselineFact(fact, model)) metrics.existingProductionBaselineFacts++;
  if (isSafeNewHandCandidate(fact, model)) {
    metrics.newHandCandidates++;
    newHandCandidateIds.push(fact.id);
  }
}

const counts = {
  manufacturers: manufacturers.length,
  sources: sources.length,
  models: models.length,
  measurements: measurements.length,
  conflicts: conflicts.length,
  assetsTotal: assets.length,
  standaloneIcons: standaloneIcons.length,
  previewAssets: previews.length,
  placeholderAssets: placeholders.length,
  exactSkuRecords: models.reduce((n, m) => n + (m.skus?.length ?? 0), 0),
  hand: models.filter((m) => m.category === 'hand').length,
  mechanical: models.filter((m) => m.category === 'mechanical').length,
  electric: models.filter((m) => m.category === 'electric').length,
  hydraulic: models.filter((m) => m.category === 'hydraulic').length,
  shoesAccessories: models.filter((m) => m.category === 'shoe' || m.category === 'accessory').length,
  officialSources: sources.filter((s) => String(s.sourceType).startsWith('official')).length,
  archivedOfficialSources: sources.filter(
    (s) => s.sourceType === 'archived_official' || s.currency === 'archived',
  ).length,
  sourceBackedNumericalFacts: measurements.filter(
    (f) => f.originalValue !== null && f.evidenceStatus !== 'rejected' && f.evidenceStatus !== 'missing',
  ).length,
  referenceOnlyModels: models.filter((m) => m.researchClass === 'reference_only').length,
  rejectedClaims: measurements.filter((f) => f.evidenceStatus === 'rejected').length,
  ...metrics,
};

console.log('=== Bend Pro bender research validation ===');
console.log(JSON.stringify(counts, null, 2));
console.log('newHandCandidateIds:', JSON.stringify(newHandCandidateIds));
if (warnings.length) {
  console.log('\nWarnings:');
  for (const w of warnings) console.log(`  - ${w}`);
}
if (errors.length) {
  console.log('\nErrors:');
  for (const e of errors) console.log(`  - ${e}`);
  console.log(`\nFAILED with ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
console.log(`\nPASSED with ${warnings.length} warning(s)`);
