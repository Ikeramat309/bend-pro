import type { TradeSize } from '@/core/types';

import { GENERIC_HAND_BENDER } from './genericHandBender';
import type { BenderProfile, BenderProfileId } from './types';

export type {
  BenderCategory,
  BenderProfile,
  BenderProfileId,
  EmtStub90TakeUpByTradeSize,
} from './types';

export { GENERIC_HAND_BENDER } from './genericHandBender';

/** Fallback take-up when a trade size is not listed on the active profile. */
export const DEFAULT_EMT_STUB90_TAKE_UP_INCHES = 5;

/** Profiles available to calculators today. */
export const BENDER_PROFILES: readonly BenderProfile[] = [GENERIC_HAND_BENDER];

export const DEFAULT_BENDER_PROFILE_ID: BenderProfileId = 'generic-hand-bender';

export function getBenderProfile(profileId: string): BenderProfile {
  return BENDER_PROFILES.find((profile) => profile.id === profileId) ?? BENDER_PROFILES[0];
}

export function getBenderProfileIdByName(name: string): BenderProfileId {
  const match = BENDER_PROFILES.find((profile) => profile.name === name);
  return match?.id ?? DEFAULT_BENDER_PROFILE_ID;
}

export function getEmtStub90TakeUpInches(
  profile: BenderProfile,
  tradeSize: TradeSize,
): number | undefined {
  return profile.emtStub90TakeUpInches[tradeSize];
}
