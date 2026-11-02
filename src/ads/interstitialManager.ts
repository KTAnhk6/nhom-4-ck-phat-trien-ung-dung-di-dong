/**
 * Điều phối Interstitial: chỉ hiển thị tối đa 1 lần / INTERSTITIAL_INTERVAL_MS.
 * Hành động (chuyển trang) chỉ chạy sau khi người dùng đóng quảng cáo.
 */

import { INTERSTITIAL_INTERVAL_MS } from './adConfig';
import { showInterstitial } from './interstitialAdapter';

let lastShownAt = 0;
let isShowing = false;

export const runAfterInterstitial = (action: () => void) => {
  if (isShowing) {
    return; // đang hiện quảng cáo, bỏ qua thao tác bấm thêm
  }

  const now = Date.now();
  if (lastShownAt !== 0 && now - lastShownAt < INTERSTITIAL_INTERVAL_MS) {
    action();
    return;
  }

  isShowing = true;
  showInterstitial()
    .then(shown => {
      if (shown) {
        lastShownAt = now;
      }
    })
    .catch(() => {})
    .finally(() => {
      isShowing = false;
      action();
    });
};
