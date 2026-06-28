import { useTheme } from '@/theme';

import { getDiagramTheme } from './diagramTheme';

export function useDiagramTheme() {
  return getDiagramTheme(useTheme().scheme);
}
