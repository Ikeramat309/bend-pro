import type { Href } from 'expo-router';

export const Routes = {
  home: '/' as Href,
  calculatorWorkbench: '/calculator-workbench' as Href,
  settings: '/settings' as Href,
  benderDatabase: '/bender-database' as Href,
} as const;
