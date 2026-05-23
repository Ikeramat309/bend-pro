/**
 * FILE: src/calculators/workbench/index.ts
 * Barrel export — import workbench engine from `@/calculators/workbench`.
 */
export * from './types';
export { tempCalculateOffsetBend } from './tempOffsetEngine';
export { runWorkbench, WORKBENCH_PRESETS } from './runWorkbench';
