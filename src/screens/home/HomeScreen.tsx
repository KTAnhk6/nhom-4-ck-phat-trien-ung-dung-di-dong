/**
 * Home Screen (Assigned to: Bình - Trang chủ & Danh sách dịch vụ)
 * Rich Dalat travel discovery hub with weather, featured spots, categories, and seasonal tips.
 */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { useLanguage } from '../../context/LanguageContext';
import { useTourism } from '../../context/TourismContext';
import { ServiceCard } from '../../components/ServiceCard';
import { DALAT_WEATHER } from '../../data/dalatData';

export const HomeScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    services,
    categories,
    navigateToCategory,
    navigateToSearch,
    navigate,
  } = useTourism();

  const featuredServices = services.filter(s => s.isFeatured);
  const topRatedServices = [...services].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Header Greeting & Search Shortcut */}
      <View style={styles.heroSection}>
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingTitle}>{t('homeGreeting')}</Text>
            <Text style={styles.greetingSubtitle}>{t('appSlogan')}</Text>
          </View>
          <View style={styles.memberTag}>
            <Text style={styles.memberTagText}>Module: Bình</Text>
          </View>
        </View>

        {/* Fake Search Input (Tapping navigates to SearchScreen) */}
        <TouchableOpacity
          style={[styles.searchBar, shadows.card]}
          onPress={() => navigateToSearch()}
          activeOpacity={0.9}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder} numberOfLines={1}>
            {t('homeSearchPlaceholder')}
          </Text>
          <View style={styles.filterBtnIcon}>
            <Text style={{ fontSize: 13, color: '#FFF' }}>⚙</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 2. Dalat Weather & Highland Mist Widget */}
      <View style={[styles.weatherCard, shadows.card]}>
        <View style={styles.weatherTopRow}>
          <View style={styles.weatherLeft}>
            <Text style={styles.weatherIcon}>{DALAT_WEATHER.icon}</Text>
            <View>
              <Text style={styles.weatherTemp}>{DALAT_WEATHER.temp}°C</Text>
              <Text style={styles.weatherCondition}>
                {language === 'vi' ? DALAT_WEATHER.conditionVi : DALAT_WEATHER.conditionEn}
              </Text>
            </View>
          </View>
          <View style={styles.weatherBadge}>
            <Text style={styles.weatherBadgeText}>
              {language === 'vi' ? DALAT_WEATHER.seasonVi : DALAT_WEATHER.seasonEn}
            </Text>
          </View>
        </View>
        <Text style={styles.weatherTip}>
          💡 {language === 'vi' ? DALAT_WEATHER.travelTipVi : DALAT_WEATHER.travelTipEn}
        </Text>
      </View>

      {/* 3. Horizontal Categories Bar */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('popularCategories')}</Text>
        <TouchableOpacity onPress={() => navigate('SERVICE_LIST')}>
          <Text style={styles.viewAllText}>{t('viewAll')} →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catScroll}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.catCard, shadows.subtle]}
            onPress={() => navigateToCategory(cat.id)}
            activeOpacity={0.8}
          >
            <View style={styles.catIconWrap}>
              <Text style={styles.catIcon}>{cat.icon}</Text>
            </View>
            <Text style={styles.catName} numberOfLines={2}>
              {language === 'vi' ? cat.nameVi : cat.name}
            </Text>
            <Text style={styles.catCount}>{cat.count || 0} dịch vụ</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 4. Featured Destinations (Horizontal Carousel) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('featuredDestinations')}</Text>
        <TouchableOpacity onPress={() => navigate('SERVICE_LIST')}>
          <Text style={styles.viewAllText}>{t('viewAll')} →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {featuredServices.map(srv => (
          <ServiceCard key={srv.id} service={srv} layout="horizontal" />
        ))}
      </ScrollView>

      {/* 5. AI Chatbot Banner CTA (shortcut to Quang's Chatbot) */}
      <TouchableOpacity
        style={[styles.aiBanner, shadows.card]}
        onPress={() => navigate('CHATBOT')}
        activeOpacity={0.85}
      >
        <View style={styles.aiBannerLeft}>
          <Text style={styles.aiBannerTitle}>✨ Trợ Lý Du Lịch Đà Lạt AI</Text>
          <Text style={styles.aiBannerDesc}>
            Mô tả sở thích (săn mây, ngắm hoàng hôn, ăn lẩu) để nhận gợi ý tức thì!
          </Text>
          <View style={styles.aiActionRow}>
            <Text style={styles.aiActionBtn}>Trò chuyện ngay ➔</Text>
          </View>
        </View>
        <Text style={styles.aiBannerEmoji}>🤖🌲</Text>
      </TouchableOpacity>

      {/* 6. Top Rated Destinations (List View) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('topRatedPlaces')}</Text>
        <TouchableOpacity onPress={() => navigate('SERVICE_LIST')}>
          <Text style={styles.viewAllText}>{t('viewAll')} →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {topRatedServices.map(srv => (
          <ServiceCard key={srv.id} service={srv} layout="list" />
        ))}
      </View>

      {/* 7. Dalat Experience Tips */}
      <View style={[styles.tipsCard, shadows.card]}>
        <Text style={styles.tipsTitle}>💡 {t('dalatExperienceTips')}</Text>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>{t('tip1')}</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>{t('tip2')}</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>{t('tip3')}</Text>
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
  },
  heroSection: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
  },
  greetingSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  memberTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  memberTagText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 46,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: colors.textLight,
  },
  filterBtnIcon: {
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: -16,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  weatherTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  weatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weatherIcon: {
    fontSize: 28,
  },
  weatherTemp: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  weatherCondition: {
    fontSize: 11,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  weatherBadge: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  weatherBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  weatherTip: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  catScroll: {
    paddingHorizontal: spacing.md,
    gap: 10,
    paddingBottom: 4,
  },
  catCard: {
    width: 96,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  catIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  catIcon: {
    fontSize: 22,
  },
  catName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    minHeight: 28,
  },
  catCount: {
    fontSize: 9,
    color: colors.textLight,
    marginTop: 2,
  },
  horizontalScroll: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  aiBanner: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    backgroundColor: '#0F2F26',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiBannerLeft: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  aiBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
  },
  aiBannerDesc: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 3,
    lineHeight: 16,
  },
  aiActionRow: {
    marginTop: 6,
  },
  aiActionBtn: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.accentGold,
  },
  aiBannerEmoji: {
    fontSize: 32,
  },
  listContainer: {
    paddingHorizontal: spacing.md,
  },
  tipsCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  tipBullet: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 6,
    lineHeight: 18,
  },
  tipText: {
    flex: 1,
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
  },
});
