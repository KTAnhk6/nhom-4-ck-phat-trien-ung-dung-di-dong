/**
 * Login Screen (Assigned to: Tuấn Anh - Auth & User)
 * Handles user login with validation, role support, and quick-fill demo buttons.
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
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useTourism } from '../../context/TourismContext';

export const LoginScreen: React.FC = () => {
  const { t } = useLanguage();
  const { login, isLoading } = useAuth();
  const { navigate } = useTourism();

  const [username, setUsername] = useState('tuananh');
  const [password, setPassword] = useState('123456');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setErrorMsg('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }
    setErrorMsg('');
    const res = await login(username, password);
    if (res.success) {
      navigate('HOME');
    } else {
      setErrorMsg(res.error || 'Đăng nhập thất bại');
    }
  };

  const handleFillDemo = (type: 'user' | 'admin') => {
    if (type === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('tuananh');
      setPassword('123456');
    }
    setErrorMsg('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Dalat Branding Hero */}
        <View style={styles.brandHero}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🌲</Text>
          </View>
          <Text style={styles.brandTitle}>{t('appName')}</Text>
          <Text style={styles.brandSlogan}>{t('appSlogan')}</Text>
          <View style={styles.memberTag}>
            <Text style={styles.memberTagText}>Module: Tuấn Anh (Auth & Người dùng)</Text>
          </View>
        </View>

        {/* Login Form Card */}
        <View style={[styles.card, shadows.floating]}>
          <Text style={styles.cardHeader}>{t('login')}</Text>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMsg}</Text>
            </View>
          ) : null}

          {/* Username Input */}
          <Text style={styles.inputLabel}>{t('username')} / Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập username (vd: tuananh, admin)"
            placeholderTextColor={colors.textLight}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          {/* Password Input */}
          <Text style={styles.inputLabel}>{t('password')}</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            placeholderTextColor={colors.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Forgot Password Link */}
          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => navigate('FORGOT_PASSWORD')}
          >
            <Text style={styles.forgotText}>{t('forgotPassword')}</Text>
          </TouchableOpacity>

          {/* Login Action Button */}
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.loginBtnText}>{t('login')}</Text>
            )}
          </TouchableOpacity>

          {/* Demo fast-fill buttons for teacher / grading */}
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Tài khoản mẫu để test nhanh:</Text>
            <View style={styles.demoRow}>
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => handleFillDemo('user')}
              >
                <Text style={styles.demoBtnText}>👤 Member (tuananh)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.demoBtn, styles.demoBtnAdmin]}
                onPress={() => handleFillDemo('admin')}
              >
                <Text style={styles.demoBtnTextAdmin}>⚙️ Admin (admin)</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Prompt */}
          <View style={styles.registerPrompt}>
            <Text style={styles.promptText}>{t('noAccount')} </Text>
            <TouchableOpacity onPress={() => navigate('REGISTER')}>
              <Text style={styles.registerLink}>{t('registerNow')}</Text>
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
    padding: spacing.lg,
    justifyContent: 'center',
    minHeight: '100%',
  },
  brandHero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  logoIcon: {
    fontSize: 32,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  brandSlogan: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  memberTag: {
    marginTop: spacing.sm,
    backgroundColor: colors.cardMuted,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  memberTagText: {
    fontSize: 10,
    color: colors.primaryLight,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
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
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    marginTop: spacing.xs,
  },
  input: {
    height: 46,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
  },
  loginBtn: {
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  demoBox: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.cardMuted,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
  demoBtnAdmin: {
    backgroundColor: colors.secondaryMuted,
    borderColor: colors.secondary,
  },
  demoBtnTextAdmin: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  registerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  promptText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
