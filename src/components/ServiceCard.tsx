/**
 * Service Card Component
 * Displays Dalat tourist services with photos, price, rating, and bookmark action.
 */

import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TourismService } from '../types';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { useTourism } from '../context/TourismContext';

interface ServiceCardProps {
  service: TourismService;
  layout?: 'grid' | 'horizontal' | 'list';
  onPress?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  layout = 'list',
  onPress,
}) => {
  if (!service) return null;

  const { navigateToDetail, isFavorite, toggleFavorite } = useTourism();
  const serviceId = String(service.id || '');
  const favorited = isFavorite(serviceId);

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    } else {
      navigateToDetail(serviceId);
    }
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation?.();
    toggleFavorite(serviceId);
  };

  const ratingVal =
    typeof service.rating === 'number'
      ? service.rating
      : parseFloat(service.rating as any) || 5.0;

  const imageUrl =
    Array.isArray(service.images) && service.images.length > 0
      ? service.images[0]
      : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';

  if (layout === 'horizontal') {
    return (
      <TouchableOpacity
        style={[styles.hCard, shadows.card]}
        onPress={handleCardPress}
        activeOpacity={0.85}
      >
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUrl }} style={styles.hImage} resizeMode="cover" />
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingText}>{ratingVal.toFixed(1)}</Text>
          </View>
          <TouchableOpacity
            style={styles.favBtn}
            onPress={handleFavoritePress}
            activeOpacity={0.7}
          >
            <Text style={[styles.favHeart, favorited && styles.favHeartActive]}>
              {favorited ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hContent}>
          <Text style={styles.categoryPill} numberOfLines={1}>
            {service.categoryName || 'Dịch vụ Đà Lạt'}
          </Text>
          <Text style={styles.hName} numberOfLines={1}>
            {service.name || 'Điểm đến Đà Lạt'}
          </Text>
          <Text style={styles.locationText} numberOfLines={1}>
            📍 {service.district || 'Đà Lạt'} • {service.distanceKm || 2.5} km
          </Text>
          <Text style={styles.priceText} numberOfLines={1}>
            {service.priceDisplay || 'Đang cập nhật'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.listCard, shadows.card]}
      onPress={handleCardPress}
      activeOpacity={0.85}
    >
      <View style={styles.listImageWrapper}>
        <Image source={{ uri: imageUrl }} style={styles.listImage} resizeMode="cover" />
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingStar}>★</Text>
          <Text style={styles.ratingText}>{ratingVal.toFixed(1)}</Text>
        </View>
      </View>

      <View style={styles.listContent}>
        <View style={styles.topRow}>
          <Text style={styles.categoryPill} numberOfLines={1}>
            {service.categoryName || 'Dịch vụ'}
          </Text>
          <TouchableOpacity
            style={styles.favBtnSmall}
            onPress={handleFavoritePress}
            activeOpacity={0.7}
          >
            <Text style={[styles.favHeart, favorited && styles.favHeartActive]}>
              {favorited ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.listName} numberOfLines={2}>
          {service.name || 'Điểm đến Đà Lạt'}
        </Text>

        <Text style={styles.locationText} numberOfLines={1}>
          📍 {service.district || 'Đà Lạt'} • {service.distanceKm || 2.5} km
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.priceText} numberOfLines={1}>
            {service.priceDisplay || 'Đang cập nhật'}
          </Text>
          <Text style={styles.reviewCountText}>
            ({service.reviewCount || 0} đánh giá)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Horizontal Carousel Layout
  hCard: {
    width: 230,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  imageWrapper: {
    width: '100%',
    height: 130,
    position: 'relative',
  },
  hImage: {
    width: '100%',
    height: '100%',
  },
  hContent: {
    padding: spacing.sm + 2,
  },
  hName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 2,
  },

  // List Card Layout
  listCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  listImageWrapper: {
    width: 110,
    height: 110,
    position: 'relative',
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  listContent: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },

  // Shared details
  categoryPill: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  ratingBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },
  ratingStar: {
    color: colors.star,
    fontSize: 11,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  favBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favBtnSmall: {
    padding: 2,
  },
  favHeart: {
    fontSize: 18,
    color: colors.textLight,
  },
  favHeartActive: {
    color: colors.secondary,
  },
  locationText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.secondary,
    flex: 1,
  },
  reviewCountText: {
    fontSize: 10,
    color: colors.textLight,
  },
});
