/**
 * FILE: src/engine/index.ts
 *
 * PURPOSE:
 * "Barrel export" — one import path for the whole engine layer.
 *
 * WHY IT EXISTS:
 * Instead of:
 *   import { toInches } from '@/engine/unitEngine'
 *   import { formatLength } from '@/engine/formattingEngine'
 * you can write:
 *   import { toInches, formatLength } from '@/engine'
 *
 * ARCHITECTURE:
 * Calculators and workbench should prefer importing from `@/engine`.
 */

// EXPORTS — re-export every public engine module
export * from './types';
export * from './unitEngine';
export * from './roundingEngine';
export * from './formattingEngine';
export * from './validationEngine';
