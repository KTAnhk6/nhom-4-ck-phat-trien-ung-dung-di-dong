/**
 * Manage Notifications Screen (Assigned to: Việt - Admin)
 * Broadcast notifications and promotional announcements to all tourists.
 */

import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { useLanguage } from '../../context/LanguageContext';
import { useTourism } from '../../context/TourismContext';
import { NotificationType } from '../../types';

export const ManageNotificationsScreen: React.FC = () => {
  const { t } = useLanguage();
  const { notifications, broadcastNotification, services, goBack } = useTourism();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('event');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');

  const types: { key: NotificationType; label: string; icon: string }[] = [
    { key: 'event', label: 'Lễ hội / Sự kiện', icon: '🌸' },
    { key: 'promo', label: 'Ưu đãi & Khuyến mãi', icon: '🎁' },
    { key: 'suggestion', label: 'Gợi ý du lịch', icon: '💡' },
    { key: 'system', label: 'Hệ thống', icon: '🔔' },
  ];

  const handleBroadcast = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề và nội dung thông báo');
      return;
    }

    await broadcastNotification({
      title: title.trim(),
      titleVi: title.trim(),
      message: message.trim(),
      messageVi: message.trim(),
      type,
      linkServiceId: selectedServiceId || undefined,
    });

    setTitle('');
    setMessage('');
    setSelectedServiceId('');
    Alert.alert('Thành công', 'Đã phát sóng thông báo đến tất cả du khách!');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.headerTitle}>{t('broadcastNotification')}</Text>
          <Text style={styles.headerSubtitle}>
            Phát sóng tin tức & ưu đãi • Phụ trách: Việt
          </Text>
        </View>
      </View>

      {/* Broadcast Form Card */}
      <View style={[styles.card, shadows.card]}>
        <Text style={styles.cardHeading}>📢 Soạn thông báo mới</Text>

        <Text style={styles.label}>Loại thông báo</Text>
        <View style={styles.typeRow}>
          {types.map(item => (
            <TouchableOpacity
              key={item.key}
              style={[styles.typeChip, type === item.key && styles.typeChipActive]}
              onPress={() => setType(item.key)}
            >
              <Text style={{ fontSize: 13 }}>{item.icon}</Text>
              <Text
                style={[
                  styles.typeChipText,
                  type === item.key && styles.typeChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{t('notificationTitleInput')} *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ví dụ: Lễ hội Hoa Đà Lạt 2026 chính thức khai mạc!"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>{t('notificationBodyInput')} *</Text>
        <TextInput
          style={[styles.input, { height: 70 }]}
          placeholder="Nội dung chi tiết thông báo gửi đến người dùng..."
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <Text style={styles.label}>Liên kết tới điểm du lịch (tùy chọn):</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <TouchableOpacity
              style={[
                styles.serviceLinkChip,
                !selectedServiceId && styles.serviceLinkChipActive,
              ]}
              onPress={() => setSelectedServiceId('')}
            >
              <Text style={styles.serviceLinkText}>Không liên kết</Text>
            </TouchableOpacity>
            {services.map(s => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.serviceLinkChip,
                  selectedServiceId === s.id && styles.serviceLinkChipActive,
                ]}
                onPress={() => setSelectedServiceId(s.id)}
              >
                <Text style={styles.serviceLinkText} numberOfLines={1}>
                  {s.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.broadcastBtn} onPress={handleBroadcast}>
          <Text style={styles.broadcastBtnText}>🚀 {t('sendNotificationBtn')}</Text>
        </TouchableOpacity>
      </View>

      {/* History of Sent Notifications */}
      <Text style={styles.historyHeading}>Lịch sử thông báo đã gửi ({notifications.length})</Text>
      <View style={{ gap: 8, paddingBottom: spacing.xxl }}>
        {notifications.map(item => (
          <View key={item.id} style={[styles.historyCard, shadows.subtle]}>
            <View style={styles.historyTop}>
              <Text style={styles.historyTitle}>{item.titleVi || item.title}</Text>
              <Text style={styles.historyDate}>
                {new Date(item.timestamp).toLocaleDateString('vi-VN')}
              </Text>
            </View>
            <Text style={styles.historyMessage}>{item.messageVi || item.message}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
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
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.lg,
  },
  cardHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: colors.cardMuted,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  typeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  typeChipTextActive: {
    color: '#FFF',
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 10,
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 13,
  },
  serviceLinkChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: colors.cardMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceLinkChipActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  serviceLinkText: {
    fontSize: 11,
    color: colors.text,
  },
  broadcastBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  broadcastBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  historyHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  historyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  historyDate: {
    fontSize: 10,
    color: colors.textLight,
  },
  historyMessage: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
});
