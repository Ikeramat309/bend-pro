import fs from 'fs';
import path from 'path';

import { CALCULATOR_GUIDES } from '@/data/guide/calculatorGuides';
import { Routes } from '@/navigation/routes';

import { CALCULATOR_ROUTE_PATHS } from '../calculators/calculatorRoutes';
import { CALCULATOR_REGISTRY } from '../calculators/calculatorRegistry';
import {
  findImportCycles,
  getFeatureFolderName,
  listSourceFiles,
  parseImportSpecifiers,
  resolveProjectImport,
  toProjectRelative,
} from './projectImports';

const ENGINE_FORBIDDEN_IMPORTS = [
  /^react$/,
  /^react-native$/,
  /^react-native-svg$/,
  /^expo-router$/,
  /^expo(-|$)/,
  /^@\/shared\/ui/,
  /^@\/shared\/workspace/,
  /^@\/features\//,
];

describe('architecture guardrails', () => {
  const sourceFiles = listSourceFiles();

  test('feature modules do not import from other features', () => {
    const violations: string[] = [];

    for (const file of sourceFiles) {
      const ownFeature = getFeatureFolderName(file);
      if (!ownFeature) {
        continue;
      }

      for (const specifier of parseImportSpecifiers(file)) {
        const match = specifier.match(/^@\/features\/(bend-[^/]+)/);
        if (match && match[1] !== ownFeature) {
          violations.push(`${toProjectRelative(file)} -> ${specifier}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  test('calculator engines do not import React or UI layers', () => {
    const violations: string[] = [];

    for (const file of sourceFiles) {
      if (!file.includes(`${path.sep}features${path.sep}`) || !file.includes(`${path.sep}engine${path.sep}`)) {
        continue;
      }

      for (const specifier of parseImportSpecifiers(file)) {
        if (ENGINE_FORBIDDEN_IMPORTS.some((pattern) => pattern.test(specifier))) {
          violations.push(`${toProjectRelative(file)} -> ${specifier}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  test('MM_PER_INCH is defined only in core measurements', () => {
    const offenders = sourceFiles.filter((file) => {
      if (file.endsWith(`${path.sep}core${path.sep}measurements${path.sep}constants.ts`)) {
        return false;
      }
      return /MM_PER_INCH\s*=/.test(fs.readFileSync(file, 'utf8'));
    });

    expect(offenders.map(toProjectRelative)).toEqual([]);
  });

  test('bendLibrary does not hand-maintain calculator lists', () => {
    const bendLibraryPath = sourceFiles.find((file) =>
      file.endsWith(`${path.sep}data${path.sep}bendLibrary.ts`),
    );
    expect(bendLibraryPath).toBeDefined();

    const content = fs.readFileSync(bendLibraryPath!, 'utf8');
    expect(content).not.toMatch(/BEND_FAMILIES\s*:\s*\[/);
    expect(content).not.toMatch(/ACTIVE_ROUTES/);
    expect(content).toContain('@/core/calculators');
  });

  test('guide ids stay aligned with registry guide links', () => {
    const registryGuideIds = new Set(
      CALCULATOR_REGISTRY.filter((entry) => entry.guideId).map((entry) => entry.guideId!),
    );
    const guideIds = CALCULATOR_GUIDES.map((guide) => guide.id);

    expect(new Set(guideIds)).toEqual(registryGuideIds);
  });

  test('Routes spreads calculator paths from core', () => {
    for (const [key, routePath] of Object.entries(CALCULATOR_ROUTE_PATHS)) {
      expect(Routes[key as keyof typeof CALCULATOR_ROUTE_PATHS]).toBe(routePath);
    }
  });

  test('no circular imports under src/', () => {
    const cycles = findImportCycles(sourceFiles);
    expect(cycles).toEqual([]);
  });

  test('screens resolve hub navigation through registry helpers', () => {
    const bendsScreen = sourceFiles.find((file) =>
      file.endsWith(`${path.sep}screens${path.sep}BendsScreen.tsx`),
    );
    expect(bendsScreen).toBeDefined();

    const content = fs.readFileSync(bendsScreen!, 'utf8');
    expect(content).toContain('getCalculatorRoute');
    expect(content).not.toMatch(/ACTIVE_ROUTES/);
    expect(content).not.toMatch(/Record<string,\s*Href>/);
  });
});

describe('resolveProjectImport', () => {
  test('resolves alias imports to src files', () => {
    const files = listSourceFiles();
    const offsetEngine = files.find(
      (file) => file.includes('bend-offset') && file.endsWith('offset.engine.ts'),
    );
    expect(offsetEngine).toBeDefined();

    const target = resolveProjectImport(offsetEngine!, '@/core/measurements');
    expect(target).toBeTruthy();
    expect(target!).toContain(`${path.sep}core${path.sep}measurements`);
  });
});
