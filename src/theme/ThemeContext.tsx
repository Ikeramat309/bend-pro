/**
 * Runtime theme: resolves the active color scheme (system / light / dark),
 * exposes the active palette, and persists the user's appearance choice.
 *
 * Components read `const { colors } = useTheme()` and build styles from it so
 * they respond to light/dark. Unmigrated components fall back to the static
 * dark `colors` export and stay dark until migrated.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';

import { getPalette, type ColorScheme, type ThemePalette } from './palette';

export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'bend-pro/appearance/v1';

export type ThemeContextValue = {
  /** User preference: follow system, or force light/dark. */
  mode: ThemeMode;
  /** Resolved scheme actually in use right now. */
  scheme: ColorScheme;
  colors: ThemePalette;
  setMode: (mode: ThemeMode) => void;
  isHydrated: boolean;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark';
}

async function loadStoredMode(): Promise<ThemeMode | undefined> {
  try {
    const { default: AsyncStorage } = await import(
      '@react-native-async-storage/async-storage'
    );
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return isThemeMode(raw) ? raw : undefined;
  } catch {
    return undefined;
  }
}

async function persistMode(mode: ThemeMode): Promise<void> {
  try {
    const { default: AsyncStorage } = await import(
      '@react-native-async-storage/async-storage'
    );
    await AsyncStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Storage unavailable — keep in-memory preference.
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    void loadStoredMode().then((stored) => {
      if (active && stored) {
        setModeState(stored);
      }
      if (active) {
        setIsHydrated(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    void persistMode(next);
  }, []);

  const scheme: ColorScheme =
    mode === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : mode;

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, scheme, colors: getPalette(scheme), setMode, isHydrated }),
    [mode, scheme, setMode, isHydrated],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}

/** Convenience for components that only need the active palette. */
export function useThemeColors(): ThemePalette {
  return useTheme().colors;
}
