import { ScreenScaffold } from '@/components/screen-scaffold';

export function BenderDatabaseScreen() {
  return (
    <ScreenScaffold
      showBack
      title="Bender Database"
      subtitle="Browse benders, shoes, and manufacturer specs"
      placeholders={[
        { title: 'Search & filter', description: 'Filter by trade, manufacturer, or model.' },
        { title: 'Bender list', description: 'Selectable catalog of benders and accessories.' },
        { title: 'Detail view', description: 'Radius tables, deducts, and compatibility notes.' },
      ]}
    />
  );
}
