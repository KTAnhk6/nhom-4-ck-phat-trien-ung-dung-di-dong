/**
 * Forgot Password Screen (Assigned to: Tuấn Anh - Auth & User)
 * Multi-step password reset simulation with OTP verification.
 */

import React, { useState } from 'react';
import {
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
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTourism } from '../../context/TourismContext';

export const ForgotPasswordScreen: React.FC = () => {
  const { t } = useLanguage();
  const { resetPassword } = useAuth();
  const { navigate, goBack } = useTourism();

  const [step, setStep] = useState<1 | 2>(1);
  const [accountInput, setAccountInput] = useState('tuananh@wander.vn');
  const [otpCode, setOtpCode] = useState('123456');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleRequestOtp = () => {
    if (!accountInput.trim()) {
      setErrorMsg('Vui lòng nhập Email hoặc Số điện thoại');
      return;
    }
    setErrorMsg('');
    setInfoMsg('Mã OTP 6 số đã được gửi (Mã mặc định: 123456)');
    setStep(2);
  };

  const handleConfirmReset = async () => {
    if (otpCode !== '123456') {
      setErrorMsg('Mã xác thực OTP không chính xác (Thử 123456)');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 4 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Xác nhận mật khẩu mới không khớp');
      return;
    }

    const res = await resetPassword(accountInput, newPassword);
    if (res.success) {
      Alert.alert(
        'Thành công',
        'Mật khẩu của bạn đã được cập nhật thành công! Vui lòng đăng nhập lại.',
        [{ text: 'Đăng nhập', onPress: () => navigate('LOGIN') }]
      );
    } else {
      setErrorMsg(res.error || 'Đặt lại mật khẩu thất bại');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={goBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('forgotPassword')}</Text>
          <View style={{ width: 38 }} />
        </View>

        <View style={[styles.card, shadows.floating]}>
          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </View>
          ) : null}

          {infoMsg ? (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>ℹ️ {infoMsg}</Text>
            </View>
          ) : null}

          {step === 1 ? (
            <>
              <Text style={styles.instruction}>
                Nhập địa chỉ Email hoặc số điện thoại liên kết với tài khoản Đà Lạt Wander của bạn để nhận mã khôi phục.
              </Text>

              <Text style={styles.inputLabel}>{t('email')} / {t('phone')}</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập email hoặc số điện thoại"
                placeholderTextColor={colors.textLight}
                value={accountInput}
                onChangeText={setAccountInput}
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleRequestOtp}
                activeOpacity={0.8}
              >
                <Text style={styles.actionBtnText}>{t('sendOtp')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.instruction}>
                Nhập mã OTP gửi tới <Text style={styles.highlight}>{accountInput}</Text> và thiết lập mật khẩu mới.
              </Text>

              <Text style={styles.inputLabel}>{t('otpCode')}</Text>
              <TextInput
                style={styles.input}
                placeholder="123456"
                placeholderTextColor={colors.textLight}
                value={otpCode}
                onChangeText={setOtpCode}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>{t('newPassword')}</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu mới"
                placeholderTextColor={colors.textLight}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />

              <Text style={styles.inputLabel}>{t('confirmPassword')}</Text>
              <TextInput
                style={styles.input}
                placeholder="Xác nhận lại mật khẩu mới"
                placeholderTextColor={colors.textLight}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleConfirmReset}
                activeOpacity={0.8}
              >
                <Text style={styles.actionBtnText}>{t('resetPassword')}</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.backToLogin} onPress={() => navigate('LOGIN')}>
            <Text style={styles.backToLoginText}>← Quay lại Đăng nhập</Text>
          </TouchableOpacity>
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
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
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
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  instruction: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
    marginBottom: spacing.md,
  },
  highlight: {
    color: colors.primary,
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: colors.dangerLight,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: colors.infoLight,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  infoText: {
    color: colors.info,
    fontSize: 12,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 5,
    marginTop: 6,
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
  actionBtn: {
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  backToLogin: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
});
