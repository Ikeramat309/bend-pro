/**
 * Placeholder conduit metadata for setup/profile work.
 */
import type { ConduitType } from '@/calculators/offset/offsetTypes';

export type ConduitTypeOption = {
  id: ConduitType;
  label: string;
};

export const CONDUIT_TYPES: ConduitTypeOption[] = [
  { id: 'EMT', label: 'EMT' },
  { id: 'RMC', label: 'RMC' },
  { id: 'IMC', label: 'IMC' },
  { id: 'PVC', label: 'PVC' },
];

export const TRADE_SIZES = ['1/2', '3/4', '1', '1-1/4', '1-1/2', '2'];
