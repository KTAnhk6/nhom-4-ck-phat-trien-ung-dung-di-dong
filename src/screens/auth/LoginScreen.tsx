/**
 * Login Screen - Modern Editorial (Assigned to: Tuấn Anh - Auth & User)
 * Giao diện đăng nhập chuẩn: Người dùng tự nhập tài khoản và mật khẩu.
 * Hệ thống tự động phân quyền Admin hoặc User theo tài khoản đã nhập.
 * Khách vãng lai không cần đăng nhập, chỉ cần bấm nút "Tiếp tục với tư cách Khách".
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
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

export const LoginScreen: React.FC = () => {
  const { t } = useLanguage();
  const { login, loginAsGuest, isLoading } = useAuth();
  const { navigate } = useTourism();

  // Ô nhập để trống hoàn toàn để người dùng tự gõ tài khoản & mật khẩu
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!username.trim()) {
      setErrorMsg('Vui lòng nhập tên đăng nhập hoặc email');
      return;
    }
    if (!password) {
      setErrorMsg('Vui lòng nhập mật khẩu');
      return;
    }

    setErrorMsg('');
    const res = await login(username, password);
    if (res.success) {
      navigate('HOME');
    } else {
      setErrorMsg(res.error || 'Tên đăng nhập hoặc mật khẩu không chính xác');
    }
  };

  const handleGuestAccess = async () => {
    // Khách không cần tài khoản, không cần mật khẩu
    await loginAsGuest();
    navigate('HOME');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Editorial Masthead */}
        <View style={styles.masthead}>
          <Text style={styles.issueNumber}>VOL. 2026 • ISSUE N° 04 • EDITORIAL EDITION</Text>
          <Text style={styles.brandTitle}>ĐÀ LẠT WANDER</Text>
          <Text style={styles.brandSubtitle}>
            Ấn phẩm cẩm nang tra cứu dịch vụ du lịch Đà Lạt
          </Text>
          <View style={styles.hairlineDivider} />
        </View>

        {/* Login Box */}
        <View style={styles.loginCard}>
          <Text style={styles.cardTitle}>ĐĂNG NHẬP</Text>
          <Text style={styles.cardIntro}>
            Vui lòng nhập tài khoản và mật khẩu của bạn để đăng nhập vào ứng dụng.
          </Text>

          {/* Error Message */}
          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </View>
          ) : null}

          {/* Username Input */}
          <Text style={styles.inputLabel}>TÊN ĐĂNG NHẬP HOẶC EMAIL</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập username hoặc email của bạn"
            placeholderTextColor={colors.textLight}
            value={username}
            onChangeText={text => {
              setUsername(text);
              if (errorMsg) setErrorMsg('');
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Password Input */}
          <View style={styles.passwordLabelRow}>
            <Text style={styles.inputLabel}>MẬT KHẨU</Text>
            <TouchableOpacity onPress={() => navigate('FORGOT_PASSWORD')}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            placeholderTextColor={colors.textLight}
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (errorMsg) setErrorMsg('');
            }}
            secureTextEntry
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.submitBtnText}>ĐĂNG NHẬP →</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>HOẶC</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Guest Direct Access (Khách không cần đăng nhập) */}
          <TouchableOpacity
            style={styles.guestBtn}
            onPress={handleGuestAccess}
            activeOpacity={0.85}
          >
            <Text style={styles.guestBtnTitle}>✦ Tiếp tục với tư cách Khách</Text>
            <Text style={styles.guestBtnSubtitle}>
              Khám phá không cần đăng nhập (Giới hạn tính năng đánh giá & lưu yêu thích)
            </Text>
          </TouchableOpacity>

          {/* Register Prompt */}
          <View style={styles.registerPrompt}>
            <Text style={styles.promptText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigate('REGISTER')}>
              <Text style={styles.registerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Note pointing to ACCOUNTS_CREDENTIALS.md for testers */}
        <View style={styles.credentialHintBox}>
          <Text style={styles.credentialHintText}>
            💡 Thông tin tài khoản & mật khẩu kiểm thử được lưu trong file{' '}
            <Text style={{ fontWeight: '700' }}>ACCOUNTS_CREDENTIALS.md</Text>
            {'\n'}• Admin: <Text style={{ fontFamily: typography.fontMono }}>admin / admin123</Text>
            {'\n'}• User: <Text style={{ fontFamily: typography.fontMono }}>tuananh / 123456</Text>
          </Text>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    justifyContent: 'center',
    minHeight: '100%',
  },
  masthead: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  issueNumber: {
    fontFamily: typography.fontMono,
    fontSize: 9,
    letterSpacing: 1.5,
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  brandTitle: {
    fontFamily: typography.fontEditorial, // Times New Roman
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 2,
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
  hairlineDivider: {
    width: 60,
    height: 1,
    backgroundColor: colors.border,
    marginTop: spacing.md,
  },
  loginCard: {
    backgroundColor: colors.card,
    borderRadius: 2,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontFamily: typography.fontEditorial,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardIntro: {
    fontFamily: typography.fontSans,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.md,
    lineHeight: 17,
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
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  forgotText: {
    fontFamily: typography.fontSans,
    fontSize: 11,
    color: colors.secondary,
    fontWeight: '600',
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
  submitBtn: {
    height: 46,
    borderRadius: 2,
    backgroundColor: colors.text, // Solid Obsidian Noir
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  submitBtnText: {
    fontFamily: typography.fontSans,
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontFamily: typography.fontMono,
    fontSize: 9,
    color: colors.textLight,
    letterSpacing: 1,
  },
  guestBtn: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.cardMuted,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  guestBtnTitle: {
    fontFamily: typography.fontSans,
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  guestBtnSubtitle: {
    fontFamily: typography.fontSans,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  promptText: {
    fontFamily: typography.fontSans,
    fontSize: 12,
    color: colors.textMuted,
  },
  registerLink: {
    fontFamily: typography.fontSans,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  credentialHintBox: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  credentialHintText: {
    fontFamily: typography.fontSans,
    fontSize: 10,
    color: colors.textLight,
    lineHeight: 15,
    textAlign: 'center',
  },
});
