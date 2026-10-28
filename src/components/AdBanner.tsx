/**
 * AdBanner Component - Google AdMob Universal Integration
 * 
 * Includes rich interactive AdMob experience:
 * - Banner preview (320x50 / Anchored adaptive)
 * - Interactive Interstitial / Promo Modal on click
 * - Simulated Rewarded Video Ad with 5s countdown & claimable discount vouchers
 * - Direct navigation to featured travel spots
 */

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { ADMOB_CONFIG } from '../config/apiConfig';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { useTourism } from '../context/TourismContext';

interface AdBannerProps {
  placement?: 'bottom_nav' | 'bottom' | 'inline' | 'detail';
  style?: ViewStyle;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  placement = 'bottom_nav',
  style,
}) => {
  const {
    services,
    navigateToDetail,
    getCooldownRemainingSeconds,
    resetInterstitialCooldown,
  } = useTourism();
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  // Cập nhật đếm ngược cooldown của Interstitial Ads (Tối đa 1 lần / 3 phút)
  useEffect(() => {
    const update = () => {
      if (getCooldownRemainingSeconds) {
        setCooldownRemaining(getCooldownRemainingSeconds());
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [getCooldownRemainingSeconds]);

  // Rewarded Video Ad State
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);
  const [rewardClaimed, setRewardClaimed] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Rewarded video countdown timer
  useEffect(() => {
    let timer: any = null;
    if (isVideoPlaying && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isVideoPlaying && countdown === 0) {
      setIsVideoPlaying(false);
      setRewardClaimed(true);
    }
    return () => clearTimeout(timer);
  }, [isVideoPlaying, countdown]);

  if (
    !ADMOB_CONFIG.IS_ENABLED ||
    (isDismissed && placement !== 'bottom' && placement !== 'bottom_nav')
  ) {
    return null;
  }

  const openInteractiveAd = () => {
    setRewardClaimed(false);
    setIsVideoPlaying(false);
    setCountdown(5);
    setCopiedCode(null);
    setModalVisible(true);
  };

  const startRewardedVideo = () => {
    setCountdown(5);
    setIsVideoPlaying(true);
  };

  const handleCopyVoucher = (code: string) => {
    setCopiedCode(code);
    Alert.alert(
      '🎉 Đã nhận Voucher!',
      `Mã ưu đãi của bạn: ${code}\nÁp dụng giảm giá khi đặt dịch vụ du lịch tại Đà Lạt!`
    );
  };

  const handleGoToFeaturedSpot = () => {
    setModalVisible(false);
    // Tìm dịch vụ Đồi Chè Cầu Đất hoặc Túi Mơ To để dẫn người dùng tới
    const target = services.find(s => s.name.includes('Cầu Đất') || s.name.includes('Túi Mơ To')) || services[0];
    if (target) {
      navigateToDetail(target.id);
    }
  };

  // 1. NATIVE ADMOB (CHO THIẾT BỊ ANDROID/IOS ĐÃ CÀI NATIVE MODULE)
  if (Platform.OS !== 'web') {
    return (
      <View style={[styles.nativeWrapper, style]}>
        <BannerAd
          unitId={ADMOB_CONFIG.IS_TEST_MODE ? TestIds.BANNER : ADMOB_CONFIG.BANNER_ID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>
    );
  }

  // 2. GIAO DIỆN QUẢNG CÁO TƯƠNG TÁC (HỖ TRỢ CẢ WEB VÀ MOBILE)
  return (
    <>
      <View
        style={[
          styles.webContainer,
          (placement === 'bottom_nav' || placement === 'bottom') && styles.bottomPlacement,
          placement === 'detail' && styles.detailPlacement,
          style,
        ]}
      >
        <TouchableOpacity
          style={styles.adContentTouchable}
          activeOpacity={0.85}
          onPress={openInteractiveAd}
        >
          <View style={styles.badgeWrapper}>
            <Text style={styles.adBadgeText}>Ad</Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.adTitle} numberOfLines={1}>
              🌲 Tour Săn Mây Cầu Đất 4h30 sáng - Giảm 20%
            </Text>
            <Text style={styles.adSubtext} numberOfLines={1}>
              {cooldownRemaining > 0
                ? `⏱ Interstitial Ad: còn ${cooldownRemaining}s (Tối đa 3 phút/lần)`
                : '✨ Google AdMob Banner • Chạm để nhận Voucher & Quà tặng'}
            </Text>
          </View>

          {cooldownRemaining > 0 ? (
            <TouchableOpacity
              style={styles.resetTestBtn}
              onPress={resetInterstitialCooldown}
              activeOpacity={0.8}
            >
              <Text style={styles.resetTestBtnText}>🔄 Reset test</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.ctaButton}>
              <Text style={styles.ctaText}>Khám phá ➔</Text>
            </View>
          )}
        </TouchableOpacity>

        {placement !== 'bottom' && placement !== 'bottom_nav' && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsDismissed(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* POPUP QUẢNG CÁO TƯƠNG TÁC ADMOB (INTERACTIVE MODAL) */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, shadows.card]}>
            {/* Header Modal */}
            <View style={styles.modalHeader}>
              <View style={styles.admobBrandRow}>
                <View style={styles.modalAdBadge}>
                  <Text style={styles.modalAdBadgeText}>Google AdMob Test</Text>
                </View>
                <Text style={styles.adUnitText}>Unit: {ADMOB_CONFIG.BANNER_ID.slice(0, 22)}...</Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Màn hình Rewarded Video Đang chạy */}
            {isVideoPlaying ? (
              <View style={styles.videoPlayerContainer}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
                  }}
                  style={styles.videoCoverImage}
                />
                <View style={styles.videoOverlay}>
                  <View style={styles.countdownBadge}>
                    <Text style={styles.countdownText}>⏱ Đang xem: {countdown}s</Text>
                  </View>
                  <Text style={styles.videoTitle}>
                    Đón bình minh tại Đồi Chè Cầu Đất Đà Lạt
                  </Text>
                  <View style={styles.progressBarWrapper}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${((5 - countdown) / 5) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.videoTip}>
                    Xem hết 5 giây để nhận Voucher giảm giá 50.000đ!
                  </Text>
                </View>
              </View>
            ) : (
              /* Màn hình Thông tin Quảng cáo & Tương tác nhận ưu đãi */
              <View style={styles.adBodyContainer}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                  }}
                  style={styles.promoImage}
                />

                <Text style={styles.promoTitle}>
                  🌸 Siêu Combo Du Lịch: Săn Mây & Cà Phê Hoàng Hôn
                </Text>

                <Text style={styles.promoDesc}>
                  Trải nghiệm ngắm biển mây bồng bềnh lúc 4h30 sáng tại Đồi Chè Cầu Đất, xe đưa đón tận nơi, tặng kèm ly cà phê ngắm thung lũng đèn.
                </Text>

                {/* Phần thưởng sau khi xem video thành công */}
                {rewardClaimed && (
                  <View style={styles.rewardSuccessBox}>
                    <Text style={styles.rewardSuccessTitle}>🎉 CHÚC MỪNG BẠN!</Text>
                    <Text style={styles.rewardSuccessSub}>
                      Bạn đã hoàn thành xem quảng cáo AdMob Rewarded.
                    </Text>
                    <View style={styles.voucherBox}>
                      <Text style={styles.voucherCode}>DALATREWARD50K</Text>
                    </View>
                  </View>
                )}

                {/* Các nút tương tác */}
                <View style={styles.interactiveActions}>
                  {/* Tương tác 1: Nhận mã giảm 20% */}
                  <TouchableOpacity
                    style={[styles.btnActionSecondary, copiedCode === 'SANMAY20' && styles.btnCopied]}
                    onPress={() => handleCopyVoucher('SANMAY20')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.btnActionSecondaryText}>
                      {copiedCode === 'SANMAY20' ? '✓ Đã nhận mã: SANMAY20' : '🎟️ Nhận mã giảm 20%: SANMAY20'}
                    </Text>
                  </TouchableOpacity>

                  {/* Tương tác 2: Xem video có thưởng (Rewarded Ad) */}
                  {!rewardClaimed && (
                    <TouchableOpacity
                      style={styles.btnActionPrimary}
                      onPress={startRewardedVideo}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.btnActionPrimaryText}>
                        ▶️ Xem Video AdMob 5s (Nhận 50k)
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Tương tác 3: Đi đến xem chi tiết địa điểm */}
                  <TouchableOpacity
                    style={styles.btnLinkAction}
                    onPress={handleGoToFeaturedSpot}
                  >
                    <Text style={styles.btnLinkActionText}>
                      Xem chi tiết địa điểm được tài trợ ➔
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  nativeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000008',
    width: '100%',
  },
  webContainer: {
    backgroundColor: '#FFFBEB',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#FDE68A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 10,
  },
  bottomNavPlacement: {
    borderBottomWidth: 0,
    backgroundColor: '#FFFDF5',
    borderTopColor: '#FDE68A',
  },
  bottomPlacement: {
    borderBottomWidth: 0,
    backgroundColor: '#FFFDF5',
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
  },
  resetTestBtn: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  resetTestBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  detailPlacement: {
    marginVertical: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  adContentTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeWrapper: {
    backgroundColor: '#D97706',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  adBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  adTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#78350F',
  },
  adSubtext: {
    fontSize: 10,
    color: '#92400E',
    marginTop: 1,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: '#92400E',
    fontWeight: '600',
    lineHeight: 18,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    width: '100%',
    maxWidth: 380,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  admobBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalAdBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  modalAdBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  adUnitText: {
    fontSize: 9,
    color: colors.textMuted,
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
  },
  adBodyContainer: {
    padding: spacing.md,
  },
  promoImage: {
    width: '100%',
    height: 140,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  promoDesc: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    marginBottom: spacing.md,
  },
  rewardSuccessBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  rewardSuccessTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
  },
  rewardSuccessSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
  },
  voucherBox: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
  },
  voucherCode: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  interactiveActions: {
    gap: 8,
  },
  btnActionPrimary: {
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  btnActionPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  btnActionSecondary: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 9,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  btnCopied: {
    backgroundColor: '#D1FAE5',
    borderColor: '#6EE7B7',
  },
  btnActionSecondaryText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  btnLinkAction: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  btnLinkActionText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },

  // Video Simulator
  videoPlayerContainer: {
    height: 260,
    position: 'relative',
    backgroundColor: '#000',
  },
  videoCoverImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  countdownBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  countdownText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '800',
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 4,
  },
  progressBarWrapper: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  videoTip: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
  },
});
