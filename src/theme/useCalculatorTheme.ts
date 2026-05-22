import { useColorScheme } from 'react-native';

import { CalculatorColors, type CalculatorColorScheme } from './calculatorTheme';

export function useCalculatorTheme() {
  const scheme = useColorScheme();
  const colorScheme: CalculatorColorScheme = scheme === 'light' ? 'light' : 'dark';
  return CalculatorColors[colorScheme];
}
