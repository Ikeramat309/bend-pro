import type { Href } from 'expo-router';

/** Central app URLs for Expo Router — use Routes.offset instead of raw strings. */
export const Routes = {
  home: '/' as Href,
  bends: '/bends' as Href,
  settings: '/settings' as Href,
  benderDatabase: '/bender-database' as Href,
  guide: '/guide' as Href,
  offset: '/offset' as Href,
  stub90: '/stub90' as Href,
  saddle3: '/saddle3' as Href,
} as const;
