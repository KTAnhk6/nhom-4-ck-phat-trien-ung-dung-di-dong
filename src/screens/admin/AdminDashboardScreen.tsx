/**
 * Admin Dashboard Screen (Assigned to: Việt - Admin)
 * System overview metrics, navigation hub for all administrative operations.
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
import { useAuth } from '../../context/AuthContext';
import { AdminStatsSummary, statsService } from '../../services/statsService';

export const AdminDashboardScreen: React.FC = () => {
  const { t } = useLanguage();
  const { navigate, goBack } = useTourism();
  const { currentUser } = useAuth();

  const [stats, setStats] = useState<AdminStatsSummary | null>(null);

  useEffect(() => {
    statsService.getDashboardSummary().then(setStats);
  }, []);

  const adminModules = [
    {
      id: 'ADMIN_SERVICES',
      title: t('manageServices'),
      desc: 'Thêm, sửa, xóa các điểm đến, cà phê, homestay',
      icon: '🌲',
      color: colors.primary,
      count: stats?.totalServices || 0,
    },
    {
      id: 'ADMIN_CATEGORIES',
      title: t('manageCategories'),
      desc: 'Quản lý 5 danh mục chính và kiểm tra ràng buộc',
      icon: '📁',
      color: colors.accent,
      count: stats?.totalCategories || 0,
    },
    {
      id: 'ADMIN_USERS',
      title: t('manageUsers'),
      desc: 'Danh sách thành viên, khóa/mở khóa tài khoản',
      icon: '👥',
      color: '#3B82F6',
      count: stats?.totalUsers || 0,
    },
    {
      id: 'ADMIN_REVIEWS',
      title: t('manageReviews'),
      desc: 'Kiểm duyệt nhận xét, ẩn/xóa đánh giá vi phạm',
      icon: '⭐',
      color: colors.star,
      count: stats?.totalReviews || 0,
    },
    {
      id: 'ADMIN_STATS',
      title: t('adminStatistics'),
      desc: 'Biểu đồ phân bố danh mục, đánh giá, top dịch vụ',
      icon: '📊',
      color: colors.secondary,
      count: `${stats?.averageRating || 5.0} ★`,
    },
    {
      id: 'ADMIN_NOTIFICATIONS',
      title: t('broadcastNotification'),
      desc: 'Phát sóng tin tức lễ hội, ưu đãi tới du khách',
      icon: '📢',
      color: '#8B5CF6',
      count: 'Broadcast',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Admin Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle}>{t('adminDashboard')}</Text>
          <Text style={styles.headerSubtitle}>
            Xin chào {currentUser?.fullName || 'Admin'} • Phụ trách: Việt
          </Text>
        </View>
        <View style={styles.adminTag}>
          <Text style={styles.adminTagText}>ADMIN PORTAL</Text>
        </View>
      </View>

      {/* Overview Stat Cards Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, shadows.subtle]}>
          <Text style={styles.statNumber}>{stats?.totalServices || 0}</Text>
          <Text style={styles.statLabel}>Dịch vụ</Text>
        </View>
        <View style={[styles.statBox, shadows.subtle]}>
          <Text style={styles.statNumber}>{stats?.totalUsers || 0}</Text>
          <Text style={styles.statLabel}>Người dùng</Text>
        </View>
        <View style={[styles.statBox, shadows.subtle]}>
          <Text style={styles.statNumber}>{stats?.totalReviews || 0}</Text>
          <Text style={styles.statLabel}>Đánh giá</Text>
        </View>
        <View style={[styles.statBox, shadows.subtle]}>
          <Text style={[styles.statNumber, { color: colors.star }]}>
            {stats?.averageRating || 5.0}★
          </Text>
          <Text style={styles.statLabel}>Điểm TB</Text>
        </View>
      </View>

      {/* Admin Management Grid */}
      <Text style={styles.sectionTitle}>Các chức năng quản lý hệ thống</Text>
      <View style={styles.grid}>
        {adminModules.map(mod => (
          <TouchableOpacity
            key={mod.id}
            style={[styles.gridCard, shadows.card]}
            onPress={() => navigate(mod.id as any)}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconCircle, { backgroundColor: `${mod.color}15` }]}>
                <Text style={styles.cardIcon}>{mod.icon}</Text>
              </View>
              <Text style={[styles.badgeCount, { color: mod.color }]}>
                {mod.count}
              </Text>
            </View>

            <Text style={styles.cardTitle}>{mod.title}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>
              {mod.desc}
            </Text>
            <Text style={[styles.cardLink, { color: mod.color }]}>Truy cập ➔</Text>
          </TouchableOpacity>
        ))}
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
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
  },
  adminTag: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  adminTagText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.lg,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  grid: {
    gap: 10,
  },
  gridCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 20,
  },
  badgeCount: {
    fontSize: 12,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  cardDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginVertical: 4,
    lineHeight: 16,
  },
  cardLink: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
});
