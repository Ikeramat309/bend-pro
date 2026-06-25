import type { Href } from 'expo-router';

import type { GuideCalculatorId } from '@/core/calculators';

export type { GuideCalculatorId } from '@/core/calculators';
export { GUIDE_CALCULATOR_IDS } from '@/core/calculators';

export type GuideSection = {
  title?: string;
  /** Single paragraph or multiple bullets / numbered steps. */
  lines: string[];
  /** Render lines as an ordered list instead of bullets. */
  ordered?: boolean;
  /** Monospace styling for formulas. */
  mono?: boolean;
};

export type CalculatorGuide = {
  id: GuideCalculatorId;
  title: string;
  summary: string;
  family: string;
  calculatorRoute: Href;
  formula: GuideSection;
  steps: GuideSection;
  mistakes: GuideSection;
  example: GuideSection;
};
