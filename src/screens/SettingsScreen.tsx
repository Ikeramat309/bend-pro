/**
 * FILE: src/screens/SettingsScreen.tsx
 *
 * PURPOSE: Placeholder settings screen (units, defaults) — polish later.
 * ARCHITECTURE: Screen → ScreenScaffold (not CalculatorLayout — not a calculator).
 */

// IMPORTS
import { ScreenScaffold } from '@/components/screen-scaffold';

// UI
export function SettingsScreen() {
  return (
    <ScreenScaffold
      showBack
      title="Settings"
      subtitle="Units, defaults, and app preferences"
      placeholders={[
        { title: 'Units', description: 'Imperial / metric, fraction display, rounding.' },
        { title: 'Defaults', description: 'Preferred bender, conduit type, and safety factors.' },
        { title: 'About', description: 'Version, licenses, and data sources.' },
      ]}
    />
  );
}

// EXPORTS — SettingsScreen
