/**
 * Home Screen (Assigned to: Bình - Trang chủ & Danh sách dịch vụ)
 * Rich Dalat travel discovery hub with weather, featured spots, categories, and seasonal tips.
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useLanguage } from '../../context/LanguageContext';
import { useTourism } from '../../context/TourismContext';
import { useAuth } from '../../context/AuthContext';
import { ServiceCard } from '../../components/ServiceCard';
import { DragScrollView } from '../../components/DragScrollView';
import { RECOMMENDED_ROUTES } from '../../data/dalatData';
import { mysqlApiService } from '../../services/mysqlApiService';
import {
  fetchLiveDalatWeather,
  getRealisticFallbackDalatWeather,
  LiveDalatWeather,
} from '../../services/weatherService';

export const HomeScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const { currentUser, isGuest, isAdmin } = useAuth();
  const {
    services,
    categories,
    navigateToCategory,
    navigateToSearch,
    navigate,
    refreshData,
  } = useTourism();

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [weather, setWeather] = useState<LiveDalatWeather>(() =>
    getRealisticFallbackDalatWeather()
  );
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);

  const loadLiveWeather = async () => {
    setIsWeatherLoading(true);
    const liveData = await fetchLiveDalatWeather();
    setWeather(liveData);
    setIsWeatherLoading(false);
  };

  useEffect(() => {
    loadLiveWeather();
    const interval = setInterval(loadLiveWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSyncMockApi = async () => {
    setIsSyncing(true);
    await refreshData();
    const dbStatus = await mysqlApiService.getStatus();
    setIsSyncing(false);
    if (dbStatus && dbStatus.connected) {
      Alert.alert(
        '✅ Đã đồng bộ MySQL Database',
        `Kết nối CSDL: ${dbStatus.config.database} (${dbStatus.config.host}:${dbStatus.config.port})\n` +
          `• Điểm đến (services): ${dbStatus.tableCounts.services}\n` +
          `• Danh mục (categories): ${dbStatus.tableCounts.categories}\n` +
          `• Người dùng (users): ${dbStatus.tableCounts.users}\n` +
          `• Đánh giá (reviews): ${dbStatus.tableCounts.reviews}`
      );
    } else {
      Alert.alert(
        '✅ Đã đồng bộ dữ liệu',
        `Đã cập nhật dữ liệu thành công!\nHiện có ${services.length} điểm đến du lịch Đà Lạt đang hoạt động.`
      );
    }
  };

  const featuredScrollRef = React.useRef<any>(null);
  const [scrollOffset, setScrollOffset] = useState<number>(0);

  const scrollFeatured = (direction: 'left' | 'right') => {
    const delta = 250;
    const newOffset = direction === 'left' ? Math.max(0, scrollOffset - delta) : scrollOffset + delta;
    setScrollOffset(newOffset);
    featuredScrollRef.current?.scrollTo({ x: newOffset, animated: true });
  };

  const featuredServices = React.useMemo(() => {
    const base =
      services.filter(s => s.isFeatured).length >= 4
        ? services.filter(s => s.isFeatured)
        : services.slice(0, 12);
    const copy = [...base];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }, [services]);

  const topRatedServices = React.useMemo(() => {
    const highRated = services.filter(s => (s.rating || 0) >= 4.7);
    const pool = highRated.length >= 6 ? highRated : services;
    const copy = [...pool];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy.slice(0, 6);
  }, [services]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Header Greeting & Search Shortcut */}
      <View style={styles.heroSection}>
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingTitle}>
              {currentUser
                ? isGuest
                  ? (language === 'vi' ? 'Kính chào, Khách' : 'Welcome, Guest')
                  : `${language === 'vi' ? 'Kính chào' : 'Welcome'}, ${currentUser.fullName}`
                : t('homeGreeting')}
            </Text>
            <Text style={styles.greetingSubtitle}>{t('appSlogan')}</Text>
          </View>
          <View style={styles.memberTag}>
            <Text style={styles.memberTagText}>Modern Editorial</Text>
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

      {/* 2. Dalat Live Local Weather & Highland Microclimate Widget */}
      <TouchableOpacity
        style={[styles.weatherCard, shadows.card]}
        onPress={loadLiveWeather}
        activeOpacity={0.92}
      >
        <View style={styles.weatherLocationBar}>
          <Text style={styles.weatherLocationText}>
            📍 {language === 'vi' ? 'TP. Đà Lạt • Độ cao 1.500m' : 'Da Lat City • 1,500m Alt'}
          </Text>
          <Text style={styles.weatherUpdateText}>
            {isWeatherLoading
              ? language === 'vi'
                ? 'Đang cập nhật...'
                : 'Updating...'
              : `${weather.isLiveApi ? (language === 'vi' ? '🟢 Trực tiếp' : '🟢 Live') : (language === 'vi' ? '🕒 Địa phương' : '🕒 Local')} ${weather.updatedAtText} ↻`}
          </Text>
        </View>

        <View style={styles.weatherTopRow}>
          <View style={styles.weatherLeft}>
            <Text style={styles.weatherIcon}>{weather.icon}</Text>
            <View>
              <View style={styles.weatherTempRow}>
                <Text style={styles.weatherTemp}>{weather.temp}°C</Text>
                <Text style={styles.weatherMinMax}>
                  {weather.tempMin}° / {weather.tempMax}°C
                </Text>
              </View>
              <Text style={styles.weatherCondition}>
                {language === 'vi' ? weather.conditionVi : weather.conditionEn}
              </Text>
              <Text style={styles.weatherFeelsLike}>
                {language === 'vi'
                  ? `Cảm giác thực tế: ${weather.feelsLike}°C`
                  : `Feels like: ${weather.feelsLike}°C`}
              </Text>
            </View>
          </View>
          <View style={styles.weatherBadge}>
            <Text style={styles.weatherBadgeText}>
              {language === 'vi' ? weather.seasonVi : weather.seasonEn}
            </Text>
          </View>
        </View>

        {/* Detailed Local Meteorological Metrics */}
        <View style={styles.weatherMetricsRow}>
          <View style={styles.weatherMetricItem}>
            <Text style={styles.weatherMetricLabel}>
              💧 {language === 'vi' ? 'Độ ẩm' : 'Humidity'}
            </Text>
            <Text style={styles.weatherMetricValue}>{weather.humidity}%</Text>
          </View>
          <View style={styles.weatherMetricDivider} />
          <View style={styles.weatherMetricItem}>
            <Text style={styles.weatherMetricLabel}>
              🌬️ {language === 'vi' ? 'Gió thông' : 'Wind'}
            </Text>
            <Text style={styles.weatherMetricValue}>{weather.windSpeedKmh} km/h</Text>
          </View>
          <View style={styles.weatherMetricDivider} />
          <View style={styles.weatherMetricItem}>
            <Text style={styles.weatherMetricLabel}>
              ☔ {language === 'vi' ? 'Khả năng mưa' : 'Rain'}
            </Text>
            <Text style={styles.weatherMetricValue}>{weather.rainProbability}%</Text>
          </View>
          <View style={styles.weatherMetricDivider} />
          <View style={styles.weatherMetricItem}>
            <Text style={styles.weatherMetricLabel}>☀️ UV</Text>
            <Text style={styles.weatherMetricValue}>{weather.uvIndex}</Text>
          </View>
        </View>

        <Text style={styles.weatherTip}>
          💡 {language === 'vi' ? weather.travelTipVi : weather.travelTipEn}
        </Text>
      </TouchableOpacity>

      {/* Quick Interactive Action: AdMob Voucher (Hidden for Admin) */}
      {!isAdmin && (
        <View style={styles.interactiveWidgetRow}>
          <TouchableOpacity
            style={[styles.interactiveChip, styles.admobChip, shadows.subtle]}
            onPress={() => {
              Alert.alert(
                '🎁 Quảng cáo AdMob Có Thưởng',
                'Chạm vào banner [Khám phá ➔] ở chân màn hình để xem video AdMob 5s và nhận ngay Voucher du lịch 50.000đ!',
                [{ text: 'Đã hiểu' }]
              );
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.interactiveChipIcon}>🎁</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.interactiveChipTitle, { color: '#B45309' }]}>
                Voucher AdMob
              </Text>
              <Text style={styles.interactiveChipSubtitle}>
                Xem video nhận 50k
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* 3. Horizontal Categories Bar */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('popularCategories')}</Text>
        <TouchableOpacity onPress={() => navigate('SERVICE_LIST')}>
          <Text style={styles.viewAllText}>{t('viewAll')} →</Text>
        </TouchableOpacity>
      </View>

      <DragScrollView
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
            <Text style={styles.catCount}>
              {cat.count || 0} {language === 'vi' ? 'dịch vụ' : 'places'}
            </Text>
          </TouchableOpacity>
        ))}
      </DragScrollView>

      {/* 4. Featured Destinations (Horizontal Carousel) */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeftWithArrows}>
          <Text style={styles.sectionTitle}>{t('featuredDestinations')}</Text>
          <View style={styles.carouselNavRow}>
            <TouchableOpacity
              style={styles.carouselNavBtn}
              onPress={() => scrollFeatured('left')}
              activeOpacity={0.7}
            >
              <Text style={styles.carouselNavIcon}>◀</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.carouselNavBtn}
              onPress={() => scrollFeatured('right')}
              activeOpacity={0.7}
            >
              <Text style={styles.carouselNavIcon}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigate('SERVICE_LIST')}>
          <Text style={styles.viewAllText}>{t('viewAll')} →</Text>
        </TouchableOpacity>
      </View>

      <DragScrollView
        ref={featuredScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
        onScroll={e => setScrollOffset(e.nativeEvent.contentOffset.x)}
        scrollEventThrottle={16}
      >
        {featuredServices.map(srv => (
          <ServiceCard key={srv.id} service={srv} layout="horizontal" />
        ))}
      </DragScrollView>

      {/* 5. AI Chatbot Banner CTA (shortcut to Quang's Chatbot) */}
      <TouchableOpacity
        style={[styles.aiBanner, shadows.card]}
        onPress={() => navigate('CHATBOT')}
        activeOpacity={0.85}
      >
        <View style={styles.aiBannerLeft}>
          <Text style={styles.aiBannerTitle}>
            {language === 'vi' ? '✨ Trợ Lý Du Lịch Đà Lạt AI' : '✨ Dalat Travel AI Assistant'}
          </Text>
          <Text style={styles.aiBannerDesc}>
            {language === 'vi'
              ? 'Mô tả sở thích (săn mây, ngắm hoàng hôn, ăn lẩu) để nhận gợi ý tức thì!'
              : 'Describe your preferences (cloud hunting, sunset, hotpot) for instant tips!'}
          </Text>
          <View style={styles.aiActionRow}>
            <Text style={styles.aiActionBtn}>
              {language === 'vi' ? 'Trò chuyện ngay ➔' : 'Chat now ➔'}
            </Text>
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

      {/* 7. Dalat Curated Routes from Travel Handbook */}
      <View style={[styles.tipsCard, shadows.card]}>
        <Text style={styles.tipsTitle}>
          {language === 'vi' ? '🗺️ Gợi ý 3 cung đường khám phá tối ưu nhất' : '🗺️ 3 Recommended Travel Routes'}
        </Text>
        {RECOMMENDED_ROUTES.map(route => (
          <View key={route.id} style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: '700', fontSize: 13, color: colors.primaryDark }}>
              {route.name}
            </Text>
            <Text style={{ fontSize: 11, color: colors.textLight, marginTop: 2, marginBottom: 4 }}>
              📍 {language === 'vi' ? 'Điểm qua:' : 'Waypoints:'} {route.waypoints.join(' ➔ ')}
            </Text>
            {route.schedule.map((item, idx) => (
              <Text key={idx} style={{ fontSize: 11, color: colors.text, marginLeft: 6, lineHeight: 16 }}>
                {item}
              </Text>
            ))}
          </View>
        ))}
      </View>

      {/* 8. Dalat Experience Tips */}
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
  guestBanner: {
    backgroundColor: colors.warningLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.warning,
  },
  guestBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guestBannerIcon: {
    fontSize: 14,
    color: colors.warning,
    fontWeight: '700',
  },
  guestBannerTitle: {
    fontFamily: typography.fontSans,
    fontSize: 10,
    fontWeight: '800',
    color: colors.warning,
    letterSpacing: 0.5,
  },
  guestBannerSubtitle: {
    fontFamily: typography.fontSans,
    fontSize: 10,
    color: colors.text,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  greetingTitle: {
    fontFamily: typography.fontEditorial, // Times New Roman
    fontSize: 21,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
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
  weatherLocationBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  weatherLocationText: {
    fontFamily: typography.fontMono,
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  weatherUpdateText: {
    fontFamily: typography.fontMono,
    fontSize: 9,
    color: colors.textMuted,
  },
  weatherTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  weatherIcon: {
    fontSize: 32,
  },
  weatherTempRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  weatherTemp: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  weatherMinMax: {
    fontFamily: typography.fontMono,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  weatherCondition: {
    fontSize: 12,
    color: colors.primaryLight,
    fontWeight: '700',
  },
  weatherFeelsLike: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
  },
  weatherBadge: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: '44%',
  },
  weatherBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  weatherMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardMuted,
    borderRadius: borderRadius.md,
    paddingVertical: 7,
    paddingHorizontal: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  weatherMetricItem: {
    flex: 1,
    alignItems: 'center',
  },
  weatherMetricLabel: {
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 2,
  },
  weatherMetricValue: {
    fontFamily: typography.fontMono,
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  weatherMetricDivider: {
    width: 1,
    height: 22,
    backgroundColor: colors.border,
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
    fontFamily: typography.fontEditorial, // Times New Roman
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  headerLeftWithArrows: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  carouselNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  carouselNavBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselNavIcon: {
    fontSize: 9,
    color: '#334155',
    fontWeight: '800',
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
  interactiveWidgetRow: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  interactiveChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  admobChip: {
    backgroundColor: '#FFFDF0',
    borderColor: '#FDE68A',
  },
  interactiveChipIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  interactiveChipTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  interactiveChipSubtitle: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },
});
