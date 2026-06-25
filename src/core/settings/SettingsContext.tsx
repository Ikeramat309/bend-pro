/**
 * App-wide provider for the shared calculator setup.
 *
 * Loads the persisted setup once on launch (defaults render until hydration
 * completes) and persists every change. Storage failures are non-fatal — the
 * app keeps working with in-memory state.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  DEFAULT_CALCULATOR_SETUP,
  patchCalculatorSetup,
  replaceCalculatorSetup,
  type CalculatorSetup,
} from './calculatorSetup';
import { resolveHydratedSetup } from './settingsHydration';
import {
  CALCULATOR_SETUP_STORAGE_KEY,
  parseStoredSetupJson,
  persistCalculatorSetup,
} from './settingsPersistence';

type SettingsContextValue = {
  setup: CalculatorSetup;
  /** True after the first storage read attempt finishes (success or failure). */
  isHydrated: boolean;
  /** Full replace — normalizes rounding and EMT-only conduit type. */
  replaceSetup: (next: CalculatorSetup) => void;
  /** Partial update with consistency rules applied. */
  patchSetup: (patch: Partial<CalculatorSetup>) => void;
  /** @deprecated Prefer `replaceSetup` — kept for existing calculator screens. */
  setSetup: (next: CalculatorSetup) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [setup, setSetupState] = useState<CalculatorSetup>(DEFAULT_CALCULATOR_SETUP);
  const [isHydrated, setIsHydrated] = useState(false);
  const userModifiedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(CALCULATOR_SETUP_STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        const stored = parseStoredSetupJson(raw);
        setSetupState((current) =>
          resolveHydratedSetup(stored, current, userModifiedRef.current),
        );
        setIsHydrated(true);
      })
      .catch(() => {
        if (!cancelled) {
          setIsHydrated(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const replaceSetup = useCallback((next: CalculatorSetup) => {
    userModifiedRef.current = true;
    const normalized = replaceCalculatorSetup(next);
    setSetupState(normalized);
    void persistCalculatorSetup(AsyncStorage, normalized);
  }, []);

  const patchSetup = useCallback((patch: Partial<CalculatorSetup>) => {
    userModifiedRef.current = true;
    setSetupState((current) => {
      const next = patchCalculatorSetup(current, patch);
      void persistCalculatorSetup(AsyncStorage, next);
      return next;
    });
  }, []);

  const setSetup = replaceSetup;

  return (
    <SettingsContext.Provider value={{ setup, isHydrated, replaceSetup, patchSetup, setSetup }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useCalculatorSetup(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useCalculatorSetup must be used inside SettingsProvider.');
  }
  return context;
}
