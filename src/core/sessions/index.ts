export {
  SESSION_SCHEMA_VERSION,
  type CalculationResultSnapshot,
  type CalculatorInputSnapshot,
  type CalculatorSession,
  type CreateRecentLayoutParams,
  type LayoutRecordBase,
  type RecentLayout,
  type RecentLayoutsEnvelope,
  type SavedLayout,
  type UpdateRecentLayoutPatch,
} from './sessionTypes';

export { toCalculationResultSnapshot } from './resultSnapshot';

export {
  sanitizeInputSnapshot,
  sanitizeRecentLayout,
  sanitizeRecentLayoutsEnvelope,
  sanitizeResultSnapshot,
  sanitizeSavedLayout,
  sanitizeSetupSnapshot,
} from './sessionSanitize';

export {
  RECENT_LAYOUTS_STORAGE_KEY,
  loadRecentLayoutsEnvelope,
  parseStoredRecentLayoutsJson,
  persistRecentLayoutsEnvelope,
  type RecentLayoutsStorage,
} from './sessionPersistence';

export {
  DEFAULT_MAX_RECENT_LAYOUTS,
  clearRecentLayouts,
  createLayoutId,
  createRecentLayout,
  getRecentLayoutRoute,
  isKnownCalculatorLayout,
  loadRecentLayouts,
  recentLayoutToSession,
  removeRecentLayout,
  resolveContinueLayoutCandidate,
  saveRecentLayout,
  trimRecentLayouts,
  updateRecentLayout,
  upsertRecentLayout,
  upsertRecentLayoutForCalculator,
  type ContinueLayoutCandidate,
} from './recentLayoutsService';

export {
  DEFAULT_PERSIST_DEBOUNCE_MS,
  buildRecentLayoutPersistSignature,
  persistRecentLayoutFromCalculation,
  shouldPersistRecentLayout,
  type PersistRecentLayoutInput,
} from './persistRecentLayout';

export { usePersistRecentLayout, type UsePersistRecentLayoutParams } from './usePersistRecentLayout';

export {
  useRestoreRecentLayout,
  type LayoutRestoreResult,
} from './useRestoreRecentLayout';

export { continueLayoutRoute } from './continueLayoutRoute';
