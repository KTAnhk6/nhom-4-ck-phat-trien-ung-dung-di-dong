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

  const handleCloseAd = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  const handleClaimOffer = () => {
    Alert.alert(
      '🎉 Nhận Voucher Thành Công!',
      'Mã ưu đãi: DALATWANDER2026\nĐã áp dụng giảm giá 20% cho chuyến đi Đà Lạt của bạn!',
      [
        {
          text: 'Vào ứng dụng ngay',
          onPress: () => handleCloseAd(),
        },
      ]
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
      transparent={false}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.container}>
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
    justifyContent: 'space-between',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  darkGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  topHeader: {
    paddingTop: 45,
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
});
