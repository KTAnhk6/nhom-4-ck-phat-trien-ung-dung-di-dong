/**
 * Google Mobile Ads Web Adapter / Simulator
 * 
 * Implements the exact public API of `react-native-google-mobile-ads`
 * so code written like BinhGold24's App.js works seamlessly on both Web and Mobile:
 * - mobileAds().initialize()
 * - BannerAd component with size & unitId
 * - InterstitialAd.createForAdRequest() with addAdEventListener, load(), show()
 * - BannerAdSize, AdEventType, TestIds
 */

import React, { useState, useEffect } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from './theme/colors';
import { borderRadius, shadows, spacing } from './theme/spacing';

export const TestIds = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  APP_OPEN: 'ca-app-pub-3940256099942544/9257395921',
};

export const BannerAdSize = {
  ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER',
  BANNER: 'BANNER',
  FULL_BANNER: 'FULL_BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  LEADERBOARD: 'LEADERBOARD',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
};

export const AdEventType = {
  LOADED: 'loaded',
  OPENED: 'opened',
  CLOSED: 'closed',
  ERROR: 'error',
  CLICKED: 'clicked',
};

// Global event bus for Interstitial show triggers
type Listener = () => void;
let globalShowInterstitial: ((resolve: () => void) => void) | null = null;

export class InterstitialAd {
  private adUnitId: string;
  private listeners: Map<string, Set<Function>> = new Map();
  public isLoaded: boolean = false;

  constructor(adUnitId: string) {
    this.adUnitId = adUnitId;
  }

  static createForAdRequest(adUnitId: string, options?: any): InterstitialAd {
    return new InterstitialAd(adUnitId);
  }

  addAdEventListener(eventType: string, handler: Function): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(handler);

    return () => {
      this.listeners.get(eventType)?.delete(handler);
    };
  }

  private emit(eventType: string, ...args: any[]) {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      handlers.forEach(h => {
        try {
          h(...args);
        } catch (e) {
          console.error(e);
        }
      });
    }
  }

  load(): void {
    setTimeout(() => {
      this.isLoaded = true;
      this.emit(AdEventType.LOADED);
    }, 400);
  }

  show(): Promise<void> {
    return new Promise((resolve) => {
      this.emit(AdEventType.OPENED);
      this.isLoaded = false;
      resolve();
    });
  }
}

export default function mobileAds() {
  return {
    initialize: async () => {
      return { status: 'INITIALIZED' };
    },
    setRequestConfiguration: async () => {},
  };
}

// ================= BANNER AD COMPONENT =================
export interface BannerAdProps {
  unitId: string;
  size?: string;
  requestOptions?: any;
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: any) => void;
}

export const BannerAd: React.FC<BannerAdProps> = ({
  unitId,
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  onAdLoaded,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (onAdLoaded) onAdLoaded();
  }, [onAdLoaded]);

  const handleCopyCode = () => {
    setIsCopied(true);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('DALATWANDER2026').catch(() => {});
    }
  };

  return (
    <>
      <View style={bannerStyles.container}>
        <TouchableOpacity
          style={bannerStyles.touchable}
          activeOpacity={0.85}
          onPress={() => setModalVisible(true)}
        >
          <View style={bannerStyles.badge}>
            <Text style={bannerStyles.badgeText}>Ad</Text>
          </View>
          <View style={bannerStyles.content}>
            <Text style={bannerStyles.title} numberOfLines={1}>
              🌲 Tour Săn Mây Cầu Đất 4h30 sáng - Giảm 20%
            </Text>
            <Text style={bannerStyles.subtext} numberOfLines={1}>
              Google AdMob • Chạm để nhận Voucher ưu đãi du lịch
            </Text>
          </View>
          <View style={bannerStyles.ctaBtn}>
            <Text style={bannerStyles.ctaText}>Khám phá ➔</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal Voucher khi chạm vào Banner */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={bannerStyles.modalOverlay}>
          <View style={[bannerStyles.modalCard, shadows.card]}>
            <View style={bannerStyles.modalHeader}>
              <Text style={bannerStyles.modalTitle}>🎉 ƯU ĐÃI GOOGLE ADMOB</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={bannerStyles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={bannerStyles.modalDesc}>
              Nhận ngay mã giảm 20% khi đặt tour săn mây hoặc ghé thăm các quán cà phê view đẹp tại Đà Lạt.
            </Text>
            <View style={bannerStyles.codeBox}>
              <Text style={bannerStyles.codeText}>DALATWANDER2026</Text>
            </View>
            <TouchableOpacity
              style={[bannerStyles.copyBtn, isCopied && bannerStyles.copyBtnSuccess]}
              onPress={handleCopyCode}
            >
              <Text style={bannerStyles.copyBtnText}>
                {isCopied ? '✓ Đã sao chép mã ưu đãi!' : '📋 Sao chép mã Voucher'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

// ================= ADMOB MODAL CONTROLLER =================
export const AdMobModalHost: React.FC = () => {
  return null;
};

const bannerStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFDF5',
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#D97706',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78350F',
  },
  subtext: {
    fontSize: 10,
    color: '#92400E',
    marginTop: 1,
  },
  ctaBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  ctaText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalCard: {
    backgroundColor: '#FFF',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 360,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
  },
  modalClose: {
    fontSize: 16,
    color: '#64748B',
    padding: 4,
  },
  modalDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  codeBox: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#059669',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  codeText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 2,
  },
  copyBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  copyBtnSuccess: {
    backgroundColor: '#059669',
  },
  copyBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

const interStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 20, 25, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  phoneContainer: {
    width: '100%',
    maxWidth: 440,
    height: '100%',
    maxHeight: 900,
    backgroundColor: '#000000',
    position: 'relative',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.65,
    shadowRadius: 35,
    elevation: 24,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  adBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  brandText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  subBrandText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 8,
  },
  closeBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  closeBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  ruleBadgeContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    zIndex: 10,
  },
  ruleBadge: {
    backgroundColor: 'rgba(27, 77, 62, 0.85)',
    borderWidth: 1,
    borderColor: '#4ADE80',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  ruleBadgeText: {
    color: '#E8F5E9',
    fontSize: 11,
    fontWeight: '700',
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 35,
    zIndex: 10,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E76F51',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowRadius: 8,
    marginBottom: 6,
  },
  desc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowRadius: 4,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  continueBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#4ADE80',
    marginBottom: 10,
  },
  continueBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footerNote: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
});
