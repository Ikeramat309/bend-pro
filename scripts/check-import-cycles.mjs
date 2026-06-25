import fs from 'fs';
import path from 'path';

const SRC_ROOT = path.resolve(process.cwd(), 'src');
const IMPORT_FROM_RE =
  /(?:import|export)\s+(?:type\s+)?(?:[\w*{}\s,$]+\s+from\s+)?['"]([^'"]+)['"]/g;

function listSourceFiles(dir = SRC_ROOT) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listSourceFiles(fullPath));
      continue;
    }
    if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\.(ts|tsx)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function parseImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return [...content.matchAll(IMPORT_FROM_RE)].map((match) => match[1]);
}

function resolveImport(fromFile, specifier) {
  const tryPaths = (base) =>
    [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')].find(
      (candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile(),
    );

  if (specifier.startsWith('@/')) {
    return tryPaths(path.join(SRC_ROOT, specifier.slice(2).split('/').join(path.sep)));
  }
  if (specifier.startsWith('.')) {
    return tryPaths(path.resolve(path.dirname(fromFile), specifier));
  }
  return null;
}

function findCycles(files) {
  const graph = new Map();
  for (const file of files) {
    graph.set(
      file,
      parseImports(file)
        .map((specifier) => resolveImport(file, specifier))
        .filter(Boolean),
    );
  }

  const cycles = [];
  const visiting = new Set();
  const visited = new Set();
  const stack = [];

  function dfs(node) {
    if (visited.has(node)) return;
    if (visiting.has(node)) {
      const start = stack.indexOf(node);
      if (start >= 0) cycles.push(stack.slice(start).concat(node));
      return;
    }
    visiting.add(node);
    stack.push(node);
    for (const next of graph.get(node) ?? []) dfs(next);
    stack.pop();
    visiting.delete(node);
    visited.add(node);
  }

  for (const file of files) dfs(file);
  return cycles;
}

const cycles = findCycles(listSourceFiles());
if (cycles.length > 0) {
  console.error('Circular imports detected under src/:');
  for (const cycle of cycles) {
    console.error(
      cycle.map((file) => path.relative(process.cwd(), file).split(path.sep).join('/')).join(' -> '),
    );
  }
  process.exit(1);
}

console.log('No circular imports detected under src/.');
