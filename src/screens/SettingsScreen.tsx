import { ScreenScaffold } from '@/components/screen-scaffold';

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
