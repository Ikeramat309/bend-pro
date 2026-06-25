import type { Href } from 'expo-router';

import type { ConduitType } from '@/core/types';

export type CalculatorStatus = 'active' | 'planned' | 'hidden';

/** Bend family grouping for Bends hub and Guide index. */
export type CalculatorCategory = 'Offset' | '90s' | 'Saddles' | 'Large / Advanced';

export type CalculatorDefinition = {
  id: string;
  title: string;
  shortTitle: string;
  description?: string;
  category: CalculatorCategory;
  /** Present only when {@link CalculatorDefinition.status} is `active`. */
  route?: Href;
  /** Guide walkthrough id when a guide exists for this calculator. */
  guideId?: string;
  status: CalculatorStatus;
  supportedConduitTypes: readonly ConduitType[];
  tags: readonly string[];
  sortOrder: number;
  showOnBendsScreen: boolean;
  showOnHome: boolean;
  homeLabel?: string;
  homeDescription?: string;
};

/** Bends hub list row — maps registry status to UI availability. */
export type BendsScreenItem = {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'coming-soon';
};

export type BendsScreenFamily = {
  title: CalculatorCategory;
  items: BendsScreenItem[];
};
