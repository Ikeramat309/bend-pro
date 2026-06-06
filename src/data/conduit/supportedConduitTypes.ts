import type { ConduitType } from '@/core/types';

/**
 * Conduit types currently active in Bend Pro.
 * Add future types (RMC, IMC, PVC, etc.) here when they are supported.
 */
export const SUPPORTED_CONDUIT_TYPES: readonly ConduitType[] = ['EMT'];

export const DEFAULT_CONDUIT_TYPE: ConduitType = 'EMT';
