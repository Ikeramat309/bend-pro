#!/usr/bin/env node
/**
 * Isolated double-rebuild verification for research/benders/.
 *
 * Copies the staging tree to a temp dir, wipes generated data artifacts,
 * runs the deterministic pipeline twice, and compares SHA-256 hashes of
 * the seven canonical artifacts against the live research/benders/ copies.
 *
 * Does not touch src/data/benders/.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(ROOT, '../..');

const ARTIFACTS = [
  'data/manufacturers.json',
  'data/sources.json',
  'data/models.json',
  'data/measurements.json',
  'data/conflicts.json',
  'data/asset-manifest.json',
  'assets/previews/icon-family-preview.svg',
];

const PIPELINE = [
  'scripts/build-corpus.mjs',
  'scripts/enrich-from-agents.mjs',
  'scripts/correct-corpus.mjs',
  'scripts/build-icon-preview.mjs',
];

const EXPECTED = {
  manufacturers: 12,
  sources: 52,
  models: 99,
  measurements: 99,
  conflicts: 10,
  manifestEntries: 17,
  standaloneIcons: 14,
  newHandCandidates: 1,
};

function sha256File(filePath) {
  const h = crypto.createHash('sha256');
  h.update(fs.readFileSync(filePath));
  return h.digest('hex');
}

function copyTree(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyTree(from, to);
    else fs.copyFileSync(from, to);
  }
}

function wipeGenerated(stagingRoot) {
  for (const name of [
    'manufacturers.json',
    'sources.json',
    'models.json',
    'measurements.json',
    'conflicts.json',
  ]) {
    fs.unlinkSync(path.join(stagingRoot, 'data', name));
  }
  const preview = path.join(stagingRoot, 'assets/previews/icon-family-preview.svg');
  if (fs.existsSync(preview)) fs.unlinkSync(preview);
}

function runPipeline(stagingRoot) {
  for (const rel of PIPELINE) {
    const script = path.join(stagingRoot, rel);
    const r = spawnSync(process.execPath, [script], {
      cwd: REPO,
      encoding: 'utf8',
      env: { ...process.env },
    });
    if (r.status !== 0) {
      console.error(r.stdout);
      console.error(r.stderr);
      throw new Error(`${rel} failed with exit ${r.status}`);
    }
  }
}

function countsFrom(stagingRoot) {
  const load = (name) =>
    JSON.parse(fs.readFileSync(path.join(stagingRoot, 'data', name), 'utf8'));
  const manufacturers = load('manufacturers.json').manufacturers.length;
  const sources = load('sources.json').sources.length;
  const models = load('models.json').models.length;
  const measurements = load('measurements.json').measurements.length;
  const conflicts = load('conflicts.json').conflicts.length;
  const manifest = load('asset-manifest.json').assets.length;
  const icons = fs
    .readdirSync(path.join(stagingRoot, 'assets/icons'))
    .filter((f) => f.startsWith('icon-') && f.endsWith('.svg')).length;

  const validate = spawnSync(
    process.execPath,
    [path.join(stagingRoot, 'scripts/validate.mjs')],
    { cwd: REPO, encoding: 'utf8' },
  );
  if (validate.status !== 0) {
    console.error(validate.stdout);
    console.error(validate.stderr);
    throw new Error('validate.mjs failed in isolated rebuild');
  }
  let newHandCandidates = null;
  const m = validate.stdout.match(/"newHandCandidates":\s*(\d+)/);
  if (m) newHandCandidates = Number(m[1]);

  return {
    manufacturers,
    sources,
    models,
    measurements,
    conflicts,
    manifestEntries: manifest,
    standaloneIcons: icons,
    newHandCandidates,
    validateStdout: validate.stdout,
  };
}

function hashSet(stagingRoot) {
  const out = {};
  for (const rel of ARTIFACTS) {
    out[rel] = sha256File(path.join(stagingRoot, rel));
  }
  return out;
}

function assertCounts(label, counts) {
  const mismatches = [];
  for (const [k, v] of Object.entries(EXPECTED)) {
    if (counts[k] !== v) mismatches.push(`${k}: got ${counts[k]}, expected ${v}`);
  }
  if (mismatches.length) {
    throw new Error(`${label} count mismatch:\n  - ${mismatches.join('\n  - ')}`);
  }
}

function compareHashes(label, actual, expected) {
  const diffs = [];
  for (const rel of ARTIFACTS) {
    if (actual[rel] !== expected[rel]) {
      diffs.push(`${rel}\n      got:      ${actual[rel]}\n      expected: ${expected[rel]}`);
    }
  }
  if (diffs.length) {
    throw new Error(`${label} hash mismatch:\n  - ${diffs.join('\n  - ')}`);
  }
}

const canonicalHashes = hashSet(ROOT);
console.log('Canonical SHA-256:');
for (const rel of ARTIFACTS) console.log(`  ${rel}: ${canonicalHashes[rel]}`);

const results = [];
for (let run = 1; run <= 2; run++) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `bendpro-benders-rebuild-${run}-`));
  const staging = path.join(tmp, 'benders');
  console.log(`\n=== Isolated rebuild run ${run} → ${staging} ===`);
  copyTree(ROOT, staging);
  wipeGenerated(staging);
  runPipeline(staging);
  const counts = countsFrom(staging);
  assertCounts(`run ${run}`, counts);
  const hashes = hashSet(staging);
  compareHashes(`run ${run}`, hashes, canonicalHashes);
  results.push({ run, counts, hashes, tmp });
  console.log(`Run ${run}: counts OK, all ${ARTIFACTS.length} artifact hashes match canonical.`);
}

console.log('\n=== verify-rebuild PASSED ===');
console.log(
  JSON.stringify(
    {
      expected: EXPECTED,
      run1: results[0].counts,
      run2: results[1].counts,
      hashesMatchCanonical: true,
      artifacts: ARTIFACTS,
    },
    null,
    2,
  ),
);
