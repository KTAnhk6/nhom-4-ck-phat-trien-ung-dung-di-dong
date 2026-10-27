/**
 * Service Detail Screen (Assigned to: Bình - Trang chủ & Danh sách dịch vụ)
 * Rich detail presentation of a Dalat tourism spot with photos, hours, prices, map & reviews.
 */

import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
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
import { RatingStars } from '../../components/RatingStars';
import { ServiceCard } from '../../components/ServiceCard';
import { Review } from '../../types';
import { tourismService } from '../../services/tourismService';

interface ServiceDetailScreenProps {
  serviceId?: string;
}

export const ServiceDetailScreen: React.FC<ServiceDetailScreenProps> = ({ serviceId }) => {
  const { t } = useLanguage();
  const {
    services,
    goBack,
    isFavorite,
    toggleFavorite,
    navigateToReviews,
    navigate,
    currentScreen,
  } = useTourism();

  const id = serviceId || currentScreen.serviceId;
  const service = services.find(s => s.id === id);
  const favorited = service ? isFavorite(service.id) : false;

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (id) {
      tourismService.getReviewsForService(id).then(setReviews);
    }
  }, [id]);

  if (!service) {
    return (
      <View style={styles.errorCenter}>
        <Text style={styles.errorTitle}>Không tìm thấy dịch vụ</Text>
        <TouchableOpacity style={styles.backBtnError} onPress={goBack}>
          <Text style={styles.backBtnErrorText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCall = () => {
    if (service.phone) {
      Linking.openURL(`tel:${service.phone}`).catch(() => {
        Alert.alert('Liên hệ', `Số điện thoại: ${service.phone}`);
      });
    }
  };

  const relatedServices = services
    .filter(s => s.categoryId === service.categoryId && s.id !== service.id)
    .slice(0, 3);

  const mainImage =
    service.images && service.images.length > 0
      ? service.images[0]
      : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image Section with Back & Favorite overlays */}
        <View style={styles.heroWrapper}>
          <Image source={{ uri: mainImage }} style={styles.heroImage} resizeMode="cover" />

          {/* Top Floating Buttons */}
          <View style={styles.heroTopActions}>
            <TouchableOpacity style={styles.circleBtn} onPress={goBack} activeOpacity={0.8}>
              <Text style={styles.circleIcon}>←</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.circleBtn, favorited && styles.circleBtnActive]}
              onPress={() => toggleFavorite(service.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.heartIcon, favorited && styles.heartIconActive]}>
                {favorited ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Container */}
        <View style={styles.contentCard}>
          {/* Category Pill & Distance */}
          <View style={styles.tagRow}>
            <Text style={styles.categoryPill}>
              {service.categoryName || 'Dịch vụ Đà Lạt'}
            </Text>
            <Text style={styles.distanceBadge}>
              📍 Cách Chợ Đà Lạt {service.distanceKm} km
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{service.name}</Text>

          {/* Rating & Reviews Jump */}
          <TouchableOpacity
            style={styles.ratingRow}
            onPress={() => navigateToReviews(service.id)}
            activeOpacity={0.7}
          >
            <RatingStars rating={service.rating} size={18} showScore />
            <Text style={styles.reviewCountLink}>
              • {service.reviewCount} {t('customerReviews')} →
            </Text>
          </TouchableOpacity>

          {/* Quick Info Grid (Price & Hours) */}
          <View style={styles.quickInfoBox}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>{t('priceRangeLabel')}</Text>
              <Text style={styles.priceHighlight}>{service.priceDisplay}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>{t('openingHoursLabel')}</Text>
              <Text style={styles.infoValue}>🕒 {service.openingHours}</Text>
            </View>
          </View>

          {/* Address & Call Button */}
          <View style={styles.addressBox}>
            <View style={styles.addressLeft}>
              <Text style={styles.addressTitle}>{t('addressLabel')}:</Text>
              <Text style={styles.addressText}>{service.address}</Text>
              <Text style={styles.districtText}>Khu vực: {service.district}</Text>
            </View>
            <TouchableOpacity style={styles.callBtn} onPress={handleCall} activeOpacity={0.8}>
              <Text style={styles.callIcon}>📞</Text>
              <Text style={styles.callText}>{t('callContact')}</Text>
            </TouchableOpacity>
          </View>

          {/* Location Map Shortcut (Minh Anh) */}
          <TouchableOpacity
            style={styles.mapShortcut}
            onPress={() => navigate('LOCATION_MAP')}
            activeOpacity={0.85}
          >
            <Text style={styles.mapShortcutIcon}>🗺️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.mapShortcutTitle}>Xem vị trí trên bản đồ Đà Lạt</Text>
              <Text style={styles.mapShortcutCoords}>
                Tọa độ: {service.latitude}, {service.longitude}
              </Text>
            </View>
            <Text style={styles.mapShortcutArrow}>➔</Text>
          </TouchableOpacity>

          {/* Description */}
          <Text style={styles.sectionHeading}>{t('aboutTab')}</Text>
          <Text style={styles.descriptionText}>{service.description}</Text>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {service.tags.map((tag, i) => (
              <View key={i} style={styles.tagBadge}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          {/* Reviews Preview (Minh Anh) */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionHeading}>{t('customerReviews')}</Text>
            <TouchableOpacity onPress={() => navigateToReviews(service.id)}>
              <Text style={styles.viewAllReviewsText}>{t('viewAll')} →</Text>
            </TouchableOpacity>
          </View>

          {reviews.length > 0 ? (
            <View style={styles.reviewCardPreview}>
              <View style={styles.reviewAuthorRow}>
                <Image
                  source={{ uri: reviews[0].userAvatar }}
                  style={styles.reviewAvatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewAuthorName}>{reviews[0].userName}</Text>
                  <RatingStars rating={reviews[0].rating} size={12} />
                </View>
              </View>
              <Text style={styles.reviewCommentPreview} numberOfLines={3}>
                "{reviews[0].comment}"
              </Text>
            </View>
          ) : (
            <Text style={styles.noReviewsText}>{t('noReviewsYet')}</Text>
          )}

          {/* Add Review Trigger */}
          <TouchableOpacity
            style={styles.writeReviewBtn}
            onPress={() => navigateToReviews(service.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.writeReviewText}>✍️ {t('writeReview')}</Text>
          </TouchableOpacity>

          {/* Related Destinations */}
          {relatedServices.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.sectionHeading}>{t('relatedPlaces')}</Text>
              {relatedServices.map(item => (
                <ServiceCard key={item.id} service={item} layout="list" />
              ))}
            </View>
          )}

          <View style={{ height: spacing.xxl }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  backBtnError: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  backBtnErrorText: {
    color: '#FFF',
    fontWeight: '700',
  },
  heroWrapper: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroTopActions: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.subtle,
  },
  circleBtnActive: {
    backgroundColor: '#FFF',
  },
  circleIcon: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '700',
  },
  heartIcon: {
    fontSize: 20,
    color: colors.textLight,
  },
  heartIconActive: {
    color: colors.secondary,
  },
  contentCard: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    padding: spacing.lg,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.xs,
  },
  categoryPill: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  distanceBadge: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginVertical: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: 6,
  },
  reviewCountLink: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  quickInfoBox: {
    flexDirection: 'row',
    backgroundColor: colors.cardMuted,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  infoCol: {
    flex: 1,
  },
  infoDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },
  priceHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.secondary,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  addressLeft: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  addressTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  addressText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    lineHeight: 16,
  },
  districtText: {
    fontSize: 11,
    color: colors.primaryLight,
    fontWeight: '600',
    marginTop: 2,
  },
  callBtn: {
    backgroundColor: colors.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  callIcon: {
    fontSize: 16,
  },
  callText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  mapShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    gap: 10,
  },
  mapShortcutIcon: {
    fontSize: 22,
  },
  mapShortcutTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  mapShortcutCoords: {
    fontSize: 11,
    color: colors.primaryLight,
    marginTop: 1,
  },
  mapShortcutArrow: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  descriptionText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.lg,
  },
  tagBadge: {
    backgroundColor: colors.cardMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 11,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  viewAllReviewsText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  reviewCardPreview: {
    backgroundColor: colors.cardMuted,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  reviewAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  reviewAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  reviewAuthorName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  reviewCommentPreview: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  noReviewsText: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  writeReviewBtn: {
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  writeReviewText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  relatedSection: {
    marginTop: spacing.md,
  },
});
