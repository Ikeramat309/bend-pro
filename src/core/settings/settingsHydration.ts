import { sanitizeStoredSetup, type CalculatorSetup } from './calculatorSetup';

/**
 * Resolves which setup to keep when AsyncStorage hydration completes.
 * In-memory user edits win over a late disk load.
 */
export function resolveHydratedSetup(
  stored: unknown,
  current: CalculatorSetup,
  userModifiedBeforeHydration: boolean,
): CalculatorSetup {
  if (userModifiedBeforeHydration) {
    return current;
  }
  if (stored === null || stored === undefined) {
    return current;
  }
  return sanitizeStoredSetup(stored);
}
