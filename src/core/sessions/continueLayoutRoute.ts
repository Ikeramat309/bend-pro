import type { Href } from 'expo-router';

import type { ContinueLayoutCandidate } from './recentLayoutsService';

/** Builds a calculator route that opens with the stored layout id for restore. */
export function continueLayoutRoute(candidate: ContinueLayoutCandidate): Href {
  const base = candidate.route;
  if (typeof base === 'string') {
    return { pathname: base, params: { layoutId: candidate.layout.id } } as Href;
  }

  return {
    ...base,
    params: {
      ...(typeof base === 'object' && base !== null && 'params' in base
        ? (base.params as Record<string, string>)
        : {}),
      layoutId: candidate.layout.id,
    },
  } as Href;
}
