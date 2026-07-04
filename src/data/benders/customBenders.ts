/**
 * User-created bender profiles — stored in calculator setup, merged with
 * built-in generic charts at runtime.
 */
import type { TradeSize } from '@/core/types';
import { parseLengthInput } from '@/utils/parseLengthInput';

import { GENERIC_HAND_BENDER } from './genericHandBender';
import { HAND_BENDER_ALT_CHART } from './handBenderAltChart';
import { HAND_BENDER_COMPACT } from './handBenderCompact';
import type { BenderProfile, EmtStub90TakeUpByTradeSize } from './types';

const BUILT_IN_PROFILES: readonly BenderProfile[] = [
  GENERIC_HAND_BENDER,
  HAND_BENDER_ALT_CHART,
  HAND_BENDER_COMPACT,
];

export type CustomBenderProfileStored = {
  id: string;
  name: string;
  emtStub90TakeUpInches: EmtStub90TakeUpByTradeSize;
};

export const CUSTOM_BENDER_ID_PREFIX = 'custom-';
export const MAX_CUSTOM_BENDER_PROFILES = 10;
export const MAX_CUSTOM_BENDER_NAME_LENGTH = 40;

const PROFILE_FORM_SIZES: readonly TradeSize[] = ['1/2', '3/4', '1'];

export function isCustomBenderProfileId(profileId: string): boolean {
  return profileId.startsWith(CUSTOM_BENDER_ID_PREFIX);
}

