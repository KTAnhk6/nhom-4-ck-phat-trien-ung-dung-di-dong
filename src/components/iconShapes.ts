/**
 * Dữ liệu hình vẽ của các icon (dùng chung cho Icon native và Icon web).
 */

export type IconName =
  | 'home'
  | 'compass'
  | 'search'
  | 'heart'
  | 'user'
  | 'bell'
  | 'back'
  | 'settings'
  | 'message'
  | 'close';

export type IconShape =
  | { type: 'path'; d: string }
  | { type: 'circle'; cx: number; cy: number; r: number };

const path = (d: string): IconShape => ({ type: 'path', d });
const circle = (cx: number, cy: number, r: number): IconShape => ({ type: 'circle', cx, cy, r });

export const ICON_SHAPES: Record<IconName, IconShape[]> = {
  message: [path('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z')],
  close: [path('M18 6 6 18'), path('m6 6 12 12')],
  home: [path('M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z')],
  compass: [circle(12, 12, 9.5), path('M15.8 8.2 13.6 13.6 8.2 15.8 10.4 10.4z')],
  search: [circle(11, 11, 7.5), path('m21 21-4.5-4.5')],
  heart: [
    path(
      'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    ),
  ],
  user: [path('M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'), circle(12, 7, 4)],
  bell: [path('M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9'), path('M13.73 21a2 2 0 0 1-3.46 0')],
  back: [path('M19 12H5'), path('m12 19-7-7 7-7')],
  settings: [
    path('M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0'),
    circle(16, 6, 2),
    circle(8, 12, 2),
    circle(18, 18, 2),
  ],
};
