/**
 * AppOpenAd Component - Google AdMob App Open / Interstitial Ad
 * 
 * Tự động hiển thị toàn màn hình ngay khi vừa mở ứng dụng.
 * - Tổng thời lượng quảng cáo: 15 giây (đếm ngược từ 15 về 0 kèm progress bar).
 * - Sau 5 giây: Nút "Bỏ qua quảng cáo ✕" được kích hoạt cho phép người dùng đóng ngay.
 * - Trước 5 giây: Nút hiển thị đếm ngược "Có thể bỏ qua sau 5s... 4s... 3s...".
 */

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ADMOB_CONFIG } from '../config/apiConfig';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';

interface AppOpenAdProps {
  onClose?: () => void;
}

export const AppOpenAd: React.FC<AppOpenAdProps> = ({ onClose }) => {
  // Tự động bật quảng cáo khi vừa vào app
  const [visible, setVisible] = useState<boolean>(true);
  const [elapsed, setElapsed] = useState<number>(0); // Đã trôi qua bao nhiêu giây (0 -> 15)
  const TOTAL_DURATION = 15; // 15 giây
  const SKIP_AFTER = 5; // Có thể bỏ qua sau 5 giây

  useEffect(() => {
    if (!visible) return;

    // Reset về 0 khi mở lại
    setElapsed(0);

    const interval = setInterval(() => {
      setElapsed(prev => {
        if (prev >= TOTAL_DURATION - 1) {
          clearInterval(interval);
          // Hết 15 giây tự động đóng quảng cáo
          setTimeout(() => handleCloseAd(), 300);
          return TOTAL_DURATION;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]);

  const [showVoucherModal, setShowVoucherModal] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCloseAd = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  const handleClaimOffer = () => {
    setShowVoucherModal(true);
  };

  const handleCopyVoucher = () => {
    setIsCopied(true);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('DALATWANDER2026').catch(() => {});
    }
    Alert.alert(
      '🎉 Đã sao chép mã ưu đãi!',
      'Mã: DALATWANDER2026\nĐã sao chép vào bộ nhớ tạm. Bạn có thể sử dụng khi đặt tour & trải nghiệm Đà Lạt!'
    );
  };

  if (!ADMOB_CONFIG.IS_ENABLED || !visible) {
    return null;
  }

  const remainingSeconds = TOTAL_DURATION - elapsed;
  const skipCountdown = SKIP_AFTER - elapsed;
  const canSkip = elapsed >= SKIP_AFTER;
  const progressPercent = Math.min((elapsed / TOTAL_DURATION) * 100, 100);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        <View style={styles.phoneContainer}>
        {/* Ảnh nền quảng cáo toàn màn hình */}
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
          }}
          style={styles.backgroundImage}
        />

        {/* Lớp phủ tối chuyển màu để chữ nổi bật */}
        <View style={styles.darkGradientOverlay} />

        {/* Header trên cùng: Tag AdMob + Nút Bỏ qua sau 5s */}
        <View style={styles.topHeader}>
          <View style={styles.adBadgeRow}>
            <View style={styles.adTag}>
              <Text style={styles.adTagText}>Ad</Text>
            </View>
            <View>
              <Text style={styles.adBrandText}>Google AdMob Interstitial</Text>
              <Text style={styles.adSubBrandText}>Test ID: ca-app-pub-394025...1033173712</Text>
            </View>
          </View>

          {/* Nút Skip (Đổi trạng thái sau 5s) */}
          {canSkip ? (
            <TouchableOpacity
              style={styles.skipButtonActive}
              onPress={handleCloseAd}
              activeOpacity={0.8}
            >
              <Text style={styles.skipButtonActiveText}>Bỏ qua quảng cáo ✕</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.skipButtonDisabled}>
              <Text style={styles.skipButtonDisabledText}>
                ⏱ Bỏ qua sau {skipCountdown}s
              </Text>
            </View>
          )}
        </View>

        {/* Nội dung chính quảng cáo ở giữa/cuối */}
        <View style={styles.bottomContent}>
          {showVoucherModal ? (
            <View style={styles.voucherBox}>
              <View style={styles.voucherHeaderRow}>
                <Text style={styles.voucherBadge}>🎉 ƯU ĐÃI ĐÃ KÍCH HOẠT</Text>
                <TouchableOpacity onPress={() => setShowVoucherModal(false)}>
                  <Text style={styles.voucherCloseMini}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.voucherTitle}>GIẢM 20% TOUR ĐÀ LẠT</Text>
              <Text style={styles.voucherSub}>
                Áp dụng cho Tour Săn Mây Cầu Đất, Cà phê Túi Mơ To & Homestay
              </Text>

              <View style={styles.codeContainer}>
                <Text style={styles.codeText}>DALATWANDER2026</Text>
              </View>

              <TouchableOpacity
                style={[styles.btnCopy, isCopied && styles.btnCopySuccess]}
                onPress={handleCopyVoucher}
                activeOpacity={0.8}
              >
                <Text style={styles.btnCopyText}>
                  {isCopied ? '✓ Đã sao chép mã: DALATWANDER2026' : '📋 Sao chép mã Voucher'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnEnterApp}
                onPress={handleCloseAd}
                activeOpacity={0.85}
              >
                <Text style={styles.btnEnterAppText}>
                  🚀 Vào khám phá ứng dụng ngay ➔
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.offerBadge}>
                <Text style={styles.offerBadgeText}>ƯU ĐÃI ĐỘC QUYỀN MÙA HOA ĐÀ LẠT</Text>
              </View>

              <Text style={styles.mainTitle}>
                Tour Săn Mây Cầu Đất & Ngắm Hoàng Hôn Thung Lũng
              </Text>

              <Text style={styles.description}>
                Khởi hành 4h30 sáng • Đón tận homestay • Bao gồm ăn sáng & cà phê chill view đồi thông.
              </Text>

              <View style={styles.ratingRow}>
                <Text style={styles.ratingStars}>⭐⭐⭐⭐⭐</Text>
                <Text style={styles.ratingScore}>4.9/5 (512 đánh giá du khách)</Text>
              </View>

              {/* Nút Kêu gọi Hành động (CTA) */}
              <TouchableOpacity
                style={[styles.ctaButton, shadows.card]}
                onPress={handleClaimOffer}
                activeOpacity={0.85}
              >
                <Text style={styles.ctaButtonText}>🎁 NHẬN VOUCHER GIẢM 20% NGAY</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Thanh Tiến Trình 15 giây & Đếm ngược */}
          <View style={styles.timerFooter}>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            <View style={styles.timerLabels}>
              <Text style={styles.timerInfo}>
                {canSkip ? 'Bạn có thể bấm Bỏ qua ở góc trên' : `Chờ ${skipCountdown}s để bỏ qua`}
              </Text>
              <Text style={styles.timerCountdown}>Tự động đóng sau: {remainingSeconds}s</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  </Modal>
);
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 20, 25, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 16 : 0,
  },
  phoneContainer: {
    width: '100%',
    maxWidth: 440,
    height: '100%',
    maxHeight: Platform.OS === 'web' ? 900 : '100%',
    backgroundColor: '#000000',
    position: 'relative',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderRadius: Platform.OS === 'web' ? 32 : 0,
    borderWidth: Platform.OS === 'web' ? 2 : 0,
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
  darkGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
  },
  topHeader: {
    paddingTop: Platform.OS === 'web' ? 24 : 45,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  adBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  adTag: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  adBrandText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  adSubBrandText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 8,
  },

  // Skip buttons
  skipButtonDisabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  skipButtonDisabledText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '600',
  },
  skipButtonActive: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  skipButtonActiveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  // Bottom Content
  bottomContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    zIndex: 10,
  },
  offerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E76F51',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  offerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowRadius: 8,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowRadius: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  ratingStars: {
    fontSize: 14,
  },
  ratingScore: {
    color: '#FDE68A',
    fontSize: 12,
    fontWeight: '700',
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#4ADE80',
    marginBottom: 16,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Progress bar & timer footer
  timerFooter: {
    marginTop: 4,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  timerLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerInfo: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontWeight: '500',
  },
  timerCountdown: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '700',
  },

  // Voucher Card Styles
  voucherBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: '#4ADE80',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  voucherHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  voucherBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#065F46',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  voucherCloseMini: {
    fontSize: 16,
    color: '#64748B',
    padding: 2,
  },
  voucherTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 2,
  },
  voucherSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  codeContainer: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#059669',
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  codeText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 2,
  },
  btnCopy: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  btnCopySuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#34D399',
  },
  btnCopyText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },
  btnEnterApp: {
    backgroundColor: colors.primary,
    paddingVertical: 11,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: 4,
  },
  btnEnterAppText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
