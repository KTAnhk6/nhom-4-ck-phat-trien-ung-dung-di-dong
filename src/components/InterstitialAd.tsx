/**
 * InterstitialAd Component - Google AdMob Interstitial Ad (Quảng cáo xen kẽ)
 * 
 * Quy tắc nghiệp vụ theo yêu cầu bài tập:
 * 1. Khi ấn nút chuyển trang -> Hiển thị Interstitial Ads.
 * 2. Người dùng tắt Interstitial Ads (bấm ✕) -> Mới thực hiện chuyển sang trang mới.
 * 3. Tần suất hiển thị: Tối đa 3 phút / lần (Cooldown 180 giây).
 */

import React from 'react';
import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ADMOB_CONFIG } from '../config/apiConfig';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { useTourism } from '../context/TourismContext';

export const InterstitialAd: React.FC = () => {
  const { isInterstitialVisible, closeInterstitial } = useTourism();

  if (!ADMOB_CONFIG.IS_ENABLED || !isInterstitialVisible) {
    return null;
  }

  return (
    <Modal
      visible={isInterstitialVisible}
      transparent={false}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={closeInterstitial}
    >
      <View style={styles.container}>
        {/* Ảnh nền toàn màn hình */}
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
          }}
          style={styles.backgroundImage}
        />
        <View style={styles.darkOverlay} />

        {/* Thanh Header trên cùng */}
        <View style={styles.topHeader}>
          <View style={styles.adBadgeRow}>
            <View style={styles.adTag}>
              <Text style={styles.adTagText}>Ad</Text>
            </View>
            <View>
              <Text style={styles.adBrandText}>Google AdMob Interstitial</Text>
              <Text style={styles.adSubBrandText}>ca-app-pub-394025...1033173712</Text>
            </View>
          </View>

          {/* NÚT TẮT QUẢNG CÁO ĐỂ CHUYỂN TRANG */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={closeInterstitial}
            activeOpacity={0.8}
          >
            <Text style={styles.closeBtnText}>Đóng quảng cáo ✕</Text>
          </TouchableOpacity>
        </View>

        {/* Thẻ ghi chú quy tắc hiển thị 3 phút */}
        <View style={styles.ruleBadgeContainer}>
          <View style={styles.ruleBadge}>
            <Text style={styles.ruleBadgeText}>
              ⏱ Quy tắc bài tập: Hiển thị tối đa 1 lần / 3 phút khi chuyển trang
            </Text>
          </View>
        </View>

        {/* Nội dung quảng cáo ở giữa / chân màn hình */}
        <View style={styles.bottomContent}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>QUẢNG CÁO XEN KẼ KHI CHUYỂN TRANG</Text>
          </View>

          <Text style={styles.mainTitle}>
            🌲 Khám Phá Tour Săn Mây Cầu Đất & Cà Phê Hoàng Hôn
          </Text>

          <Text style={styles.description}>
            Khởi hành 4h30 sáng • Đón tận nơi • Bao gồm bữa sáng nhẹ & ly cà phê chill view đồi thông bồng bềnh mây trắng.
          </Text>

          <View style={styles.ratingRow}>
            <Text style={styles.ratingStars}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.ratingScore}>4.9/5 (512 du khách hài lòng)</Text>
          </View>

          {/* Nút Đóng & Chuyển Trang Nổi Bật */}
          <TouchableOpacity
            style={[styles.continueButton, shadows.card]}
            onPress={closeInterstitial}
            activeOpacity={0.85}
          >
            <Text style={styles.continueButtonText}>
              ➔ TIẾP TỤC CHUYỂN ĐẾN TRANG MỚI
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerNote}>
            💡 Người dùng bấm [Đóng quảng cáo ✕] ở góc trên hoặc nút trên để vào trang mới.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
    position: 'relative',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    color: '#FFFFFF',
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
  bottomContent: {
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
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#4ADE80',
    marginBottom: 10,
  },
  continueButtonText: {
    color: '#FFFFFF',
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
