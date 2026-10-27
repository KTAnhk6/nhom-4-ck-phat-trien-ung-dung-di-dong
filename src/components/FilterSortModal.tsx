/**
 * Filter & Sort Modal Component (Assigned to: Quang)
 * Allows filtering by Category, Rating, District, Price, and Ordering.
 */

import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FilterOptions, SortOption } from '../types';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { useLanguage } from '../context/LanguageContext';
import { useTourism } from '../context/TourismContext';

interface FilterSortModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FilterSortModal: React.FC<FilterSortModalProps> = ({ visible, onClose }) => {
  const { t } = useLanguage();
  const { filter, setFilter, resetFilter, categories } = useTourism();

  // Temporary local state until "Apply" is tapped
  const [tempFilter, setTempFilter] = useState<FilterOptions>(filter);

  const sortOptions: { key: SortOption; labelKey: any }[] = [
    { key: 'popular', labelKey: 'sortPopular' },
    { key: 'rating_desc', labelKey: 'sortRatingDesc' },
    { key: 'distance_asc', labelKey: 'sortDistanceAsc' },
    { key: 'price_asc', labelKey: 'sortPriceAsc' },
    { key: 'price_desc', labelKey: 'sortPriceDesc' },
    { key: 'name_asc', labelKey: 'sortNameAsc' },
  ];

  const ratingOptions = [0, 4.5, 4.0, 3.5];

  const districtOptions = [
    'ALL',
    'Phường 1',
    'Phường 2',
    'Phường 3',
    'Phường 4',
    'Phường 5',
    'Phường 9',
    'Phường 11',
    'Xuân Trường',
  ];

  const handleApply = () => {
    setFilter(tempFilter);
    onClose();
  };

  const handleReset = () => {
    resetFilter();
    setTempFilter({
      categoryId: 'ALL',
      minPrice: 0,
      maxPrice: 0,
      minRating: 0,
      district: 'ALL',
      sortBy: 'popular',
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('filterAndSort')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            {/* 1. Sort Options */}
            <Text style={styles.sectionTitle}>{t('sortBy')}</Text>
            <View style={styles.chipGrid}>
              {sortOptions.map(opt => {
                const active = tempFilter.sortBy === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                    onPress={() => setTempFilter(p => ({ ...p, sortBy: opt.key }))}
                  >
                    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                      {t(opt.labelKey)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 2. Category Filter */}
            <Text style={styles.sectionTitle}>{t('popularCategories')}</Text>
            <View style={styles.chipGrid}>
              <TouchableOpacity
                style={[styles.filterChip, tempFilter.categoryId === 'ALL' && styles.filterChipActive]}
                onPress={() => setTempFilter(p => ({ ...p, categoryId: 'ALL' }))}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    tempFilter.categoryId === 'ALL' && styles.filterChipTextActive,
                  ]}
                >
                  {t('allCategories')}
                </Text>
              </TouchableOpacity>
              {categories.map(cat => {
                const active = tempFilter.categoryId === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                    onPress={() => setTempFilter(p => ({ ...p, categoryId: cat.id }))}
                  >
                    <Text
                      style={[styles.filterChipText, active && styles.filterChipTextActive]}
                    >
                      {cat.icon} {cat.nameVi}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 3. Rating Filter */}
            <Text style={styles.sectionTitle}>{t('minRatingFilter')}</Text>
            <View style={styles.chipGrid}>
              {ratingOptions.map(r => {
                const active = tempFilter.minRating === r;
                return (
                  <TouchableOpacity
                    key={r}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                    onPress={() => setTempFilter(p => ({ ...p, minRating: r }))}
                  >
                    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                      {r === 0 ? t('minRatingAny') : `★ ${r} trở lên`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 4. District / Ward Filter */}
            <Text style={styles.sectionTitle}>{t('districtFilter')}</Text>
            <View style={styles.chipGrid}>
              {districtOptions.map(d => {
                const active = tempFilter.district === d;
                return (
                  <TouchableOpacity
                    key={d}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                    onPress={() => setTempFilter(p => ({ ...p, district: d }))}
                  >
                    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                      {d === 'ALL' ? t('allDistricts') : d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetText}>{t('reset')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyText}>{t('apply')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '82%',
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cardMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 14,
    color: colors.textMuted,
  },
  scrollArea: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: colors.cardMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  filterChipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  resetBtn: {
    flex: 1,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardMuted,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
  },
  applyBtn: {
    flex: 2,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
});
