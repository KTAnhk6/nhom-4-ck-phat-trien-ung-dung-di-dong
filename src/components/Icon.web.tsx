/**
 * Bản web của Icon: vẽ bằng thẻ <svg> thuần
 * (react-native-svg không bundle được qua alias react-native-web).
 */

import React from 'react';
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
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {ICON_SHAPES[name].map((shape, i) =>
      shape.type === 'path' ? (
        <path key={i} d={shape.d} />
      ) : (
        <circle key={i} cx={shape.cx} cy={shape.cy} r={shape.r} />
      ),
    )}
  </svg>
);
