/**
 * Search Screen (Assigned to: Quang - Tìm kiếm, lọc, sắp xếp và chatbot)
 * Real-time search, search history tracking, trending keywords, and filter/sort.
 */

import React, { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { useLanguage } from '../../context/LanguageContext';
import { useTourism } from '../../context/TourismContext';
import { ServiceCard } from '../../components/ServiceCard';
import { FilterSortModal } from '../../components/FilterSortModal';
import { POPULAR_KEYWORDS } from '../../data/dalatData';

export const SearchScreen: React.FC = () => {
  const { t } = useLanguage();
  const {
    searchQuery,
    setSearchQuery,
    filteredServices,
    searchHistory,
    addSearchQuery,
    clearSearchHistory,
    filter,
  } = useTourism();

  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectHistory = (query: string) => {
    setSearchQuery(query);
    addSearchQuery(query);
  };

  const handleSubmitSearch = () => {
    if (searchQuery.trim()) {
      addSearchQuery(searchQuery.trim());
    }
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const isFilterActive =
    filter.categoryId !== 'ALL' ||
    filter.district !== 'ALL' ||
    filter.minRating > 0 ||
    filter.sortBy !== 'popular';

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchBarRow}>
        <View style={styles.inputWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder={t('homeSearchPlaceholder')}
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSubmitSearch}
            returnKeyType="search"
            autoFocus={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

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

      {/* When user hasn't typed anything, show Search History & Popular Keywords */}
      {searchQuery.trim().length === 0 ? (
        <ScrollView style={styles.suggestionsScroll} showsVerticalScrollIndicator={false}>
          {/* Member assignment badge */}
          <View style={styles.memberTag}>
            <Text style={styles.memberTagText}>Module: Quang (Tìm kiếm, Lọc, Sắp xếp)</Text>
          </View>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>🕒 {t('recentSearches')}</Text>
                <TouchableOpacity onPress={clearSearchHistory}>
                  <Text style={styles.clearHistoryText}>{t('clearHistory')}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.chipsWrap}>
                {searchHistory.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyChip}
                    onPress={() => handleSelectHistory(item.query)}
                  >
                    <Text style={styles.historyText}>{item.query}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Popular Keywords */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 {t('popularKeywords')}</Text>
            <View style={styles.chipsWrap}>
              {POPULAR_KEYWORDS.map((keyword, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.keywordChip}
                  onPress={() => handleSelectHistory(keyword)}
                >
                  <Text style={styles.keywordText}>{keyword}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Dalat Scope Note */}
          <View style={styles.scopeBox}>
            <Text style={styles.scopeTitle}>🌲 Tra cứu toàn diện dịch vụ Đà Lạt</Text>
            <Text style={styles.scopeDesc}>
              Tìm kiếm nhanh quán cà phê hoàng hôn, điểm săn mây, homestay view thung lũng hoặc các món ngon đặc sản.
            </Text>
          </View>
        </ScrollView>
      ) : (
        /* Results List */
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              Tìm thấy {filteredServices.length} kết quả cho "{searchQuery}"
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.sortLink}>{t('sortBy')} ▾</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredServices}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <ServiceCard service={item} layout="list" />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyResults}>
                <Text style={styles.emptyEmoji}>🍃</Text>
                <Text style={styles.emptyTitle}>Không tìm thấy kết quả phù hợp</Text>
                <Text style={styles.emptyDesc}>
                  Thử tìm kiếm với các từ khóa ngắn gọn hơn như: Túi Mơ To, Săn mây, Lẩu gà, Cà phê...
                </Text>
              </View>
            }
          />
        </View>
      )}

      {/* Filter & Sort Modal */}
      <FilterSortModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBarRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    gap: 8,
    alignItems: 'center',
  },
  inputWrap: {
    flex: 1,
    height: 44,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  clearBtn: {
    padding: 4,
  },
  clearIcon: {
    fontSize: 14,
    color: colors.textLight,
  },
  filterBtn: {
    width: 44,
    height: 44,
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
  suggestionsScroll: {
    padding: spacing.md,
  },
  memberTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  memberTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  clearHistoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  historyChip: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  keywordChip: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  keywordText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  scopeBox: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginTop: spacing.md,
  },
  scopeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  scopeDesc: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  sortLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  emptyResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 44,
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
});
