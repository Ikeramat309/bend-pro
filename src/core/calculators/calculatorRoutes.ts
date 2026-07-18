import type { Href } from 'expo-router';

/** Calculator screen paths — keep in sync with `src/app/` route files. Do not import `@/navigation`. */
export const CALCULATOR_ROUTE_PATHS = {
  offset: '/offset',
  stub90: '/stub90',
  saddle3: '/saddle3',
  saddle4: '/saddle4',
  segment: '/segment',
  rolling: '/rolling',
  kick90: '/kick90',
  matchingOffset: '/matching-offset',
  parallelOffset: '/parallel-offset',
  backToBack: '/back-to-back',
  compound90: '/compound90',
  multipleBends: '/multiple-bends',
} as const satisfies Record<string, Href>;

export type CalculatorRouteKey = keyof typeof CALCULATOR_ROUTE_PATHS;
