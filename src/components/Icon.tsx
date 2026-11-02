/**
 * Line icons (Feather style) drawn with react-native-svg.
 */

import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { ICON_SHAPES, IconName } from './iconShapes';

export type { IconName };

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = '#000',
  strokeWidth = 2,
}) => {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {ICON_SHAPES[name].map((shape, i) =>
        shape.type === 'path' ? (
          <Path key={i} d={shape.d} {...common} />
        ) : (
          <Circle key={i} cx={shape.cx} cy={shape.cy} r={shape.r} {...common} />
        ),
      )}
    </Svg>
  );
};
