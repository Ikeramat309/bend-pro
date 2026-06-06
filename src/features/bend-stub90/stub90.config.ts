import type { RoundingOption, UnitSystem } from '@/core/types';
import { DEFAULT_BENDER_PROFILE_ID } from '@/data/benders';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { DEFAULT_EMT_TRADE_SIZE } from '@/data/emt';

/** Defaults and fixed values for the Stub 90 calculator. */
export const STUB90_CONFIG = {
  bendAngle: 90 as const,
  defaultUnit: 'imperial' as UnitSystem,
  defaultRounding: '1/16' as RoundingOption,
  defaultConduitType: DEFAULT_CONDUIT_TYPE,
  defaultTradeSize: DEFAULT_EMT_TRADE_SIZE,
  defaultBenderProfileId: DEFAULT_BENDER_PROFILE_ID,
  diagramHeight: 300,
  diagramViewBox: '0 0 360 300',
} as const;
