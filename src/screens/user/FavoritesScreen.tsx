/**
 * Favorites Screen (Assigned to: Minh Anh - Đánh giá & tương tác người dùng)
 * Displays user's saved Dalat tourist destinations with quick remove and detail navigation.
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
import { borderRadius, spacing } from '../../theme/spacing';
import { useLanguage } from '../../context/LanguageContext';
import { useTourism } from '../../context/TourismContext';
import { ServiceCard } from '../../components/ServiceCard';

export const FavoritesScreen: React.FC = () => {
  const { t } = useLanguage();
  const { services, favorites, goBack, navigate } = useTourism();

  const favoriteServices = services.filter(s => favorites.includes(s.id));

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle}>{t('savedPlaces')}</Text>
          <Text style={styles.headerSubtitle}>
            {favoriteServices.length} địa điểm đã lưu • Phụ trách: Minh Anh
          </Text>
        </View>
      </View>

      <FlatList
        data={favoriteServices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ServiceCard service={item} layout="list" />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🤍</Text>
            <Text style={styles.emptyTitle}>Chưa có địa điểm yêu thích nào</Text>
            <Text style={styles.emptyDesc}>
              Nhấn vào biểu tượng trái tim khi xem các quán cà phê, homestay hoặc điểm du lịch để lưu lại danh sách này nhé!
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => navigate('SERVICE_LIST')}
            >
              <Text style={styles.exploreBtnText}>Khám phá dịch vụ Đà Lạt ➔</Text>
            </TouchableOpacity>
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  emptyDesc: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  exploreBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  exploreBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