export function createCustomBenderProfileId(): string {
  return `${CUSTOM_BENDER_ID_PREFIX}${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function toBenderProfile(stored: CustomBenderProfileStored): BenderProfile {
  return {
    id: stored.id,
    name: stored.name,
    category: 'custom',
    chartKind: 'custom-measured',
    description: 'Your measured stub 90 deducts — saved on this device.',
    emtStub90TakeUpInches: stored.emtStub90TakeUpInches,
  };
}

export function mergeBenderProfiles(
  customProfiles: readonly CustomBenderProfileStored[],
): readonly BenderProfile[] {
  return [...BUILT_IN_PROFILES, ...customProfiles.map(toBenderProfile)];
}

export type ResolvedBenderProfile = {
  profile: BenderProfile;
  /** True when profileId did not match any profile and the default was substituted. */
  isFallback: boolean;
};

/**
 * Resolves a profile id without hiding failure: callers that surface results to
 * users must check `isFallback` and say so (no silent substitution).
 */
export function resolveBenderProfileById(
  profileId: string,
  customProfiles: readonly CustomBenderProfileStored[] = [],
): ResolvedBenderProfile {
  const merged = mergeBenderProfiles(customProfiles);
  const match = merged.find((profile) => profile.id === profileId);
  return match !== undefined
    ? { profile: match, isFallback: false }
    : { profile: BUILT_IN_PROFILES[0], isFallback: true };
}

export function getBenderProfileById(
  profileId: string,
  customProfiles: readonly CustomBenderProfileStored[] = [],
): BenderProfile {
  return resolveBenderProfileById(profileId, customProfiles).profile;
}

export function getBenderProfileIdByNameFromAll(
  name: string,
  customProfiles: readonly CustomBenderProfileStored[] = [],
): string {
  const match = mergeBenderProfiles(customProfiles).find((profile) => profile.name === name);
  return match?.id ?? BUILT_IN_PROFILES[0].id;
}

export function filterAllBenderProfiles(
  query: string,
  customProfiles: readonly CustomBenderProfileStored[],
): readonly BenderProfile[] {
  const normalized = query.trim().toLowerCase();
  const merged = mergeBenderProfiles(customProfiles);
  if (!normalized) return merged;

  return merged.filter(
    (profile) =>
      profile.name.toLowerCase().includes(normalized) ||
      profile.description.toLowerCase().includes(normalized) ||
      profile.category.toLowerCase().includes(normalized),
  );
}

export function isKnownBenderProfileId(
  profileId: string,
  customProfiles: readonly CustomBenderProfileStored[] = [],
): boolean {
  return mergeBenderProfiles(customProfiles).some((profile) => profile.id === profileId);
}

export function isBenderProfileNameTaken(
  name: string,
  customProfiles: readonly CustomBenderProfileStored[],
  exceptId?: string,
): boolean {
  const normalized = name.trim().toLowerCase();
  return mergeBenderProfiles(customProfiles).some(
    (profile) => profile.id !== exceptId && profile.name.toLowerCase() === normalized,
  );
}

/** Validates and normalizes a single stored custom profile. Returns undefined if invalid. */
export function sanitizeCustomBenderProfile(raw: unknown): CustomBenderProfileStored | undefined {
  if (typeof raw !== 'object' || raw === null) return undefined;
  const record = raw as Record<string, unknown>;

  if (typeof record.id !== 'string' || !isCustomBenderProfileId(record.id)) return undefined;
  if (typeof record.name !== 'string') return undefined;

  const name = record.name.trim();
  if (name.length === 0 || name.length > MAX_CUSTOM_BENDER_NAME_LENGTH) return undefined;

  if (typeof record.emtStub90TakeUpInches !== 'object' || record.emtStub90TakeUpInches === null) {
    return undefined;
  }

  const deducts: EmtStub90TakeUpByTradeSize = {};
  for (const size of PROFILE_FORM_SIZES) {
    const value = (record.emtStub90TakeUpInches as Record<string, unknown>)[size];
    if (typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= 24) {
      deducts[size] = value;
    }
  }

  if (Object.keys(deducts).length === 0) return undefined;

  return { id: record.id, name, emtStub90TakeUpInches: deducts };
}

export function sanitizeCustomBenderProfiles(raw: unknown): CustomBenderProfileStored[] {
  if (!Array.isArray(raw)) return [];

  const profiles: CustomBenderProfileStored[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  for (const entry of raw) {
    const profile = sanitizeCustomBenderProfile(entry);
    if (!profile) continue;
    if (seenIds.has(profile.id) || seenNames.has(profile.name.toLowerCase())) continue;
    seenIds.add(profile.id);
    seenNames.add(profile.name.toLowerCase());
    profiles.push(profile);
    if (profiles.length >= MAX_CUSTOM_BENDER_PROFILES) break;
  }

  return profiles;
}

export type CustomBenderProfileDraft = {
  name: string;
  deductHalf: string;
  deductThreeQuarter: string;
  deductOne: string;
};

export function buildCustomBenderProfileFromDraft(
  draft: CustomBenderProfileDraft,
  existingId?: string,
): { profile?: CustomBenderProfileStored; error?: string } {
  const name = draft.name.trim();
  if (name.length === 0) {
    return { error: 'Enter a bender name.' };
  }
  if (name.length > MAX_CUSTOM_BENDER_NAME_LENGTH) {
    return { error: `Name must be ${MAX_CUSTOM_BENDER_NAME_LENGTH} characters or fewer.` };
  }

  const parseDeduct = (text: string): number | undefined => {
    const trimmed = text.trim();
    if (trimmed === '') return undefined;
    const value = parseLengthInput(trimmed);
    if (value === undefined || value <= 0 || value > 24) return Number.NaN;
    return value;
  };

  const half = parseDeduct(draft.deductHalf);
  const threeQuarter = parseDeduct(draft.deductThreeQuarter);
  const one = parseDeduct(draft.deductOne);

  if ([half, threeQuarter, one].some((value) => value !== undefined && Number.isNaN(value))) {
    return { error: 'Enter valid deduct values greater than 0, or leave blank.' };
  }

  const emtStub90TakeUpInches: EmtStub90TakeUpByTradeSize = {};
  if (half !== undefined && !Number.isNaN(half)) emtStub90TakeUpInches['1/2'] = half;
  if (threeQuarter !== undefined && !Number.isNaN(threeQuarter)) {
    emtStub90TakeUpInches['3/4'] = threeQuarter;
  }
  if (one !== undefined && !Number.isNaN(one)) emtStub90TakeUpInches['1'] = one;

  if (Object.keys(emtStub90TakeUpInches).length === 0) {
    return { error: 'Enter at least one stub 90 deduct (1/2", 3/4", or 1").' };
  }

  return {
    profile: {
      id: existingId ?? createCustomBenderProfileId(),
      name,
      emtStub90TakeUpInches,
    },
  };
}

export function draftFromCustomProfile(profile: CustomBenderProfileStored): CustomBenderProfileDraft {
  const format = (value?: number) => (value !== undefined ? String(value) : '');
  return {
    name: profile.name,
    deductHalf: format(profile.emtStub90TakeUpInches['1/2']),
    deductThreeQuarter: format(profile.emtStub90TakeUpInches['3/4']),
    deductOne: format(profile.emtStub90TakeUpInches['1']),
  };
}
