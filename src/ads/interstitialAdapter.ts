/**
 * Native (Android/iOS) adapter cho Google Mobile Ads.
 * Bản web nằm ở interstitialAdapter.web.tsx (giả lập).
 */

import React from 'react';
import mobileAds, {
  AdEventType,
  InterstitialAd,
} from 'react-native-google-mobile-ads';
import { INTERSTITIAL_UNIT_ID } from './adConfig';

let interstitial: InterstitialAd | null = null;
let isLoaded = false;

const loadInterstitial = () => {
  isLoaded = false;
  interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_UNIT_ID);
  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    isLoaded = true;
  });
  interstitial.addAdEventListener(AdEventType.ERROR, () => {
    isLoaded = false;
  });
  interstitial.load();
};

export const initAds = async () => {
  await mobileAds().initialize();
  loadInterstitial();
};

/**
 * Hiển thị interstitial. Promise resolve khi người dùng đóng quảng cáo.
 * Trả về false (resolve ngay) nếu quảng cáo chưa sẵn sàng.
 */
export const showInterstitial = (): Promise<boolean> => {
  const ad = interstitial;
  if (!ad || !isLoaded) {
    loadInterstitial();
    return Promise.resolve(false);
  }

  return new Promise(resolve => {
    let settled = false;
    const finish = (shown: boolean) => {
      if (settled) {
        return;
      }
      settled = true;
      unsubscribeClosed();
      unsubscribeError();
      loadInterstitial(); // chuẩn bị quảng cáo cho lần sau
      resolve(shown);
    };
    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () =>
      finish(true),
    );
    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, () =>
      finish(false),
    );
    ad.show().catch(() => finish(false));
  });
};

// Native hiển thị quảng cáo toàn màn hình bằng SDK, không cần host component.
export const InterstitialHost: React.FC = () => null;
