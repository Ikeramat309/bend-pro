/**
 * FILE: src/app/index.tsx
 *
 * PURPOSE: Route entry for "/" (home). Keeps routing separate from screen UI.
 *
 * PATTERN: Thin route file → real UI lives in src/screens/HomeScreen.tsx
 * WHY: Prevents Expo template code from overwriting your home screen when you edit routes.
 */

// EXPORTS — re-export screen as default route component
export { HomeScreen as default } from '@/screens/HomeScreen';
