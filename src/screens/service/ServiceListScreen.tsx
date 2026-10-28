/**
 * Service List Screen (Assigned to: Bình - Trang chủ & Danh sách dịch vụ)
 * Category tabs, sorting, filtering, and rich list view of Dalat services.
 */

import React, { useState } from 'react';
import {
  FlatList,
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
import { ServiceCard } from '../../components/ServiceCard';
import { CategoryChip } from '../../components/CategoryChip';
import { FilterSortModal } from '../../components/FilterSortModal';

export const ServiceListScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    filteredServices,
    categories,
    filter,
    setFilter,
    navigateToSearch,
  } = useTourism();

  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectCategory = (catId: string) => {
    setFilter(prev => ({
      ...prev,
      categoryId: prev.categoryId === catId ? 'ALL' : catId,
    }));
  };

  const isFilterActive =
    (filter?.categoryId && filter.categoryId !== 'ALL') ||
    (filter?.district && filter.district !== 'ALL') ||
    (filter?.minRating && filter.minRating > 0) ||
    (filter?.sortBy && filter.sortBy !== 'popular');

  const safeList = Array.isArray(filteredServices) ? filteredServices : [];

  return (
    <View style={styles.container}>
      {/* Top Search & Filter Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigateToSearch()}
          activeOpacity={0.8}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder} numberOfLines={1}>
            {t('homeSearchPlaceholder')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterBtn, isFilterActive && styles.filterBtnActive]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterIcon, isFilterActive && styles.filterIconActive]}>
            ⚙
          </Text>
          {isFilterActive && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      {/* Horizontal Category Chips */}
      <View style={styles.chipsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          <CategoryChip
            label={t('allCategories')}
            icon="🌲"
            isSelected={!filter?.categoryId || filter.categoryId === 'ALL'}
            onPress={() => setFilter(prev => ({ ...prev, categoryId: 'ALL' }))}
          />
          {Array.isArray(categories) &&
            categories.map(cat => (
              <CategoryChip
                key={String(cat.id)}
                label={language === 'vi' ? cat.nameVi : cat.name}
                icon={cat.icon}
                count={cat.count}
                isSelected={filter?.categoryId === cat.id}
                onPress={() => handleSelectCategory(cat.id)}
              />
            ))}
        </ScrollView>
      </View>

      {/* Header Info: count & active sort */}
      <View style={styles.listHeaderRow}>
        <Text style={styles.resultsCount}>
          {safeList.length} {t('dalatScope')}
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.sortIndicator}>
            Sắp xếp: {filter?.sortBy || 'popular'} ▾
          </Text>
        </TouchableOpacity>
      </View>

      {/* Services List */}
      <FlatList
        data={safeList}
        keyExtractor={(item, index) => String(item?.id || index)}
        renderItem={({ item }) => <ServiceCard service={item} layout="list" />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🌲🔍</Text>
            <Text style={styles.emptyTitle}>{t('serviceNotFound')}</Text>
            <Text style={styles.emptyDesc}>
              Hãy thử thay đổi từ khóa tìm kiếm hoặc đặt lại các bộ lọc.
            </Text>
          </View>
        }
      />

      {/* Filter & Sort Modal */}
      <FilterSortModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    gap: 8,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    height: 42,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 6,
  },
  searchPlaceholder: {
    fontSize: 13,
    color: colors.textLight,
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterIcon: {
    fontSize: 16,
    color: colors.text,
  },
  filterIconActive: {
    color: '#FFF',
  },
  filterDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  chipsContainer: {
    paddingVertical: spacing.xs,
  },
  chipsScroll: {
    paddingHorizontal: spacing.md,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  sortIndicator: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
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
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  emptyDesc: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
});
