import type { Href } from 'expo-router';

import type { ConduitType } from '@/core/types';

import { CALCULATOR_ROUTE_PATHS } from './calculatorRoutes';
import type {
  BendsScreenFamily,
  BendsScreenItem,
  CalculatorCategory,
  CalculatorDefinition,
} from './calculatorTypes';

const EMT_ONLY: readonly ConduitType[] = ['EMT'];

const CATEGORY_ORDER: readonly CalculatorCategory[] = [
  'Offset',
  '90s',
  'Saddles',
  'Large / Advanced',
];

const REGISTRY_SOURCE = [
  {
    id: 'offset',
    title: 'Basic Offset',
    shortTitle: 'Offset',
    description: 'Clear obstruction. Stay parallel.',
    category: 'Offset',
    route: CALCULATOR_ROUTE_PATHS.offset,
    guideId: 'offset',
    status: 'active',
    supportedConduitTypes: EMT_ONLY,
    tags: ['offset', 'basic'],
    sortOrder: 10,
    showOnBendsScreen: true,
    showOnHome: false,
  },
  {
    id: 'parallelOffset',
    title: 'Parallel Offset',
    shortTitle: 'Parallel Offset',
    category: 'Offset',
    status: 'planned',
    supportedConduitTypes: EMT_ONLY,
    tags: ['offset', 'parallel'],
    sortOrder: 20,
    showOnBendsScreen: true,
    showOnHome: false,
  },
  {
    id: 'rolling',
    title: 'Rolling Offset',
    shortTitle: 'Rolling',
    description: 'Offset in two directions — height and advance.',
    category: 'Offset',
    route: CALCULATOR_ROUTE_PATHS.rolling,
    guideId: 'rolling',
    status: 'active',
    supportedConduitTypes: EMT_ONLY,
    tags: ['offset', 'rolling'],
    sortOrder: 30,
    showOnBendsScreen: true,
    showOnHome: false,
  },
  {
    id: 'boxOffset',
    title: 'Box Offset',
    shortTitle: 'Box Offset',
    category: 'Offset',
    status: 'planned',
    supportedConduitTypes: EMT_ONLY,
    tags: ['offset', 'box'],
    sortOrder: 40,
    showOnBendsScreen: true,
    showOnHome: false,
  },
  {
    id: 'stub90',
    title: 'Stub-Up 90',
    shortTitle: 'Stub 90',
    description: 'Find the deduct mark from stub length and deduct.',
    category: '90s',
    route: CALCULATOR_ROUTE_PATHS.stub90,
    guideId: 'stub90',
    status: 'active',
    supportedConduitTypes: EMT_ONLY,
    tags: ['90', 'stub'],
    sortOrder: 10,
    showOnBendsScreen: true,
    showOnHome: false,
  },
  {
    id: 'backToBack',
    title: 'Back-to-Back 90',
    shortTitle: 'Back-to-Back',
    category: '90s',
    status: 'planned',
    supportedConduitTypes: EMT_ONLY,
    tags: ['90', 'back-to-back'],
    sortOrder: 20,
    showOnBendsScreen: true,
    showOnHome: false,
  },
  {
    id: 'kick90',
    title: 'Kick 90',
    shortTitle: 'Kick 90',
    category: '90s',
    status: 'planned',
    supportedConduitTypes: EMT_ONLY,
    tags: ['90', 'kick'],
    sortOrder: 30,
    showOnBendsScreen: true,
    showOnHome: false,
  },
  {
    id: 'saddle3',
    title: '3-Point Saddle',
    shortTitle: '3-Point Saddle',
    description: 'Route over an obstruction with three bends.',
    category: 'Saddles',
    route: CALCULATOR_ROUTE_PATHS.saddle3,
    guideId: 'saddle3',
    status: 'active',
    supportedConduitTypes: EMT_ONLY,
    tags: ['saddle', '3-point'],
    sortOrder: 10,
    showOnBendsScreen: true,
    showOnHome: false,
  },
  {
    id: 'saddle4',
    title: '4-Point Saddle',
    shortTitle: '4-Point Saddle',
    description: 'Route over a wide obstruction with a flat top.',
    category: 'Saddles',
    route: CALCULATOR_ROUTE_PATHS.saddle4,
    guideId: 'saddle4',
    status: 'active',
    supportedConduitTypes: EMT_ONLY,
    tags: ['saddle', '4-point'],
    sortOrder: 20,
    showOnBendsScreen: true,
    showOnHome: false,
  },
  {
    id: 'segment',
    title: 'Segment Bend',
    shortTitle: 'Segment',
    description: 'Large-radius bend from a series of equal shots.',
    category: 'Large / Advanced',
    route: CALCULATOR_ROUTE_PATHS.segment,
    guideId: 'segment',
    status: 'active',
    supportedConduitTypes: EMT_ONLY,
    tags: ['segment', 'large-radius'],
    sortOrder: 10,
    showOnBendsScreen: true,
    showOnHome: false,
  },
  {
    id: 'hydraulicLayout',
    title: 'Hydraulic Layout',
    shortTitle: 'Hydraulic',
    category: 'Large / Advanced',
    status: 'planned',
    supportedConduitTypes: EMT_ONLY,
    tags: ['hydraulic', 'advanced'],
    sortOrder: 20,
    showOnBendsScreen: true,
    showOnHome: false,
  },
] as const;

export type CalculatorId = (typeof REGISTRY_SOURCE)[number]['id'];

export type GuideCalculatorId = Extract<
  (typeof REGISTRY_SOURCE)[number],
  { guideId: string }
>['guideId'];

export const CALCULATOR_REGISTRY: readonly CalculatorDefinition[] = REGISTRY_SOURCE;

export const CALCULATOR_IDS: readonly CalculatorId[] = REGISTRY_SOURCE.map((entry) => entry.id);

export const GUIDE_CALCULATOR_IDS: readonly GuideCalculatorId[] = REGISTRY_SOURCE.flatMap(
  (entry) => ('guideId' in entry ? [entry.guideId] : []),
);

export function getCalculatorById(id: CalculatorId): CalculatorDefinition | undefined {
  return CALCULATOR_REGISTRY.find((entry) => entry.id === id);
}

export function isCalculatorId(id: string): id is CalculatorId {
  return CALCULATOR_REGISTRY.some((entry) => entry.id === id);
}

/** Returns a route only for active calculators. Planned/hidden entries never navigate. */
export function getCalculatorRoute(id: CalculatorId): Href | undefined {
  const entry = getCalculatorById(id);
  if (!entry || entry.status !== 'active') {
    return undefined;
  }
  return entry.route;
}

function toBendsScreenItem(entry: CalculatorDefinition): BendsScreenItem {
  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    status: entry.status === 'active' ? 'active' : 'coming-soon',
  };
}

/** Bends hub groups derived from registry visibility and sort order. */
export function getBendsScreenFamilies(): BendsScreenFamily[] {
  const visible = CALCULATOR_REGISTRY.filter(
    (entry) => entry.showOnBendsScreen && entry.status !== 'hidden',
  );

  return CATEGORY_ORDER.map((category) => ({
    title: category,
    items: visible
      .filter((entry) => entry.category === category)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(toBendsScreenItem),
  })).filter((family) => family.items.length > 0);
}
