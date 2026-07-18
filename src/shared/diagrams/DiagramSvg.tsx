import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import Svg, { type SvgProps } from 'react-native-svg';

export type DiagramSvgProps = {
  viewBox: string;
  children: ReactNode;
} & Omit<SvgProps, 'viewBox' | 'width' | 'height' | 'preserveAspectRatio'>;

/** Fitted calculator diagram canvas — scales to the workspace well without clipping. */
export function DiagramSvg({ viewBox, children, ...rest }: DiagramSvgProps) {
  const fontFamily = Platform.select({
    web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    default: 'System',
  });

  return (
    <Svg
      viewBox={viewBox}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      fontFamily={fontFamily}
      {...rest}>
      {children}
    </Svg>
  );
}
