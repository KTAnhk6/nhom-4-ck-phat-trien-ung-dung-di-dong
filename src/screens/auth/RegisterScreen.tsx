/**
 * Register Screen - Modern Editorial Edition (Assigned to: Tuấn Anh - Auth & User)
 * Đăng ký tài khoản người dùng bình thường như các ứng dụng tiêu chuẩn khác.
 * Không có tùy chọn đăng ký quản trị viên.
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTourism } from '../../context/TourismContext';

export const RegisterScreen: React.FC = () => {
  const { t } = useLanguage();
  const { register, isLoading } = useAuth();
  const { navigate, goBack } = useTourism();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Mật khẩu phải có ít nhất 4 ký tự');
      return;
    }

    setErrorMsg('');
    // Đăng ký tài khoản người dùng bình thường
    const res = await register({
      fullName,
      username,
      email,
      phone,
      passwordPlain: password,
      role: 'user',
    });

    if (res.success) {
      Alert.alert(
        'Đăng ký thành công! 🎉',
        `Tài khoản [${username}] đã được tạo thành công! Bạn có thể đăng nhập ngay để trải nghiệm ứng dụng.`,
        [
          {
            text: 'Đăng nhập ngay',
            onPress: () => navigate('LOGIN'),
          },
        ]
      );
    } else {
      setErrorMsg(res.error || 'Đăng ký không thành công');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Navigation Top Row */}
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backBtn} onPress={goBack} activeOpacity={0.7}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.topVol}>ISSUE N° 04 • EDITORIAL REGISTRATION</Text>
          <View style={{ width: 34 }} />
        </View>

        {/* Editorial Heading */}
        <View style={styles.headingSection}>
          <Text style={styles.brandTitle}>ĐĂNG KÝ TÀI KHOẢN</Text>
          <Text style={styles.brandSubtitle}>
            Tạo tài khoản thành viên để lưu địa điểm yêu thích và gửi đánh giá du lịch
          </Text>
        </View>

        <View style={styles.card}>
          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <Text style={styles.inputLabel}>HỌ VÀ TÊN *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: Nguyễn Văn Du Khách"
            placeholderTextColor={colors.textLight}
            value={fullName}
            onChangeText={text => {
              setFullName(text);
              if (errorMsg) setErrorMsg('');
            }}
          />

          <Text style={styles.inputLabel}>TÊN ĐĂNG NHẬP (USERNAME) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Tên viết liền không dấu (ví dụ: hoangnam, minhduc...)"
            placeholderTextColor={colors.textLight}
            value={username}
            onChangeText={text => {
              setUsername(text);
              if (errorMsg) setErrorMsg('');
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.inputLabel}>ĐỊA CHỈ EMAIL *</Text>
          <TextInput
            style={styles.input}
            placeholder="email@example.com"
            placeholderTextColor={colors.textLight}
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (errorMsg) setErrorMsg('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>SỐ ĐIỆN THOẠI</Text>
          <TextInput
            style={styles.input}
            placeholder="0912.345.678"
            placeholderTextColor={colors.textLight}
            value={phone}
            onChangeText={text => {
              setPhone(text);
              if (errorMsg) setErrorMsg('');
            }}
            keyboardType="phone-pad"
          />

          <Text style={styles.inputLabel}>MẬT KHẨU *</Text>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu tối thiểu 4 ký tự"
            placeholderTextColor={colors.textLight}
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (errorMsg) setErrorMsg('');
            }}
            secureTextEntry
          />

          <Text style={styles.inputLabel}>XÁC NHẬN MẬT KHẨU *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu vừa đặt"
            placeholderTextColor={colors.textLight}
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              if (errorMsg) setErrorMsg('');
            }}
            secureTextEntry
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.registerBtnText}>TẠO TÀI KHOẢN →</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginPrompt}>
            <Text style={styles.promptText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigate('LOGIN')}>
              <Text style={styles.loginLink}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  backIcon: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '700',
  },
  topVol: {
    fontFamily: typography.fontMono,
    fontSize: 9,
    letterSpacing: 1.2,
    color: colors.textMuted,
  },
  headingSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  brandTitle: {
    fontFamily: typography.fontEditorial, // Times New Roman
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  brandSubtitle: {
    fontFamily: typography.fontEditorial,
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 2,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorBox: {
    backgroundColor: colors.dangerLight,
    padding: spacing.sm,
    borderRadius: 2,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.danger,
  },
  errorText: {
    fontFamily: typography.fontSans,
    color: colors.danger,
    fontSize: 12,
    fontWeight: '600',
  },
  inputLabel: {
    fontFamily: typography.fontMono,
    fontSize: 10,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.8,
    marginBottom: 5,
    marginTop: spacing.xs,
  },
  input: {
    height: 44,
    backgroundColor: colors.background,
    borderRadius: 2,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 13,
    color: colors.text,
    marginBottom: spacing.sm,
    fontFamily: typography.fontSans,
  },
  registerBtn: {
    height: 46,
    borderRadius: 2,
    backgroundColor: colors.text, // Solid Obsidian Noir
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  registerBtnText: {
    fontFamily: typography.fontSans,
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  promptText: {
    fontFamily: typography.fontSans,
    fontSize: 12,
    color: colors.textMuted,
  },
  loginLink: {
    fontFamily: typography.fontSans,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});
