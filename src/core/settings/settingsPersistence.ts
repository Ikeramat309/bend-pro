import type { CalculatorSetup } from './calculatorSetup';

export const CALCULATOR_SETUP_STORAGE_KEY = 'bend-pro/calculator-setup/v1';

export type SetupStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};

/** Persists setup — failures are non-fatal for the running session. */
export async function persistCalculatorSetup(
  storage: SetupStorage,
  setup: CalculatorSetup,
  key = CALCULATOR_SETUP_STORAGE_KEY,
): Promise<void> {
  try {
    await storage.setItem(key, JSON.stringify(setup));
  } catch {
    // Storage unavailable — caller keeps in-memory state.
  }
}

/** Parses stored JSON safely; returns null when missing or corrupt. */
export function parseStoredSetupJson(raw: string | null): unknown {
  if (raw === null) {
    return null;
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}
