import { ScreenScaffold } from '@/components/screen-scaffold';

export function CalculatorWorkbench() {
  return (
    <ScreenScaffold
      showBack
      title="Calculator Workbench"
      subtitle="Bend inputs, live results, and step-by-step solve"
      placeholders={[
        { title: 'Conduit & bender', description: 'Trade size, bender model, and shoe radius.' },
        { title: 'Bend sequence', description: 'Offsets, kicks, saddles, and 3-point bends.' },
        { title: 'Results', description: 'Mark distances, angles, and cut length.' },
      ]}
    />
  );
}
