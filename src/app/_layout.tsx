/**
 * FILE: src/app/_layout.tsx
 *
 * PURPOSE: Root navigation shell for the entire app (Expo Router).
 *
 * HOW EXPO ROUTER WORKS:
 * - Each file in src/app/ becomes a route (index = home).
 * - _layout.tsx wraps ALL routes with shared UI (theme, stack navigator).
 *
 * BEGINNER NOTE: Import ThemeProvider from 'expo-router', NOT '@react-navigation/native'
 * (SDK 56 blocks mixing them).
 */

// IMPORTS
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

// UI — root layout component (default export required by Expo Router)
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="bends" />
        <Stack.Screen name="calculator-workbench" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="bender-database" />
        <Stack.Screen name="guide" />
        <Stack.Screen name="offset" />
      </Stack>
    </ThemeProvider>
  );
}

// EXPORTS — default RootLayout
