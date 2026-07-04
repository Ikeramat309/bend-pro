import type { TradeSize } from '@/core/types';

import type {
  BenderProfile,
  BenderSizeSpec,
  BenderVerificationStatus,
  BuiltInBenderProfileId,
  EmtStub90TakeUpByTradeSize,
} from '../types';

export type BuildManufacturerProfileInput = {
  id: BuiltInBenderProfileId;
  name: string;
  brand: string;
  series: string;
  material: string;
  verificationStatus: BenderVerificationStatus;
  description: string;
  sourceNote: string;
  sizeSpecs: Partial<Record<TradeSize, BenderSizeSpec>>;
};

function deriveStub90Chart(
  verificationStatus: BenderVerificationStatus,
  sizeSpecs: Partial<Record<TradeSize, BenderSizeSpec>>,
): EmtStub90TakeUpByTradeSize {
  if (verificationStatus === 'reference_only') {
    return {};
  }

  const chart: EmtStub90TakeUpByTradeSize = {};
  for (const [tradeSize, spec] of Object.entries(sizeSpecs) as [TradeSize, BenderSizeSpec][]) {
    if (spec.takeUpInches !== undefined) {
      chart[tradeSize] = spec.takeUpInches;
    }
  }
  return chart;
}

/** Builds a manufacturer bender profile with a source-backed stub-90 chart derived from sizeSpecs. */
export function buildManufacturerProfile(input: BuildManufacturerProfileInput): BenderProfile {
  if (!input.sourceNote.trim()) {
    throw new Error(`Manufacturer profile "${input.id}" requires a non-empty sourceNote.`);
  }

  return {
    id: input.id,
    name: input.name,
    category: 'hand',
    chartKind: 'manufacturer',
    description: input.description,
    sourceNote: input.sourceNote,
    brand: input.brand,
    series: input.series,
    material: input.material,
    verificationStatus: input.verificationStatus,
    sizeSpecs: input.sizeSpecs,
    emtStub90TakeUpInches: deriveStub90Chart(input.verificationStatus, input.sizeSpecs),
  };
}
