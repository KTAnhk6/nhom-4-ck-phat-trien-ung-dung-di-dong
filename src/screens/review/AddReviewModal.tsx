/**
 * Add Review Modal (Assigned to: Minh Anh - Đánh giá & tương tác người dùng)
 * Interactive star selection, comment input, and review submission.
 */

import React, { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTourism } from '../../context/TourismContext';
import { RatingStars } from '../../components/RatingStars';

interface AddReviewModalProps {
  visible: boolean;
  serviceId: string;
  serviceName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  visible,
  serviceId,
  serviceName,
  onClose,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { addReview } = useTourism();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung đánh giá của bạn');
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview({
        serviceId,
        serviceName,
        userId: currentUser?.id || 'USR_GUEST',
        userName: currentUser?.fullName || 'Khách Du Lịch',
        userAvatar:
          currentUser?.avatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        rating,
        comment: comment.trim(),
      });
      setComment('');
      setRating(5);
      Alert.alert('Cảm ơn bạn!', 'Đánh giá của bạn đã được ghi nhận.');
      onSuccess();
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể gửi đánh giá, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalCard, shadows.floating]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('writeReview')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.serviceNameText}>{serviceName}</Text>

          {/* Star Rating Picker */}
          <View style={styles.starSection}>
            <Text style={styles.starLabel}>{t('ratingLabel')}:</Text>
            <RatingStars
              rating={rating}
              size={32}
              interactive
              onRatingChange={setRating}
            />
            <Text style={styles.starScoreHint}>
              {rating === 5 && 'Tuyệt vời (5 sao)'}
              {rating === 4 && 'Rất tốt (4 sao)'}
              {rating === 3 && 'Bình thường (3 sao)'}
              {rating === 2 && 'Chưa hài lòng (2 sao)'}
              {rating === 1 && 'Rất tệ (1 sao)'}
            </Text>
          </View>

          {/* Comment Input */}
          <Text style={styles.commentLabel}>Nhận xét của bạn:</Text>
          <TextInput
            style={styles.commentInput}
            placeholder={t('yourComment')}
            placeholderTextColor={colors.textLight}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Action Buttons */}
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitText}>
                {isSubmitting ? 'Đang gửi...' : t('submitReview')}
              </Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    padding: spacing.md,
  },
  modalCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
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
  serviceNameText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  starSection: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.cardMuted,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  starLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 6,
  },
  starScoreHint: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.star,
    marginTop: 6,
  },
  commentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  commentInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    height: 100,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 13,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  btnRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.cardMuted,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
  },
  submitBtn: {
    flex: 2,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
});
