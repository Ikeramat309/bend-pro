import { AppHeader } from '@/shared/ui';

export type BendHeaderProps = {
  title: string;
  subtitle: string;
  onBackPress: () => void;
  centerTitle?: boolean;
};

/** Compact calculator header — title, EMT subtitle, back navigation. */
export function BendHeader({ title, subtitle, onBackPress, centerTitle = false }: BendHeaderProps) {
  return (
    <AppHeader
      showBack
      density="compact"
      title={title}
      subtitle={subtitle}
      onBackPress={onBackPress}
      centerTitle={centerTitle}
    />
  );
}
