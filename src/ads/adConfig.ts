/**
 * AdMob configuration.
 * Đang dùng ID quảng cáo TEST của Google. Khi phát hành thật, thay bằng ID của bạn
 * (và đổi App ID trong app.json).
 */

// Interstitial hiển thị tối đa 1 lần / 3 phút
export const INTERSTITIAL_INTERVAL_MS = 3 * 60 * 1000;

export const BANNER_UNIT_ID = 'ca-app-pub-3940256099942544/6300978111';
export const INTERSTITIAL_UNIT_ID = 'ca-app-pub-3940256099942544/1033173712';

// Bản web: dùng Google Publisher Tag (GPT) với ad unit demo của Google.
// Khi phát hành thật, thay bằng ad unit Ad Manager / AdSense của bạn.
export const WEB_GPT_SRC = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
export const WEB_BANNER_UNIT = '/6355419/Travel/Europe/France/Paris';
export const WEB_BANNER_SIZES: [number, number][] = [[320, 50], [300, 50], [320, 100]];
export const WEB_INTERSTITIAL_UNIT = '/6355419/Travel/Europe/France/Paris';
export const WEB_INTERSTITIAL_SIZES: [number, number][] = [[300, 250]];
// Quá thời gian này mà GPT chưa trả quảng cáo thì hiển thị khung giả lập
export const WEB_AD_TIMEOUT_MS = 4000;
