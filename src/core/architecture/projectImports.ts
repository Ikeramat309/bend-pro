/**
 * Lightweight filesystem helpers for architecture guardrail tests.
 * Not used at runtime — Jest only.
 */
import fs from 'fs';
import path from 'path';

const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx']);

/** Absolute path to `src/`. */
export const SRC_ROOT = path.resolve(process.cwd(), 'src');

const IMPORT_FROM_RE =
  /(?:import|export)\s+(?:type\s+)?(?:[\w*{}\s,$]+\s+from\s+)?['"]([^'"]+)['"]/g;

export function listSourceFiles(rootDir = SRC_ROOT): string[] {
  const results: string[] = [];

  function walk(current: string) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '__tests__') {
        continue;
      }
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      const ext = path.extname(entry.name);
      if (SOURCE_EXTENSIONS.has(ext) && !entry.name.endsWith('.test.ts') && !entry.name.endsWith('.test.tsx')) {
        results.push(fullPath);
      }
    }
  }

  walk(rootDir);
  return results;
}

export function parseImportSpecifiers(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const specifiers: string[] = [];
  for (const match of content.matchAll(IMPORT_FROM_RE)) {
    specifiers.push(match[1]);
  }
  return specifiers;
}

function resolveModulePath(basePath: string): string | null {
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return null;
}

/** Resolves an import to an absolute file under `src/`, or null for externals. */
export function resolveProjectImport(fromFile: string, specifier: string): string | null {
  if (specifier.startsWith('@/')) {
    const relative = specifier.slice(2).split('/').join(path.sep);
    return resolveModulePath(path.join(SRC_ROOT, relative));
  }

  if (specifier.startsWith('.')) {
    return resolveModulePath(path.resolve(path.dirname(fromFile), specifier));
  }

  return null;
}

export function getFeatureFolderName(filePath: string): string | undefined {
  const normalized = filePath.split(path.sep).join('/');
  const match = normalized.match(/\/features\/(bend-[^/]+)\//);
  return match?.[1];
}

export function findImportCycles(files: string[]): string[][] {
  const graph = new Map<string, string[]>();

  for (const file of files) {
    const edges: string[] = [];
    for (const specifier of parseImportSpecifiers(file)) {
      const target = resolveProjectImport(file, specifier);
      if (target) {
        edges.push(target);
      }
    }
    graph.set(file, edges);
  }

  const cycles: string[][] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];

  function dfs(node: string) {
    if (visited.has(node)) {
      return;
    }
    if (visiting.has(node)) {
      const cycleStart = stack.indexOf(node);
      if (cycleStart >= 0) {
        cycles.push([...stack.slice(cycleStart), node]);
      }
      return;
    }

    visiting.add(node);
    stack.push(node);

    for (const next of graph.get(node) ?? []) {
      dfs(next);
    }

    stack.pop();
    visiting.delete(node);
    visited.add(node);
  }

  for (const file of files) {
    dfs(file);
  }

  return cycles;
}

export function toProjectRelative(filePath: string): string {
  return path.relative(path.join(SRC_ROOT, '..'), filePath).split(path.sep).join('/');
}
