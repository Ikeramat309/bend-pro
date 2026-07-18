import { CALCULATOR_GUIDES } from '@/data/guide/calculatorGuides';

import { CALCULATOR_ROUTE_PATHS } from './calculatorRoutes';
import {
  CALCULATOR_IDS,
  CALCULATOR_REGISTRY,
  getBendsScreenFamilies,
  getCalculatorRoute,
  isCalculatorId,
  type CalculatorId,
} from './calculatorRegistry';

describe('calculatorRegistry', () => {
  test('calculator ids are derived from registry entries', () => {
    expect(CALCULATOR_IDS).toEqual(CALCULATOR_REGISTRY.map((entry) => entry.id));
  });

  test('no duplicate calculator ids', () => {
    expect(new Set(CALCULATOR_IDS).size).toBe(CALCULATOR_IDS.length);
  });

  test('all active calculators have routes', () => {
    const activeWithoutRoute = CALCULATOR_REGISTRY.filter(
      (entry) => entry.status === 'active' && !entry.route,
    );
    expect(activeWithoutRoute).toEqual([]);
  });

  test('all calculators shown on Bends screen have stable ids', () => {
    const shown = getBendsScreenFamilies().flatMap((family) => family.items);

    expect(shown.length).toBeGreaterThan(0);
    shown.forEach((item) => {
      expect(isCalculatorId(item.id)).toBe(true);
      expect(item.title.trim().length).toBeGreaterThan(0);
    });
  });

  test('getBendsScreenFamilies excludes hidden calculators', () => {
    const expectedCount = CALCULATOR_REGISTRY.filter(
      (entry) => entry.showOnBendsScreen && entry.status !== 'hidden',
    ).length;
    const shownCount = getBendsScreenFamilies().flatMap((family) => family.items).length;

    expect(shownCount).toBe(expectedCount);
  });

  test('planned calculators do not route to active screens', () => {
    const planned = CALCULATOR_REGISTRY.filter((entry) => entry.status === 'planned');

    planned.forEach((entry) => {
      expect(entry.route).toBeUndefined();
      expect(isCalculatorId(entry.id)).toBe(true);
      expect(getCalculatorRoute(entry.id as CalculatorId)).toBeUndefined();
    });
  });

  test('active calculators resolve routes through getCalculatorRoute', () => {
    const active = CALCULATOR_REGISTRY.filter((entry) => entry.status === 'active');

    active.forEach((entry) => {
      expect(isCalculatorId(entry.id)).toBe(true);
      expect(getCalculatorRoute(entry.id as CalculatorId)).toBe(entry.route);
    });
  });

  test('active calculator routes use centralized path constants', () => {
    const active = CALCULATOR_REGISTRY.filter((entry) => entry.status === 'active');

    active.forEach((entry) => {
      expect(entry.route).toBeDefined();
      expect(CALCULATOR_ROUTE_PATHS[entry.id as keyof typeof CALCULATOR_ROUTE_PATHS]).toBe(
        entry.route,
      );
    });
  });

  test('guide ids referenced by active calculators are valid when present', () => {
    const guideIds = new Set<string>(CALCULATOR_GUIDES.map((guide) => guide.id));

    CALCULATOR_REGISTRY.filter((entry) => entry.guideId).forEach((entry) => {
      expect(guideIds.has(entry.guideId!)).toBe(true);
    });
  });

  test('every published guide matches an active registry entry', () => {
    const byGuideId = new Map(
      CALCULATOR_REGISTRY.filter((entry) => entry.guideId).map((entry) => [
        entry.guideId!,
        entry,
      ]),
    );

    CALCULATOR_GUIDES.forEach((guide) => {
      const entry = byGuideId.get(guide.id);
      expect(entry).toBeDefined();
      expect(entry!.status).toBe('active');
      expect(entry!.route).toBe(guide.calculatorRoute);
    });
  });

  test('no calculator uses a static Home shortcut', () => {
    expect(CALCULATOR_REGISTRY.filter((entry) => entry.showOnHome)).toEqual([]);
  });

  test('isCalculatorId accepts registry ids and rejects unknown strings', () => {
    expect(isCalculatorId('offset')).toBe(true);
    expect(isCalculatorId('matchingOffset')).toBe(true);
    expect(isCalculatorId('parallelOffset')).toBe(true);
    expect(isCalculatorId('backToBack')).toBe(true);
    expect(isCalculatorId('compound90')).toBe(true);
    expect(isCalculatorId('multipleBends')).toBe(true);
    expect(isCalculatorId('not-a-calculator')).toBe(false);
  });
});
