import type { Href } from 'expo-router';

import { CALCULATOR_ROUTE_PATHS } from '@/core/calculators/calculatorRoutes';
import type { GuideCalculatorId } from '@/core/calculators/calculatorRegistry';

/** Central app URLs for Expo Router — use Routes.offset instead of raw strings. */
export const Routes = {
  home: '/' as Href,
  bends: '/bends' as Href,
  settings: '/settings' as Href,
  benderDatabase: '/bender-database' as Href,
  guide: '/guide' as Href,
  ...CALCULATOR_ROUTE_PATHS,
} as const;

/** Guide tab with optional calculator context from a bend screen dock. */
export function guideRoute(calculatorId: GuideCalculatorId): Href {
  return { pathname: '/guide', params: { calculator: calculatorId } } as Href;
}

/** Bender database with optional profile detail sheet open. */
export function benderDatabaseRoute(profileId?: string): Href {
  return profileId
    ? ({ pathname: '/bender-database', params: { profile: profileId } } as Href)
    : Routes.benderDatabase;
}
