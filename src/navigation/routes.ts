/**
 * FILE: src/navigation/routes.ts
 *
 * PURPOSE: Central list of app URLs for Expo Router.
 *
 * BEGINNER NOTE: router.push(Routes.calculatorWorkbench) avoids typos like '/calculator-workbench'.
 *
 * DEPENDENCIES: expo-router Href type
 */

// IMPORTS
import type { Href } from 'expo-router';

// CONSTANTS — one path per screen file in src/app/
export const Routes = {
  home: '/' as Href,
  calculatorWorkbench: '/calculator-workbench' as Href,
  settings: '/settings' as Href,
  benderDatabase: '/bender-database' as Href,
  offset: '/offset' as Href,
} as const;

// EXPORTS — Routes
