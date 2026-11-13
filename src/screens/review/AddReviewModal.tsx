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
  const { t, language } = useLanguage();
  const { currentUser, isGuest } = useAuth();
  const { addReview, navigate } = useTourism();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isGuest || currentUser?.role === 'guest') {
      Alert.alert(
        language === 'vi' ? 'Chế độ Khách (Giới hạn tính năng)' : 'Guest Mode (Limited Feature)',
        language === 'vi'
          ? 'Bạn đang duyệt ở chế độ Khách. Vui lòng đăng nhập hoặc đăng ký tài khoản để gửi đánh giá!'
          : 'You are browsing as a Guest. Please sign in or register an account to submit a review!',
        [
          { text: language === 'vi' ? 'Hủy' : 'Cancel', style: 'cancel' },
          {
            text: language === 'vi' ? 'Đăng nhập ngay' : 'Sign in now',
            onPress: () => {
              onClose();
              navigate('LOGIN');
            },
          },
        ]
      );
      return;
    }

    if (!comment.trim()) {
      Alert.alert(
        language === 'vi' ? 'Thông báo' : 'Notice',
        language === 'vi' ? 'Vui lòng nhập nội dung đánh giá của bạn' : 'Please enter your review content'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview({
        serviceId,
        serviceName,
        userId: currentUser?.id || 'USR_GUEST',
        userName: currentUser?.fullName || (language === 'vi' ? 'Khách Du Lịch' : 'Tourist Guest'),
        userAvatar:
          currentUser?.avatar ||
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        rating,
        comment: comment.trim(),
      });
      setComment('');
      setRating(5);
      Alert.alert(
        language === 'vi' ? 'Cảm ơn bạn!' : 'Thank you!',
        language === 'vi' ? 'Đánh giá của bạn đã được ghi nhận.' : 'Your review has been recorded.'
      );
      onSuccess();
    } catch (e) {
      Alert.alert(
        language === 'vi' ? 'Lỗi' : 'Error',
        language === 'vi' ? 'Không thể gửi đánh giá, vui lòng thử lại' : 'Could not submit review, please try again'
      );
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

          {/* Guest restriction warning notice */}
          {(isGuest || currentUser?.role === 'guest') && (
            <View style={{ backgroundColor: colors.warningLight, padding: 10, borderRadius: 3, marginBottom: 12, borderWidth: 1, borderColor: colors.warning }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.warning, marginBottom: 2 }}>
                {language === 'vi' ? '⚠️ TÀI KHOẢN KHÁCH BỊ GIỚI HẠN' : '⚠️ GUEST ACCOUNT RESTRICTED'}
              </Text>
              <Text style={{ fontSize: 11, color: colors.text, marginBottom: 8, lineHeight: 15 }}>
                {language === 'vi'
                  ? 'Bạn đang duyệt ở chế độ Khách. Vui lòng đăng nhập hoặc tạo tài khoản để gửi đánh giá điểm đến này.'
                  : 'You are browsing as Guest. Please sign in or create an account to review this destination.'}
              </Text>
              <TouchableOpacity
                style={{ backgroundColor: colors.text, paddingVertical: 6, borderRadius: 2, alignItems: 'center' }}
                onPress={() => {
                  onClose();
                  navigate('LOGIN');
                }}
              >
                <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700' }}>
                  {language === 'vi' ? 'ĐĂNG NHẬP NGAY →' : 'SIGN IN NOW →'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

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
              {rating === 5 && (language === 'vi' ? 'Tuyệt vời (5 sao)' : 'Excellent (5 stars)')}
              {rating === 4 && (language === 'vi' ? 'Rất tốt (4 sao)' : 'Very Good (4 stars)')}
              {rating === 3 && (language === 'vi' ? 'Bình thường (3 sao)' : 'Average (3 stars)')}
              {rating === 2 && (language === 'vi' ? 'Chưa hài lòng (2 sao)' : 'Poor (2 stars)')}
              {rating === 1 && (language === 'vi' ? 'Rất tệ (1 sao)' : 'Terrible (1 star)')}
            </Text>
          </View>

          {/* Comment Input */}
          <Text style={styles.commentLabel}>
            {language === 'vi' ? 'Nhận xét của bạn:' : 'Your review:'}
          </Text>
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
                {isSubmitting ? (language === 'vi' ? 'Đang gửi...' : 'Submitting...') : t('submitReview')}
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
