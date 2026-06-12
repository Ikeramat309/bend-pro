/**
 * App-wide provider for the shared calculator setup.
 *
 * Loads the persisted setup once on launch (defaults render until hydration
 * completes) and persists every change. Storage failures are non-fatal — the
 * app keeps working with in-memory state.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import {
  DEFAULT_CALCULATOR_SETUP,
  sanitizeStoredSetup,
  type CalculatorSetup,
} from './calculatorSetup';

const STORAGE_KEY = 'bend-pro/calculator-setup/v1';

type SettingsContextValue = {
  setup: CalculatorSetup;
  setSetup: (next: CalculatorSetup) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [setup, setSetupState] = useState<CalculatorSetup>(DEFAULT_CALCULATOR_SETUP);

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (cancelled || stored === null) return;
        setSetupState(sanitizeStoredSetup(JSON.parse(stored)));
      })
      .catch(() => {
        // Unreadable storage — keep defaults.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setSetup = useCallback((next: CalculatorSetup) => {
    setSetupState(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {
      // Persistence failure is non-fatal; the session keeps the new setup.
    });
  }, []);

  return <SettingsContext.Provider value={{ setup, setSetup }}>{children}</SettingsContext.Provider>;
}

export function useCalculatorSetup(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useCalculatorSetup must be used inside SettingsProvider.');
  }
  return context;
}
