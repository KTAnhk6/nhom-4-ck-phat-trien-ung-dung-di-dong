/**
 * Review List Screen (Assigned to: Minh Anh - Đánh giá & tương tác người dùng)
 * Detailed tourist ratings, star breakdown bar chart, and review list with add review trigger.
 */

import React, { useEffect, useState } from 'react';
import {
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
import { RatingStars } from '../../components/RatingStars';
import { AddReviewModal } from './AddReviewModal';
import { Review } from '../../types';
import { tourismService } from '../../services/tourismService';

interface ReviewListScreenProps {
  serviceId?: string;
}

export const ReviewListScreen: React.FC<ReviewListScreenProps> = ({ serviceId }) => {
  const { t } = useLanguage();
  const { services, goBack, currentScreen } = useTourism();

  const id = serviceId || currentScreen.serviceId;
  const service = services.find(s => s.id === id);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const loadReviews = async () => {
    if (id) {
      const data = await tourismService.getReviewsForService(id);
      setReviews(data);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [id]);

  if (!service) {
    return (
      <View style={styles.centerContainer}>
        <Text>Không tìm thấy dịch vụ</Text>
      </View>
    );
  }

  // Calculate star breakdown (1 to 5 stars)
  const total = reviews.length;
  const starCounts = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => Math.round(r.rating) === stars).length;
    const percent = total > 0 ? (count / total) * 100 : 0;
    return { stars, count, percent };
  });

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {t('customerReviews')}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {service.name} • Phụ trách: Minh Anh
          </Text>
        </View>
      </View>

      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Rating Summary Card */}
            <View style={[styles.summaryCard, shadows.card]}>
              <View style={styles.summaryLeft}>
                <Text style={styles.summaryScore}>{service.rating.toFixed(1)}</Text>
                <RatingStars rating={service.rating} size={16} />
                <Text style={styles.summaryCount}>
                  {reviews.length} {t('totalReviews')}
                </Text>
              </View>

              {/* Breakdown Bars */}
              <View style={styles.summaryRight}>
                {starCounts.map(item => (
                  <View key={item.stars} style={styles.barRow}>
                    <Text style={styles.barStarText}>{item.stars} ★</Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          { width: `${Math.min(item.percent, 100)}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.barCountText}>{item.count}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Write Review Action Banner */}
            <TouchableOpacity
              style={[styles.writeBtn, shadows.subtle]}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.writeBtnText}>✍️ {t('writeReview')}</Text>
            </TouchableOpacity>

            <Text style={styles.listSectionTitle}>{t('customerReviews')}:</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={[styles.reviewCard, shadows.subtle]}>
            <View style={styles.reviewHeaderRow}>
              <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.userName}>{item.userName}</Text>
                <View style={styles.starRow}>
                  <RatingStars rating={item.rating} size={12} />
                  <Text style={styles.dateText}>
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.commentText}>{item.comment}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyTitle}>{t('noReviewsYet')}</Text>
          </View>
        }
      />

      {/* Add Review Modal */}
      <AddReviewModal
        visible={modalVisible}
        serviceId={service.id}
        serviceName={service.name}
        onClose={() => setModalVisible(false)}
        onSuccess={() => {
          setModalVisible(false);
          loadReviews();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  summaryLeft: {
    alignItems: 'center',
    paddingRight: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.borderLight,
    minWidth: 100,
  },
  summaryScore: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
  },
  summaryCount: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
  },
  summaryRight: {
    flex: 1,
    paddingLeft: spacing.md,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    gap: 6,
  },
  barStarText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    width: 24,
  },
  barTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.star,
    borderRadius: 3,
  },
  barCountText: {
    fontSize: 10,
    color: colors.textLight,
    width: 20,
    textAlign: 'right',
  },
  writeBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  writeBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  listSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  dateText: {
    fontSize: 10,
    color: colors.textLight,
  },
  commentText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 6,
  },
});
