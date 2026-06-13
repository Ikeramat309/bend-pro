/**
 * Bender profile helpers — list, search, and display summaries.
 */
import type { TradeSize } from '@/core/types';

import { GENERIC_HAND_BENDER } from './genericHandBender';
import { HAND_BENDER_ALT_CHART } from './handBenderAltChart';
import { HAND_BENDER_COMPACT } from './handBenderCompact';
import {
  getBenderProfileById,
  getBenderProfileIdByNameFromAll,
  type CustomBenderProfileStored,
} from './customBenders';
import type { BenderProfile, BenderProfileId } from './types';

export type {
  BenderCategory,
  BenderProfile,
  BenderProfileId,
  BuiltInBenderProfileId,
  EmtStub90TakeUpByTradeSize,
} from './types';

export {
  buildCustomBenderProfileFromDraft,
  createCustomBenderProfileId,
  CUSTOM_BENDER_ID_PREFIX,
  draftFromCustomProfile,
  filterAllBenderProfiles,
  getBenderProfileById,
  getBenderProfileIdByNameFromAll,
  isBenderProfileNameTaken,
  isCustomBenderProfileId,
  isKnownBenderProfileId,
  MAX_CUSTOM_BENDER_NAME_LENGTH,
  MAX_CUSTOM_BENDER_PROFILES,
  mergeBenderProfiles,
  sanitizeCustomBenderProfile,
  sanitizeCustomBenderProfiles,
  toBenderProfile,
  type CustomBenderProfileDraft,
  type CustomBenderProfileStored,
} from './customBenders';

export { GENERIC_HAND_BENDER } from './genericHandBender';
export { HAND_BENDER_ALT_CHART } from './handBenderAltChart';
export { HAND_BENDER_COMPACT } from './handBenderCompact';

/** Fallback take-up when a trade size is not listed on the active profile. */
export const DEFAULT_EMT_STUB90_TAKE_UP_INCHES = 5;

/** EMT sizes shown in profile summaries (profiles only list these today). */
export const PROFILE_SUMMARY_TRADE_SIZES: readonly TradeSize[] = ['1/2', '3/4', '1'];

/** Profiles available to calculators today. */
export const BENDER_PROFILES: readonly BenderProfile[] = [
  GENERIC_HAND_BENDER,
  HAND_BENDER_ALT_CHART,
  HAND_BENDER_COMPACT,
];

export const DEFAULT_BENDER_PROFILE_ID: BenderProfileId = 'generic-hand-bender';

export function getBenderProfile(
  profileId: string,
  customProfiles: readonly CustomBenderProfileStored[] = [],
): BenderProfile {
  return getBenderProfileById(profileId, customProfiles);
}

export function getBenderProfileIdByName(
  name: string,
  customProfiles: readonly CustomBenderProfileStored[] = [],
): string {
  return getBenderProfileIdByNameFromAll(name, customProfiles);
}

export function getEmtStub90TakeUpInches(
  profile: BenderProfile,
  tradeSize: TradeSize,
): number | undefined {
  return profile.emtStub90TakeUpInches[tradeSize];
}

/** Case-insensitive search across name, description, and category. */
export function filterBenderProfiles(query: string): readonly BenderProfile[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return BENDER_PROFILES;

  return BENDER_PROFILES.filter(
    (profile) =>
      profile.name.toLowerCase().includes(normalized) ||
      profile.description.toLowerCase().includes(normalized) ||
      profile.category.toLowerCase().includes(normalized),
  );
}

/** One-line stub-90 deduct summary for database cards, e.g. `1/2" 5" · 3/4" 6"`. */
export function formatProfileStub90Summary(profile: BenderProfile): string {
  return PROFILE_SUMMARY_TRADE_SIZES.filter(
    (size) => profile.emtStub90TakeUpInches[size] !== undefined,
  )
    .map((size) => `${size}" ${profile.emtStub90TakeUpInches[size]}"`)
    .join(' · ');
}

export {
  formatOffsetProfileContextLine,
  formatStub90DeductContextAction,
  formatStub90DeductContextLine,
  resolveStub90DeductContext,
  resolveStub90DeductSource,
  type Stub90DeductContext,
  type Stub90DeductSource,
} from './profileContext';
