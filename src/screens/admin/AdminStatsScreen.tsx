/**
 * Admin Statistics Screen (Assigned to: Việt - Admin)
 * Visual data reports: category distribution, rating breakdown, and top-ranked spots.
 */

import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { useLanguage } from '../../context/LanguageContext';
import { useTourism } from '../../context/TourismContext';
import { AdminStatsSummary, statsService } from '../../services/statsService';

export const AdminStatsScreen: React.FC = () => {
  const { t } = useLanguage();
  const { goBack, navigateToDetail } = useTourism();

  const [stats, setStats] = useState<AdminStatsSummary | null>(null);

  useEffect(() => {
    statsService.getDashboardSummary().then(setStats);
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle}>{t('adminStatistics')}</Text>
          <Text style={styles.headerSubtitle}>
            Báo cáo & Phân tích hệ thống • Phụ trách: Việt
          </Text>
        </View>
      </View>

      {/* 1. Services by Category Breakdown */}
      <View style={[styles.card, shadows.card]}>
        <Text style={styles.cardTitle}>📊 {t('statsCategoryBreakdown')}</Text>
        <View style={{ marginTop: spacing.sm, gap: 10 }}>
          {stats?.categoryStats.map(item => (
            <View key={item.categoryId}>
              <View style={styles.barLabelRow}>
                <Text style={styles.barLabelName}>{item.categoryName}</Text>
                <Text style={styles.barLabelValue}>
                  {item.count} dịch vụ ({item.percentage}%)
                </Text>
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${item.percentage}%` }]} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 2. Rating Distribution Breakdown */}
      <View style={[styles.card, shadows.card]}>
        <Text style={styles.cardTitle}>⭐ {t('statsRatingDistribution')}</Text>
        <Text style={styles.cardDesc}>
          Điểm trung bình toàn hệ thống: <Text style={styles.avgHighlight}>{stats?.averageRating || 5.0} / 5.0 ★</Text>
        </Text>
        <View style={{ marginTop: spacing.sm, gap: 8 }}>
          {stats?.ratingDistribution.map(item => (
            <View key={item.stars} style={styles.ratingBarRow}>
              <Text style={styles.starText}>{item.stars} ★</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    styles.barFillGold,
                    { width: `${item.percentage}%` },
                  ]}
                />
              </View>
              <Text style={styles.ratingCountText}>
                {item.count} ({item.percentage}%)
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 3. Top 5 Most Loved Places */}
      <View style={[styles.card, shadows.card]}>
        <Text style={styles.cardTitle}>🏆 {t('statsTopServices')}</Text>
        <View style={{ marginTop: spacing.sm, gap: 8 }}>
          {stats?.topServices.map((srv, idx) => (
            <TouchableOpacity
              key={srv.id}
              style={styles.topPlaceRow}
              onPress={() => navigateToDetail(srv.id)}
            >
              <View
                style={[
                  styles.rankBadge,
                  idx === 0 && styles.rankBadgeFirst,
                  idx === 1 && styles.rankBadgeSecond,
                ]}
              >
                <Text
                  style={[
                    styles.rankText,
                    (idx === 0 || idx === 1) && styles.rankTextTop,
                  ]}
                >
                  #{idx + 1}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.topPlaceName} numberOfLines={1}>
                  {srv.name}
                </Text>
                <Text style={styles.topPlaceCat}>{srv.categoryName}</Text>
              </View>
              <View style={styles.topPlaceRating}>
                <Text style={styles.scoreText}>★ {srv.rating.toFixed(1)}</Text>
                <Text style={styles.reviewCountText}>({srv.reviewCount} đánh giá)</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
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
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  cardDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  avgHighlight: {
    fontWeight: '800',
    color: colors.primary,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barLabelName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  barLabelValue: {
    fontSize: 11,
    color: colors.textMuted,
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  barFillGold: {
    backgroundColor: colors.star,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    width: 28,
  },
  ratingCountText: {
    fontSize: 11,
    color: colors.textLight,
    width: 60,
    textAlign: 'right',
  },
  topPlaceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rankBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.cardMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadgeFirst: {
    backgroundColor: '#FEF3C7',
  },
  rankBadgeSecond: {
    backgroundColor: '#E8F5E9',
  },
  rankText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
  },
  rankTextTop: {
    color: colors.primaryDark,
  },
  topPlaceName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  topPlaceCat: {
    fontSize: 10,
    color: colors.textMuted,
  },
  topPlaceRating: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.star,
  },
  reviewCountText: {
    fontSize: 9,
    color: colors.textLight,
  },
});
