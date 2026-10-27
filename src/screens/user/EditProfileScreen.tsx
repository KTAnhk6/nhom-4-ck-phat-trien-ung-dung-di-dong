/**
 * Edit Profile Screen (Assigned to: Tuấn Anh - Auth & User)
 * Allows updating user display name, phone, email, and avatar picture.
 */

import React, { useState } from 'react';
import {
  Alert,
  Image,
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
import { useAuth } from '../../context/AuthContext';
import { useTourism } from '../../context/TourismContext';

export const EditProfileScreen: React.FC = () => {
  const { t } = useLanguage();
  const { currentUser, updateProfile } = useAuth();
  const { goBack } = useTourism();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [avatar, setAvatar] = useState(
    currentUser?.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  );

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  ];

  const handleSave = async () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert('Lỗi', 'Họ tên và email không được để trống');
      return;
    }
    await updateProfile({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      avatar,
    });
    Alert.alert('Thành công', 'Thông tin cá nhân đã được lưu!');
    goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('editProfile')}</Text>
        <TouchableOpacity style={styles.saveTopBtn} onPress={handleSave}>
          <Text style={styles.saveTopText}>{t('save')}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, shadows.card]}>
        {/* Avatar preview */}
        <View style={styles.avatarSection}>
          <Image source={{ uri: avatar }} style={styles.avatarPreview} />
          <Text style={styles.avatarLabel}>Chọn ảnh đại diện mẫu:</Text>
          <View style={styles.avatarPickerRow}>
            {sampleAvatars.map((url, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setAvatar(url)}
                style={[
                  styles.sampleAvatarWrap,
                  avatar === url && styles.sampleAvatarWrapActive,
                ]}
              >
                <Image source={{ uri: url }} style={styles.sampleAvatarImg} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Inputs */}
        <Text style={styles.inputLabel}>{t('fullName')}</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nhập họ và tên"
        />

        <Text style={styles.inputLabel}>{t('email')}</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Nhập email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.inputLabel}>{t('phone')}</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
        />

        <Text style={styles.inputLabel}>URL ảnh đại diện tùy chỉnh</Text>
        <TextInput
          style={styles.input}
          value={avatar}
          onChangeText={setAvatar}
          placeholder="https://..."
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{t('save')}</Text>
        </TouchableOpacity>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  backIcon: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  saveTopBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
  },
  saveTopText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarPreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: spacing.sm,
  },
  avatarLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
  },
  avatarPickerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sampleAvatarWrap: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 24,
    padding: 2,
  },
  sampleAvatarWrapActive: {
    borderColor: colors.primary,
  },
  sampleAvatarImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
    marginTop: 8,
  },
  input: {
    height: 44,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  saveBtn: {
    height: 46,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
