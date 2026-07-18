import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const rootFiles = [
  'README.md',
  'EXECUTIVE_PRODUCT_DECISIONS.md',
  'IMPLEMENTATION_ROADMAP.md',
  'CROSS_CALCULATOR_FIELD_CONTRACT.md',
  'USER_VOICE_SYNTHESIS.md',
  'CURRENT_APP_AUDIT.md',
  'COMPETITOR_SYNTHESIS.md',
  'SOURCE_REGISTER.md',
  'CONFLICTS_AND_GAPS.md',
  'RESEARCH_LOG.md',
  'SOL_UPGRADE_REPORT.md',
  'QA_REPORT.md',
  'TASK_REPORT.md',
];

const calculators = [
  'back-to-back-90',
  'matching-offset',
  'parallel-offsets',
  'compound-90',
  'multiple-bends',
  'parallel-kick-90',
];

const calculatorFiles = [
  'PRODUCT_SPEC.md',
  'FIELD_WORKFLOW.md',
  'INPUT_OUTPUT_MATRIX.md',
  'DIAGRAM_BRIEF.md',
  'CURRENT_GAP_AUDIT.md',
  'EVIDENCE_LEDGER.md',
  'WORKED_CASES.md',
  'OPEN_QUESTIONS.md',
  'COMPETITOR_COMPARISON.md',
];

const failures = [];
const canonicalFiles = [];

function requireFile(relative) {
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    failures.push(`Missing file: ${relative}`);
    return;
  }
  canonicalFiles.push(absolute);
}

for (const file of rootFiles) requireFile(file);
for (const calculator of calculators) {
  for (const file of calculatorFiles) {
    requireFile(path.join('calculators', calculator, file));
  }
}

const sourcePath = path.join(root, 'SOURCE_REGISTER.md');
const sourceText = fs.readFileSync(sourcePath, 'utf8');
const declared = new Set(
  [...sourceText.matchAll(/\|\s*((?:S|C|U)-(?:[A-Z0-9]+-)+[A-Z0-9]+)\s*\|/g)].map(
    (match) => match[1],
  ),
);

const referenced = new Set();
const mojibake = /(?:\u00c3|\u00c2|\u00e2\u0080|\ufffd)/u;
for (const absolute of canonicalFiles) {
  const text = fs.readFileSync(absolute, 'utf8');
  if (mojibake.test(text)) {
    failures.push(`Encoding artifact: ${path.relative(root, absolute)}`);
  }
  if (absolute !== sourcePath) {
    for (const match of text.matchAll(/\b(?:S|C|U)-(?:[A-Z0-9]+-)+[A-Z0-9]+\b/g)) {
      referenced.add(match[0]);
    }
  }
}

for (const id of referenced) {
  if (!declared.has(id)) failures.push(`Unresolved source ID: ${id}`);
}

function findNested(directory, targetName) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === targetName) return absolute;
      const found = findNested(absolute, targetName);
      if (found) return found;
    }
  }
  return undefined;
}

const nestedModules = findNested(root, 'node_modules');
if (nestedModules) failures.push(`Generated dependency tree present: ${nestedModules}`);

function close(actual, expected, tolerance, label) {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) {
    failures.push(`${label}: expected ${expected}, received ${actual}`);
  }
}

const deg = (value) => (value * Math.PI) / 180;
close(2 * Math.tan(deg(15)), 0.5358983849, 1e-9, 'parallel shift');
close((Math.asin(6 / 12) * 180) / Math.PI, 30, 1e-12, 'matching bends angle');
close((Math.atan(3 / 12) * 180) / Math.PI, 14.0362434679, 1e-9, 'matching centers angle');
close(Math.hypot(3, 12), 12.3693168769, 1e-9, 'matching centers DBB');
close((1.5 + 1.5) * 1.414 - 0.5, 3.742, 1e-12, 'compound wall box');
close(1.5 * 3 - 0.5, 4, 1e-12, 'compound diamond');
close(2 / Math.sin(deg(30)) + 0.5, 4.5, 1e-12, 'kick center');
close(2 / Math.sin(deg(30)), 4, 1e-12, 'kick parallel landing');
close(2.5 / Math.cos(deg(30)), 2.8867513459, 1e-9, 'kick perpendicular landing');

if (failures.length > 0) {
  console.error('Research validation FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Research validation PASSED');
  console.log(`Canonical root files: ${rootFiles.length}`);
  console.log(`Calculator packages: ${calculators.length}`);
  console.log(`Calculator files: ${calculators.length * calculatorFiles.length}`);
  console.log(`Declared source IDs: ${declared.size}`);
  console.log(`Referenced source IDs: ${referenced.size}`);
}
