/**
 * Session and layout persistence models — JSON-safe, schema-versioned.
 */
import type { CalculatorId } from '@/core/calculators/calculatorRegistry';
import type {
  CalculationResultItem,
  CalculationSetupSnapshot,
  CalculationStatus,
} from '@/core/calculations';

/** Current schema for recent/saved layout storage envelopes. Bump when fields change. */
export const SESSION_SCHEMA_VERSION = 1;

/** Calculator-specific inputs — keys interpreted per `calculatorId`. */
export type CalculatorInputSnapshot = Readonly<Record<string, unknown>>;

/** Persisted subset of {@link CalculationResult} for lists, export, and resume. */
export type CalculationResultSnapshot = {
  status: CalculationStatus;
  primaryResults: readonly CalculationResultItem[];
  secondaryResults: readonly CalculationResultItem[];
  warnings: readonly string[];
  displayValues: Readonly<Record<string, string | undefined>>;
  rawValuesInches: Readonly<Record<string, number | undefined>>;
  /** One-line preview for recent-layout rows. */
  summaryLine?: string;
};

/** Shared fields for stored layout records. */
export type LayoutRecordBase = {
  id: string;
  schemaVersion: number;
  calculatorId: string;
  /** Registry title at save time — survives later registry renames. */
  calculatorTitle: string;
  inputSnapshot: CalculatorInputSnapshot;
  setupSnapshot: CalculationSetupSnapshot;
  resultSnapshot?: CalculationResultSnapshot;
  warnings: readonly string[];
  createdAt: string;
  updatedAt: string;
  label?: string;
  /** Reserved for future job/project workflows. */
  projectId?: string;
};

/** Most recently used layout — auto-managed, capped list. */
export type RecentLayout = LayoutRecordBase & {
  kind: 'recent';
};

/** User-pinned layout — explicit save (future UI). */
export type SavedLayout = LayoutRecordBase & {
  kind: 'saved';
  savedAt: string;
};

/**
 * In-flight or resumable calculator work.
 * May mirror a {@link RecentLayout} when persisted to recents.
 */
export type CalculatorSession = {
  id: string;
  schemaVersion: number;
  calculatorId: CalculatorId | string;
  calculatorTitle: string;
  inputSnapshot: CalculatorInputSnapshot;
  setupSnapshot: CalculationSetupSnapshot;
  resultSnapshot?: CalculationResultSnapshot;
  warnings: readonly string[];
  createdAt: string;
  updatedAt: string;
  label?: string;
  projectId?: string;
  /** True when in-memory edits differ from the last persisted recent entry. */
  isDirty?: boolean;
};

export type RecentLayoutsEnvelope = {
  schemaVersion: number;
  layouts: RecentLayout[];
};

export type CreateRecentLayoutParams = {
  calculatorId: string;
  calculatorTitle: string;
  inputSnapshot: CalculatorInputSnapshot;
  setupSnapshot: CalculationSetupSnapshot;
  resultSnapshot?: CalculationResultSnapshot;
  warnings?: readonly string[];
  label?: string;
  projectId?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UpdateRecentLayoutPatch = Partial<
  Pick<
    RecentLayout,
    | 'calculatorTitle'
    | 'inputSnapshot'
    | 'setupSnapshot'
    | 'resultSnapshot'
    | 'warnings'
    | 'label'
    | 'projectId'
  >
>;
