import type { BendAngle, RoundingOption, UnitSystem } from '@/core/types';
import { DEFAULT_BENDER_PROFILE_ID } from '@/data/benders';
import { DEFAULT_CONDUIT_TYPE } from '@/data/conduit';
import { DEFAULT_EMT_TRADE_SIZE } from '@/data/emt';

/** Defaults and fixed values for the Offset calculator. */
export const OFFSET_CONFIG = {
  defaultUnit: 'imperial' as UnitSystem,
  defaultRounding: '1/16' as RoundingOption,
  defaultAngle: 30 as BendAngle,
  defaultConduitType: DEFAULT_CONDUIT_TYPE,
  defaultTradeSize: DEFAULT_EMT_TRADE_SIZE,
  defaultBenderProfileId: DEFAULT_BENDER_PROFILE_ID,
  validAngles: [10, 22.5, 30, 45, 60] as const,
  diagramHeight: 300,
  diagramViewBox: '0 0 360 300',
} as const;
