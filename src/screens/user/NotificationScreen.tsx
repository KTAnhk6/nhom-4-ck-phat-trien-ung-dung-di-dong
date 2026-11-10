/**
 * Notification & Suggestions Screen (Assigned to: Minh Anh - Đánh giá & tương tác người dùng)
 * System notifications, Dalat festival announcements, discounts, and personalized suggestions.
 */

import React, { useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { useLanguage } from '../../context/LanguageContext';
import { useTourism } from '../../context/TourismContext';
import { isSameServiceId } from '../../services/tourismService';
import { NotificationItem, TourismService } from '../../types';

// Các tọa độ thuộc 3 cụm cung đường: Trại Mát & Cầu Đất, Đèo Prenn & Hồ Tuyền Lâm, Phố cổ Trung tâm
const THREE_ROUTES_SERVICE_IDS = [
  // Cụm 1: Trại Mát & Cầu Đất
  'SRV_12_DOI_CHE_CAU_DAT',
  'SRV_08_CHUA_LINH_PHUOC',
  'SRV_16_TUI_MO_TO',
  'SRV_17_CHEO_VEOOO',
  'SRV_18_BINH_MINH_OI',
  'SRV_20_MAY_LANG_THANG',
  'SRV_22_BA_QUA_DOI',
  'SRV_23_LOI_CUA_GIO',
  'SRV_26_KONG_CAFE',
  'SRV_03_GA_DA_LAT',
  'SRV_04_DINH_1_BAO_DAI',
  'SRV_48_DOI_MOT_NGUOI',
  // Cụm 2: Đèo Prenn & Hồ Tuyền Lâm
  'SRV_06_THIEN_VIEN_TRUC_LAM',
  'SRV_07_HO_TUYEN_LAM',
  'SRV_09_THAC_DATANLA',
  'SRV_19_LULULOLA_COFFEE',
  'SRV_27_HORIZON_COFFEE',
  'SRV_39_GA_NUONG_DOI_TRANG',
  'SRV_43_TERRACOTTA_RESORT',
  'SRV_44_SWISS_BELRESORT',
  'SRV_47_THE_KUPID_HILL',
  'SRV_49_NHA_BEN_RUNG',
  // Cụm 3: Phố cổ Trung tâm
  'SRV_01_QUANG_TRUONG_LAM_VIEN',
  'SRV_02_HO_XUAN_HUONG',
  'SRV_14_NHA_THO_CON_GA',
  'SRV_13_DOMAINE_DE_MARIE',
  'SRV_05_DINH_3_BAO_DAI',
  'SRV_24_CAFE_TUNG',
  'SRV_25_AN_CAFE',
  'SRV_21_DALAT_GOLF_CAFE',
  'SRV_28_LAU_GA_TAO_NGO',
  'SRV_29_LAU_BO_BA_TOA',
  'SRV_31_BANH_CAN_NHA_CHUNG',
  'SRV_32_BANH_MI_XIU_MAI_HOANG_DIEU',
  'SRV_34_BANH_UOT_LONG_GA_TRANG',
  'SRV_35_KEM_BO_THANH_THAO',
  'SRV_40_CHO_DEM_DA_LAT',
  'SRV_41_DALAT_PALACE',
  'SRV_46_HOTEL_COLLINE',
];

// Các món lẩu & món nóng đêm se lạnh (Lẩu Gà Lá É & Bò Ba Toa)
const HOTPOT_WARM_NIGHT_IDS = [
  'SRV_28_LAU_GA_TAO_NGO',
  'SRV_29_LAU_BO_BA_TOA',
];

export const NotificationScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    notifications,
    services,
    markAllNotificationsRead,
    goBack,
    navigateToDetail,
  } = useTourism();

  // Lưu lại địa điểm vừa mở gần nhất của từng thông báo để lần bấm tiếp theo luôn ra địa điểm mới
  const lastPickedRef = useRef<Record<string, string>>({});

  const pickRandomFromPool = (notifId: string, pool: TourismService[]): TourismService | null => {
    if (pool.length === 0) return null;
    if (pool.length === 1) return pool[0];
    const lastId = lastPickedRef.current[notifId];
    const candidates = lastId ? pool.filter(s => s.id !== lastId) : pool;
    const finalPool = candidates.length > 0 ? candidates : pool;
    const picked = finalPool[Math.floor(Math.random() * finalPool.length)];
    lastPickedRef.current[notifId] = picked.id;
    return picked;
  };

  const handleNotificationPress = (notif: NotificationItem) => {
    const titleLower = (notif.titleVi || notif.title || '').toLowerCase();

    // 1. Thông báo 1: Cẩm nang 50 tọa độ du lịch Đà Lạt -> Chọn ngẫu nhiên 1 trong 50 tọa độ
    if (notif.id === 'NOTIF_1' || titleLower.includes('50 tọa độ')) {
      const picked = pickRandomFromPool(notif.id, services);
      if (picked) {
        navigateToDetail(picked.id);
      }
      return;
    }

    // 2. Thông báo 2: Gợi ý 3 cung đường khám phá Đà Lạt -> Chọn ngẫu nhiên 1 địa điểm thuộc 3 cụm cung đường
    if (notif.id === 'NOTIF_2' || titleLower.includes('3 cung đường')) {
      const routePool = THREE_ROUTES_SERVICE_IDS.map(id =>
        services.find(s => isSameServiceId(s.id, id))
      ).filter((s): s is TourismService => Boolean(s));
      const picked = pickRandomFromPool(
        notif.id,
        routePool.length > 0 ? routePool : services
      );
      if (picked) {
        navigateToDetail(picked.id);
      }
      return;
    }

    // 3. Thông báo 3: Thưởng thức Lẩu Gà Lá É & Bò Ba Toa -> Chọn ngẫu nhiên giữa Lẩu Gà Lá É và Lẩu Bò Ba Toa
    if (notif.id === 'NOTIF_3' || titleLower.includes('lẩu gà lá é')) {
      const hotpotPool = HOTPOT_WARM_NIGHT_IDS.map(id =>
        services.find(s => isSameServiceId(s.id, id))
      ).filter((s): s is TourismService => Boolean(s));
      const picked = pickRandomFromPool(
        notif.id,
        hotpotPool.length > 0 ? hotpotPool : services
      );
      if (picked) {
        navigateToDetail(picked.id);
      }
      return;
    }

    // Thông báo khác có gắn linkServiceId
    if (notif.linkServiceId) {
      navigateToDetail(notif.linkServiceId);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event':
        return '🌸';
      case 'promo':
        return '🎁';
      case 'suggestion':
        return '💡';
      default:
        return '🔔';
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle}>{t('notificationsTitle')}</Text>
          <Text style={styles.headerSubtitle}>
            Thông báo & Gợi ý du lịch • Phụ trách: Minh Anh
          </Text>
        </View>
        <TouchableOpacity
          style={styles.markReadBtn}
          onPress={markAllNotificationsRead}
        >
          <Text style={styles.markReadText}>✓ Đã đọc</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const title = language === 'vi' ? item.titleVi : item.title;
          const message = language === 'vi' ? item.messageVi : item.message;

          return (
            <TouchableOpacity
              style={[
                styles.notifCard,
                !item.isRead && styles.notifCardUnread,
                shadows.subtle,
              ]}
              onPress={() => handleNotificationPress(item)}
              activeOpacity={0.8}
            >
              <View style={styles.notifIconWrap}>
                <Text style={{ fontSize: 20 }}>{getNotificationIcon(item.type)}</Text>
              </View>

              <View style={styles.notifBody}>
                <View style={styles.titleRow}>
                  <Text
                    style={[
                      styles.notifTitle,
                      !item.isRead && styles.notifTitleUnread,
                    ]}
                    numberOfLines={2}
                  >
                    {title}
                  </Text>
                  {!item.isRead && <View style={styles.unreadDot} />}
                </View>

                <Text style={styles.notifMsg}>{message}</Text>

                <View style={styles.bottomRow}>
                  <Text style={styles.timeText}>
                    {new Date(item.timestamp).toLocaleDateString('vi-VN')}
                  </Text>
                  {item.linkServiceId && (
                    <Text style={styles.linkText}>Xem điểm đến ➔</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔕</Text>
            <Text style={styles.emptyTitle}>{t('noNotifications')}</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
  },
  markReadBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryMuted,
  },
  markReadText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  notifCardUnread: {
    backgroundColor: '#FAFDFB',
    borderColor: '#C8E6C9',
  },
  notifIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  notifBody: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  notifTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 18,
  },
  notifTitleUnread: {
    fontWeight: '800',
    color: colors.primaryDark,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
    marginLeft: 6,
    marginTop: 4,
  },
  notifMsg: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  timeText: {
    fontSize: 10,
    color: colors.textLight,
  },
  linkText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
  },
});
