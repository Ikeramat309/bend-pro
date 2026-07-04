/**
 * Bender profile helpers — list, search, and display summaries.
 */
import type { TradeSize } from '@/core/types';

import { GENERIC_HAND_BENDER } from './genericHandBender';
import { HAND_BENDER_ALT_CHART } from './handBenderAltChart';
import { HAND_BENDER_COMPACT } from './handBenderCompact';
import { MANUFACTURER_BENDER_PROFILES } from './manufacturers';
import {
  getBenderProfileById,
  getBenderProfileIdByNameFromAll,
  resolveBenderProfileById,
  type CustomBenderProfileStored,
  type ResolvedBenderProfile,
} from './customBenders';
import type { BenderProfile, BenderProfileId } from './types';

export type {
  BenderCategory,
  BenderChartKind,
  BenderChartSource,
  BenderProfile,
  BenderProfileId,
  BenderSizeSpec,
  BenderVerificationStatus,
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
  resolveBenderProfileById,
  sanitizeCustomBenderProfile,
  sanitizeCustomBenderProfiles,
  toBenderProfile,
  type CustomBenderProfileDraft,
  type CustomBenderProfileStored,
  type ResolvedBenderProfile,
} from './customBenders';

export { GENERIC_HAND_BENDER } from './genericHandBender';
export { HAND_BENDER_ALT_CHART } from './handBenderAltChart';
export { HAND_BENDER_COMPACT } from './handBenderCompact';
export { MANUFACTURER_BENDER_PROFILES } from './manufacturers';
export { BENDER_SOURCES, BENDER_WORKBOOK_VERSION } from './manufacturers/sources';

/** EMT sizes shown in profile summaries. */
export const PROFILE_SUMMARY_TRADE_SIZES: readonly TradeSize[] = ['1/2', '3/4', '1', '1-1/4'];

/** Profiles available to calculators today. */
export const BENDER_PROFILES: readonly BenderProfile[] = [
  GENERIC_HAND_BENDER,
  HAND_BENDER_ALT_CHART,
  HAND_BENDER_COMPACT,
  ...MANUFACTURER_BENDER_PROFILES,
];

export const DEFAULT_BENDER_PROFILE_ID: BenderProfileId = 'generic-hand-bender';

export function getBenderProfile(
  profileId: string,
  customProfiles: readonly CustomBenderProfileStored[] = [],
): BenderProfile {
  return getBenderProfileById(profileId, customProfiles);
}

/**
 * Resolves a profile id and reports whether the default was substituted.
 * Engines must use this (not getBenderProfile) so a dangling id — e.g. a
 * deleted custom bender still referenced by setup — surfaces as a warning
 * instead of a silent swap.
 */
export function resolveBenderProfile(
  profileId: string,
  customProfiles: readonly CustomBenderProfileStored[] = [],
): ResolvedBenderProfile {
  return resolveBenderProfileById(profileId, customProfiles);
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
  formatMissingBenderProfileWarning,
  formatSegmentTrustTitle,
  formatSetupOnlyBenderMeta,
  formatStandardOffsetTableTrustTitle,
  formatStandardSaddleTableTrustTitle,
  formatStub90DeductContextAction,
  formatStub90DeductContextLine,
  resolveStub90DeductContext,
  resolveStub90DeductSource,
  type Stub90DeductContext,
  type Stub90DeductSource,
} from './profileContext';
export {
  resolveEffectiveStub90DeductInches,
  type EffectiveStub90Deduct,
} from './benderResolution';
export {
  buildManufacturerDetailRows,
  buildProfileDeductRows,
  formatChartKindLabel,
  formatManufacturerBrandMaterial,
  formatProfileDeductCell,
  formatVerificationStatusLabel,
  getProfileCapabilities,
  isVerificationStatusWarning,
  profileHasRadiusData,
  splitProfilesByChartKind,
  splitProfilesByOrigin,
  type ProfileChartKindGroups,
  type ProfileDeductRow,
  type ProfileManufacturerDetailRow,
} from './profileChart';
