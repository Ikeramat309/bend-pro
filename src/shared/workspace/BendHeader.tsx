import { AppHeader } from '@/shared/ui';

export type BendHeaderProps = {
  title: string;
  subtitle: string;
  onBackPress: () => void;
};

/** Compact calculator header — title, EMT subtitle, back navigation. */
export function BendHeader({ title, subtitle, onBackPress }: BendHeaderProps) {
  return (
    <AppHeader showBack density="compact" title={title} subtitle={subtitle} onBackPress={onBackPress} />
  );
}
