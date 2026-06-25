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
  type ContinueLayoutCandidate,
} from './recentLayoutsService';
