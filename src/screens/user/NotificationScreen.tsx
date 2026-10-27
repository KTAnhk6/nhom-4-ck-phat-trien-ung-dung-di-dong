/**
 * Notification & Suggestions Screen (Assigned to: Minh Anh - Đánh giá & tương tác người dùng)
 * System notifications, Dalat festival announcements, discounts, and personalized suggestions.
 */

import React from 'react';
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
import { NotificationItem } from '../../types';

export const NotificationScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    notifications,
    markAllNotificationsRead,
    goBack,
    navigateToDetail,
  } = useTourism();

  const handleNotificationPress = (notif: NotificationItem) => {
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
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
