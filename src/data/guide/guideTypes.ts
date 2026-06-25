import type { Href } from 'expo-router';

export const GUIDE_CALCULATOR_IDS = [
  'offset',
  'stub90',
  'saddle3',
  'saddle4',
  'segment',
  'rolling',
] as const;

export type GuideCalculatorId = (typeof GUIDE_CALCULATOR_IDS)[number];

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
