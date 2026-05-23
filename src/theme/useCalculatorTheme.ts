/**
 * FILE: src/theme/useCalculatorTheme.ts
 *
 * PURPOSE:
 * React hook that returns the correct color object for light/dark mode.
 *
 * INPUTS:  Device color scheme (from React Native).
 * OUTPUTS: CalculatorColors.dark OR CalculatorColors.light object.
 *
 * BEGINNER NOTE — What is a hook?
 * A function starting with "use" that can call other hooks.
 * Components call useCalculatorTheme() to read theme colors inside render.
 *
 * USAGE IN COMPONENTS:
 *   const colors = useCalculatorTheme();
 *   <View style={{ backgroundColor: colors.card }} />
 */

// IMPORTS
import { useColorScheme } from 'react-native';

import { CalculatorColors, type CalculatorColorScheme } from './calculatorTheme';

// LOGIC — hook implementation
export function useCalculatorTheme() {
  const scheme = useColorScheme();
  const colorScheme: CalculatorColorScheme = scheme === 'light' ? 'light' : 'dark';
  return CalculatorColors[colorScheme];
}

// EXPORTS — useCalculatorTheme above
