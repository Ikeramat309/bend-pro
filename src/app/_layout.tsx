import '@/global.css';

import { useMemo } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider as NavThemeProvider,
} from 'expo-router';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { SettingsProvider } from '@/core/settings';
import { ThemeProvider, useTheme } from '@/theme';

function ThemedStack() {
  const { scheme, colors } = useTheme();

  const navTheme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.background,
        text: colors.text,
        border: colors.border,
        notification: colors.primary,
      },
    };
  }, [scheme, colors]);

  return (
    <NavThemeProvider value={navTheme}>
      <SettingsProvider>
        <AnimatedSplashOverlay />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="bends" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="bender-database" />
          <Stack.Screen name="guide" />
          <Stack.Screen name="offset" />
          <Stack.Screen name="stub90" />
          <Stack.Screen name="saddle3" />
          <Stack.Screen name="saddle4" />
          <Stack.Screen name="segment" />
          <Stack.Screen name="rolling" />
        </Stack>
      </SettingsProvider>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedStack />
    </ThemeProvider>
  );
}
