/**
 * Manage Reviews Screen (Assigned to: Việt - Admin)
 * Review moderation: view, toggle visibility (hidden/approved), and delete spam.
 */

import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { useLanguage } from '../../context/LanguageContext';
import { useTourism } from '../../context/TourismContext';
import { Review } from '../../types';
import { tourismService } from '../../services/tourismService';

export const ManageReviewsScreen: React.FC = () => {
  const { t } = useLanguage();
  const { toggleReviewStatus, deleteReview, goBack } = useTourism();

  const [reviews, setReviews] = useState<Review[]>([]);

  const loadReviews = async () => {
    const list = await tourismService.getAllReviews();
    setReviews(list);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleHide = async (rev: Review) => {
    await toggleReviewStatus(rev.id);
    await loadReviews();
  };

  const handleDelete = (rev: Review) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá của "${rev.userName}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa vĩnh viễn',
          style: 'destructive',
          onPress: async () => {
            await deleteReview(rev.id);
            await loadReviews();
            Alert.alert('Thành công', 'Đã xóa đánh giá!');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle}>{t('manageReviews')}</Text>
          <Text style={styles.headerSubtitle}>
            {reviews.length} đánh giá toàn hệ thống • Phụ trách: Việt
          </Text>
        </View>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isHidden = item.status === 'hidden';

          return (
            <View style={[styles.reviewCard, shadows.card]}>
              <View style={styles.headerRow}>
                <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.userName}>{item.userName}</Text>
                  <Text style={styles.serviceName}>📍 {item.serviceName}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {item.rating}</Text>
                </View>
              </View>

              <Text style={styles.commentText}>"{item.comment}"</Text>

              <View style={styles.actionRow}>
                <View
                  style={[
                    styles.statusBadge,
                    isHidden ? styles.statusBadgeHidden : styles.statusBadgeApproved,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isHidden ? styles.statusTextHidden : styles.statusTextApproved,
                    ]}
                  >
                    {isHidden ? 'ĐÃ ẨN' : 'HIỂN THỊ'}
                  </Text>
                </View>

                <View style={styles.btnGroup}>
                  <TouchableOpacity
                    style={styles.hideBtn}
                    onPress={() => handleToggleHide(item)}
                  >
                    <Text style={styles.hideBtnText}>
                      {isHidden ? '👁 Hiện lại' : '🚫 Ẩn đi'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item)}
                  >
                    <Text style={styles.deleteBtnText}>🗑️ Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Chưa có đánh giá nào</Text>
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
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  serviceName: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 1,
  },
  ratingBadge: {
    backgroundColor: colors.cardMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.star,
  },
  commentText: {
    fontSize: 12,
    color: colors.text,
    marginVertical: 8,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusBadgeApproved: {
    backgroundColor: colors.successLight,
  },
  statusBadgeHidden: {
    backgroundColor: colors.dangerLight,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusTextApproved: {
    color: colors.success,
  },
  statusTextHidden: {
    color: colors.danger,
  },
  btnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  hideBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.cardMuted,
    borderRadius: borderRadius.sm,
  },
  hideBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.dangerLight,
    borderRadius: borderRadius.sm,
  },
  deleteBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.danger,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyTitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
