/**
 * Location & Map Screen (Assigned to: Minh Anh - Đánh giá & tương tác người dùng)
 * Displays tourist spots with distances from Dalat Market, coordinates, and navigation links.
 */

import React, { useState } from 'react';
import {
  FlatList,
  Linking,
  Platform,
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
import { TourismService } from '../../types';

export const LocationMapScreen: React.FC = () => {
  const { t } = useLanguage();
  const { services, goBack, navigateToDetail } = useTourism();

  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  const districts = ['ALL', 'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 11', 'Xuân Trường'];

  // Sort by nearest distance to Dalat Market
  const sortedServices = [...services]
    .filter(s => selectedDistrict === 'ALL' || s.district === selectedDistrict)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const handleOpenGoogleMaps = (srv: TourismService) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${srv.latitude},${srv.longitude}`;
    Linking.openURL(url).catch(() => {
      alert(`Tọa độ: ${srv.latitude}, ${srv.longitude} (${srv.name})`);
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle}>{t('mapTitle')}</Text>
          <Text style={styles.headerSubtitle}>
            Tọa độ & Khoảng cách • Phụ trách: Minh Anh
          </Text>
        </View>
      </View>

      {/* Dalat Center Reference Box */}
      <View style={[styles.centerBox, shadows.subtle]}>
        <View style={styles.centerIconWrap}>
          <Text style={{ fontSize: 22 }}>🎯</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.centerTitle}>Mốc trung tâm: Chợ Đà Lạt / Hồ Xuân Hương</Text>
          <Text style={styles.centerCoords}>Tọa độ GPS: 11.9405° B, 108.4382° Đ</Text>
          <Text style={styles.centerNote}>
            Tất cả khoảng cách bên dưới được tính chính xác từ tâm chợ Đà Lạt.
          </Text>
        </View>
      </View>

      {/* District filter bar */}
      <View style={styles.districtBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          {districts.map(d => {
            const active = selectedDistrict === d;
            return (
              <TouchableOpacity
                key={d}
                style={[styles.districtChip, active && styles.districtChipActive]}
                onPress={() => setSelectedDistrict(d)}
              >
                <Text style={[styles.districtText, active && styles.districtTextActive]}>
                  {d === 'ALL' ? 'Toàn Đà Lạt' : d}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Destinations List by proximity */}
      <FlatList
        data={sortedServices}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.locationCard, shadows.card]}
            onPress={() => navigateToDetail(item.id)}
            activeOpacity={0.85}
          >
            <View style={styles.cardTopRow}>
              <View style={styles.indexBadge}>
                <Text style={styles.indexText}>#{index + 1}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.placeName}>{item.name}</Text>
                <Text style={styles.categoryText}>{item.categoryName}</Text>
              </View>
              <View style={styles.distanceBox}>
                <Text style={styles.distanceKm}>{item.distanceKm} km</Text>
                <Text style={styles.distanceLabel}>từ trung tâm</Text>
              </View>
            </View>

            <View style={styles.addressRow}>
              <Text style={styles.addressText} numberOfLines={2}>
                📍 {item.address}
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.coordsText}>
                GPS: {item.latitude}, {item.longitude}
              </Text>

              <TouchableOpacity
                style={styles.navBtn}
                onPress={e => {
                  e.stopPropagation?.();
                  handleOpenGoogleMaps(item);
                }}
              >
                <Text style={styles.navBtnText}>🗺️ Chỉ đường</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
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
  centerBox: {
    backgroundColor: '#E8F5E9',
    margin: spacing.md,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    gap: 12,
  },
  centerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  centerCoords: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  centerNote: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  districtBar: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  districtChip: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  districtChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  districtText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  districtTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  locationCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indexText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  placeName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  categoryText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  distanceBox: {
    alignItems: 'flex-end',
  },
  distanceKm: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.secondary,
  },
  distanceLabel: {
    fontSize: 9,
    color: colors.textLight,
  },
  addressRow: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  addressText: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  coordsText: {
    fontSize: 10,
    color: colors.textLight,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  navBtn: {
    backgroundColor: colors.cardMuted,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
});
