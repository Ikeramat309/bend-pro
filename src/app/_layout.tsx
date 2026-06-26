import '@/global.css';

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
  const { scheme } = useTheme();

  return (
    <NavThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SettingsProvider>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
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
