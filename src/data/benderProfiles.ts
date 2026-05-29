/**
 * Placeholder bender profile data.
 *
 * This is intentionally small for now. Future hand, mechanical, hydraulic, and
 * custom benders can extend this shape without changing calculator screens.
 */
import type { Unit } from '@/calculators/offset/offsetTypes';

export type BenderProfile = {
  id: string;
  name: string;
  category: 'hand' | 'mechanical' | 'hydraulic' | 'custom';
  defaultUnitSystem: Unit;
  notes?: string[];
};

export const BENDER_PROFILES: BenderProfile[] = [
  {
    id: 'generic-hand-bender',
    name: 'Generic Hand Bender',
    category: 'hand',
    defaultUnitSystem: 'metric',
    notes: ['Use bender marks according to the shoe instructions.'],
  },
];

export const DEFAULT_BENDER_PROFILE_ID = 'generic-hand-bender';

export function getBenderProfile(profileId: string): BenderProfile {
  return BENDER_PROFILES.find((profile) => profile.id === profileId) ?? BENDER_PROFILES[0];
}
